import React from 'react';
import { Store, AlertCircle } from 'lucide-react';
import { useRetailers } from '../../hooks/useRetailers';

interface RetailerSelectorProps {
  value: string;
  onChange: (retailerId: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  allowAll?: boolean;
}

export const RetailerSelector: React.FC<RetailerSelectorProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  allowAll = false,
}) => {
  const { data: retailers = [], isLoading } = useRetailers();

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
        Retailer <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Store className="w-4 h-4" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading}
          className={`w-full pl-9 pr-8 py-2.5 bg-white border rounded-lg text-sm text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed ${
            error ? 'border-red-400 focus:ring-red-400' : 'border-slate-300'
          }`}
        >
          <option value="">{isLoading ? 'Loading Retailers...' : 'Select Retailer...'}</option>
          {allowAll && <option value="ALL">All Retailers</option>}
          {retailers.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.shopsCount} Shops - {r.city})
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
