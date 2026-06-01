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

    console.log("Contact form submission received:", {
      nom, email, sujet, messageLength: message.length,
      ip: clientIp, timestamp: new Date().toISOString(),
    });

    // ─── 1. Tentative via le pipeline Lovable (primaire) ───────────────────────
    let lovableOk = false;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const LEGACY_ANON_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoYW9neWdsdmxlZ21sdHhveGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NjkzODUsImV4cCI6MjA4NTM0NTM4NX0.ewMLyWw_U4h-xTmng61FLeGwcUNhN9d5ya58ufJz_4I";
    const jwtCandidates = [
      Deno.env.get("SUPABASE_ANON_KEY"),
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    ];
    const bearer =
      jwtCandidates.find((v) => typeof v === "string" && v.split(".").length === 3) ??
      LEGACY_ANON_JWT;

    if (supabaseUrl) {
      const submissionId = crypto.randomUUID();
      const enqueue = async (label: string, payload: Record<string, unknown>): Promise<boolean> => {
        try {
          const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const text = await res.text();
            console.error(`Lovable pipeline failed for ${label} (${res.status}):`, text);
            return false;
          }
          return true;
        } catch (e) {
          console.error(`Lovable pipeline exception for ${label}:`, e);
          return false;
        }
      };

      const notifOk = await enqueue("contact-notification", {
        templateName: "contact-notification",
        recipientEmail: "contact@maison-lephare.com",
        idempotencyKey: `contact-notif-${submissionId}`,
        templateData: { nom, email, sujet, message },
      });

      await enqueue("contact-confirmation", {
        templateName: "contact-confirmation",
        recipientEmail: email,
        idempotencyKey: `contact-confirm-${submissionId}`,
        templateData: { nom },
      });

      lovableOk = notifOk;
    }

    // ─── 2. Fallback Resend si Lovable a échoué ────────────────────────────────
    if (!lovableOk) {
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

      if (!RESEND_API_KEY) {
        console.error("Lovable pipeline KO et RESEND_API_KEY absente — aucun email envoyé !");
      } else {
        const TO_EMAIL = Deno.env.get("CONTACT_EMAIL") || "contact@maison-lephare.com";

        const html = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#8B4513;margin-bottom:4px;">Nouveau message depuis le site</h2>
            <p style="color:#888;font-size:13px;margin-bottom:20px;">
              ⚠️ Envoyé via Resend (fallback) — vérifier le pipeline Lovable
            </p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr>
                <td style="padding:6px 0;color:#888;width:70px;font-size:13px;">De</td>
                <td style="padding:6px 0;font-weight:600;">${nom}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#888;font-size:13px;">Email</td>
                <td style="padding:6px 0;">
                  <a href="mailto:${email}" style="color:#8B4513;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#888;font-size:13px;vertical-align:top;">Sujet</td>
                <td style="padding:6px 0;">${sujet}</td>
              </tr>
            </table>
            <div style="background:#f9f6f2;border-radius:8px;padding:16px;margin-bottom:20px;">
              <p style="margin:0;white-space:pre-wrap;line-height:1.6;font-size:14px;">${message}</p>
            </div>
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(sujet)}"
               style="display:inline-block;background:#8B4513;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;">
              Répondre à ${nom}
            </a>
            <p style="margin-top:28px;font-size:11px;color:#bbb;">
              Reçu le ${new Date().toLocaleDateString("fr-FR", { dateStyle: "full" })} à ${new Date().toLocaleTimeString("fr-FR", { timeStyle: "short" })}
            </p>
          </div>`;

        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "LePhare Contact <onboarding@resend.dev>",
              to: [TO_EMAIL],
              reply_to: email,
              subject: `[LePhare] ${sujet} — ${nom}`,
              html,
            }),
          });

          if (res.ok) {
            console.log("Resend fallback: email envoyé avec succès");
          } else {
            const body = await res.text();
            console.error("Resend fallback failed:", res.status, body);
          }
        } catch (e) {
          console.error("Resend fallback exception:", e);
        }
      }
    } else {
      console.log("Pipeline Lovable OK — Resend non nécessaire");
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
