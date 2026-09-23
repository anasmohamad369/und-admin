import { apiClient } from './axios';
import { FarmInventory, StockAdjustment, StockAdjustmentPayload, StockInPayload } from '../types/inventory';

export const inventoryApi = {
  /** READ All Inventory (or specific farm): GET /api/v1/inventory?farmId=ALL */
  getInventories: async (farmId?: number | string): Promise<FarmInventory[]> => {
    const params = farmId ? { farmId } : { farmId: 'ALL' };
    const response = await apiClient.get('/inventory', { params });
    const raw = response.data as any;

    if (Array.isArray(raw)) return raw;
    if (raw?.success && Array.isArray(raw?.data)) return raw.data;
    if (raw?.success && raw?.data?.content && Array.isArray(raw.data.content)) return raw.data.content;
    if (raw?.content && Array.isArray(raw.content)) return raw.content;
    return [];
  },

  /** READ Stock Transaction Audit History: GET /api/v1/inventory/adjustments?farmId=ALL */
  getStockAdjustments: async (farmId?: number | string): Promise<StockAdjustment[]> => {
    const params = farmId ? { farmId } : { farmId: 'ALL' };
    const response = await apiClient.get('/inventory/adjustments', { params });
    const raw = response.data as any;

    if (Array.isArray(raw)) return raw;
    if (raw?.success && Array.isArray(raw?.data)) return raw.data;
    if (raw?.success && raw?.data?.content && Array.isArray(raw.data.content)) return raw.data.content;
    if (raw?.content && Array.isArray(raw.content)) return raw.content;
    return [];
  },

  /** Add Stock (Stock-In): POST /api/v1/inventory/stock-in */
  stockIn: async (payload: StockInPayload): Promise<FarmInventory> => {
    const response = await apiClient.post('/inventory/stock-in', payload);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },

  /** Adjust / Deduct Stock (Stock-Out / Damage / Correction): POST /api/v1/inventory/adjustments */
  adjustStock: async (payload: StockAdjustmentPayload): Promise<FarmInventory> => {
    const response = await apiClient.post('/inventory/adjustments', payload);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },
};
