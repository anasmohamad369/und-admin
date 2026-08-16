export interface Retailer {
  id: string;
  name: string; // Business Name
  ownerName: string;
  primaryPhone: string;
  alternatePhone?: string;
  email?: string;
  taxNumber?: string; // GST / Tax Details
  city: string;
  shopsCount: number;
  totalOrders: number;
  totalPurchaseAmount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
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
