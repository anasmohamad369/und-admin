import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Eye, Store, MapPin } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useShops } from '../../hooks/useShops';
import { Shop } from '../../types/shop';
import { CreateShopModal } from './CreateShopModal';

export const ShopsListPage: React.FC = () => {
  const { data: shops = [], isLoading } = useShops();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered = shops.filter((s) => {
    if (!s) return false;
    const searchLower = (search || '').toLowerCase();
    const nameStr = (s.name || '').toLowerCase();
    const retailerStr = (s.retailerName || '').toLowerCase();
    const cityStr = (s.city || '').toLowerCase();
    const areaStr = (s.area || '').toLowerCase();

    return (
      nameStr.includes(searchLower) ||
      retailerStr.includes(searchLower) ||
      cityStr.includes(searchLower) ||
      areaStr.includes(searchLower)
    );
  });

  const columns: Column<Shop>[] = [
    {
      header: 'Shop Name',
      cell: (row) => (
        <div>
          <a
            href={`/shops/${row.id}`}
            className="font-bold text-slate-900 hover:text-brand-700 transition-colors block text-sm"
          >
            {row.name}
          </a>
          <span className="text-xs text-slate-500 font-mono">{row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Parent Retailer',
      cell: (row) => (
        <a
          href={`/retailers/${row.retailerId}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-900 border border-brand-200 font-bold text-xs hover:bg-brand-100 transition-colors"
        >
          <Store className="w-3.5 h-3.5 text-brand-700" />
          {row.retailerName}
        </a>
      ),
    },
    {
      header: 'City / Area',
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-700">
          {row.area}, {row.city}
        </span>
      ),
    },
    {
      header: 'Address',
      cell: (row) => (
        <span className="text-xs text-slate-500 max-w-xs truncate block" title={row.address}>
          {row.address}
        </span>
      ),
    },
    {
      header: 'Total Orders',
      cell: (row) => <span className="font-bold text-slate-900 text-xs">{row.totalOrders ?? 0}</span>,
    },
    {
      header: 'Total Purchases',
      cell: (row) => (
        <span className="font-extrabold text-emerald-700 text-xs">
          ₹{(row.totalPurchaseAmount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <a
          href={`/shops/${row.id}`}
          className="p-1.5 text-brand-700 hover:bg-brand-50 rounded-lg inline-flex items-center gap-1 text-xs font-semibold"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Retailer Shops Directory"
        subtitle="Manage shop branches owned by registered B2B retailers"
        actions={
          <Link
            to="/shops/create"
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            + Add Shop Branch
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search shops by name, parent retailer, or city..."
        isLoading={isLoading}
      />

      <CreateShopModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
