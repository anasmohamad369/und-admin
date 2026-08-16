export interface Shop {
  id: string;
  retailerId: string; // STRICT: Belongs to exactly one Retailer
  retailerName: string;
  name: string; // Shop Name
  phone: string;
  address: string;
  city: string;
  area: string;
  totalOrders: number;
  totalPurchaseAmount: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopPayload {
  retailerId: string; // STRICT: Required parent retailer ID
  name: string;
  phone: string;
  address: string;
  city: string;
  area?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
