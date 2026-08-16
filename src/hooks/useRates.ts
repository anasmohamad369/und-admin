import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratesApi } from '../api/rates.api';
import { PublishRatePayload } from '../types/rate';

export const RATES_QUERY_KEY = 'rates';

export function useCurrentRate(farmId?: number | string, chickenTypeId?: number | string) {
  return useQuery({
    queryKey: [RATES_QUERY_KEY, 'current', String(farmId), String(chickenTypeId)],
    queryFn: () => ratesApi.getCurrentRate(farmId, chickenTypeId),
    enabled: !!farmId && !!chickenTypeId,
  });
}

export function useLiveRates(farmId?: number | string) {
  return useQuery({
    queryKey: [RATES_QUERY_KEY, 'live', String(farmId)],
    queryFn: () => ratesApi.getLiveRates(farmId),
  });
}

export function useRateHistory(farmId?: number | string, chickenTypeId?: number | string) {
  return useQuery({
    queryKey: [RATES_QUERY_KEY, 'history', String(farmId), String(chickenTypeId)],
    queryFn: () => ratesApi.getRateHistory(farmId, chickenTypeId),
  });
}

export function usePublishRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PublishRatePayload) => ratesApi.publishRate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RATES_QUERY_KEY] });
    },
  });
}

export const useUpdateRate = usePublishRate;
