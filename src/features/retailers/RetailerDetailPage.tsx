import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, Plus, ArrowLeft, Phone, MapPin, Map } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useRetailer } from '../../hooks/useRetailers';
import { useRetailerShops } from '../../hooks/useShops';
import { useOrders } from '../../hooks/useOrders';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import { ErrorState } from '../../components/feedback/ErrorState';
import { CreateShopModal } from '../shops/CreateShopModal';
import { ShopsMap } from '../../components/common/ShopsMap';

export const RetailerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: retailer, isLoading, isError } = useRetailer(id || '');
  const { data: rawShops = [] } = useRetailerShops(id);
  const { data: rawOrders = [] } = useOrders(undefined, id);

  const shops = Array.isArray(rawShops) ? rawShops : [];
  const orders = Array.isArray(rawOrders) ? rawOrders : [];

  const [activeTab, setActiveTab] = useState<'overview' | 'shops' | 'orders' | 'payments'>('shops');
  const [isAddShopOpen, setIsAddShopOpen] = useState(false);

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !retailer) return <ErrorState title="Retailer Not Found" message="The requested retailer account could not be found." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={retailer.name || 'Retailer Details'}
        subtitle={`Owner: ${retailer.ownerName || 'N/A'} • Mobile: ${retailer.primaryPhone || 'N/A'}`}
        breadcrumbs={[
          { label: 'Retailers', href: '/retailers' },
          { label: retailer.name || 'Retailer' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={retailer.status || 'ACTIVE'} />
            <Link
              to="/retailers"
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Retailers
            </Link>
          </div>
        }
      />

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Shops</p>
          <p className="text-2xl font-extrabold text-brand-900 mt-1">{shops.length || retailer.shopsCount || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Orders</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{retailer.totalOrders ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-emerald-700">Total Purchase</p>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1">₹{(retailer.totalPurchaseAmount ?? 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Primary Circle</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{retailer.city || 'N/A'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex gap-6">
            {(['shops', 'overview', 'orders', 'payments'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-bold capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-brand-700 text-brand-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'shops'
                  ? `Shops & Locations (${shops.length})`
                  : tab === 'overview'
                  ? 'Retailer Details'
                  : tab === 'orders'
                  ? `Orders (${orders.length})`
                  : 'Payment History'}
              </button>
            ))}
          </div>

          {activeTab === 'shops' && (
            <button
              onClick={() => setIsAddShopOpen(true)}
              className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg font-bold text-xs hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" /> + Add Shop Branch
            </button>
          )}
        </div>

        <div className="p-6">
          {activeTab === 'shops' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Map className="w-4 h-4 text-brand-700" /> Multi-Shop Network & Live Map View
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Interactive Leaflet map showing all shop locations for {retailer.name || 'this retailer'}</p>
                </div>
                <span className="text-xs font-bold text-brand-900 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  {shops.length} Active Shops
                </span>
              </div>

              {/* Interactive OpenStreetMap Pin View */}
              <ShopsMap shops={shops} height="360px" />

              <div className="pt-4 border-t border-slate-100">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Shop Directory</h4>
                  <span className="text-xs text-slate-500 font-medium">Click shop to view details or manage</span>
                </div>

                {shops.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800">No shops found for this retailer</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Add a shop branch for {retailer.name} to accept orders.</p>
                    <button
                      onClick={() => setIsAddShopOpen(true)}
                      className="px-4 py-2 bg-brand-900 text-white text-xs font-bold rounded-lg"
                    >
                      + Add First Shop
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {shops.map((shop) => (
                      <div
                        key={shop.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-slate-900 text-sm">{shop.name}</h5>
                            <StatusBadge status={shop.status || 'ACTIVE'} size="sm" />
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {shop.address || 'N/A'}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {shop.phone || 'N/A'}
                          </p>
                          {shop.latitude != null && shop.longitude != null && (
                            <p className="text-[10px] font-mono text-slate-400 mt-1">
                              GPS: {Number(shop.latitude).toFixed(4)}, {Number(shop.longitude).toFixed(4)}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Orders: <strong>{shop.totalOrders || 0}</strong></span>
                          <Link
                            to={`/shops/${shop.id}`}
                            className="text-brand-700 font-bold hover:underline"
                          >
                            View Shop →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Business Profile</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Business Name:</span>
                    <span className="font-bold text-slate-900">{retailer.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Owner Name:</span>
                    <span className="font-bold text-slate-900">{retailer.ownerName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">GST / Tax Details:</span>
                    <span className="font-bold text-slate-900">{retailer.taxNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">City / Circle:</span>
                    <span className="font-bold text-slate-900">{retailer.city || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Contact Channels</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Primary Mobile:</span>
                    <span className="font-bold text-slate-900">{retailer.primaryPhone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Alternate Phone:</span>
                    <span className="font-bold text-slate-900">{retailer.alternatePhone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-bold text-slate-900">{retailer.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No orders placed by this retailer yet.</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{o.orderNumber}</span>
                      <p className="text-xs text-slate-500">Shop: {o.shopName || 'Branch'} • {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-sm">{o.totalQuantityKg || 0} KG</span>
                      <p className="text-xs text-emerald-700 font-bold">₹{(o.totalAmount ?? 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="text-center py-8 text-xs text-slate-500">
              <DollarSign className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              Payment history ledger integrated with Spring Boot Finance service.
            </div>
          )}
        </div>
      </div>

      {retailer.id != null && (
        <CreateShopModal
          isOpen={isAddShopOpen}
          onClose={() => setIsAddShopOpen(false)}
          defaultRetailerId={String(retailer.id)}
        />
      )}
    </div>
  );
};
