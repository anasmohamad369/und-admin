/** Matches the Spring Boot backend Farm entity response */
export interface Farm {
  id: string | number;
  name: string;
  code: string;
  ownerName: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  phone?: string;
  city?: string;
  state?: string;
  contactPerson?: string; // alias for ownerName
  location?: string;      // alias for address
  currentRate?: number;
  physicalStock?: number;
  reservedStock?: number;
  availableStock?: number;
  activeOrdersCount?: number;
  deliveryRadiusKm?: number;
  deliverableAreas?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/** Payload shape matching POST /api/v1/farms */
export interface CreateFarmPayload {
  name: string;
  code: string;
  ownerName: string;
  address: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  phone?: string;
  city?: string;
  state?: string;
  currentRate?: number;
  physicalStock?: number;
  deliveryRadiusKm?: number;
  deliverableAreas?: string[];
}

/** Payload shape matching PUT /api/v1/farms/{id} */
export interface UpdateFarmPayload {
  name?: string;
  code?: string;
  ownerName?: string;
  address?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  phone?: string;
  city?: string;
  state?: string;
  currentRate?: number;
  physicalStock?: number;
  deliveryRadiusKm?: number;
  deliverableAreas?: string[];
}
