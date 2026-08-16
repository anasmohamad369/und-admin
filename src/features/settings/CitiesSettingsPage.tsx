import React from 'react';
import { MapPin, Plus } from 'lucide-react';

export const CitiesSettingsPage: React.FC = () => {
  const CITIES = [
    { name: 'Ahmedabad', code: 'AMD', state: 'Gujarat', hubsCount: 2, retailersCount: 45 },
    { name: 'Surat', code: 'SRT', state: 'Gujarat', hubsCount: 1, retailersCount: 22 },
    { name: 'Vadodara', code: 'VDR', state: 'Gujarat', hubsCount: 1, retailersCount: 18 },
    { name: 'Rajkot', code: 'RJK', state: 'Gujarat', hubsCount: 0, retailersCount: 8 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Distribution Supply Circles & Cities</h3>
        <button className="px-3.5 py-1.5 bg-brand-900 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Supply Circle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CITIES.map((c) => (
          <div key={c.code} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-700" /> {c.name} ({c.code})
              </span>
              <p className="text-slate-500 mt-1">{c.state} Circle</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-800">{c.retailersCount} Active Retailers</span>
              <p className="text-slate-400">{c.hubsCount} Farm Hubs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
