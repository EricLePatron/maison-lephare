import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  label: string | null;
}

const TABLE = "feature_flags";

export function useFeatureFlags() {
  return useQuery({
    queryKey: [TABLE],
    queryFn: async () => {
      const { data, error } = await supabase.from(TABLE).select("*");
      if (error) throw error;
      return data as FeatureFlag[];
    },
  });
}

export function useFeatureFlag(key: string): boolean {
  const { data } = useFeatureFlags();
  return data?.find((f) => f.key === key)?.enabled ?? false;
}

export function useUpdateFeatureFlag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, enabled }: { key: string; enabled: boolean }) => {
      const { error } = await supabase.from(TABLE).update({ enabled }).eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [TABLE] }),
  });
}
