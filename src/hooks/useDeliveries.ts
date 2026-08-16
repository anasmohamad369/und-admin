import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveriesApi } from '../api/deliveries.api';
import { DeliveryStatus } from '../types/delivery';
import { DRIVERS_QUERY_KEY } from './useDrivers';
import { ORDERS_QUERY_KEY } from './useOrders';

export const DELIVERIES_QUERY_KEY = 'deliveries';

export function useDeliveries(farmId?: string, status?: string) {
  return useQuery({
    queryKey: [DELIVERIES_QUERY_KEY, farmId, status],
    queryFn: () => deliveriesApi.getDeliveries(farmId, status),
  });
}

export function useAssignDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deliveryId, driverId }: { deliveryId: string; driverId: string }) =>
      deliveriesApi.assignDriver(deliveryId, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DELIVERIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [DRIVERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });
}

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deliveryId, status }: { deliveryId: string; status: DeliveryStatus }) =>
      deliveriesApi.updateDeliveryStatus(deliveryId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DELIVERIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [DRIVERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });
}
