import { apiClient } from './axios';
import { Shop, CreateShopPayload } from '../types/shop';

export const shopsApi = {
  getShops: async (retailerIdFilter?: string): Promise<Shop[]> => {
    const response = await apiClient.get<Shop[] | { content: Shop[] }>('/shops', { params: { retailerId: retailerIdFilter } });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content;
    }
    return [];
  },

  getShopsByRetailerId: async (retailerId: string): Promise<Shop[]> => {
    const response = await apiClient.get<Shop[] | { content: Shop[] }>(`/retailers/${retailerId}/shops`);
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content;
    }
    return [];
  },

  getShopById: async (id: string): Promise<Shop> => {
    const response = await apiClient.get<Shop>(`/shops/${id}`);
    return response.data;
  },

  createShop: async (payload: CreateShopPayload): Promise<Shop> => {
    const response = await apiClient.post<Shop>('/shops', payload);
    return response.data;
  },
};
