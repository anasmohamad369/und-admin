import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';
import { CreateOrderPayload, OrderStatus } from '../types/order';
import { FARMS_QUERY_KEY } from './useFarms';
import { SHOPS_QUERY_KEY } from './useShops';
import { RETAILERS_QUERY_KEY } from './useRetailers';
import { INVENTORY_QUERY_KEY } from './useInventory';
import { DELIVERIES_QUERY_KEY } from './useDeliveries';

export const ORDERS_QUERY_KEY = 'orders';

export function useOrders(farmId?: string, retailerId?: string, shopId?: string, status?: string) {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, farmId, retailerId, shopId, status],
    queryFn: () => ordersApi.getOrders(farmId, retailerId, shopId, status),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, id],
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FARMS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [RETAILERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SHOPS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [DELIVERIES_QUERY_KEY] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status, driverId }: { orderId: string; status: OrderStatus; driverId?: string }) =>
      ordersApi.updateOrderStatus(orderId, status, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FARMS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [DELIVERIES_QUERY_KEY] });
    },
  });
}
