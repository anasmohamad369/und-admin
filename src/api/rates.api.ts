import { apiClient } from './axios';
import { LiveRate, RateHistoryItem, PublishRatePayload } from '../types/rate';

export const ratesApi = {
  /** READ Current Live Rate: GET /api/v1/rates/current?farmId=10&chickenTypeId=3 */
  getCurrentRate: async (farmId?: number | string, chickenTypeId?: number | string): Promise<LiveRate | null> => {
    try {
      const response = await apiClient.get('/rates/current', {
        params: { farmId, chickenTypeId },
      });
      const raw = response.data as any;
      return raw?.success && raw?.data ? raw.data : raw;
    } catch (err) {
      return null;
    }
  },

  /** READ All Active Rates: GET /api/v1/rates?farmId=ALL (or specific farmId) */
  getLiveRates: async (farmId?: number | string): Promise<LiveRate[]> => {
    let response;
    const targetFarmId = farmId || 'ALL';
    try {
      response = await apiClient.get('/rates', { params: { farmId: targetFarmId } });
    } catch (e) {
      response = await apiClient.get('/rates/live', { params: { farmId: targetFarmId } });
    }
    const raw = response.data as any;

    if (Array.isArray(raw)) return raw;
    if (raw?.success && Array.isArray(raw?.data)) return raw.data;
    if (raw?.success && raw?.data?.content && Array.isArray(raw.data.content)) return raw.data.content;
    if (raw?.content && Array.isArray(raw.content)) return raw.content;
    return [];
  },

  /** READ Rate History Timeline: GET /api/v1/rates/history?farmId=10&chickenTypeId=3&page=0&size=20 */
  getRateHistory: async (
    farmId?: number | string,
    chickenTypeId?: number | string,
    page: number = 0,
    size: number = 20
  ): Promise<RateHistoryItem[]> => {
    const params: Record<string, any> = { page, size };
    if (farmId && farmId !== 'ALL') params.farmId = farmId;
    if (chickenTypeId && chickenTypeId !== 'ALL') params.chickenTypeId = chickenTypeId;

    const response = await apiClient.get('/rates/history', { params });
    const raw = response.data as any;

    if (Array.isArray(raw)) return raw;
    if (raw?.success && Array.isArray(raw?.data)) return raw.data;
    if (raw?.success && raw?.data?.content && Array.isArray(raw.data.content)) return raw.data.content;
    if (raw?.content && Array.isArray(raw.content)) return raw.content;
    return [];
  },

  /** CREATE / PUBLISH Live Rate: POST /api/v1/rates */
  publishRate: async (payload: PublishRatePayload): Promise<LiveRate> => {
    const response = await apiClient.post('/rates', {
      currency: 'INR',
      ...payload,
    });
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },

  /** Alias updateRate for backwards compatibility */
  updateRate: async (payload: PublishRatePayload): Promise<LiveRate> => {
    return ratesApi.publishRate(payload);
  },
};
