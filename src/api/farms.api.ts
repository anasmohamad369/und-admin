import { apiClient } from './axios';
import { Farm, CreateFarmPayload, UpdateFarmPayload } from '../types/farm';

export const farmsApi = {
  /** READ All Farms: GET /api/v1/farms/list (fallback to GET /api/v1/farms) */
  getFarms: async (farmIdFilter?: string): Promise<Farm[]> => {
    let response;
    try {
      response = await apiClient.get('/farms/list', { params: farmIdFilter ? { farmId: farmIdFilter } : undefined });
    } catch (err) {
      // Fallback to /farms if /farms/list returns 404 or fails
      response = await apiClient.get('/farms', { params: farmIdFilter ? { farmId: farmIdFilter } : undefined });
    }

    const raw = response.data as any;

    // Handle { success, data: { content: [] } } — paginated
    if (raw?.success && raw?.data?.content) return raw.data.content;
    // Handle { success, data: [] } — plain array
    if (raw?.success && Array.isArray(raw?.data)) return raw.data;
    // Handle direct array
    if (Array.isArray(raw)) return raw;
    // Handle non-wrapped paginated { content: [] }
    if (raw?.content && Array.isArray(raw.content)) return raw.content;
    return [];
  },

  /** READ Farm by ID: GET /api/v1/farms/{id} */
  getFarmById: async (id: string | number): Promise<Farm> => {
    const response = await apiClient.get(`/farms/${id}`);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },

  /** CREATE / ONBOARD Farm: POST /api/v1/farms */
  createFarm: async (payload: CreateFarmPayload): Promise<Farm> => {
    const response = await apiClient.post('/farms', payload);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },

  /** UPDATE Farm: PUT /api/v1/farms/{id} */
  updateFarm: async (id: string | number, payload: UpdateFarmPayload): Promise<Farm> => {
    const response = await apiClient.put(`/farms/${id}`, payload);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },

  /** DELETE Farm: DELETE /api/v1/farms/{id} */
  deleteFarm: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/farms/${id}`);
  },
};
