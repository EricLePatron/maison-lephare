import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAteliers } from "@/hooks/useAteliers";

export type Publication = Tables<"publications">;

export function usePublications() {
  return useQuery({
    queryKey: ["publications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .eq("actif", true)
        .order("date_publication", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Publication[];
    },
  });
}

export function useFeatureFlag(key: string) {
  const query = useQuery({
    queryKey: ["feature_flag", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_flags")
        .select("enabled")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return data?.enabled ?? false;
    },
  });
  return { enabled: query.data ?? false, isLoading: query.isLoading };
}

export function useActualitesVisible() {
  const { data: ateliers, isLoading: ateliersLoading } = useAteliers();
  const { data: publications, isLoading: pubsLoading } = usePublications();
  const now = Date.now();
  const ateliersActifs = (ateliers ?? []).filter(
    (a) =>
      a.actif &&
      a.date_evenement &&
      new Date(a.date_evenement).getTime() > now
  );
  const publicationsActives = publications ?? [];
  return {
    visible: ateliersActifs.length > 0 || publicationsActives.length > 0,
    isLoading: ateliersLoading || pubsLoading,
    ateliers: ateliersActifs,
    publications: publicationsActives,
  };
}