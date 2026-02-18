import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, MenuItemInput } from '@/types/cms';

// Build tree structure from flat menu items
function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const map = new Map<string, MenuItem>();
  const roots: MenuItem[] = [];

  // Create a map of all items
  items.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  // Build the tree
  items.forEach(item => {
    const node = map.get(item.id)!;
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  // Sort by position
  const sortByPosition = (a: MenuItem, b: MenuItem) => a.position - b.position;
  roots.sort(sortByPosition);
  roots.forEach(root => root.children?.sort(sortByPosition));

  return roots;
}

export function useMenuItems(location?: 'header' | 'footer' | 'learn_more') {
  return useQuery({
    queryKey: ['menu-items', location],
    queryFn: async () => {
      let query = supabase
        .from('menu_items')
        .select('*')
        .order('position', { ascending: true });

      if (location) {
        query = query.eq('menu_location', location);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MenuItem[];
    },
  });
}

export function useMenuTree(location: 'header' | 'footer' | 'learn_more') {
  const { data: items, ...rest } = useMenuItems(location);
  return {
    ...rest,
    data: items ? buildMenuTree(items) : [],
  };
}

export function useAllMenuItems() {
  return useQuery({
    queryKey: ['menu-items', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      return data as MenuItem[];
    },
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MenuItemInput) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as MenuItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<MenuItemInput> & { id: string }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as MenuItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
}

export function useReorderMenuItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: { id: string; position: number; parent_id: string | null }[]) => {
      // Update each item's position and parent
      const updates = items.map(item =>
        supabase
          .from('menu_items')
          .update({ position: item.position, parent_id: item.parent_id })
          .eq('id', item.id)
      );

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
}
