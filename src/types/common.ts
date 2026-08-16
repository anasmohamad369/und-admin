export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'FARM_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'OPERATIONS_MANAGER'
  | 'FINANCE';

export type StatusType = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DEACTIVATED';

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}
