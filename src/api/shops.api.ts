import { apiClient } from './axios';
import { Shop, CreateShopPayload } from '../types/shop';

const mapShop = (item: any): Shop => ({
  id: String(item.id),
  retailerId: String(item.retailerId || ''),
  retailerName: item.retailerName || item.businessName || 'Retailer',
  name: item.shopName || item.name || `Shop #${item.id}`,
  phone: item.mobile || item.phone || 'N/A',
  address: item.address || 'N/A',
  latitude: item.latitude != null ? Number(item.latitude) : 16.5062,
  longitude: item.longitude != null ? Number(item.longitude) : 80.6480,
  status: item.status || 'ACTIVE',
  totalOrders: item.totalOrders || 0,
});

export const shopsApi = {
  getShops: async (retailerIdFilter?: string): Promise<Shop[]> => {
    const response = await apiClient.get('/shops', { params: { retailerId: retailerIdFilter } });
    const raw = response.data as any;
    let list: any[] = [];
    if (Array.isArray(raw)) list = raw;
    else if (raw?.success && Array.isArray(raw?.data)) list = raw.data;
    else if (raw?.content && Array.isArray(raw.content)) list = raw.content;
    return list.map(mapShop);
  },

  getShopsByRetailerId: async (retailerId: string): Promise<Shop[]> => {
    const response = await apiClient.get(`/retailers/${retailerId}/shops`);
    const raw = response.data as any;
    let list: any[] = [];
    if (Array.isArray(raw)) list = raw;
    else if (raw?.success && Array.isArray(raw?.data)) list = raw.data;
    else if (raw?.content && Array.isArray(raw.content)) list = raw.content;
    return list.map(mapShop);
  },

  getShopById: async (id: string): Promise<Shop> => {
    const response = await apiClient.get(`/shops/${id}`);
    const raw = response.data as any;
    const item = raw?.success && raw?.data ? raw.data : raw;
    return mapShop(item);
  },

  createShop: async (payload: CreateShopPayload): Promise<Shop> => {
    const response = await apiClient.post('/shops', payload);
    const raw = response.data as any;
    const item = raw?.success && raw?.data ? raw.data : raw;
    return mapShop(item);
  },
};
