import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbProduct {
  id: string;
  name: string;
  brand: string;
  strength: string;
  strength_mg: number;
  flavor: string;
  price: number;
  image: string | null;
  image_2: string | null;
  image_3: string | null;
  description: string | null;
  description_it: string | null;
  popularity: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  brand: string;
  strength: string;
  strength_mg: number;
  flavor: string;
  price: number;
  image?: string | null;
  image_2?: string | null;
  image_3?: string | null;
  description?: string | null;
  description_it?: string | null;
  popularity?: number;
  is_active?: boolean;
}

export function useProducts(includeInactive = false) {
  return useQuery({
    queryKey: ['products', includeInactive],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DbProduct[];
    },
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as DbProduct;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: ProductInput) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...product }: ProductInput & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Convert database product to frontend Product type
export function toFrontendProduct(dbProduct: DbProduct, language: 'en' | 'it' = 'en') {
  const description = language === 'it' && dbProduct.description_it 
    ? dbProduct.description_it 
    : dbProduct.description || '';
  
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand,
    strength: dbProduct.strength,
    strengthMg: dbProduct.strength_mg,
    flavor: dbProduct.flavor,
    price: Number(dbProduct.price),
    image: dbProduct.image || '/placeholder.svg',
    description,
    popularity: dbProduct.popularity || 50,
  };
}
