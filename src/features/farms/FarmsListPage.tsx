import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Eye, MapPin, Navigation, Plus, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useFarms } from '../../hooks/useFarms';
import { useAuth } from '../../context/AuthContext';
import { Farm } from '../../types/farm';
import { CreateFarmModal } from './CreateFarmModal';

export const FarmsListPage: React.FC = () => {
  const { role } = useAuth();
  const { data: farms = [], isLoading } = useFarms();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isSuperAdmin = role === 'SUPER_ADMIN';

  const filteredFarms = farms.filter(
    (f) =>
      (f.name && f.name.toLowerCase().includes(search.toLowerCase())) ||
      (f.city && f.city.toLowerCase().includes(search.toLowerCase())) ||
      (f.address && f.address.toLowerCase().includes(search.toLowerCase())) ||
      (f.location && f.location.toLowerCase().includes(search.toLowerCase())) ||
      (f.code && f.code.toLowerCase().includes(search.toLowerCase()))
  );

  const columns: Column<Farm>[] = [
    {
      header: 'Farm Hub Name',
      cell: (row) => (
        <div>
          <a
            href={`/farms/${row.id}`}
            className="font-extrabold text-stone-900 hover:text-emerald-700 transition-colors block text-sm"
          >
            {row.name}
          </a>
          <span className="text-xs text-stone-500 font-mono">{row.code}</span>
        </div>
      ),
    },
    {
      header: 'Location & Address',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-stone-700">
          <MapPin className="w-3.5 h-3.5 text-stone-400" />
          <span>{row.location || row.address || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: 'Delivery Radius & Coverage',
      cell: (row) => (
        <div>
          <span className="inline-flex items-center gap-1 font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <Navigation className="w-3 h-3 text-emerald-600" />
            {row.deliveryRadiusKm || 50} KM Radius
          </span>
          <p className="text-[10px] text-stone-500 mt-0.5 truncate max-w-xs" title={row.deliverableAreas?.join(', ')}>
            Areas: {row.deliverableAreas && row.deliverableAreas.length > 0 ? row.deliverableAreas.slice(0, 3).join(', ') : 'All Areas'}
          </p>
        </div>
      ),
    },
    {
      header: 'Live Rate',
      cell: (row) => (
        <span className="font-extrabold text-emerald-700 text-sm">
          {row.currentRate != null ? `₹${row.currentRate} / KG` : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Available Stock',
      cell: (row) => (
        <div>
          <span className="font-bold text-stone-900">{(row.availableStock ?? 0).toLocaleString()} KG</span>
          <p className="text-[10px] text-stone-400">Physical: {(row.physicalStock ?? 0).toLocaleString()} KG</p>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <a
          href={`/farms/${row.id}`}
          className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded-lg inline-flex items-center gap-1 text-xs font-semibold"
        >
          <Eye className="w-3.5 h-3.5" /> View Detail
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farm Hubs Directory"
        subtitle="Manage supply hubs, live chicken stock, and deliverable radius coverage"
        actions={
          isSuperAdmin ? (
            <Link
              to="/farms/onboard"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              + Onboard New Farm
            </Link>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-xs font-medium text-stone-600">
              <ShieldCheck className="w-4 h-4 text-stone-400" /> Super Admin Onboarding Required
            </div>
          )
        }
      />

      <DataTable
        columns={columns}
        data={filteredFarms}
        keyExtractor={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search farms by name, code, or location..."
        isLoading={isLoading}
      />
    </div>
  );
};
