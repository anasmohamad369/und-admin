import React, { useState } from 'react';
import { Search, Bell, Shield, LogOut, ChevronDown, UserCheck } from 'lucide-react';
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
    <header className="h-16 bg-white border-b border-stone-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left Section: Global Farm Selector & Quick Search */}
      <div className="flex items-center gap-4">
        <FarmSelector />

        <div className="relative hidden lg:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search orders, retailers, shops..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#fdfbf7] border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Section: Role Switcher, Notifications, User Menu */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            title="Switch demo role"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span>Role: {role.replace(/_/g, ' ')}</span>
            <ChevronDown className="w-3 h-3 text-emerald-700" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-30">
              <div className="px-3 py-1.5 border-b border-stone-100">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
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
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-50 font-medium ${
                    role === r.role ? 'text-emerald-800 font-bold bg-emerald-50/60' : 'text-stone-700'
                  }`}
                >
                  <span>{r.label}</span>
                  {role === r.role && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name.charAt(0) : 'N'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-stone-900 leading-tight">{user?.name || 'NutriFarm Admin'}</p>
              <p className="text-[10px] text-stone-500">{user?.email || 'admin@nutrifarm.in'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-30">
              <div className="px-3 py-2 border-b border-stone-100">
                <p className="text-xs font-bold text-stone-900">{user?.name}</p>
                <p className="text-[10px] text-stone-500">{user?.role}</p>
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
