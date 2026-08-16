import React, { useState } from 'react';
import { Truck, Phone, Star, MapPin, Eye } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useDrivers } from '../../hooks/useDrivers';
import { useFarmContext } from '../../context/FarmContext';
import { Driver } from '../../types/driver';

export const DriversListPage: React.FC = () => {
  const { selectedFarmId } = useFarmContext();
  const { data: drivers = [], isLoading } = useDrivers(selectedFarmId);
  const [search, setSearch] = useState('');

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
  );

  const columns: Column<Driver>[] = [
    {
      header: 'Driver Name',
      cell: (row) => (
        <div>
          <a
            href={`/drivers/${row.id}`}
            className="font-bold text-slate-900 hover:text-brand-700 transition-colors block text-sm"
          >
            {row.name}
          </a>
          <span className="text-xs text-slate-500 font-mono">{row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Vehicle Number',
      cell: (row) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
          {row.vehicleNumber}
        </span>
      ),
    },
    {
      header: 'Vehicle Spec',
      cell: (row) => <span className="text-xs text-slate-600 font-medium">{row.vehicleType}</span>,
    },
    {
      header: 'Duty Status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Completed Deliveries',
      cell: (row) => <span className="font-bold text-slate-900 text-xs">{row.completedDeliveriesCount}</span>,
    },
    {
      header: 'Driver Rating',
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{row.rating}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <a
          href={`/drivers/${row.id}`}
          className="p-1.5 text-brand-700 hover:bg-brand-50 rounded-lg inline-flex items-center gap-1 text-xs font-semibold"
        >
          <Eye className="w-3.5 h-3.5" /> Roster Detail
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet & Logistics Drivers"
        subtitle="Manage refrigerated vehicle drivers, availability status, and delivery routes"
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search drivers by name, vehicle, or phone..."
        isLoading={isLoading}
      />
    </div>
  );
};
