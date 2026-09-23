import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';

import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';

import { FarmsListPage } from '../features/farms/FarmsListPage';
import { FarmDetailPage } from '../features/farms/FarmDetailPage';
import { OnboardFarmPage } from '../features/farms/OnboardFarmPage';

import { RatesPage } from '../features/rates/RatesPage';
import { RateHistoryPage } from '../features/rates/RateHistoryPage';
import { UpdateRatePage } from '../features/rates/UpdateRatePage';

import { RetailersListPage } from '../features/retailers/RetailersListPage';
import { RetailerDetailPage } from '../features/retailers/RetailerDetailPage';

import { ShopsListPage } from '../features/shops/ShopsListPage';
import { ShopDetailPage } from '../features/shops/ShopDetailPage';
import { CreateShopPage } from '../features/shops/CreateShopPage';

import { OrdersListPage } from '../features/orders/OrdersListPage';
import { OrderDetailPage } from '../features/orders/OrderDetailPage';
import { CreateOrderPage } from '../features/orders/CreateOrderPage';

import { InventoryPage } from '../features/inventory/InventoryPage';
import { InventoryHistoryPage } from '../features/inventory/InventoryHistoryPage';

import { DriversListPage } from '../features/drivers/DriversListPage';
import { DriverDetailPage } from '../features/drivers/DriverDetailPage';

import { DeliveriesPage } from '../features/deliveries/DeliveriesPage';
import { ReportsPage } from '../features/reports/ReportsPage';

import { SettingsPage } from '../features/settings/SettingsPage';
import { UsersSettingsPage } from '../features/settings/UsersSettingsPage';
import { RolesSettingsPage } from '../features/settings/RolesSettingsPage';
import { CitiesSettingsPage } from '../features/settings/CitiesSettingsPage';
import { ChickenTypesSettingsPage } from '../features/settings/ChickenTypesSettingsPage';
import { AuditLogsPage } from '../features/settings/AuditLogsPage';
import { RouteErrorElement } from '../components/common/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <RouteErrorElement />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'farms',
        element: <FarmsListPage />,
      },
      {
        path: 'farms/onboard',
        element: <OnboardFarmPage />,
      },
      {
        path: 'farms/:id',
        element: <FarmDetailPage />,
      },
      {
        path: 'rates',
        element: <RatesPage />,
      },
      {
        path: 'rates/update',
        element: <UpdateRatePage />,
      },
      {
        path: 'rates/history',
        element: <RateHistoryPage />,
      },
      {
        path: 'retailers',
        element: <RetailersListPage />,
      },
      {
        path: 'retailers/:id',
        element: <RetailerDetailPage />,
      },
      {
        path: 'shops',
        element: <ShopsListPage />,
      },
      {
        path: 'shops/create',
        element: <CreateShopPage />,
      },
      {
        path: 'shops/:id',
        element: <ShopDetailPage />,
      },
      {
        path: 'orders',
        element: <OrdersListPage />,
      },
      {
        path: 'orders/create',
        element: <CreateOrderPage />,
      },
      {
        path: 'orders/:id',
        element: <OrderDetailPage />,
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
      {
        path: 'inventory/history',
        element: <InventoryHistoryPage />,
      },
      {
        path: 'inventory/:id',
        element: <InventoryPage />,
      },
      {
        path: 'drivers',
        element: <DriversListPage />,
      },
      {
        path: 'drivers/:id',
        element: <DriverDetailPage />,
      },
      {
        path: 'deliveries',
        element: <DeliveriesPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        children: [
          {
            index: true,
            element: <Navigate to="/settings/users" replace />,
          },
          {
            path: 'users',
            element: <UsersSettingsPage />,
          },
          {
            path: 'roles',
            element: <RolesSettingsPage />,
          },
          {
            path: 'cities',
            element: <CitiesSettingsPage />,
          },
          {
            path: 'chicken-types',
            element: <ChickenTypesSettingsPage />,
          },
          {
            path: 'audit-logs',
            element: <AuditLogsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
