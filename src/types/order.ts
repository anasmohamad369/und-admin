import { ChickenType } from './rate';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';

export interface OrderItem {
  id: string;
  chickenType: ChickenType;
  quantityKg: number;
  ratePerKg: number;
  totalAmount: number;
}

export interface Order {
  id: string; // ORD-10245
  orderNumber: string;
  farmId: string;
  farmName: string;
  retailerId: string; // STRICT: Parent retailer
  retailerName: string;
  shopId: string; // STRICT: Belongs to retailerId
  shopName: string;
  shopAddress: string;
  shopCity: string;
  items: OrderItem[];
  totalQuantityKg: number;
  ratePerKg: number;
  subtotal: number;
  discount: number;
  taxesAndFees: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  reservedStockKg: number;
  stockReservedStatus: 'PENDING' | 'RESERVED' | 'RELEASED' | 'FULFILLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
}

export interface CreateOrderPayload {
  farmId: string;
  retailerId: string;
  shopId: string; // Must belong to retailerId
  chickenType: ChickenType;
  quantityKg: number;
  notes?: string;
}
