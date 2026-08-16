import { apiClient } from './axios';
import { Retailer, CreateRetailerPayload } from '../types/retailer';

export const retailersApi = {
  /** READ All Retailers: GET /api/v1/retailers/list (fallback to GET /api/v1/retailers) */
  getRetailers: async (): Promise<Retailer[]> => {
    let response;
    try {
      response = await apiClient.get('/retailers/list');
    } catch (err) {
      response = await apiClient.get('/retailers');
    }
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray(data.content)) {
      return data.content;
    }
    return [];
  },

  getRetailerById: async (id: string | number): Promise<Retailer> => {
    const response = await apiClient.get(`/retailers/${id}`);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },

  createRetailer: async (payload: CreateRetailerPayload): Promise<Retailer> => {
    const response = await apiClient.post('/retailers', payload);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },

  updateRetailer: async (id: string | number, payload: Partial<CreateRetailerPayload>): Promise<Retailer> => {
    const response = await apiClient.put(`/retailers/${id}`, payload);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },
};
