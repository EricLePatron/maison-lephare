import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Professionnel = Tables<"professionnels">;
export type ProfessionnelInsert = TablesInsert<"professionnels">;
export type ProfessionnelUpdate = TablesUpdate<"professionnels">;

// Fetch all active professionals (public)
export function useProfessionnels() {
  return useQuery({
    queryKey: ["professionnels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionnels")
        .select("*")
        .eq("actif", true)
        .order("ordre_affichage", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

// Fetch all professionals including inactive (admin)
export function useAllProfessionnels() {
  return useQuery({
    queryKey: ["professionnels", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionnels")
        .select("*")
        .order("ordre_affichage", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

// Fetch a single professional by ID
export function useProfessionnel(id: string | undefined) {
  return useQuery({
    queryKey: ["professionnels", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("professionnels")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// Create a new professional
export function useCreateProfessionnel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (professionnel: ProfessionnelInsert) => {
      const { data, error } = await supabase
        .from("professionnels")
        .insert(professionnel)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionnels"] });
    },
  });
}

// Update a professional
export function useUpdateProfessionnel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ProfessionnelUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("professionnels")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionnels"] });
    },
  });
}

// Delete a professional
export function useDeleteProfessionnel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("professionnels")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionnels"] });
    },
  });
}

// Get unique professions for filtering
export function useProfessions() {
  return useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionnels")
        .select("profession")
        .eq("actif", true);

      if (error) throw error;
      
      const professions = [...new Set(data.map((p) => p.profession))];
      return professions;
    },
  });
}
