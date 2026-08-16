import { apiClient } from './axios';
import { Driver } from '../types/driver';

export const driversApi = {
  getDrivers: async (farmId?: string): Promise<Driver[]> => {
    const response = await apiClient.get<Driver[] | { content: Driver[] }>('/drivers', { params: { farmId } });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content;
    }
    return [];
  },

  getDriverById: async (id: string): Promise<Driver> => {
    const response = await apiClient.get<Driver>(`/drivers/${id}`);
    return response.data;
  },
};
