export type DriverStatus = 'AVAILABLE' | 'ON_DELIVERY' | 'OFFLINE' | 'INACTIVE';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: string;
  licenseNumber: string;
  status: DriverStatus;
  currentDeliveryId?: string;
  completedDeliveriesCount: number;
  rating: number;
  assignedFarmId?: string;
  assignedFarmName?: string;
  createdAt: string;
  updatedAt: string;
}
