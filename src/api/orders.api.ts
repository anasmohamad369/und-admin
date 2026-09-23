import { apiClient } from './axios';
import { Order, CreateOrderPayload, OrderStatus } from '../types/order';

const ensureArray = (raw: any): Order[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.content)) return raw.content;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  if (raw?.data?.content && Array.isArray(raw.data.content)) return raw.data.content;
  return [];
};

export const ordersApi = {
  /** READ All Orders: GET /api/v1/orders */
  getOrders: async (farmId?: number | string, retailerId?: number | string, shopId?: number | string, status?: string): Promise<Order[]> => {
    let response;
    try {
      response = await apiClient.get('/orders/list', { params: { farmId, retailerId, shopId, status } });
    } catch (e) {
      response = await apiClient.get('/orders', { params: { farmId, retailerId, shopId, status } });
    }
    return ensureArray(response.data);
  },

  /** READ Order by ID: GET /api/v1/orders/{id} */
  getOrderById: async (id: number | string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },

  /** CREATE Order: POST /api/v1/orders */
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const normalizedPayload = {
      farmId: isNaN(Number(payload.farmId)) ? payload.farmId : Number(payload.farmId),
      retailerId: isNaN(Number(payload.retailerId)) ? payload.retailerId : Number(payload.retailerId),
      shopId: isNaN(Number(payload.shopId)) ? payload.shopId : Number(payload.shopId),
      paymentMethod: payload.paymentMethod || 'UPI',
      items: payload.items && payload.items.length > 0
        ? payload.items
        : [{ chickenTypeId: 3, quantity: payload.quantityKg || 100 }],
    };

    const response = await apiClient.post('/orders', normalizedPayload);
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },

  /** UPDATE Order Status: PATCH /api/v1/orders/{orderId}/status */
  updateOrderStatus: async (orderId: number | string, status: OrderStatus, driverId?: number | string): Promise<Order> => {
    const response = await apiClient.patch(`/orders/${orderId}/status`, { status, driverId });
    const raw = response.data as any;
    return raw?.success && raw?.data ? raw.data : raw;
  },
};
