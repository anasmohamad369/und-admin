import { apiClient } from './axios';
import { Retailer, CreateRetailerPayload, RegisterRetailerPayload } from '../types/retailer';

const mapRetailer = (item: any): Retailer => {
  if (!item || typeof item !== 'object') {
    return {
      id: '',
      name: 'Retailer Business',
      ownerName: 'N/A',
      primaryPhone: 'N/A',
      email: '',
      city: 'N/A',
      shopsCount: 0,
      totalOrders: 0,
      totalPurchaseAmount: 0,
      status: 'ACTIVE',
    };
  }

  const shopList = Array.isArray(item.shops) ? item.shops : [];
  let cityStr = item.cityCircle || item.city || 'N/A';
  if (cityStr === 'N/A' && shopList.length > 0 && shopList[0]?.address) {
    const addr = shopList[0].address;
    if (typeof addr === 'string' && addr.includes(',')) {
      const parts = addr.split(',');
      cityStr = parts[parts.length - 1].trim();
    } else if (typeof addr === 'string') {
      cityStr = addr;
    }
  }

  return {
    id: item.id != null ? String(item.id) : '',
    name: item.businessName || item.name || 'Retailer Business',
    ownerName: item.ownerName || 'N/A',
    primaryPhone: item.mobile || item.primaryPhone || 'N/A',
    email: item.email || '',
    city: cityStr,
    shopsCount: item.shopsCount ?? shopList.length,
    totalOrders: item.totalOrders ?? 0,
    totalPurchaseAmount: item.totalPurchase ?? 0,
    status: item.status || 'ACTIVE',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

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
    let list: any[] = [];
    if (Array.isArray(data)) list = data;
    else if (data?.success && Array.isArray(data?.data)) list = data.data;
    else if (data?.content && Array.isArray(data.content)) list = data.content;

    return list.map(mapRetailer);
  },

  getRetailerById: async (id: string | number): Promise<Retailer> => {
    const response = await apiClient.get(`/retailers/${id}`);
    const raw = response.data as any;
    const item = raw?.success && raw?.data ? raw.data : raw;
    return mapRetailer(item);
  },

  /** REGISTER Retailer: POST /api/v1/auth/register-retailer */
  registerRetailer: async (payload: RegisterRetailerPayload): Promise<any> => {
    const response = await apiClient.post('/auth/register-retailer', payload);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },

  createRetailer: async (payload: CreateRetailerPayload): Promise<Retailer> => {
    const response = await apiClient.post('/retailers', payload);
    const raw = response.data as any;
    const item = raw?.success && raw?.data ? raw.data : raw;
    return mapRetailer(item);
  },

  updateRetailer: async (id: string | number, payload: Partial<CreateRetailerPayload>): Promise<Retailer> => {
    const response = await apiClient.put(`/retailers/${id}`, payload);
    const raw = response.data as any;
    const item = raw?.success && raw?.data ? raw.data : raw;
    return mapRetailer(item);
  },
};
