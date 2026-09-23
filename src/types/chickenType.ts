export interface ChickenType {
  id: number | string;
  name: string;
  code: string;
  unit: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateChickenTypePayload {
  name: string;
  code: string;
  unit: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateChickenTypePayload {
  name?: string;
  code?: string;
  unit?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}
