export interface Retailer {
  id: string | number;
  name: string; // Business Name
  ownerName: string;
  primaryPhone: string;
  alternatePhone?: string;
  email?: string;
  taxNumber?: string;
  city: string;
  shopsCount?: number;
  totalOrders?: number;
  totalPurchaseAmount?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRetailerPayload {
  name: string;
  ownerName: string;
  primaryPhone: string;
  alternatePhone?: string;
  email?: string;
  taxNumber?: string;
  city: string;
  status: 'ACTIVE' | 'INACTIVE';
}

/** Payload matching POST /api/v1/auth/register-retailer */
export interface RegisterRetailerPayload {
  mobile: string;
  fullName: string;
  businessName: string;
  email?: string;
  password?: string;
  shopName: string;
  address: string;
  latitude?: number;
  longitude?: number;
}
