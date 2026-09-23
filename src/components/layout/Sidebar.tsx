import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Store,
  ShoppingCart,
  Boxes,
  Truck,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Tag,
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
  { label: 'Chicken Types', path: '/settings/chicken-types', icon: Tag },
  { label: 'Farms', path: '/farms', icon: Building2 },
  { label: 'Daily Prices', path: '/rates', icon: TrendingUp },
  { label: 'Retailers', path: '/retailers', icon: Store },
  { label: 'Orders', path: '/orders', icon: ShoppingCart },
  { label: 'Drivers', path: '/drivers', icon: Truck },
  { label: 'Inventory', path: '/inventory', icon: Boxes },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Notifications', path: '/settings/audit-logs', icon: Bell },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { hasRole, role, user } = useAuth();

  return (
    <aside
      className={`bg-[#0f172a] text-slate-100 flex flex-col transition-all duration-300 z-30 border-r border-slate-800 shadow-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header with NutriFarm Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/80">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/logo.png"
                alt="NutriFarm Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="overflow-hidden">
              <span className="font-black text-lg tracking-tight text-white block leading-tight truncate">
                NutriFarm
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest font-extrabold uppercase block truncate">
                ADMIN
              </span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md mx-auto flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="NutriFarm" className="w-full h-full object-contain" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

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
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#059669] text-white font-bold shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!collapsed && <span>{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile Footer */}
      {!collapsed ? (
        <div className="p-3 m-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="Admin Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/50"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-extrabold text-white leading-tight truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">{role.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-3 text-center border-t border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mx-auto shadow-md">
            A
          </div>
        </div>
      )}
    </aside>
  );
};
