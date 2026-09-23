import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chickenTypesApi } from '../api/chickenTypes.api';
import { CreateChickenTypePayload, UpdateChickenTypePayload } from '../types/chickenType';

export const CHICKEN_TYPES_QUERY_KEY = 'chicken_types';

export function useChickenTypes() {
  return useQuery({
    queryKey: [CHICKEN_TYPES_QUERY_KEY],
    queryFn: () => chickenTypesApi.getChickenTypes(),
  });
}

export function useCreateChickenType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChickenTypePayload) => chickenTypesApi.createChickenType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHICKEN_TYPES_QUERY_KEY] });
    },
  });
}

export function useUpdateChickenType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateChickenTypePayload }) =>
      chickenTypesApi.updateChickenType(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHICKEN_TYPES_QUERY_KEY] });
    },
  });
}

export function useDeleteChickenType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => chickenTypesApi.deleteChickenType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHICKEN_TYPES_QUERY_KEY] });
    },
  });
}
