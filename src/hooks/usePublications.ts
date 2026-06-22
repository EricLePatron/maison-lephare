import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAteliers } from "@/hooks/useAteliers";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

export type Publication = Tables<"publications">;
export type PublicationType = "linkedin" | "actualite";
export type PublicationInsert = TablesInsert<"publications"> & { type: PublicationType };
export type PublicationUpdate = TablesUpdate<"publications"> & { type?: PublicationType };

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

export function useAllPublications() {
  return useQuery({
    queryKey: ["publications_admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .order("date_publication", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Publication[];
    },
  });
}

export function useCreatePublication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pub: Omit<PublicationInsert, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("publications").insert(pub).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["publications"] });
      qc.invalidateQueries({ queryKey: ["publications_admin"] });
    },
  });
}

export function useUpdatePublication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...update }: PublicationUpdate) => {
      const { data, error } = await supabase.from("publications").update(update).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["publications"] });
      qc.invalidateQueries({ queryKey: ["publications_admin"] });
    },
  });
}

export function useDeletePublication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("publications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["publications"] });
      qc.invalidateQueries({ queryKey: ["publications_admin"] });
    },
  });
}

export function useFeatureFlag(key: string) {
  const { data, isLoading } = useFeatureFlags();
  return { enabled: data?.find((f) => f.key === key)?.enabled ?? false, isLoading };
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
