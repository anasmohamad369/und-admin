import { apiClient } from './axios';
import { User, AuditLog } from '../types/user';

export const settingsApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[] | { content: User[] }>('/settings/users');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content;
    }
    return [];
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await apiClient.get<AuditLog[] | { content: AuditLog[] }>('/settings/audit-logs');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content;
    }
    return [];
  },
};
