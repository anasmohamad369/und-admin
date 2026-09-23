import React, { useState } from 'react';
import { Store, Eye, ShoppingBag, Smartphone, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useRetailers } from '../../hooks/useRetailers';
import { Retailer } from '../../types/retailer';

export const RetailersListPage: React.FC = () => {
  const { data: retailers = [], isLoading } = useRetailers();
  const [search, setSearch] = useState('');

  const filtered = retailers.filter((r) => {
    if (!r) return false;
    const searchLower = (search || '').toLowerCase();
    const nameStr = (r.name || '').toLowerCase();
    const ownerStr = (r.ownerName || '').toLowerCase();
    const cityStr = (r.city || '').toLowerCase();
    const phoneStr = (r.primaryPhone || '').toLowerCase();
    const emailStr = (r.email || '').toLowerCase();

    return (
      nameStr.includes(searchLower) ||
      ownerStr.includes(searchLower) ||
      cityStr.includes(searchLower) ||
      phoneStr.includes(searchLower) ||
      emailStr.includes(searchLower)
    );
  });

  const columns: Column<Retailer>[] = [
    {
      header: 'Retailer Business',
      cell: (row) => (
        <div>
          <a
            href={`/retailers/${row.id}`}
            className="font-bold text-slate-900 hover:text-brand-700 transition-colors block text-sm"
          >
            {row.name}
          </a>
          <span className="text-xs text-slate-500">{row.email || 'Registered via Mobile App'}</span>
        </div>
      ),
    },
    {
      header: 'Owner',
      cell: (row) => <span className="font-semibold text-slate-800 text-xs">{row.ownerName || 'N/A'}</span>,
    },
    {
      header: 'Primary Mobile',
      cell: (row) => <span className="text-xs font-mono text-slate-700">{row.primaryPhone || 'N/A'}</span>,
    },
    {
      header: 'Number of Shops',
      cell: (row) => (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-900 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full">
          <ShoppingBag className="w-3.5 h-3.5 text-brand-700" />
          {row.shopsCount ?? 0} Shops
        </span>
      ),
    },
    {
      header: 'City / Circle',
      cell: (row) => <span className="text-xs font-medium text-slate-600">{row?.city || 'N/A'}</span>,
    },
    {
      header: 'Total Orders',
      cell: (row) => <span className="font-bold text-slate-900 text-xs">{row?.totalOrders ?? 0}</span>,
    },
    {
      header: 'Total Purchase',
      cell: (row) => (
        <span className="font-extrabold text-emerald-700 text-xs">
          ₹{(row?.totalPurchaseAmount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Account Status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <a
          href={`/retailers/${row.id}`}
          className="p-1.5 text-brand-700 hover:bg-brand-50 rounded-lg inline-flex items-center gap-1 text-xs font-semibold"
        >
          <Eye className="w-3.5 h-3.5" /> Manage Shops
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Retailer Network Directory"
        subtitle="Registered B2B retailer accounts and multi-shop networks"
      />

      {/* Info Banner for React Native App Registration */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/40">
            <Smartphone className="w-5 h-5 text-brand-300" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">
              SELF-REGISTRATION WORKFLOW
            </span>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">
              Retailers self-register via the React Native Mobile App. Admins verify, audit, and manage shops here.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Account Audit Active
        </span>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search retailers by name, owner, or city..."
        isLoading={isLoading}
      />
    </div>
  );
};
