import { apiClient } from './axios';
import { User } from '../types/user';
import { UserRole } from '../types/common';

export interface LoginPayload {
  usernameOrPhone: string;
  password?: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const backendPayload = {
      username: payload.usernameOrPhone,
      password: payload.password || 'Admin@123',
    };

    const response = await apiClient.post<any>('/auth/login', backendPayload);
    const data = response.data;

    const token = data.accessToken || data.token || 'auth_token_active';
    const mappedUser: User = {
      id: String(data.userId || 1),
      name: data.fullName || data.username || 'System Admin',
      email: data.email || 'admin@chickencommerce.com',
      phone: '9876543210',
      role: payload.role || 'SUPER_ADMIN',
      status: 'ACTIVE',
      lastLoginAt: new Date().toISOString(),
    };

    if (token) {
      localStorage.setItem('cc_auth_token', token);
    }

    return {
      token,
      user: mappedUser,
    };
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
