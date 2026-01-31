import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContent {
  id: string;
  page_key: string;
  section_key: string;
  content_key: string;
  content_type: string;
  content_value: string;
  created_at: string;
  updated_at: string;
}

export type ContentMap = Record<string, string>;

export function useSiteContent(pageKey?: string) {
  return useQuery({
    queryKey: ["site_content", pageKey],
    queryFn: async () => {
      let query = supabase
        .from("site_content")
        .select("*")
        .order("section_key")
        .order("content_key");
      
      if (pageKey) {
        query = query.eq("page_key", pageKey);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as SiteContent[];
    },
  });
}

export function usePageContent(pageKey: string) {
  const { data, isLoading, error } = useSiteContent(pageKey);
  
  const content: ContentMap = {};
  
  if (data) {
    data.forEach((item) => {
      const key = `${item.section_key}.${item.content_key}`;
      content[key] = item.content_value;
    });
  }
  
  const getContent = (section: string, key: string, fallback: string = ""): string => {
    return content[`${section}.${key}`] || fallback;
  };
  
  return { content, getContent, isLoading, error };
}

export function useUpdateSiteContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      content_value,
    }: {
      id: string;
      content_value: string;
    }) => {
      const { data, error } = await supabase
        .from("site_content")
        .update({ content_value })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
    },
  });
}

export function useCreateSiteContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newContent: {
      page_key: string;
      section_key: string;
      content_key: string;
      content_value: string;
      content_type?: string;
    }) => {
      const { data, error } = await supabase
        .from("site_content")
        .insert({
          ...newContent,
          content_type: newContent.content_type || "text",
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
    },
  });
}

export function useDeleteSiteContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_content").delete().eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
    },
  });
}
