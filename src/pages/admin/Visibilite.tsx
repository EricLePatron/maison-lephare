import { useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const FLAGS = [
  {
    key: "actualites_header",
    label: "Actualités dans le menu de navigation",
    description: "Affiche ou masque le lien « Actualités » dans le header du site.",
  },
  {
    key: "actualites_home",
    label: "Bloc Actualités sur la page d'accueil",
    description: "Affiche ou masque la section actualités sur la page d'accueil.",
  },
];

function useAllFeatureFlags() {
  return useQuery({
    queryKey: ["feature_flags_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_flags")
        .select("key, enabled, label");
      if (error) throw error;
      const map: Record<string, boolean> = {};
      (data ?? []).forEach((row) => { map[row.key] = row.enabled; });
      return map;
    },
  });
}

export default function AdminVisibilite() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: flags, isLoading } = useAllFeatureFlags();
  const [saving, setSaving] = useState<string | null>(null);

  const handleToggle = async (key: string, newValue: boolean) => {
    setSaving(key);
    try {
      const { error } = await supabase
        .from("feature_flags")
        .update({ enabled: newValue, updated_at: new Date().toISOString() })
        .eq("key", key);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["feature_flags_all"] });
      queryClient.invalidateQueries({ queryKey: ["feature_flag", key] });

      toast({
        title: newValue ? "Section activée" : "Section masquée",
        description: FLAGS.find((f) => f.key === key)?.label,
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la visibilité.",
        variant: "destructive",
      });
    }
    setSaving(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container-wide py-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-primary" />
            <h1 className="font-serif text-xl font-semibold">Visibilité des sections</h1>
          </div>
        </div>
      </header>

      <main className="container-wide py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Page Actualités</CardTitle>
            <CardDescription>
              Contrôlez où la page Actualités est visible sur le site public.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {FLAGS.map((flag) => (
              <div key={flag.key} className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
                <div className="space-y-1">
                  <Label htmlFor={flag.key} className="text-sm font-medium cursor-pointer">
                    {flag.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{flag.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {saving === flag.key && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  <Switch
                    id={flag.key}
                    checked={flags?.[flag.key] ?? false}
                    onCheckedChange={(checked) => handleToggle(flag.key, checked)}
                    disabled={saving === flag.key}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
