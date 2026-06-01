import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Professionnel = Tables<"professionnels">;
export type ProfessionnelInsert = TablesInsert<"professionnels">;
export type ProfessionnelUpdate = TablesUpdate<"professionnels">;

// Public view type (without contact info)
export type ProfessionnelPublic = {
  id: string;
  nom: string;
  prenom: string;
  profession: string;
  specialites: string[] | null;
  description: string | null;
  approche: string | null;
  public_cible: string | null;
  jours_presence: string | null;
  photo_url: string | null;
  hero_photo_url: string | null;
  actif: boolean;
  ordre_affichage: number | null;
  created_at: string;
  updated_at: string;
  site_web: string | null;
  doctolib_url: string | null;
  telephone: string | null;
  email: string | null;
};

// Fetch all active professionals (public) - uses the secure view
export function useProfessionnels() {
  return useQuery({
    queryKey: ["professionnels", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionnels_public" as "professionnels")
        .select("*")
        .order("ordre_affichage", { ascending: true });

      if (error) throw error;
      return data as unknown as ProfessionnelPublic[];
    },
  });
}

// Fetch all professionals including inactive (admin only)
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

// Fetch a single professional by ID (public view)
export function useProfessionnel(id: string | undefined) {
  return useQuery({
    queryKey: ["professionnels", "public", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("professionnels_public" as "professionnels")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as ProfessionnelPublic | null;
    },
    enabled: !!id,
  });
}

// Fetch a single professional by ID (admin - full data)
export function useProfessionnelAdmin(id: string | undefined) {
  return useQuery({
    queryKey: ["professionnels", "admin", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("professionnels")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Professionnel | null;
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

// Get unique professions for filtering (uses public view)
export function useProfessions() {
  return useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionnels_public" as "professionnels")
        .select("profession")
        .order("profession", { ascending: true });

      if (error) throw error;
      
      const professions = [...new Set((data as unknown as { profession: string }[]).map((p) => p.profession))];
      return professions;
    },
  });
}
