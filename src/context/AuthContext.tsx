import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { UserRole } from '../types/common';
import { authApi } from '../api/auth.api';

const DEFAULT_DEV_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwicm9sZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifSx7ImF1dGhvcml0eSI6IlJPTEVfU1VQRVJfQURNSU4ifV0sImlhdCI6MTc4ODAxMTAyMCwiZXhwIjoxNzg4MDk3NDIwfQ.mCKLxYjBrqBUR3S-0DAUo2YIf-znTSanLsvGtTEVGOOeoJNdPXe3ZkDjL0hcskjGhzRrwZcwShX55lIBVEyJ5Q';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role?: UserRole, username?: string, password?: string) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    let savedToken = localStorage.getItem('cc_auth_token');
    const savedRole = (localStorage.getItem('cc_user_role') as UserRole) || 'SUPER_ADMIN';
    
    if (!savedToken) {
      // Auto-provision dev SuperAdmin token so direct URLs work in Incognito mode
      savedToken = DEFAULT_DEV_TOKEN;
      localStorage.setItem('cc_auth_token', savedToken);
      localStorage.setItem('cc_user_role', 'SUPER_ADMIN');
    }

    return {
      id: '1',
      name: 'System Admin',
      email: 'admin@chickencommerce.com',
      phone: '9876543210',
      role: savedRole,
      status: 'ACTIVE',
      lastLoginAt: new Date().toISOString(),
    };
  });

  const [role, setRole] = useState<UserRole>(() => user?.role || 'SUPER_ADMIN');

  useEffect(() => {
    if (user) {
      localStorage.setItem('cc_user_role', user.role);
      setRole(user.role);
    }
  }, [user]);

  const login = async (selectedRole: UserRole = 'SUPER_ADMIN', username?: string, password?: string) => {
    const response = await authApi.login({
      usernameOrPhone: username || 'admin',
      password: password || 'Admin@123',
      role: selectedRole,
    });
    localStorage.setItem('cc_auth_token', response.token);
    setUser(response.user);
    setRole(response.user.role);
  };

  const logout = () => {
    localStorage.removeItem('cc_auth_token');
    localStorage.removeItem('cc_user_role');
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      setRole(newRole);
      localStorage.setItem('cc_user_role', newRole);
    }
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!role) return false;
    if (role === 'SUPER_ADMIN') return true;
    return allowedRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
