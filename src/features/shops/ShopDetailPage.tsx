import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Store, MapPin, Phone, ArrowLeft, ShoppingCart } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useShop } from '../../hooks/useShops';
import { useOrders } from '../../hooks/useOrders';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import { ErrorState } from '../../components/feedback/ErrorState';

export const ShopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: shop, isLoading, isError } = useShop(id || '');
  const { data: orders = [] } = useOrders(undefined, undefined, id);

  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview');

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !shop) return <ErrorState title="Shop Not Found" message="The requested shop branch could not be found." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={shop.name}
        subtitle={`${shop.area}, ${shop.city} • Contact: ${shop.phone}`}
        breadcrumbs={[
          { label: 'Shops', href: '/shops' },
          { label: shop.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={shop.status} />
            <Link
              to="/shops"
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Shops
            </Link>
          </div>
        }
      />

      {/* Parent Retailer Highlight Box */}
      <div className="bg-gradient-to-r from-brand-900 to-slate-900 text-white p-5 rounded-2xl border border-brand-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white/10 text-brand-300">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-300 tracking-wider">
              PARENT RETAILER ACCOUNT
            </span>
            <h3 className="text-lg font-bold text-white leading-tight">{shop.retailerName}</h3>
          </div>
        </div>
        <Link
          to={`/retailers/${shop.retailerId}`}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors"
        >
          View Parent Retailer →
        </Link>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Orders</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{shop.totalOrders}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-emerald-700">Total Purchases</p>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1">
            ₹{shop.totalPurchaseAmount.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-500">City / Area</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{shop.area}, {shop.city}</p>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 px-6 flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-brand-700 text-brand-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Shop Details
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-brand-700 text-brand-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Order History ({orders.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Shop Name:</span>
                <span className="font-bold text-slate-900">{shop.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Address:</span>
                <span className="font-bold text-slate-900">{shop.address}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Phone Contact:</span>
                <span className="font-bold text-slate-900">{shop.phone}</span>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{o.orderNumber}</span>
                    <p className="text-xs text-slate-500">Farm: {o.farmName} • {new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 text-sm">{o.totalQuantityKg} KG</span>
                    <p className="text-xs text-emerald-700 font-bold">₹{o.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
