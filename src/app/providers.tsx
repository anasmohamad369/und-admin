import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { AuthProvider } from '../context/AuthContext';
import { FarmProvider } from '../context/FarmContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FarmProvider>{children}</FarmProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
