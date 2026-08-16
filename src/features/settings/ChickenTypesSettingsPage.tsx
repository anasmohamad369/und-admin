import React from 'react';
import { Feather, Plus } from 'lucide-react';

export const ChickenTypesSettingsPage: React.FC = () => {
  const TYPES = [
    { code: 'LIVE_CHICKEN', name: 'Live Chicken Standard', avgWeightKg: '2.0 - 2.5 KG', status: 'ACTIVE' },
    { code: 'BROILER', name: 'Broiler Commercial', avgWeightKg: '1.8 - 2.2 KG', status: 'ACTIVE' },
    { code: 'COUNTRY_CHICKEN', name: 'Desi / Country Chicken', avgWeightKg: '1.2 - 1.6 KG', status: 'ACTIVE' },
    { code: 'PARENT_BIRD', name: 'Parent Breeder Bird', avgWeightKg: '3.0 - 3.5 KG', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Chicken Product Catalog & Types</h3>
        <button className="px-3.5 py-1.5 bg-brand-900 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Product Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TYPES.map((t) => (
          <div key={t.code} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-emerald-700" /> {t.name}
              </span>
              <p className="text-slate-500 font-mono text-[11px] mt-1">{t.code}</p>
            </div>
            <div className="text-right font-medium">
              <span className="text-slate-700">Target Weight: {t.avgWeightKg}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
