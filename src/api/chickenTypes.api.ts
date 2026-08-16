import { apiClient } from './axios';
import { ChickenType, CreateChickenTypePayload } from '../types/chickenType';

/** Default fallback chicken types if backend hasn't initialized any yet */
export const DEFAULT_CHICKEN_TYPES: ChickenType[] = [
  { id: 1, name: 'Broiler Live Chicken', code: 'CHICKEN-BROILER', unit: 'KG', status: 'ACTIVE' },
  { id: 2, name: 'Country Live Chicken', code: 'CHICKEN-COUNTRY', unit: 'KG', status: 'ACTIVE' },
  { id: 3, name: 'Parent Bird / Breeder', code: 'CHICKEN-PARENT', unit: 'KG', status: 'ACTIVE' },
  { id: 4, name: 'Cockerel Live Chicken', code: 'CHICKEN-COCKEREL', unit: 'KG', status: 'ACTIVE' },
];

export const chickenTypesApi = {
  /** READ Chicken Types: GET /api/v1/chicken-types */
  getChickenTypes: async (): Promise<ChickenType[]> => {
    try {
      const response = await apiClient.get('/chicken-types');
      const raw = response.data as any;
      if (Array.isArray(raw)) return raw.length > 0 ? raw : DEFAULT_CHICKEN_TYPES;
      if (raw?.success && Array.isArray(raw?.data)) return raw.data.length > 0 ? raw.data : DEFAULT_CHICKEN_TYPES;
      if (raw?.content && Array.isArray(raw.content)) return raw.content.length > 0 ? raw.content : DEFAULT_CHICKEN_TYPES;
      return DEFAULT_CHICKEN_TYPES;
    } catch (e) {
      return DEFAULT_CHICKEN_TYPES;
    }
  },

  /** CREATE Chicken Type: POST /api/v1/chicken-types */
  createChickenType: async (payload: CreateChickenTypePayload): Promise<ChickenType> => {
    const response = await apiClient.post('/chicken-types', {
      status: 'ACTIVE',
      ...payload,
    });
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },
};
