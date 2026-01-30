import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Atelier = Tables<"ateliers">;
export type AtelierInsert = TablesInsert<"ateliers">;
export type AtelierUpdate = TablesUpdate<"ateliers">;

export function useAteliers() {
  return useQuery({
    queryKey: ["ateliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ateliers")
        .select("*")
        .order("ordre_affichage", { ascending: true });

      if (error) throw error;
      return data as Atelier[];
    },
  });
}

export function useAtelier(id: string) {
  return useQuery({
    queryKey: ["ateliers", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ateliers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Atelier;
    },
    enabled: !!id,
  });
}

export function useCreateAtelier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (atelier: AtelierInsert) => {
      const { data, error } = await supabase
        .from("ateliers")
        .insert(atelier)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ateliers"] });
    },
  });
}

export function useUpdateAtelier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: AtelierUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("ateliers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ateliers"] });
    },
  });
}

export function useDeleteAtelier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ateliers").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ateliers"] });
    },
  });
}
