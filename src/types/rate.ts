export type ChickenType = 'LIVE_CHICKEN' | 'BROILER' | 'COUNTRY_CHICKEN' | 'PARENT_BIRD';
export type ChickenTypeEnum = ChickenType;

export interface LiveRate {
  id: string | number;
  farmId: number | string;
  farmName?: string;
  chickenTypeId?: number | string;
  chickenType?: string;
  originalRatePerKg?: number;
  originalRate?: number;
  marketRatePerKg?: number;
  discountPerKg?: number;
  ratePerKg: number;
  currentRate?: number;
  previousRatePerKg?: number;
  percentageChange?: number;
  currency?: string;
  status?: 'ACTIVE' | 'EXPIRED' | 'MAINTENANCE';
  reason?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  updatedBy?: string;
  updatedById?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload matching POST /api/v1/rates */
export interface PublishRatePayload {
  farmId: number | string;
  chickenTypeId: number | string;
  originalRatePerKg: number;
  discountPerKg: number;
  marketRatePerKg?: number;
  ratePerKg?: number;
  currency?: string;
  reason: string;
  effectiveFrom?: string;
}

export type UpdateRatePayload = PublishRatePayload;

export interface RateHistoryItem extends LiveRate {}
