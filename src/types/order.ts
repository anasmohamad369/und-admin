import { ChickenType } from './rate';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';

export interface OrderItemPayload {
  chickenTypeId?: number | string;
  chickenType?: ChickenType | string;
  quantity?: number;
  quantityKg?: number;
  ratePerKg?: number;
}

export interface OrderItem {
  id: string | number;
  chickenTypeId?: number | string;
  chickenType?: ChickenType | string;
  quantityKg?: number;
  quantity?: number;
  ratePerKg?: number;
  totalAmount?: number;
}

export interface Order {
  id: string | number;
  orderNumber: string;
  farmId: string | number;
  farmName?: string;
  retailerId: string | number;
  retailerName?: string;
  shopId: string | number;
  shopName?: string;
  shopAddress?: string;
  shopCity?: string;
  items: OrderItem[];
  totalQuantityKg: number;
  ratePerKg?: number;
  subtotal?: number;
  discount?: number;
  taxesAndFees?: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  driverId?: string | number;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  reservedStockKg?: number;
  stockReservedStatus?: 'PENDING' | 'RESERVED' | 'RELEASED' | 'FULFILLED';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  deliveredAt?: string;
}

/** Payload matching POST /api/v1/orders */
export interface CreateOrderPayload {
  farmId: number | string;
  retailerId: number | string;
  shopId: number | string;
  paymentMethod?: string;
  items?: OrderItemPayload[];
  chickenType?: ChickenType | string;
  quantityKg?: number;
  notes?: string;
}
