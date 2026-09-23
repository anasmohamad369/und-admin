import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Store,
  ShoppingBag,
  Truck,
  Boxes,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useOrder, useUpdateOrderStatus } from '../../hooks/useOrders';
import { useDrivers } from '../../hooks/useDrivers';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import { ErrorState } from '../../components/feedback/ErrorState';
import { OrderStatus } from '../../types/order';

const STAGES: { status: OrderStatus; label: string }[] = [
  { status: 'PENDING', label: 'Order Placed' },
  { status: 'CONFIRMED', label: 'Stock Reserved' },
  { status: 'ASSIGNED', label: 'Driver Assigned' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { status: 'DELIVERED', label: 'Delivered' },
];

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useOrder(id || '');
  const { data: drivers = [] } = useDrivers();
  const updateStatusMutation = useUpdateOrderStatus();

  const [selectedDriverId, setSelectedDriverId] = useState('');

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !order) return <ErrorState title="Order Not Found" message="The requested order could not be found." />;

  const currentStageIndex = STAGES.findIndex((s) => s.status === order.status);

  const handleStatusChange = async (nextStatus: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        orderId: String(order.id),
        status: nextStatus,
        driverId: selectedDriverId || (order.driverId ? String(order.driverId) : undefined),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.orderNumber || `Order #${order.id}`}
        subtitle={`Placed on ${order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}`}
        breadcrumbs={[
          { label: 'Orders', href: '/orders' },
          { label: order.orderNumber || `Order #${order.id}` },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            {order.paymentStatus && <StatusBadge status={order.paymentStatus} />}
            <Link
              to="/orders"
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Orders
            </Link>
          </div>
        }
      />

      {/* Lifecycle Progress Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
          Order Lifecycle Timeline
        </h3>
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0" />
          <div
            style={{ width: `${Math.max(0, (currentStageIndex / (STAGES.length - 1)) * 100)}%` }}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
          />

          {STAGES.map((stg, idx) => {
            const isPassed = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stg.status} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isPassed
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isCurrent ? 'text-emerald-800 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {stg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Controls for Status Advancement */}
      {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-900 text-xs font-semibold">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Advance Order Lifecycle Stage:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {order.status === 'PENDING' && (
              <button
                onClick={() => handleStatusChange('CONFIRMED')}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-1.5 bg-brand-900 hover:bg-brand-950 text-white font-bold text-xs rounded-lg shadow-xs"
              >
                Confirm Order & Reserve Stock
              </button>
            )}

            {order.status === 'CONFIRMED' && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium"
                >
                  <option value="">Select Driver...</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.vehicleNumber})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleStatusChange('ASSIGNED')}
                  disabled={!selectedDriverId || updateStatusMutation.isPending}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs disabled:opacity-40"
                >
                  Assign Driver
                </button>
              </div>
            )}

            {order.status === 'ASSIGNED' && (
              <button
                onClick={() => handleStatusChange('OUT_FOR_DELIVERY')}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs"
              >
                Dispatch Out for Delivery
              </button>
            )}

            {order.status === 'OUT_FOR_DELIVERY' && (
              <button
                onClick={() => handleStatusChange('DELIVERED')}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs"
              >
                Mark as Delivered & Paid
              </button>
            )}

            <button
              onClick={() => handleStatusChange('CANCELLED')}
              disabled={updateStatusMutation.isPending}
              className="px-3 py-1.5 bg-white text-rose-600 border border-rose-300 hover:bg-rose-50 font-bold text-xs rounded-lg"
            >
              Cancel Order
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Customer Info, Items, Inventory, Driver */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Pricing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Store className="w-5 h-5 text-brand-700" /> Retailer & Shop Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 uppercase font-semibold">Retailer Account:</span>
                <Link
                  to={`/retailers/${order.retailerId}`}
                  className="font-bold text-slate-900 hover:text-brand-700 text-sm block mt-0.5"
                >
                  {order.retailerName}
                </Link>
              </div>

              <div>
                <span className="text-slate-500 uppercase font-semibold">Shop Branch:</span>
                <Link
                  to={`/shops/${order.shopId}`}
                  className="font-bold text-slate-900 hover:text-brand-700 text-sm block mt-0.5"
                >
                  {order.shopName}
                </Link>
                <p className="text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {order.shopAddress}, {order.shopCity}
                </p>
              </div>
            </div>
          </div>

          {/* Order Item Pricing Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Ordered Items
            </h3>
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Rate / KG</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {(item.chickenType || 'LIVE_CHICKEN').replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 font-semibold">{item.quantityKg} KG</td>
                    <td className="py-3 px-3">₹{item.ratePerKg}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                      ₹{(item.totalAmount ?? 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Price Breakdown */}
            <div className="mt-6 pt-4 border-t border-slate-100 max-w-xs ml-auto space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">
                  ₹{(order.subtotal ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount:</span>
                <span>₹{order.discount || 0}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Charges:</span>
                <span>₹{order.taxesAndFees || 0}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-emerald-800 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span>₹{(order.totalAmount ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory & Driver details */}
        <div className="space-y-6">
          {/* Inventory Reservation Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Boxes className="w-5 h-5 text-brand-700" /> Stock Reservation
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Supply Farm:</span>
                <span className="font-bold text-slate-900">{order.farmName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity Reserved:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {order.reservedStockKg} KG
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reservation Status:</span>
                <span className="font-bold text-emerald-700 uppercase">
                  {order.stockReservedStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Driver Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Truck className="w-5 h-5 text-brand-700" /> Delivery & Driver
            </h3>
            {order.driverName ? (
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Driver:</span>
                  <span className="font-bold text-slate-900">{order.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-semibold text-slate-800">{order.driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle Number:</span>
                  <span className="font-mono font-bold text-slate-900">{order.vehicleNumber}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-slate-50 rounded-xl text-xs text-slate-500">
                No driver assigned yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
