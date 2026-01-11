import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Buyer, BuyerInsert } from '@/types/supabase';

export function useBuyers() {
  return useQuery({
    queryKey: ['buyers'],
    queryFn: async (): Promise<Buyer[]> => {
      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as Buyer[]) || [];
    },
  });
}

export function useBuyer(id: string | undefined) {
  return useQuery({
    queryKey: ['buyers', id],
    queryFn: async (): Promise<Buyer | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Buyer;
    },
    enabled: !!id,
  });
}

export function useCreateBuyer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (buyer: BuyerInsert): Promise<Buyer> => {
      const { data, error } = await (supabase
        .from('buyers') as any)
        .insert([buyer])
        .select()
        .single();
      
      if (error) throw error;
      return data as Buyer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyers'] });
    },
  });
}