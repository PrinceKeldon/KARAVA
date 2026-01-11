import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FitAnalysis, FitAnalysisInsert } from '@/types/supabase';

export function useFitAnalyses(supplierId?: string) {
  return useQuery({
    queryKey: ['fit_analyses', supplierId],
    queryFn: async (): Promise<FitAnalysis[]> => {
      let query = supabase
        .from('fit_analyses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return (data as FitAnalysis[]) || [];
    },
  });
}

export function useCreateFitAnalysis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (analysis: FitAnalysisInsert): Promise<FitAnalysis> => {
      const { data, error } = await (supabase
        .from('fit_analyses') as any)
        .insert([analysis])
        .select()
        .single();
      
      if (error) throw error;
      return data as FitAnalysis;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fit_analyses'] });
    },
  });
}