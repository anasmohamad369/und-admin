import React, { useState } from 'react';
import { Boxes, Plus, History, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useFarmContext } from '../../context/FarmContext';
import { useInventory, useStockAdjustments } from '../../hooks/useInventory';
import { FarmInventory, StockAdjustment } from '../../types/inventory';
import { StockAdjustmentModal } from './StockAdjustmentModal';

export const InventoryPage: React.FC = () => {
  const { selectedFarmId } = useFarmContext();
  const { data: inventories = [], isLoading } = useInventory(selectedFarmId);
  const { data: adjustments = [] } = useStockAdjustments(selectedFarmId);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const totalPhysical = inventories.reduce((acc, i) => acc + i.physicalStockKg, 0);
  const totalReserved = inventories.reduce((acc, i) => acc + i.reservedStockKg, 0);
  const totalAvailable = inventories.reduce((acc, i) => acc + i.availableStockKg, 0);

  const columns: Column<FarmInventory>[] = [
    {
      header: 'Farm Hub',
      cell: (row) => <span className="font-bold text-slate-900">{row.farmName}</span>,
    },
    {
      header: 'Chicken Product',
      cell: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
          {row.chickenType.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Physical Stock',
      cell: (row) => (
        <span className="font-bold text-slate-900 text-sm">
          {row.physicalStockKg.toLocaleString()} KG
        </span>
      ),
    },
    {
      header: 'Reserved Stock',
      cell: (row) => (
        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {row.reservedStockKg.toLocaleString()} KG
        </span>
      ),
    },
    {
      header: 'Available Stock',
      cell: (row) => (
        <span className="font-extrabold text-emerald-700 text-sm">
          {row.availableStockKg.toLocaleString()} KG
        </span>
      ),
    },
    {
      header: 'Last Restocked',
      cell: (row) => (
        <span className="text-xs text-slate-500">
          {new Date(row.lastRestockedAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Health Status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => setIsAdjustOpen(true)}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
        >
          Adjust
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Stock Management"
        subtitle="Track live chicken physical, reserved, and available stock capacity"
        actions={
          <button
            onClick={() => setIsAdjustOpen(true)}
            className="px-4 py-2 bg-brand-900 hover:bg-brand-950 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-brand-300" />
            Stock Adjustment
          </button>
        }
      />

      {/* Hero Stock Calculation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Physical Stock</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {totalPhysical.toLocaleString()} <span className="text-sm font-normal text-slate-500">KG</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-2">Total live birds physically housed at farms</p>
        </div>

        <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/80 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Reserved Stock</p>
          <p className="text-3xl font-extrabold text-amber-900 mt-2">
            {totalReserved.toLocaleString()} <span className="text-sm font-normal text-amber-700">KG</span>
          </p>
          <p className="text-[11px] text-amber-700 mt-2">Locked for confirmed B2B retailer orders</p>
        </div>

        <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200/80 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Available Stock</p>
          <p className="text-3xl font-extrabold text-emerald-900 mt-2">
            {totalAvailable.toLocaleString()} <span className="text-sm font-normal text-emerald-700">KG</span>
          </p>
          <p className="text-[11px] text-emerald-700 mt-2">Available = Physical Stock - Reserved Stock</p>
        </div>
      </div>

      {/* Main Stock Table */}
      <DataTable
        columns={columns}
        data={inventories}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />

      {/* Recent Stock Adjustments Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Stock Movement & Adjustment Log</h3>
          <span className="text-xs text-slate-500 font-medium">Audit History</span>
        </div>

        <div className="divide-y divide-slate-200">
          {adjustments.map((adj) => (
            <div key={adj.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{adj.farmName}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-brand-700">{adj.adjustmentType.replace('_', ' ')}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{adj.reason}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">By {adj.performedBy} on {new Date(adj.createdAt).toLocaleString()}</p>
              </div>

              <div className="text-right font-bold">
                <span className={adj.adjustmentType === 'ADD_STOCK' ? 'text-emerald-700' : 'text-rose-600'}>
                  {adj.adjustmentType === 'ADD_STOCK' ? '+' : '-'}{adj.quantityKg} KG
                </span>
                <p className="text-[11px] text-slate-400 font-mono">
                  {adj.previousPhysicalKg} → {adj.newPhysicalKg} KG
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StockAdjustmentModal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} />
    </div>
  );
};
