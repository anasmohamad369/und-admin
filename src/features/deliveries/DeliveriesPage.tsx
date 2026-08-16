import React, { useState } from 'react';
import { MapPin, Truck, Clock, User, CheckCircle2, AlertCircle, Map, Layers } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useFarmContext } from '../../context/FarmContext';
import { useDeliveries, useUpdateDeliveryStatus, useAssignDriver } from '../../hooks/useDeliveries';
import { useDrivers } from '../../hooks/useDrivers';
import { Delivery, DeliveryStatus } from '../../types/delivery';

const STAGES: { status: DeliveryStatus; label: string }[] = [
  { status: 'PENDING', label: 'Pending Dispatch' },
  { status: 'ASSIGNED', label: 'Driver Assigned' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { status: 'DELIVERED', label: 'Delivered' },
];

export const DeliveriesPage: React.FC = () => {
  const { selectedFarmId } = useFarmContext();
  const { data: deliveries = [], isLoading } = useDeliveries(selectedFarmId);
  const { data: drivers = [] } = useDrivers();
  const updateStatusMutation = useUpdateDeliveryStatus();
  const assignDriverMutation = useAssignDriver();

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');

  const handleAssign = async (deliveryId: string) => {
    if (!selectedDriverId) return;
    try {
      await assignDriverMutation.mutateAsync({ deliveryId, driverId: selectedDriverId });
      setSelectedDelivery(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (deliveryId: string, nextStatus: DeliveryStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ deliveryId, status: nextStatus });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Operations Hub"
        subtitle="Track live refrigerated truck dispatches, route progress, and driver status"
      />

      {/* Future Google Maps Integration Container Placeholder */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/40">
              <Map className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                GPS LIVE FLEET TRACKING READY
              </span>
              <h3 className="text-lg font-extrabold text-white">Google Maps Real-Time Route Matrix</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Placeholder container prepared for Spring Boot WebSocket GPS coordinates telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-slate-300">
              {deliveries.filter((d) => d.status === 'OUT_FOR_DELIVERY').length} Vehicles Currently En Route
            </span>
          </div>
        </div>
      </div>

      {/* Operations Dispatch Board (Kanban Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STAGES.map((col) => {
          const colDeliveries = deliveries.filter((d) => d.status === col.status);

          return (
            <div key={col.status} className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 flex flex-col">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-800 font-extrabold text-xs border border-slate-200">
                  {colDeliveries.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {colDeliveries.map((del) => (
                  <div
                    key={del.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-shadow space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <a href={`/orders/${del.orderId}`} className="font-extrabold text-slate-900 text-sm hover:underline">
                        {del.orderNumber}
                      </a>
                      <span className="font-bold text-emerald-700 text-xs">{del.quantityKg} KG</span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600">
                      <p className="font-semibold text-slate-800 truncate">{del.retailerName}</p>
                      <p className="text-slate-500 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {del.shopName} ({del.shopCity})
                      </p>
                    </div>

                    {del.driverName ? (
                      <div className="p-2 bg-slate-50 rounded-lg text-[11px] font-medium text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-slate-400" /> {del.driverName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">{del.vehicleNumber}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <select
                          value={selectedDelivery?.id === del.id ? selectedDriverId : ''}
                          onChange={(e) => {
                            setSelectedDelivery(del);
                            setSelectedDriverId(e.target.value);
                          }}
                          className="w-full text-xs p-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                        >
                          <option value="">Select Driver...</option>
                          {drivers.map((drv) => (
                            <option key={drv.id} value={drv.id}>
                              {drv.name} ({drv.vehicleNumber})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(del.id)}
                          disabled={!selectedDriverId || selectedDelivery?.id !== del.id}
                          className="w-full py-1 bg-brand-900 text-white font-bold text-xs rounded-lg disabled:opacity-40"
                        >
                          Assign Driver
                        </button>
                      </div>
                    )}

                    {/* Transition Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      {del.status === 'ASSIGNED' && (
                        <button
                          onClick={() => handleStatusChange(del.id, 'OUT_FOR_DELIVERY')}
                          className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px]"
                        >
                          Dispatch Out for Delivery →
                        </button>
                      )}
                      {del.status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={() => handleStatusChange(del.id, 'DELIVERED')}
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                        >
                          Mark Delivered ✓
                        </button>
                      )}
                      {del.status === 'DELIVERED' && (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
