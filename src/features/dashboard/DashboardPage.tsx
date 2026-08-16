import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Boxes,
  Store,
  Clock,
  CheckCircle2,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useFarmContext } from '../../context/FarmContext';
import { useFarms } from '../../hooks/useFarms';
import { useLiveRates } from '../../hooks/useRates';
import { useOrders } from '../../hooks/useOrders';
import { useRetailers } from '../../hooks/useRetailers';
import { UpdateRateModal } from '../rates/UpdateRateModal';
import { CreateOrderModal } from '../orders/CreateOrderModal';

const STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Confirmed: '#3b82f6',
  Assigned: '#6366f1',
  'Out for Delivery': '#8b5cf6',
  Delivered: '#10b981',
  Cancelled: '#ef4444',
};

export const DashboardPage: React.FC = () => {
  const { selectedFarmId } = useFarmContext();
  const { data: farms = [] } = useFarms(selectedFarmId);
  const { data: rates = [] } = useLiveRates(selectedFarmId);
  const { data: orders = [] } = useOrders(selectedFarmId);
  const { data: retailers = [] } = useRetailers();

  const [isUpdateRateOpen, setIsUpdateRateOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  // Aggregated KPIs
  const currentLiveRate = rates.length > 0 ? rates[0] : { ratePerKg: 102, previousRatePerKg: 98, percentageChange: 4.08, updatedAt: 'Just now' };

  const totalPhysicalStock = farms.reduce((acc, f) => acc + (f.physicalStock ?? 0), 0);
  const totalReservedStock = farms.reduce((acc, f) => acc + (f.reservedStock ?? 0), 0);
  const totalAvailableStock = farms.reduce((acc, f) => acc + (f.availableStock ?? 0), 0);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalKgSold = orders.reduce((acc, o) => acc + o.totalQuantityKg, 0);

  // Status breakdown for Recharts
  const statusCounts = orders.reduce((acc, o) => {
    const key = o.status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : o.status.charAt(0) + o.status.slice(1).toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = [
    { time: '08:00', orders: 12, sales: 24000 },
    { time: '10:00', orders: 28, sales: 58000 },
    { time: '12:00', orders: 45, sales: 94000 },
    { time: '14:00', orders: 32, sales: 65000 },
    { time: '16:00', orders: 24, sales: 49000 },
    { time: '18:00', orders: 15, sales: 31000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Good Morning, Admin 👋</h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening across your farms and retail distribution today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUpdateRateOpen(true)}
            className="px-4 py-2 bg-brand-900 hover:bg-brand-950 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-brand-300" />
            Update Live Rate
          </button>
          <button
            onClick={() => setIsCreateOrderOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            + New Order
          </button>
        </div>
      </div>

      {/* Hero Grid: Live Rate Card & Stock Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hero Live Rate Card */}
        <div className="bg-gradient-to-br from-brand-900 via-brand-850 to-slate-900 text-white rounded-2xl p-6 border border-brand-800 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-300">
                LIVE CHICKEN RATE
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>

            <div className="mt-4">
              <div className="text-4xl font-extrabold tracking-tight text-white">
                ₹{currentLiveRate.ratePerKg}{' '}
                <span className="text-lg font-normal text-brand-300">/ KG</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                <span>Previous: ₹{currentLiveRate.previousRatePerKg}/KG</span>
                <span className="text-emerald-400 font-bold">
                  +{currentLiveRate.percentageChange}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Updated 2m ago
            </span>
            <button
              onClick={() => setIsUpdateRateOpen(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
            >
              Update Rate
            </button>
          </div>
        </div>

        {/* Physical / Reserved / Available Stock Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Inventory Stock Utilization</h3>
              <a href="/inventory" className="text-xs font-bold text-brand-700 hover:underline">
                View Full Inventory →
              </a>
            </div>

            {/* Visual Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Total Physical: {totalPhysicalStock.toLocaleString()} KG</span>
                <span>Available: {totalAvailableStock.toLocaleString()} KG</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(totalAvailableStock / (totalPhysicalStock || 1)) * 100}%` }}
                  className="bg-emerald-500 h-full"
                  title="Available Stock"
                />
                <div
                  style={{ width: `${(totalReservedStock / (totalPhysicalStock || 1)) * 100}%` }}
                  className="bg-amber-400 h-full"
                  title="Reserved Stock"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-[11px] font-semibold uppercase text-slate-500">Physical Stock</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  {totalPhysicalStock.toLocaleString()} <span className="text-xs font-normal">KG</span>
                </p>
              </div>

              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                <p className="text-[11px] font-semibold uppercase text-amber-700">Reserved Stock</p>
                <p className="text-xl font-bold text-amber-900 mt-0.5">
                  {totalReservedStock.toLocaleString()} <span className="text-xs font-normal">KG</span>
                </p>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60">
                <p className="text-[11px] font-semibold uppercase text-emerald-700">Available Stock</p>
                <p className="text-xl font-bold text-emerald-900 mt-0.5">
                  {totalAvailableStock.toLocaleString()} <span className="text-xs font-normal">KG</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Orders"
          value={orders.length || 124}
          icon={ShoppingCart}
          trend={{ value: '12%', isPositive: true }}
          comparisonText="vs yesterday"
        />
        <KpiCard
          label="Chicken Sold"
          value={`${totalKgSold ? totalKgSold.toLocaleString() : '4,820'} KG`}
          icon={Boxes}
          trend={{ value: '8.4%', isPositive: true }}
          comparisonText="vs yesterday"
        />
        <KpiCard
          label="Total Revenue"
          value={`₹${(totalRevenue || 491640).toLocaleString('en-IN')}`}
          icon={DollarSign}
          trend={{ value: '15.2%', isPositive: true }}
          comparisonText="vs last week"
        />
        <KpiCard
          label="Active Retailers"
          value={retailers.length || 86}
          icon={Store}
          comparisonText="Across 4 supply circles"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Sales Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Today's Sales & Order Trend</h3>
              <p className="text-xs text-slate-500">Hourly volume breakdown in KG</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Sales']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="sales" fill="#0f392b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution Pie */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Order Status Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Live breakdown by lifecycle stage</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.length > 0 ? pieData : [{ name: 'Confirmed', value: 5 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.name] || '#10b981'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[d.name] || '#10b981' }}
                />
                <span className="text-slate-600 font-medium truncate">{d.name}:</span>
                <span className="font-bold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's Live Orders</h3>
            <p className="text-xs text-slate-500">Retailer orders placed today</p>
          </div>
          <a
            href="/orders"
            className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors"
          >
            View All Orders →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Retailer</th>
                <th className="px-4 py-3">Shop</th>
                <th className="px-4 py-3">Farm</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Rate</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">{o.orderNumber}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{o.retailerName}</td>
                  <td className="px-4 py-3 text-slate-600">{o.shopName}</td>
                  <td className="px-4 py-3 text-slate-600">{o.farmName}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{o.totalQuantityKg} KG</td>
                  <td className="px-4 py-3 text-slate-700">₹{o.ratePerKg}</td>
                  <td className="px-4 py-3 font-bold text-emerald-700">
                    ₹{o.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{o.driverName || 'Unassigned'}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/orders/${o.id}`}
                      className="p-1.5 text-brand-700 hover:bg-brand-50 rounded-lg inline-flex items-center gap-1 font-semibold text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rate Update Modal */}
      <UpdateRateModal isOpen={isUpdateRateOpen} onClose={() => setIsUpdateRateOpen(false)} />

      {/* Create Order Modal */}
      <CreateOrderModal isOpen={isCreateOrderOpen} onClose={() => setIsCreateOrderOpen(false)} />
    </div>
  );
};
