import React, { useEffect } from 'react';
import { ShoppingBag, AlertCircle, AlertTriangle } from 'lucide-react';
import { useRetailerShops } from '../../hooks/useShops';

interface ShopSelectorProps {
  retailerId: string; // STRICT DEPENDENCY
  value: string;
  onChange: (shopId: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  allowAll?: boolean;
}

export const ShopSelector: React.FC<ShopSelectorProps> = ({
  retailerId,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  allowAll = false,
}) => {
  const { data: shops = [], isLoading } = useRetailerShops(retailerId);

  // If retailerId changes and currently selected shop doesn't belong to new retailer, reset selection
  useEffect(() => {
    if (value && retailerId && retailerId !== 'ALL') {
      const exists = shops.some((s) => s.id === value);
      if (!isLoading && shops.length > 0 && !exists) {
        onChange('');
      }
    }
  }, [retailerId, shops, value, isLoading, onChange]);

  const isDisabled = disabled || !retailerId || retailerId === '' || isLoading;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
        Retailer Shop <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className={`w-full pl-9 pr-8 py-2.5 bg-white border rounded-lg text-sm text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
            error ? 'border-red-400 focus:ring-red-400' : 'border-slate-300'
          }`}
        >
          {!retailerId ? (
            <option value="">Select a Retailer first...</option>
          ) : isLoading ? (
            <option value="">Loading Shops for Retailer...</option>
          ) : shops.length === 0 ? (
            <option value="">No shops found for this Retailer</option>
          ) : (
            <>
              <option value="">Select Shop...</option>
              {allowAll && <option value="ALL">All Shops</option>}
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.area}, {s.city})
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      {!retailerId && (
        <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          Shops load automatically once a Retailer is selected.
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
