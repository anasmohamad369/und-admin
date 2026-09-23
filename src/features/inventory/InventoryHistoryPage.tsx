import React, { useState } from 'react';
import { History, Filter, Boxes, ShieldCheck, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { useFarms } from '../../hooks/useFarms';
import { useStockAdjustments } from '../../hooks/useInventory';
import { StockAdjustment } from '../../types/inventory';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';

export const InventoryHistoryPage: React.FC = () => {
  const { data: farms = [] } = useFarms();
  const [selectedFarmId, setSelectedFarmId] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const { data: adjustments = [], isLoading } = useStockAdjustments(selectedFarmId);

  const filteredAdjustments = adjustments.filter((adj) => {
    if (!search) return true;
    const name = adj.farmName || '';
    const code = adj.farmCode || '';
    const reason = adj.reason || '';
    const type = adj.adjustmentType || '';
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      code.toLowerCase().includes(search.toLowerCase()) ||
      reason.toLowerCase().includes(search.toLowerCase()) ||
      type.toLowerCase().includes(search.toLowerCase())
    );
  });

  const columns: Column<StockAdjustment>[] = [
    {
      header: 'ID',
      cell: (row) => <span className="font-mono text-xs font-bold text-stone-500">#{row.id}</span>,
    },
    {
      header: 'Date / Time',
      cell: (row) => (
        <span className="text-xs font-mono text-stone-600">
          {row.createdAt || row.lastUpdatedAt ? new Date(row.createdAt || row.lastUpdatedAt!).toLocaleString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Farm Hub',
      cell: (row) => (
        <div>
          <span className="font-bold text-stone-900 text-xs block">
            {row.farmName || `Farm #${row.farmId}`}
          </span>
          {row.farmCode && (
            <span className="font-mono text-[11px] text-stone-400 font-bold">{row.farmCode}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Chicken Type',
      cell: (row) => (
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
          {row.chickenTypeName || row.chickenTypeCode || row.chickenType || 'Live Chicken'}
        </span>
      ),
    },
    {
      header: 'Transaction Type',
      cell: (row) => (
        <Badge variant={row.adjustmentType === 'DAMAGE' ? 'destructive' : row.adjustmentType === 'STOCK_IN' || row.adjustmentType === 'ADD_STOCK' ? 'brand' : 'outline'}>
          {String(row.adjustmentType || 'ADJUST').replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Quantity Delta (KG)',
      cell: (row) => {
        const delta = row.quantity ?? 0;
        const isNegative = delta < 0;
        return (
          <span className={`font-black text-sm flex items-center gap-1 ${isNegative ? 'text-rose-600' : 'text-emerald-700'}`}>
            {isNegative ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            {isNegative ? `${delta} KG` : `+${delta} KG`}
          </span>
        );
      },
    },
    {
      header: 'Reason & Supervisor Notes',
      cell: (row) => (
        <div>
          <span className="text-xs text-stone-900 font-medium block truncate max-w-xs" title={row.reason}>
            {row.reason || 'Transaction record'}
          </span>
          {row.notes && (
            <span className="text-[11px] text-stone-400 italic block truncate max-w-xs" title={row.notes}>
              Notes: {row.notes}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Audit Seal',
      cell: () => (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded-md">
          <ShieldCheck className="w-3 h-3 text-stone-400" /> Immutable
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Transaction Audit Log"
        subtitle="Full audit trail of stock-ins, damage deductions, and inventory corrections (GET /api/v1/inventory/adjustments?farmId=ALL)"
        breadcrumbs={[
          { label: 'Inventory Management', href: '/inventory' },
          { label: 'Audit History Log' },
        ]}
      />

      {/* Filter Controls Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-emerald-700" /> Filter Audit Trail by Farm Hub (farmId):
          </div>
          <div className="w-full md:w-72">
            <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
              <SelectTrigger>
                <SelectValue placeholder="All Farm Hubs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">🌐 All Farm Hubs (farmId=ALL)</SelectItem>
                {farms.map((f) => (
                  <SelectItem key={String(f.id)} value={String(f.id)}>
                    🏡 {f.name} ({f.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredAdjustments}
        keyExtractor={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search audit log by farm name, code, transaction type, or reason..."
        isLoading={isLoading}
        emptyTitle="No inventory transaction records found"
      />
    </div>
  );
};
