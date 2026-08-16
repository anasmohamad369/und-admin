import { UserRole } from './common';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  farmId?: string; // If farm manager, restricted to specific farm
  farmName?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLoginAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: 'FARM' | 'RATE' | 'RETAILER' | 'SHOP' | 'ORDER' | 'INVENTORY' | 'DRIVER' | 'DELIVERY' | 'SETTINGS';
  details: string;
  ipAddress: string;
  createdAt: string;
}
