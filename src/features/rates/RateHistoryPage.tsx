import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { useFarms } from '../../hooks/useFarms';
import { useChickenTypes } from '../../hooks/useChickenTypes';
import { useRateHistory } from '../../hooks/useRates';
import { RateHistoryItem } from '../../types/rate';
import { Lock, ShieldCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export const RateHistoryPage: React.FC = () => {
  const { data: farms = [] } = useFarms();
  const { data: chickenTypes = [] } = useChickenTypes();

  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [selectedChickenTypeId, setSelectedChickenTypeId] = useState<string>('');
  const [search, setSearch] = useState('');

  const { data: history = [], isLoading } = useRateHistory(
    selectedFarmId ? selectedFarmId : undefined,
    selectedChickenTypeId ? selectedChickenTypeId : undefined
  );

  const filteredHistory = history.filter((item) => {
    if (search) {
      const name = item.farmName || '';
      const reason = item.reason || '';
      if (!name.toLowerCase().includes(search.toLowerCase()) && !reason.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const columns: Column<RateHistoryItem>[] = [
    {
      header: 'Effective Date',
      cell: (row) => (
        <div className="text-xs font-semibold text-stone-700">
          {row.effectiveFrom ? new Date(row.effectiveFrom).toLocaleString() : 'N/A'}
        </div>
      ),
    },
    {
      header: 'Farm Hub',
      cell: (row) => <span className="font-bold text-stone-900">{row.farmName || `Farm #${row.farmId}`}</span>,
    },
    {
      header: 'Chicken Type',
      cell: (row) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
          {(row.chickenType || 'BROILER').replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Rate / KG',
      cell: (row) => (
        <span className="font-extrabold text-emerald-700 text-sm">₹{row.ratePerKg} / KG</span>
      ),
    },
    {
      header: 'Currency',
      cell: (row) => <span className="text-xs text-stone-500 font-mono">{row.currency || 'INR'}</span>,
    },
    {
      header: 'Updated By',
      cell: (row) => <span className="text-xs text-stone-600 font-medium">{row.updatedBy || 'System'}</span>,
    },
    {
      header: 'Reason',
      cell: (row) => <span className="text-xs text-stone-500 italic">{row.reason || 'Rate adjustment'}</span>,
    },
    {
      header: 'Audit Seal',
      cell: () => (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded-md">
          <Lock className="w-3 h-3 text-stone-400" /> Immutable
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable Rate History"
        subtitle="Historical audit log of all published chicken rate adjustments (GET /api/v1/rates/history)"
        breadcrumbs={[
          { label: 'Live Rates', href: '/rates' },
          { label: 'Rate History' },
        ]}
      />

      <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 flex items-center gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <p className="text-xs text-stone-300">
          Rate history logs are sealed and cryptographically linked to audit records. Past records cannot be deleted or mutated.
        </p>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
            Filter by Farm Hub
          </label>
          <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
            <SelectTrigger>
              <SelectValue placeholder="All Farm Hubs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Farm Hubs</SelectItem>
              {farms.map((f) => (
                <SelectItem key={String(f.id)} value={String(f.id)}>
                  {f.name} ({f.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
            Filter by Chicken Type
          </label>
          <Select value={selectedChickenTypeId} onValueChange={setSelectedChickenTypeId}>
            <SelectTrigger>
              <SelectValue placeholder="All Chicken Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Chicken Types</SelectItem>
              {chickenTypes.map((ct) => (
                <SelectItem key={String(ct.id)} value={String(ct.id)}>
                  {ct.name} ({ct.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredHistory}
        keyExtractor={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by farm or reason..."
        isLoading={isLoading}
        emptyTitle="No rate history records found"
      />
    </div>
  );
};
