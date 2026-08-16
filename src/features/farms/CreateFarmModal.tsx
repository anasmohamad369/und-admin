import React, { useState } from 'react';
import { X, Building2, AlertTriangle, ShieldCheck, MapPin, Navigation } from 'lucide-react';
import { useCreateFarm } from '../../hooks/useFarms';

interface CreateFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFarmModal: React.FC<CreateFarmModalProps> = ({ isOpen, onClose }) => {
  const createFarmMutation = useCreateFarm();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Ahmedabad');
  const [state, setState] = useState('Gujarat');
  const [location, setLocation] = useState('');
  const [currentRate, setCurrentRate] = useState<number>(102);
  const [physicalStock, setPhysicalStock] = useState<number>(10000);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState<number>(50);
  const [deliverableAreasText, setDeliverableAreasText] = useState('Ahmedabad, Sanand, Bopal, Satellite, SG Highway');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Farm Name is required.');
      return;
    }
    if (!code.trim()) {
      setError('Farm Code is required.');
      return;
    }
    if (!contactPerson.trim() || !phone.trim()) {
      setError('Contact person details are required.');
      return;
    }
    if (!location.trim()) {
      setError('Location address is required.');
      return;
    }
    if (!deliveryRadiusKm || deliveryRadiusKm <= 0) {
      setError('Delivery radius must be greater than 0 KM.');
      return;
    }

    const deliverableAreas = deliverableAreasText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      await createFarmMutation.mutateAsync({
        name,
        code,
        ownerName: contactPerson,
        address: location,
        status: 'ACTIVE',
        phone,
        city,
        state,
        currentRate: Number(currentRate),
        physicalStock: Number(physicalStock),
        deliveryRadiusKm: Number(deliveryRadiusKm),
        deliverableAreas,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to onboard farm.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Building2 className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-stone-900">Farm Onboarding & Supply Hub</h3>
            <p className="text-xs text-stone-500">Configure new farm hub, live pricing, & delivery coverage radius</p>
          </div>
        </div>

        {/* Super Admin Access Banner */}
        <div className="mb-4 p-3 rounded-xl bg-stone-900 text-white text-xs flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Super Admin Onboarding Authorization
          </span>
          <span className="text-[10px] font-mono text-stone-400">SUPER_ADMIN_ONLY</span>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Farm Hub Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NutriFarm Gujarat Hub 01"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Farm Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NF-GJ01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-bold font-mono focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Suresh Patel"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 9898011223"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                City / Circle *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ahmedabad, Mumbai, Bengaluru..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                State *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Gujarat, Maharashtra, Karnataka..."
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Full Location Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sanand Highway, Ahmedabad"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          {/* Pricing & Initial Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Initial Live Rate / KG (₹) *
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={currentRate}
                onChange={(e) => setCurrentRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Physical Stock Capacity (KG) *
              </label>
              <input
                type="number"
                min="100"
                step="500"
                required
                value={physicalStock}
                onChange={(e) => setPhysicalStock(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Delivery Coverage Radius & Areas */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-700" /> Delivery Coverage & Radius Setup
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Deliverable Coverage Radius (KM) *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="300"
                  required
                  value={deliveryRadiusKm}
                  onChange={(e) => setDeliveryRadiusKm(Number(e.target.value))}
                  className="w-32 px-3.5 py-2 bg-white border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
                <span className="text-xs font-semibold text-stone-600">Kilometers from Farm Hub</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Deliverable Postal Areas / Cities (Comma Separated) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ahmedabad, Sanand, Bopal, Satellite, SG Highway"
                value={deliverableAreasText}
                onChange={(e) => setDeliverableAreasText(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createFarmMutation.isPending}
              className="px-5 py-2 text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              {createFarmMutation.isPending ? 'Onboarding Farm...' : 'Complete Farm Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
