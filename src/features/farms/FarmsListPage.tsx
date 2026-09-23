import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Eye,
  MapPin,
  Navigation,
  Plus,
  ShieldCheck,
  LayoutGrid,
  List,
  Boxes,
  TrendingUp,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useFarms } from '../../hooks/useFarms';
import { useAuth } from '../../context/AuthContext';
import { Farm } from '../../types/farm';

export const FarmsListPage: React.FC = () => {
  const { role } = useAuth();
  const { data: farms = [], isLoading } = useFarms();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const isSuperAdmin = role === 'SUPER_ADMIN';

  const filteredFarms = farms.filter(
    (f) =>
      (f.name && f.name.toLowerCase().includes(search.toLowerCase())) ||
      (f.city && f.city.toLowerCase().includes(search.toLowerCase())) ||
      (f.address && f.address.toLowerCase().includes(search.toLowerCase())) ||
      (f.location && f.location.toLowerCase().includes(search.toLowerCase())) ||
      (f.code && f.code.toLowerCase().includes(search.toLowerCase()))
  );

  const totalCapacity = filteredFarms.reduce((acc, f) => acc + (f.physicalStock ?? 0), 0);
  const totalAvailable = filteredFarms.reduce((acc, f) => acc + (f.availableStock ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Farm Hubs Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {filteredFarms.length} Active Hubs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage live chicken stock, delivery radius coverage, and regional hub pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSuperAdmin ? (
            <Link
              to="/farms/onboard"
              className="px-4 py-2 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 border border-emerald-700/40"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              Onboard Farm Hub
            </Link>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">
              <ShieldCheck className="w-4 h-4 text-slate-400" /> Managed Hub Access
            </div>
          )}
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Farm Hubs</p>
            <p className="text-xl font-black text-slate-900">{filteredFarms.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-50 text-orange-700">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Physical Stock Capacity</p>
            <p className="text-xl font-black text-slate-900">{totalCapacity.toLocaleString()} <span className="text-xs font-medium text-slate-500">KG</span></p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available for Order</p>
            <p className="text-xl font-black text-emerald-700">{totalAvailable.toLocaleString()} <span className="text-xs font-medium text-slate-500">KG</span></p>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Search & View Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farm by name, code, city..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-orange-500" /> Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5 text-emerald-600" /> Table
          </button>
        </div>
      </div>

      {/* Grid View Cards */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => {
            const phys = farm.physicalStock ?? 0;
            const avail = farm.availableStock ?? 0;
            const res = farm.reservedStock ?? 0;
            const pctAvail = phys > 0 ? Math.round((avail / phys) * 100) : 0;

            return (
              <div
                key={farm.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all card-hover-lift flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                        {farm.code}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-1.5 tracking-tight">
                        <Link to={`/farms/${farm.id}`} className="hover:text-emerald-700 transition-colors">
                          {farm.name}
                        </Link>
                      </h3>
                    </div>
                    <StatusBadge status={farm.status} size="sm" />
                  </div>

                  {/* Location Info */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{farm.location || farm.address || 'Regional Supply Hub'}</span>
                  </div>

                  {/* Live Rate & Coverage Badges */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Rate</p>
                      <p className="text-lg font-extrabold text-emerald-700">
                        ₹{farm.currentRate || 102} <span className="text-xs font-semibold text-slate-500">/ KG</span>
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 font-bold text-xs text-orange-800 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/80 shadow-2xs">
                      <Navigation className="w-3 h-3 text-orange-600" />
                      {farm.deliveryRadiusKm || 50} KM Radius
                    </span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-600">Available Stock:</span>
                      <span className="text-emerald-700">{avail.toLocaleString()} KG ({pctAvail}%)</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/60">
                      <div style={{ width: `${pctAvail}%` }} className="bg-emerald-600 h-full" title="Available" />
                      <div style={{ width: `${100 - pctAvail}%` }} className="bg-orange-400 h-full" title="Reserved/Other" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                      <span>Physical: {phys.toLocaleString()} KG</span>
                      <span>Reserved: {res.toLocaleString()} KG</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Coverage: {farm.deliverableAreas ? farm.deliverableAreas.length : 4} Circles
                  </span>
                  <Link
                    to={`/farms/${farm.id}`}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-orange-400" /> Hub Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View Fallback */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Hub Name</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Coverage</th>
                <th className="px-5 py-3.5">Live Rate</th>
                <th className="px-5 py-3.5">Available Stock</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFarms.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <Link to={`/farms/${row.id}`} className="font-extrabold text-slate-900 hover:text-emerald-700 block">
                      {row.name}
                    </Link>
                    <span className="text-xs font-mono text-slate-400">{row.code}</span>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-600">
                    {row.location || row.address || 'N/A'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 font-bold text-xs text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      <Navigation className="w-3 h-3 text-orange-600" />
                      {row.deliveryRadiusKm || 50} KM
                    </span>
                  </td>
                  <td className="px-5 py-4 font-black text-emerald-700">₹{row.currentRate || 102} / KG</td>
                  <td className="px-5 py-4 font-bold text-slate-900">{(row.availableStock ?? 0).toLocaleString()} KG</td>
                  <td className="px-5 py-4"><StatusBadge status={row.status} size="sm" /></td>
                  <td className="px-5 py-4 text-right">
                    <Link to={`/farms/${row.id}`} className="p-1.5 text-emerald-700 font-bold hover:bg-emerald-50 rounded-lg inline-flex items-center gap-1 text-xs">
                      <Eye className="w-3.5 h-3.5" /> Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
