import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings.api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UserPlus } from 'lucide-react';

export const UsersSettingsPage: React.FC = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['usersSettings'],
    queryFn: () => settingsApi.getUsers(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Platform User Roster</h3>
        <button className="px-3.5 py-1.5 bg-brand-900 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-500 font-semibold uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email / Mobile</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Scope / Farm</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3 font-bold text-brand-900">{(u.role || 'ADMIN').replace(/_/g, ' ')}</td>
                <td className="px-4 py-3 text-slate-500">{u.farmName || 'All Farms Scope'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={u.status} size="sm" />
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Recently'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
