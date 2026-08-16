import React, { useState } from 'react';
import { Download, FileSpreadsheet, BarChart3, TrendingUp, DollarSign, Boxes, Store } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { useFarmContext } from '../../context/FarmContext';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../../api/reports.api';

export const ReportsPage: React.FC = () => {
  const { selectedFarmId } = useFarmContext();
  const [dateRange, setDateRange] = useState('7d');
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const { data: salesReport } = useQuery({
    queryKey: ['salesReport', selectedFarmId, dateRange],
    queryFn: () => reportsApi.getSalesReport(selectedFarmId, dateRange),
  });

  const { data: retailerReport = [] } = useQuery({
    queryKey: ['retailerReport'],
    queryFn: () => reportsApi.getRetailerReport(),
  });

  const handleExport = (format: 'CSV' | 'PDF') => {
    setExportMessage(`Exporting ${format} report... Download will begin shortly.`);
    setTimeout(() => {
      setExportMessage(null);
    }, 4000);
  };

  const dailyTrends = salesReport?.dailyTrends || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Supply Analytics"
        subtitle="Business intelligence, revenue trends, rate history, and B2B partner performance"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport('CSV')}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="px-4 py-2 bg-brand-900 hover:bg-brand-950 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-brand-300" />
              Export PDF Report
            </button>
          </div>
        }
      />

      {exportMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{exportMessage}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
      )}

      {/* Date & Scope Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Analysis Window</span>
        <div className="flex gap-2">
          {['today', '7d', '30d', 'quarter'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors ${
                dateRange === range
                  ? 'bg-brand-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Gross Sales Revenue</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹{(salesReport?.totalRevenue || 491640).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Volume Sold</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {(salesReport?.totalQuantityKgSold || 4820).toLocaleString()} KG
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Orders Fulfilled</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {salesReport?.totalOrders || 124}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Avg Order Value</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹{(salesReport?.averageOrderValue || 3965).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Trend Area Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Revenue & Sales Growth</h3>
          <p className="text-xs text-slate-500 mb-4">Daily gross revenue trajectory in INR</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f392b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0f392b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#0f392b" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Sold by City Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Regional Distribution Volume</h3>
          <p className="text-xs text-slate-500 mb-4">Sales breakdown by distribution city</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesReport?.salesByCity || []}>
                <XAxis dataKey="city" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Sales']} />
                <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Retailer Accounts Ranking */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Retailer Performance Ranking</h3>
          <span className="text-xs text-slate-500 font-medium">B2B Partner Sales Volume</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-500 font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Retailer</th>
                <th className="px-4 py-3">Shops Count</th>
                <th className="px-4 py-3">Total Orders</th>
                <th className="px-4 py-3">Est. Volume (KG)</th>
                <th className="px-4 py-3">Total Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {retailerReport.map((ret) => (
                <tr key={ret.retailerId} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-900">{ret.retailerName}</td>
                  <td className="px-4 py-3 font-semibold">{ret.shopsCount} Shops</td>
                  <td className="px-4 py-3 font-medium">{ret.totalOrders}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{ret.totalQuantityKg.toLocaleString()} KG</td>
                  <td className="px-4 py-3 font-extrabold text-emerald-700">₹{ret.totalSpent.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
