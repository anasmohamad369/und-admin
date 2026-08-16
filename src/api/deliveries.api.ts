import { apiClient } from './axios';
import { Delivery, DeliveryStatus } from '../types/delivery';

export const deliveriesApi = {
  getDeliveries: async (farmId?: string, status?: string): Promise<Delivery[]> => {
    const response = await apiClient.get<Delivery[] | { content: Delivery[] }>('/deliveries', { params: { farmId, status } });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content;
    }
    return [];
  },

  assignDriver: async (deliveryId: string, driverId: string): Promise<Delivery> => {
    const response = await apiClient.post<Delivery>(`/deliveries/${deliveryId}/assign`, { driverId });
    return response.data;
  },

  updateDeliveryStatus: async (deliveryId: string, status: DeliveryStatus): Promise<Delivery> => {
    const response = await apiClient.patch<Delivery>(`/deliveries/${deliveryId}/status`, { status });
    return response.data;
  },
};
