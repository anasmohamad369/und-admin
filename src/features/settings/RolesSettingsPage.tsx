import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

const ROLES_MATRIX = [
  { role: 'SUPER_ADMIN', name: 'Super Administrator', desc: 'Full unrestricted platform access across all farms & settings', usersCount: 2 },
  { role: 'ADMIN', name: 'General Administrator', desc: 'Manages farms, rates, retailers, shops, orders, and logistics', usersCount: 4 },
  { role: 'FARM_MANAGER', name: 'Farm Manager', desc: 'Restricted scope: Updates rates and stock for assigned farm', usersCount: 8 },
  { role: 'INVENTORY_MANAGER', name: 'Inventory Manager', desc: 'Manages physical intake, stock adjustments, and losses', usersCount: 3 },
  { role: 'OPERATIONS_MANAGER', name: 'Operations Manager', desc: 'Manages logistics dispatches, drivers, and deliveries', usersCount: 5 },
  { role: 'FINANCE', name: 'Finance Admin', desc: 'Manages pricing audits, invoices, payment status ledgers', usersCount: 3 },
];

export const RolesSettingsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
        <span className="text-xs text-slate-500 font-medium">Spring Security Compatible Roles</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLES_MATRIX.map((r) => (
          <div key={r.role} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{r.name}</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                {r.role}
              </span>
            </div>
            <p className="text-xs text-slate-600">{r.desc}</p>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Assigned Users: {r.usersCount}</span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Enforced in React Router
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
