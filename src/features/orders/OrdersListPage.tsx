import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Eye, Filter, Store, Building2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useOrders } from '../../hooks/useOrders';
import { useFarmContext } from '../../context/FarmContext';
import { Order } from '../../types/order';
import { CreateOrderModal } from './CreateOrderModal';

export const OrdersListPage: React.FC = () => {
  const { selectedFarmId } = useFarmContext();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { data: orders = [], isLoading } = useOrders(selectedFarmId, undefined, undefined, statusFilter);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.retailerName.toLowerCase().includes(search.toLowerCase()) ||
      o.shopName.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Order>[] = [
    {
      header: 'Order ID',
      cell: (row) => (
        <div>
          <a
            href={`/orders/${row.id}`}
            className="font-extrabold text-slate-900 hover:text-brand-700 transition-colors block text-sm"
          >
            {row.orderNumber}
          </a>
          <span className="text-[10px] text-slate-400 font-mono">
            {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      header: 'Retailer',
      cell: (row) => (
        <a
          href={`/retailers/${row.retailerId}`}
          className="font-bold text-slate-900 hover:underline text-xs block"
        >
          {row.retailerName}
        </a>
      ),
    },
    {
      header: 'Shop Branch',
      cell: (row) => (
        <div>
          <a
            href={`/shops/${row.shopId}`}
            className="font-medium text-slate-700 hover:underline text-xs block"
          >
            {row.shopName}
          </a>
          <span className="text-[10px] text-slate-400">{row.shopCity}</span>
        </div>
      ),
    },
    {
      header: 'Farm Hub',
      cell: (row) => <span className="text-xs font-semibold text-slate-600">{row.farmName}</span>,
    },
    {
      header: 'Quantity',
      cell: (row) => <span className="font-bold text-slate-900 text-xs">{row.totalQuantityKg} KG</span>,
    },
    {
      header: 'Rate',
      cell: (row) => <span className="text-xs text-slate-700 font-medium">₹{row.ratePerKg}</span>,
    },
    {
      header: 'Total Amount',
      cell: (row) => (
        <span className="font-extrabold text-emerald-700 text-xs">
          ₹{row.totalAmount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Order Status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Payment',
      cell: (row) => <StatusBadge status={row.paymentStatus} size="sm" />,
    },
    {
      header: 'Driver',
      cell: (row) => (
        <span className="text-xs font-medium text-slate-600">
          {row.driverName || 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <a
          href={`/orders/${row.id}`}
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
        title="B2B Orders Roster"
        subtitle="Manage live chicken orders, stock reservations, and driver dispatch"
        actions={
          <Link
            to="/orders/create"
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            + Create New Order
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Status Filter:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'PENDING', 'CONFIRMED', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-brand-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search orders by ID, retailer, or shop..."
        isLoading={isLoading}
      />

      <CreateOrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
