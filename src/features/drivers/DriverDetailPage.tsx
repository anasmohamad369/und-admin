import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, Phone, Star, Shield, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useDriver } from '../../hooks/useDrivers';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import { ErrorState } from '../../components/feedback/ErrorState';

export const DriverDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: driver, isLoading, isError } = useDriver(id || '');

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !driver) return <ErrorState title="Driver Not Found" message="The requested driver profile could not be found." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={driver.name}
        subtitle={`Vehicle: ${driver.vehicleNumber} • ${driver.vehicleType}`}
        breadcrumbs={[
          { label: 'Drivers', href: '/drivers' },
          { label: driver.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={driver.status} />
            <Link
              to="/drivers"
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Drivers
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Driver Profile</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Phone Contact:</span>
              <span className="font-bold text-slate-900">{driver.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">License Number:</span>
              <span className="font-mono font-bold text-slate-900">{driver.licenseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rating:</span>
              <span className="font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {driver.rating}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Logistics Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-500">Completed Trips</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{driver.completedDeliveriesCount}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-800">Current Status</p>
              <p className="text-xl font-extrabold text-emerald-900 mt-1">{driver.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
