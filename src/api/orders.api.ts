import { apiClient } from './axios';
import { Order, CreateOrderPayload, OrderStatus } from '../types/order';

export const ordersApi = {
  getOrders: async (farmId?: string, retailerId?: string, shopId?: string, status?: string): Promise<Order[]> => {
    const response = await apiClient.get<Order[] | { content: Order[] }>('/orders', {
      params: { farmId, retailerId, shopId, status },
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content;
    }
    return [];
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', payload);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus, driverId?: string): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${orderId}/status`, { status, driverId });
    return response.data;
  },
};
