export type DeliveryStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED';

export interface Delivery {
  id: string; // DEL-9012
  orderId: string;
  orderNumber: string;
  farmId: string;
  farmName: string;
  retailerId: string;
  retailerName: string;
  shopId: string;
  shopName: string;
  shopAddress: string;
  shopCity: string;
  quantityKg: number;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  status: DeliveryStatus;
  estimatedDeliveryTime?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  createdAt: string;
}
