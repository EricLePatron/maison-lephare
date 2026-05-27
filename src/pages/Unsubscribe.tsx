import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type State = "loading" | "valid" | "already" | "invalid" | "submitting" | "done" | "error";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
      headers: { apikey: anonKey },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.valid) setState("valid");
        else if (data?.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("error"));
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setState("submitting");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error) setState("error");
    else if (data?.success) setState("done");
    else if (data?.reason === "already_unsubscribed") setState("already");
    else setState("error");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6 py-16">
      <div className="max-w-md w-full bg-card rounded-3xl shadow-soft p-8 sm:p-10 text-center">
        <h1 className="font-script text-primary text-4xl mb-4">Désinscription</h1>

        {state === "loading" && (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Vérification du lien…</p>
          </div>
        )}

        {state === "valid" && (
          <>
            <p className="text-foreground mb-6">
              Souhaitez-vous vraiment vous désinscrire de nos emails ?
            </p>
            <Button variant="hero" onClick={handleConfirm}>
              Confirmer la désinscription
            </Button>
          </>
        )}

        {state === "submitting" && (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Désinscription en cours…</p>
          </div>
        )}

        {state === "done" && (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="text-foreground">
              Vous avez bien été désinscrit. Vous ne recevrez plus d'emails de notre part.
            </p>
          </div>
        )}

        {state === "already" && (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="text-foreground">Cette adresse est déjà désinscrite.</p>
          </div>
        )}

        {state === "invalid" && (
          <div className="flex flex-col items-center gap-3">
            <XCircle className="h-10 w-10 text-destructive" />
            <p className="text-foreground">Ce lien de désinscription est invalide ou a expiré.</p>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center gap-3">
            <XCircle className="h-10 w-10 text-destructive" />
            <p className="text-foreground">
              Une erreur est survenue. Merci de réessayer plus tard.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}