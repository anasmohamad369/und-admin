import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { retailersApi } from '../api/retailers.api';
import { CreateRetailerPayload } from '../types/retailer';

export const RETAILERS_QUERY_KEY = 'retailers';

export function useRetailers() {
  return useQuery({
    queryKey: [RETAILERS_QUERY_KEY],
    queryFn: () => retailersApi.getRetailers(),
  });
}

export function useRetailer(id: string) {
  return useQuery({
    queryKey: [RETAILERS_QUERY_KEY, id],
    queryFn: () => retailersApi.getRetailerById(id),
    enabled: !!id,
  });
}

export function useCreateRetailer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRetailerPayload) => retailersApi.createRetailer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RETAILERS_QUERY_KEY] });
    },
  });
}
