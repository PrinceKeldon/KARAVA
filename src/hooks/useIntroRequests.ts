import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { IntroRequest, IntroRequestInsert } from '@/types/supabase';

export function useIntroRequests() {
  return useQuery({
    queryKey: ['intro_requests'],
    queryFn: async (): Promise<IntroRequest[]> => {
      const { data, error } = await supabase
        .from('intro_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useRequestIntro() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: IntroRequestInsert): Promise<IntroRequest> => {
      const { data, error } = await supabase
        .from('intro_requests')
        .insert(request)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intro_requests'] });
    },
  });
}
