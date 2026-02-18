import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Page, PageInput, PageBlock, PageBlockInput, BlockContent } from '@/types/cms';

// Pages hooks
export function usePages() {
  return useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Page[];
    },
  });
}

export function usePage(id: string) {
  return useQuery({
    queryKey: ['pages', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Page;
    },
    enabled: !!id,
  });
}

export function usePageBySlug(slug: string) {
  return useQuery({
    queryKey: ['pages', 'slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as Page;
    },
    enabled: !!slug,
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PageInput) => {
      const { data, error } = await supabase
        .from('pages')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as Page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<PageInput> & { id: string }) => {
      const updateData: any = { ...input };
      
      // Set published_at when publishing
      if (input.status === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Page;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['pages', data.id] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}

// Page Blocks hooks
export function usePageBlocks(pageId: string) {
  return useQuery({
    queryKey: ['page-blocks', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('page_id', pageId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data as PageBlock[];
    },
    enabled: !!pageId,
  });
}

export function useCreateBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PageBlockInput) => {
      const { data, error } = await supabase
        .from('page_blocks')
        .insert({
          ...input,
          content: input.content as any,
        })
        .select()
        .single();

      if (error) throw error;
      return data as PageBlock;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', data.page_id] });
    },
  });
}

export function useUpdateBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, pageId, ...input }: { id: string; pageId: string; content?: BlockContent; is_visible?: boolean; position?: number }) => {
      const { data, error } = await supabase
        .from('page_blocks')
        .update({
          ...input,
          content: input.content as any,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, pageId } as PageBlock & { pageId: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', data.pageId] });
    },
  });
}

export function useDeleteBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, pageId }: { id: string; pageId: string }) => {
      const { error } = await supabase
        .from('page_blocks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { pageId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', data.pageId] });
    },
  });
}

export function useReorderBlocks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pageId, blocks }: { pageId: string; blocks: { id: string; position: number }[] }) => {
      const updates = blocks.map(block =>
        supabase
          .from('page_blocks')
          .update({ position: block.position })
          .eq('id', block.id)
      );

      await Promise.all(updates);
      return { pageId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', data.pageId] });
    },
  });
}
