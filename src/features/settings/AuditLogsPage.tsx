import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings.api';
import { Lock } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { data: logs = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => settingsApi.getAuditLogs(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">System Audit Trail Log</h3>
        <span className="text-xs text-slate-500 font-medium">{logs.length} audit entries</span>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-500 font-semibold uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-slate-500">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 font-bold text-slate-900">{l.userName}</td>
                <td className="px-4 py-3 font-semibold text-brand-700">{l.module}</td>
                <td className="px-4 py-3 font-mono text-slate-700">{l.action}</td>
                <td className="px-4 py-3 text-slate-600 max-w-sm">{l.details}</td>
                <td className="px-4 py-3 font-mono text-slate-400">{l.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
