import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { RetailerSelector } from '../../components/selectors/RetailerSelector';
import { useCreateShop } from '../../hooks/useShops';
import { useStates, useCitiesForState } from '../../hooks/useCities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export const CreateShopPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRetailerId = searchParams.get('retailerId') || '';

  const createShopMutation = useCreateShop();
  const allStates = useStates();

  const [retailerId, setRetailerId] = useState(defaultRetailerId);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState('AP');
  const [selectedCity, setSelectedCity] = useState('Vijayawada');
  const [area, setArea] = useState('');

  const cities = useCitiesForState(selectedStateCode);

  const handleStateChange = (isoCode: string) => {
    setSelectedStateCode(isoCode);
    setSelectedCity('');
  };

  const [error, setError] = useState<string | null>(null);

  const finalCity = selectedCity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!retailerId) {
      setError('Parent Retailer selection is strictly required.');
      return;
    }
    if (!name.trim()) {
      setError('Shop Branch Name is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Shop Mobile contact is required.');
      return;
    }
    if (!finalCity.trim()) {
      setError('City / Circle selection is required.');
      return;
    }
    if (!address.trim()) {
      setError('Shop Address is required.');
      return;
    }

    try {
      const newShop = await createShopMutation.mutateAsync({
        retailerId,
        name,
        phone,
        address,
        city: finalCity,
        area: area || finalCity,
        status: 'ACTIVE',
      });
      navigate(`/shops/${newShop.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create shop branch.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Create Shop Branch Page"
        subtitle="Dedicated page to add a new retail branch under a parent Retailer"
        breadcrumbs={[
          { label: 'Shops', href: '/shops' },
          { label: 'Create Shop Branch' },
        ]}
        actions={
          <Link
            to="/shops"
            className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Return
          </Link>
        }
      />

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200/80 p-8 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-700" /> Shop Branch Specifications
        </h3>

        {/* Parent Retailer Selector */}
        <RetailerSelector
          value={retailerId}
          onChange={(id) => setRetailerId(id)}
          disabled={!!defaultRetailerId}
        />

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Shop Branch Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. ABC Chicken - Bopal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Shop Mobile *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              State *
            </label>
            <Select value={selectedStateCode} onValueChange={handleStateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select state..." />
              </SelectTrigger>
              <SelectContent>
                {allStates.map((s) => (
                  <SelectItem key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              City / Circle *
            </label>
            <Select
              value={selectedCity}
              onValueChange={setSelectedCity}
              disabled={cities.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={cities.length === 0 ? 'Select state first...' : 'Select city...'} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Full Address *
          </label>
          <textarea
            required
            rows={3}
            placeholder="e.g. Shop 12, South Bopal Main Road"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          />
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
          <Link
            to="/shops"
            className="px-5 py-2.5 text-sm font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createShopMutation.isPending}
            className="px-6 py-2.5 text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {createShopMutation.isPending ? 'Creating...' : 'Create Shop Branch ✓'}
          </button>
        </div>
      </form>
    </div>
  );
};
