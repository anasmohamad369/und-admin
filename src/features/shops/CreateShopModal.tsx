import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, AlertTriangle } from 'lucide-react';
import { RetailerSelector } from '../../components/selectors/RetailerSelector';
import { useCreateShop } from '../../hooks/useShops';

interface CreateShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRetailerId?: string;
}

export const CreateShopModal: React.FC<CreateShopModalProps> = ({
  isOpen,
  onClose,
  defaultRetailerId = '',
}) => {
  const createShopMutation = useCreateShop();

  const [retailerId, setRetailerId] = useState(defaultRetailerId);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Ahmedabad');
  const [area, setArea] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultRetailerId) {
      setRetailerId(defaultRetailerId);
    }
  }, [defaultRetailerId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // STRICT VALIDATION
    if (!retailerId) {
      setError('Parent Retailer selection is strictly required.');
      return;
    }
    if (!name.trim()) {
      setError('Shop Name is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Shop Mobile contact is required.');
      return;
    }
    if (!address.trim()) {
      setError('Shop Address is required.');
      return;
    }

    try {
      await createShopMutation.mutateAsync({
        retailerId, // STRICT OWNERSHIP
        name,
        phone,
        address,
        city,
        area: area || city,
        status: 'ACTIVE',
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create shop branch.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Create Shop Branch</h3>
            <p className="text-xs text-slate-500">Every shop strictly belongs to exactly one Retailer</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STRICT RETAILER SELECTION */}
          <RetailerSelector
            value={retailerId}
            onChange={(id) => setRetailerId(id)}
            disabled={!!defaultRetailerId}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Shop Branch Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ABC Chicken - Bopal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Shop Mobile *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                City / Circle *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Rajkot">Rajkot</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Shop Address *
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Shop 12, South Bopal Main Road"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createShopMutation.isPending}
              className="px-5 py-2 text-sm font-bold text-white bg-brand-900 hover:bg-brand-950 rounded-lg shadow-sm"
            >
              {createShopMutation.isPending ? 'Creating...' : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
