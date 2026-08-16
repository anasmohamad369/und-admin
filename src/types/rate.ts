export type ChickenType = 'LIVE_CHICKEN' | 'BROILER' | 'COUNTRY_CHICKEN' | 'PARENT_BIRD';
export type ChickenTypeEnum = ChickenType;

export interface LiveRate {
  id: string | number;
  farmId: number | string;
  farmName?: string;
  chickenTypeId?: number | string;
  chickenType?: string;
  ratePerKg: number;
  previousRatePerKg?: number;
  percentageChange?: number;
  currency?: string;
  effectiveFrom?: string;
  updatedBy?: string;
  updatedById?: string;
  reason?: string;
  updatedAt?: string;
}

/** Payload matching POST /api/v1/rates */
export interface PublishRatePayload {
  farmId: number | string;
  chickenTypeId?: number | string;
  chickenType?: string;
  ratePerKg: number;
  currency?: string;
  reason?: string;
  effectiveFrom?: string;
}

export type UpdateRatePayload = PublishRatePayload;

export interface RateHistoryItem extends LiveRate {}
