import React, { useState } from 'react';
import { Boxes, Plus, History, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useFarmContext } from '../../context/FarmContext';
import { useInventory, useStockAdjustments } from '../../hooks/useInventory';
import { FarmInventory, StockAdjustment } from '../../types/inventory';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';

export const InventoryPage: React.FC = () => {
  const { selectedFarmId } = useFarmContext();
  const { data: inventories = [], isLoading, refetch } = useInventory(selectedFarmId);
  const { data: adjustments = [] } = useStockAdjustments(selectedFarmId);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [search, setSearch] = useState('');

  const totalPhysical = inventories.reduce(
    (acc, i) => acc + (i.physicalQuantity ?? i.physicalStockKg ?? 0),
    0
  );
  const totalReserved = inventories.reduce(
    (acc, i) => acc + (i.reservedQuantity ?? i.reservedStockKg ?? 0),
    0
  );
  const totalAvailable = inventories.reduce(
    (acc, i) => acc + (i.availableQuantity ?? i.availableStockKg ?? 0),
    0
  );

  const filteredInventories = inventories.filter((inv) => {
    if (!search) return true;
    const name = inv.farmName || '';
    const code = inv.farmCode || '';
    const typeName = inv.chickenTypeName || inv.chickenTypeCode || '';
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      code.toLowerCase().includes(search.toLowerCase()) ||
      typeName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const columns: Column<FarmInventory>[] = [
    {
      header: 'Farm Hub',
      cell: (row) => (
        <div>
          <span className="font-bold text-stone-900 text-sm block">
            {row.farmName || `Farm #${row.farmId}`}
          </span>
          {row.farmCode && (
            <span className="font-mono text-xs text-stone-400 font-bold">{row.farmCode}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Chicken Product Type',
      cell: (row) => (
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
          {row.chickenTypeName || row.chickenTypeCode || row.chickenType || 'Live Chicken'}
        </span>
      ),
    },
    {
      header: 'Physical Stock',
      cell: (row) => (
        <span className="font-extrabold text-stone-900 text-sm">
          {(row.physicalQuantity ?? row.physicalStockKg ?? 0).toLocaleString()} {row.unit || 'KG'}
        </span>
      ),
    },
    {
      header: 'Reserved Stock',
      cell: (row) => (
        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
          {(row.reservedQuantity ?? row.reservedStockKg ?? 0).toLocaleString()} {row.unit || 'KG'}
        </span>
      ),
    },
    {
      header: 'Available Stock',
      cell: (row) => (
        <span className="font-black text-emerald-700 text-sm">
          {(row.availableQuantity ?? row.availableStockKg ?? 0).toLocaleString()} {row.unit || 'KG'}
        </span>
      ),
    },
    {
      header: 'Last Updated',
      cell: (row) => (
        <span className="text-xs text-stone-500 font-mono">
          {row.lastUpdatedAt ? new Date(row.lastUpdatedAt).toLocaleString() : 'Recently'}
        </span>
      ),
    },
    {
      header: 'Health Status',
      cell: (row) => <StatusBadge status={row.status || 'OPTIMAL'} size="sm" />,
    },
    {
      header: 'Actions',
      cell: () => (
        <Button variant="outline" size="sm" onClick={() => setIsAdjustOpen(true)}>
          Stock Action
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Stock Management"
        subtitle="Live inventory tracking across farm hubs (GET /api/v1/inventory?farmId=ALL)"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/inventory/history">
              <Button variant="outline">
                <History className="w-4 h-4 mr-1.5 text-stone-500" /> Transaction Audit History
              </Button>
            </Link>
            <Button onClick={() => setIsAdjustOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5 text-emerald-400" /> Physical Stock Entry / Action
            </Button>
          </div>
        }
      />

      {/* Hero Stock Calculation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-stone-200 shadow-xs">
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Physical Stock</p>
            <p className="text-3xl font-black text-stone-900 mt-2">
              {totalPhysical.toLocaleString()} <span className="text-sm font-semibold text-stone-500">KG</span>
            </p>
            <p className="text-[11px] text-stone-400 mt-2">Live birds physically housed at farm hubs</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/60 border-amber-200 shadow-xs">
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Reserved Stock</p>
            <p className="text-3xl font-black text-amber-900 mt-2">
              {totalReserved.toLocaleString()} <span className="text-sm font-semibold text-amber-700">KG</span>
            </p>
            <p className="text-[11px] text-amber-700 mt-2">Locked for pending/active retailer orders</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/60 border-emerald-200 shadow-xs">
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Available Stock</p>
            <p className="text-3xl font-black text-emerald-900 mt-2">
              {totalAvailable.toLocaleString()} <span className="text-sm font-semibold text-emerald-700">KG</span>
            </p>
            <p className="text-[11px] text-emerald-700 mt-2">Available = Physical Stock - Reserved Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Stock Table */}
      <DataTable
        columns={columns}
        data={filteredInventories}
        keyExtractor={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search inventory by farm name, code, or product type..."
        isLoading={isLoading}
      />

      {/* Recent Stock Adjustments Audit Log */}
      <Card>
        <div className="p-5 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Inventory Transaction Audit History Log</h3>
            <p className="text-xs text-stone-500">GET /api/v1/inventory/adjustments?farmId=ALL</p>
          </div>
          <Link to="/inventory/history">
            <Badge variant="secondary">View Full History →</Badge>
          </Link>
        </div>

        <CardContent className="p-0 divide-y divide-stone-100">
          {adjustments.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              No recent inventory transactions recorded.
            </div>
          ) : (
            adjustments.slice(0, 5).map((adj) => (
              <div key={String(adj.id)} className="p-4 flex items-center justify-between text-xs hover:bg-stone-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{adj.farmName || `Farm #${adj.farmId}`}</span>
                    <span className="text-stone-300">•</span>
                    <Badge variant={adj.adjustmentType === 'DAMAGE' ? 'destructive' : 'brand'}>
                      {String(adj.adjustmentType || 'ADJUST').replace('_', ' ')}
                    </Badge>
                    <span className="text-stone-300">•</span>
                    <span className="text-stone-600">{adj.reason}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 font-mono">
                    By {adj.performedBy || 'System Supervisor'} on {adj.createdAt || adj.lastUpdatedAt ? new Date(adj.createdAt || adj.lastUpdatedAt!).toLocaleString() : 'Recently'}
                  </p>
                </div>

                <div className="text-right font-bold">
                  <span className={adj.quantityDelta && adj.quantityDelta < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                    {adj.quantityDelta && adj.quantityDelta > 0 ? '+' : ''}{adj.quantityDelta ?? adj.quantityKg} KG
                  </span>
                  {adj.previousPhysicalKg != null && (
                    <p className="text-[11px] text-stone-400 font-mono">
                      {adj.previousPhysicalKg} → {adj.newPhysicalKg} KG
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <StockAdjustmentModal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} />
    </div>
  );
};
