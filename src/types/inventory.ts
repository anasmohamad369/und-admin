import { ChickenType } from './rate';

export type AdjustmentType = 'ADD_STOCK' | 'REMOVE_STOCK' | 'CORRECTION' | 'DAMAGE' | 'OTHER';

export interface FarmInventory {
  id: string | number;
  farmId: string | number;
  farmName?: string;
  farmCode?: string;
  chickenTypeId?: string | number;
  chickenTypeName?: string;
  chickenTypeCode?: string;
  chickenType?: ChickenType | string;
  physicalQuantity?: number;
  physicalStockKg?: number;
  reservedQuantity?: number;
  reservedStockKg?: number;
  availableQuantity?: number;
  availableStockKg?: number;
  unit?: string;
  version?: number;
  lastUpdatedAt?: string;
  updatedAt?: string;
  status?: 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL' | 'OVERSTOCKED';
}

/** Payload matching POST /api/v1/inventory/stock-in */
export interface StockInPayload {
  farmId: number | string;
  chickenTypeId: number | string;
  quantity: number;
  reason: string;
}

export interface StockAdjustment {
  id: string | number;
  farmId: string | number;
  farmName?: string;
  farmCode?: string;
  chickenTypeId?: number | string;
  chickenTypeName?: string;
  chickenTypeCode?: string;
  chickenType?: ChickenType | string;
  adjustmentType: AdjustmentType | string;
  quantity?: number;
  quantityKg?: number;
  quantityDelta?: number;
  previousPhysicalKg?: number;
  newPhysicalKg?: number;
  reason?: string;
  notes?: string;
  performedBy?: string;
  createdAt?: string;
  lastUpdatedAt?: string;
}

/** Payload matching POST /api/v1/inventory/adjustments */
export interface StockAdjustmentPayload {
  farmId: string | number;
  chickenType?: string;
  chickenTypeId?: number | string;
  adjustmentType: AdjustmentType | string;
  quantity: number;
  reason: string;
  notes?: string;
}
