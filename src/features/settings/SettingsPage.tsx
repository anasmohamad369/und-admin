import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, Shield, MapPin, Feather, FileText, Settings as SettingsIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

const SETTINGS_TABS = [
  { label: 'User Management', path: '/settings/users', icon: Users },
  { label: 'Roles & Permissions', path: '/settings/roles', icon: Shield },
  { label: 'Supply Circles / Cities', path: '/settings/cities', icon: MapPin },
  { label: 'Chicken Catalog Types', path: '/settings/chicken-types', icon: Feather },
  { label: 'System Audit Logs', path: '/settings/audit-logs', icon: FileText },
];

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Administration & Settings"
        subtitle="Configure user roles, supply circles, product catalog, and audit trails"
      />

      {/* Settings Tab Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 px-6 flex flex-wrap gap-6 bg-slate-50/50">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-brand-700 text-brand-900 font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-brand-700" />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
