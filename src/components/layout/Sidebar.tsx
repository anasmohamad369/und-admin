import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Store,
  ShoppingBag,
  ShoppingCart,
  Boxes,
  Truck,
  MapPin,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/common';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Farms', path: '/farms', icon: Building2 },
  { label: 'Live Rates', path: '/rates', icon: TrendingUp },
  { label: 'Retailers', path: '/retailers', icon: Store },
  { label: 'Shops', path: '/shops', icon: ShoppingBag },
  { label: 'Orders', path: '/orders', icon: ShoppingCart },
  { label: 'Inventory', path: '/inventory', icon: Boxes },
  { label: 'Drivers', path: '/drivers', icon: Truck },
  { label: 'Deliveries', path: '/deliveries', icon: MapPin },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { hasRole, role } = useAuth();

  return (
    <aside
      className={`bg-stone-900 text-stone-100 flex flex-col transition-all duration-300 z-30 border-r border-stone-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header with NutriFarm Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-stone-800">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-sm border border-stone-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/logo.png"
                alt="NutriFarm Chicken Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="overflow-hidden">
              <span className="font-extrabold text-sm tracking-tight text-white block leading-tight truncate">
                NutriFarm Chicken
              </span>
              <span className="text-[10px] text-amber-400 tracking-wider font-semibold block truncate">
                Fresh & Healthy B2B
              </span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm mx-auto flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="NutriFarm" className="w-full h-full object-contain" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge Summary */}
      {!collapsed && (
        <div className="px-4 py-2.5 bg-stone-950/60 border-b border-stone-800/80 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="truncate">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Active Role</p>
            <p className="text-xs font-bold text-stone-100 truncate">{role.replace(/_/g, ' ')}</p>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          if (item.roles && !hasRole(item.roles)) {
            return null;
          }
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-stone-800 text-white font-semibold shadow-inner border-l-4 border-emerald-500'
                    : 'text-stone-300 hover:bg-stone-800/70 hover:text-white'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer System Version */}
      {!collapsed && (
        <div className="p-4 border-t border-stone-800 text-center bg-stone-950/40">
          <p className="text-[11px] text-stone-400 font-mono">NutriFarm v1.0.0-PROD</p>
        </div>
      )}
    </aside>
  );
};
