import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmsApi } from '../api/farms.api';
import { CreateFarmPayload, UpdateFarmPayload } from '../types/farm';

export const FARMS_QUERY_KEY = 'farms';

export function useFarms(farmIdFilter?: string) {
  return useQuery({
    queryKey: [FARMS_QUERY_KEY, farmIdFilter],
    queryFn: () => farmsApi.getFarms(farmIdFilter),
  });
}

export function useFarm(id: string | number) {
  return useQuery({
    queryKey: [FARMS_QUERY_KEY, String(id)],
    queryFn: () => farmsApi.getFarmById(id),
    enabled: !!id,
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFarmPayload) => farmsApi.createFarm(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FARMS_QUERY_KEY] });
    },
  });
}

export function useUpdateFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateFarmPayload }) =>
      farmsApi.updateFarm(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [FARMS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FARMS_QUERY_KEY, String(variables.id)] });
    },
  });
}

export function useDeleteFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => farmsApi.deleteFarm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FARMS_QUERY_KEY] });
    },
  });
}
