import { apiClient } from './axios';
import { LiveRate, RateHistoryItem, PublishRatePayload } from '../types/rate';

export const ratesApi = {
  /** READ Current Live Rate: GET /api/v1/rates/current?farmId=1&chickenTypeId=1 (with fallback to GET /api/v1/rates/live) */
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

  /** READ All Live Rates: GET /api/v1/rates (or GET /api/v1/rates/live) */
  getLiveRates: async (farmId?: number | string): Promise<LiveRate[]> => {
    let response;
    try {
      response = await apiClient.get('/rates', { params: farmId ? { farmId } : undefined });
    } catch (e) {
      response = await apiClient.get('/rates/live', { params: farmId ? { farmId } : undefined });
    }
    const raw = response.data as any;

    if (Array.isArray(raw)) return raw;
    if (raw?.success && Array.isArray(raw?.data)) return raw.data;
    if (raw?.content && Array.isArray(raw.content)) return raw.content;
    return [];
  },

  /** READ Rate History: GET /api/v1/rates/history?farmId=1&chickenTypeId=1 */
  getRateHistory: async (farmId?: number | string, chickenTypeId?: number | string): Promise<RateHistoryItem[]> => {
    const response = await apiClient.get('/rates/history', {
      params: { farmId, chickenTypeId },
    });
    const raw = response.data as any;

    if (Array.isArray(raw)) return raw;
    if (raw?.success && Array.isArray(raw?.data)) return raw.data;
    if (raw?.content && Array.isArray(raw.content)) return raw.content;
    return [];
  },

  /** CREATE / PUBLISH Live Rate: POST /api/v1/rates */
  publishRate: async (payload: PublishRatePayload): Promise<LiveRate> => {
    const response = await apiClient.post('/rates', {
      currency: 'INR',
      reason: 'Market update',
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
