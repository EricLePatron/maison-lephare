import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiting (per IP, resets on function cold start)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 submissions per hour per IP

// Server-side validation - mirrors client-side but is the source of truth
function validateContactForm(data: unknown): { success: true; data: { nom: string; email: string; sujet: string; message: string } } | { success: false; error: string } {
  if (!data || typeof data !== "object") {
    return { success: false, error: "Données invalides" };
  }

  const { nom, email, sujet, message } = data as Record<string, unknown>;

  // Validate nom
  if (typeof nom !== "string" || nom.trim().length < 2) {
    return { success: false, error: "Le nom doit contenir au moins 2 caractères" };
  }
  if (nom.trim().length > 100) {
    return { success: false, error: "Le nom ne peut pas dépasser 100 caractères" };
  }

  // Validate email with regex
  if (typeof email !== "string") {
    return { success: false, error: "Email invalide" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: "Adresse email invalide" };
  }
  if (email.trim().length > 255) {
    return { success: false, error: "L'email ne peut pas dépasser 255 caractères" };
  }

  // Validate sujet
  if (typeof sujet !== "string" || sujet.trim().length < 5) {
    return { success: false, error: "Le sujet doit contenir au moins 5 caractères" };
  }
  if (sujet.trim().length > 200) {
    return { success: false, error: "Le sujet ne peut pas dépasser 200 caractères" };
  }

  // Validate message
  if (typeof message !== "string" || message.trim().length < 10) {
    return { success: false, error: "Le message doit contenir au moins 10 caractères" };
  }
  if (message.trim().length > 5000) {
    return { success: false, error: "Le message ne peut pas dépasser 5000 caractères" };
  }

  return {
    success: true,
    data: {
      nom: nom.trim(),
      email: email.trim().toLowerCase(),
      sujet: sujet.trim(),
      message: message.trim(),
    },
  };
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Reset if window expired
  if (now - entry.timestamp > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Check if limit exceeded
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  // Increment count
  entry.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Only allow POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Méthode non autorisée" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.log(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Trop de requêtes. Veuillez réessayer plus tard." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Format de données invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validationResult = validateContactForm(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: validationResult.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { nom, email, sujet, message } = validationResult.data;

    // Log the submission (in production, you might store in DB or send email)
    console.log("Contact form submission received:", {
      nom,
      email,
      sujet,
      messageLength: message.length,
      ip: clientIp,
      timestamp: new Date().toISOString(),
    });

    // Send emails via the transactional email pipeline (queued + retried)
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const submissionId = crypto.randomUUID();

      // 1) Internal notification to contact@maison-lephare.com (recipient is fixed in the template)
      const notif = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-notification",
          recipientEmail: "contact@maison-lephare.com",
          idempotencyKey: `contact-notif-${submissionId}`,
          templateData: { nom, email, sujet, message },
        },
      });
      if (notif.error) {
        console.error("Failed to enqueue contact notification email", notif.error);
      }

      // 2) Acknowledgement to the visitor
      const ack = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-confirmation",
          recipientEmail: email,
          idempotencyKey: `contact-confirm-${submissionId}`,
          templateData: { nom },
        },
      });
      if (ack.error) {
        console.error("Failed to enqueue contact confirmation email", ack.error);
      }
    } else {
      console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY — cannot send emails");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message reçu avec succès" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
