import { apiClient } from './axios';
import { FarmInventory, StockAdjustment, StockAdjustmentPayload } from '../types/inventory';

export const inventoryApi = {
  getInventories: async (farmId?: string): Promise<FarmInventory[]> => {
    const response = await apiClient.get<FarmInventory[] | { content: FarmInventory[] }>('/inventory', { params: { farmId } });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content;
    }
    return [];
  },

  getStockAdjustments: async (farmId?: string): Promise<StockAdjustment[]> => {
    const response = await apiClient.get<StockAdjustment[] | { content: StockAdjustment[] }>('/inventory/adjustments', { params: { farmId } });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content;
    }
    return [];
  },

  adjustStock: async (payload: StockAdjustmentPayload, performedBy?: string): Promise<FarmInventory> => {
    const response = await apiClient.post<FarmInventory>('/inventory/adjustments', payload);
    return response.data;
  },
};
