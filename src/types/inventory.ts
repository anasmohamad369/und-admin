import { ChickenType } from './rate';

export type AdjustmentType = 'ADD_STOCK' | 'REMOVE_STOCK' | 'CORRECTION' | 'DAMAGE' | 'OTHER';

export interface FarmInventory {
  id: string;
  farmId: string;
  farmName: string;
  chickenType: ChickenType;
  physicalStockKg: number;
  reservedStockKg: number;
  availableStockKg: number; // Physical - Reserved
  lastRestockedAt: string;
  status: 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL' | 'OVERSTOCKED';
  updatedAt: string;
}

export interface StockAdjustment {
  id: string;
  farmId: string;
  farmName: string;
  chickenType: ChickenType;
  adjustmentType: AdjustmentType;
  quantityKg: number;
  previousPhysicalKg: number;
  newPhysicalKg: number;
  reason: string;
  notes?: string;
  performedBy: string;
  createdAt: string;
}

export interface StockAdjustmentPayload {
  farmId: string;
  chickenType: ChickenType;
  adjustmentType: AdjustmentType;
  quantityKg: number;
  reason: string;
  notes?: string;
}
