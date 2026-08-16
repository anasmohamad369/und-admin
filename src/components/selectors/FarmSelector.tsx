import React from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { useFarmContext } from '../../context/FarmContext';
import { useFarms } from '../../hooks/useFarms';

export const FarmSelector: React.FC = () => {
  const { selectedFarmId, setSelectedFarmId } = useFarmContext();
  const { data: farms = [] } = useFarms();

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg text-slate-800 font-medium text-sm transition-colors border border-slate-200">
        <Building2 className="w-4 h-4 text-brand-700" />
        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold hidden sm:inline">
          Farm:
        </span>
        <select
          value={selectedFarmId}
          onChange={(e) => setSelectedFarmId(e.target.value)}
          className="bg-transparent focus:outline-none cursor-pointer pr-4 font-semibold text-slate-800 text-sm appearance-none"
        >
          <option value="ALL">All Farms</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500 -ml-3 pointer-events-none" />
      </div>
    </div>
  );
};
