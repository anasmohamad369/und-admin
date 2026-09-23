import React, { useState } from 'react';
import { Search, Bell, Shield, LogOut, ChevronDown, UserCheck, Calendar } from 'lucide-react';
import { FarmSelector } from '../selectors/FarmSelector';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/common';

const ROLES_LIST: { role: UserRole; label: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Administrator' },
  { role: 'ADMIN', label: 'General Admin' },
  { role: 'FARM_MANAGER', label: 'Farm Manager' },
  { role: 'INVENTORY_MANAGER', label: 'Inventory Manager' },
  { role: 'OPERATIONS_MANAGER', label: 'Operations Manager' },
  { role: 'FINANCE', label: 'Finance Admin' },
];

export const Header: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left Section: Farm Hub Selector & Search */}
      <div className="flex items-center gap-4">
        <FarmSelector />

        <div className="relative hidden lg:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, retailers, shops..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Right Section: Date Picker Pill, Notifications, Role Switcher & User Menu */}
      <div className="flex items-center gap-3">
        {/* Date Selector Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>10 Aug 2025</span>
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>

        {/* Quick Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-800 border border-orange-200 text-xs font-bold hover:bg-orange-100 transition-colors shadow-2xs"
            title="Switch demo role"
          >
            <Shield className="w-3.5 h-3.5 text-orange-600" />
            <span>Role: {role.replace(/_/g, ' ')}</span>
            <ChevronDown className="w-3 h-3 text-orange-600" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Test System Role Access
                </p>
              </div>
              {ROLES_LIST.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-orange-50 font-medium ${
                    role === r.role ? 'text-orange-900 font-bold bg-orange-50/80' : 'text-slate-700'
                  }`}
                >
                  <span>{r.label}</span>
                  {role === r.role && <UserCheck className="w-3.5 h-3.5 text-orange-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon with Badge 12 */}
        <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 text-[10px] font-extrabold bg-rose-500 text-white rounded-full shadow-2xs">
            12
          </span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name.charAt(0) : 'S'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'System Admin'}</p>
              <p className="text-[10px] text-slate-500">{user?.email || 'admin@chickencommerce.com'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[10px] text-slate-500">{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-xs text-rose-600 font-semibold flex items-center gap-2 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
