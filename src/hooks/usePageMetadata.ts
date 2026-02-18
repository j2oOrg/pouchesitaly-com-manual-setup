import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PageMetadata {
  id: string;
  page_path: string;
  language: string;
  title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  keywords: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageMetadataInput {
  page_path: string;
  language: string;
  title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_card?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
  keywords?: string | null;
  canonical_url?: string | null;
}

export function useAllPageMetadata() {
  return useQuery({
    queryKey: ['page-metadata'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_metadata')
        .select('*')
        .order('page_path')
        .order('language');
      
      if (error) throw error;
      return data as PageMetadata[];
    },
  });
}

export function usePageMetadata(pagePath: string, language: string) {
  return useQuery({
    queryKey: ['page-metadata', pagePath, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_metadata')
        .select('*')
        .eq('page_path', pagePath)
        .eq('language', language)
        .maybeSingle();
      
      if (error) throw error;
      return data as PageMetadata | null;
    },
  });
}

export function useUpdatePageMetadata() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<PageMetadataInput> & { id: string }) => {
      const { error } = await supabase
        .from('page_metadata')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-metadata'] });
    },
  });
}

export function useCreatePageMetadata() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PageMetadataInput) => {
      const { error } = await supabase
        .from('page_metadata')
        .insert(data);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-metadata'] });
    },
  });
}

export function useDeletePageMetadata() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('page_metadata')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-metadata'] });
    },
  });
}
