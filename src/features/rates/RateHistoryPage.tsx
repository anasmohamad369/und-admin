import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { useFarms } from '../../hooks/useFarms';
import { useChickenTypes } from '../../hooks/useChickenTypes';
import { useRateHistory } from '../../hooks/useRates';
import { RateHistoryItem } from '../../types/rate';
import { Lock, ShieldCheck, History, TrendingUp, Filter, Clock, ArrowRight, Table, Layers } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';

export const RateHistoryPage: React.FC = () => {
  const { data: farms = [] } = useFarms();
  const { data: chickenTypes = [] } = useChickenTypes();

  const [selectedFarmId, setSelectedFarmId] = useState<string>('ALL');
  const [selectedChickenTypeId, setSelectedChickenTypeId] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'TIMELINE' | 'TABLE'>('TIMELINE');

  const { data: history = [], isLoading } = useRateHistory(
    selectedFarmId,
    selectedChickenTypeId
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
      header: 'ID',
      cell: (row) => <span className="font-mono text-xs font-bold text-stone-500">#{row.id}</span>,
    },
    {
      header: 'Effective Date / Time',
      cell: (row) => (
        <div className="text-xs font-semibold text-stone-700">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{row.effectiveFrom ? new Date(row.effectiveFrom).toLocaleString() : 'N/A'}</span>
          </div>
          {row.effectiveTo && (
            <p className="text-[10px] text-stone-400 font-mono mt-0.5">
              To: {new Date(row.effectiveTo).toLocaleString()}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Farm Hub',
      cell: (row) => <span className="font-bold text-stone-900 text-xs">{row.farmName || `Farm #${row.farmId}`}</span>,
    },
    {
      header: 'Chicken Type',
      cell: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
          {row.chickenType ? row.chickenType.replace('_', ' ') : `Type #${row.chickenTypeId || 3}`}
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
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'brand' : 'outline'}>
          {row.status || 'EXPIRED'}
        </Badge>
      ),
    },
    {
      header: 'Reason for Revision',
      cell: (row) => <span className="text-xs text-stone-500 italic max-w-xs block truncate" title={row.reason}>{row.reason || 'Rate adjustment'}</span>,
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
        title="Rate History & Audit Timeline"
        subtitle="Historical audit log of rate revisions with effective timestamps & reasons (GET /api/v1/rates/history)"
        breadcrumbs={[
          { label: 'Live Rates', href: '/rates' },
          { label: 'Rate History' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'TIMELINE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('TIMELINE')}
            >
              <Layers className="w-4 h-4 mr-1.5" /> Visual Timeline
            </Button>
            <Button
              variant={viewMode === 'TABLE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('TABLE')}
            >
              <Table className="w-4 h-4 mr-1.5" /> Audit Table
            </Button>
          </div>
        }
      />

      <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 flex items-center gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <p className="text-xs text-stone-300">
          Rate history logs are sealed and cryptographically linked to audit records. Past records cannot be deleted or mutated.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
            Filter by Farm Hub (farmId)
          </label>
          <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
            <SelectTrigger>
              <SelectValue placeholder="All Farm Hubs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">🌐 All Farm Hubs (ALL)</SelectItem>
              {farms.map((f) => (
                <SelectItem key={String(f.id)} value={String(f.id)}>
                  🏡 {f.name} ({f.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
            Filter by Chicken Type (chickenTypeId)
          </label>
          <Select value={selectedChickenTypeId} onValueChange={setSelectedChickenTypeId}>
            <SelectTrigger>
              <SelectValue placeholder="All Chicken Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">🐥 All Chicken Types (ALL)</SelectItem>
              {chickenTypes.map((ct) => (
                <SelectItem key={String(ct.id)} value={String(ct.id)}>
                  {ct.name} ({ct.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === 'TIMELINE' ? (
        /* VISUAL TIMELINE VIEW */
        <Card>
          <div className="p-5 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-700" /> Sequential Rate Revision Timeline
            </h3>
            <Badge variant="secondary">{filteredHistory.length} Revision Records</Badge>
          </div>

          <CardContent className="p-8">
            {isLoading ? (
              <div className="text-center py-12 text-stone-500 font-semibold text-sm">
                Loading rate history timeline...
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-sm">
                No rate revisions recorded for the selected filter parameters.
              </div>
            ) : (
              <div className="relative border-l-2 border-stone-200 ml-4 pl-8 space-y-8">
                {filteredHistory.map((item, idx) => {
                  const isActive = item.status === 'ACTIVE' || idx === 0;
                  const prevItem = filteredHistory[idx + 1];
                  const priceDiff = prevItem ? item.ratePerKg - prevItem.ratePerKg : 0;

                  return (
                    <div key={String(item.id)} className="relative group">
                      {/* Timeline Node Icon */}
                      <div
                        className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                          isActive
                            ? 'bg-emerald-600 border-white text-white shadow-md ring-4 ring-emerald-100'
                            : 'bg-stone-200 border-white text-stone-600'
                        }`}
                      >
                        {isActive ? '✓' : idx + 1}
                      </div>

                      {/* Content Card */}
                      <div className="bg-stone-50/80 hover:bg-stone-50 p-5 rounded-2xl border border-stone-200/90 shadow-xs transition-all space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-stone-900 text-sm">
                              {item.farmName || `Farm #${item.farmId}`}
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {item.chickenType ? item.chickenType.replace('_', ' ') : `Type #${item.chickenTypeId || 3}`}
                            </span>
                          </div>

                          <Badge variant={isActive ? 'brand' : 'outline'}>
                            {isActive ? 'CURRENT ACTIVE RATE' : 'EXPIRED HISTORICAL RATE'}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-stone-900">₹{item.ratePerKg}</span>
                              <span className="text-xs font-bold text-stone-500">/ KG</span>
                              <span className="text-xs font-mono text-stone-400">({item.currency || 'INR'})</span>
                            </div>

                            {priceDiff !== 0 && (
                              <span
                                className={`text-xs font-bold inline-flex items-center gap-1 mt-1 ${
                                  priceDiff > 0 ? 'text-emerald-600' : 'text-rose-600'
                                }`}
                              >
                                {priceDiff > 0 ? '▲' : '▼'} {priceDiff > 0 ? `+₹${priceDiff.toFixed(2)}` : `-₹${Math.abs(priceDiff).toFixed(2)}`} / KG vs Previous
                              </span>
                            )}
                          </div>

                          <div className="text-right text-xs space-y-1">
                            <div className="flex items-center gap-1 text-stone-600 font-semibold justify-end">
                              <Clock className="w-3.5 h-3.5 text-stone-400" />
                              <span>{item.effectiveFrom ? new Date(item.effectiveFrom).toLocaleString() : 'N/A'}</span>
                            </div>
                            {item.effectiveTo && (
                              <p className="text-[11px] text-stone-400 font-mono">
                                Expired: {new Date(item.effectiveTo).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600 flex items-center justify-between">
                          <p className="italic">
                            <strong>Reason:</strong> {item.reason || 'Market update'}
                          </p>
                          <span className="text-[10px] font-mono font-bold text-stone-400">
                            Record ID: #{item.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* AUDIT DATA TABLE VIEW */
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
      )}
    </div>
  );
};
