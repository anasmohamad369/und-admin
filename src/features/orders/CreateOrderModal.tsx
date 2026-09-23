import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, AlertTriangle, CheckCircle2, Boxes } from 'lucide-react';
import { RetailerSelector } from '../../components/selectors/RetailerSelector';
import { ShopSelector } from '../../components/selectors/ShopSelector';
import { useFarms } from '../../hooks/useFarms';
import { useLiveRates } from '../../hooks/useRates';
import { useCreateOrder } from '../../hooks/useOrders';
import { ChickenType } from '../../types/rate';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
  const { data: rawFarms } = useFarms();
  const farms = Array.isArray(rawFarms) ? rawFarms : [];
  const createOrderMutation = useCreateOrder();

  const [farmId, setFarmId] = useState('');
  const [retailerId, setRetailerId] = useState('');
  const [shopId, setShopId] = useState('');
  const [chickenType, setChickenType] = useState<ChickenType>('LIVE_CHICKEN');
  const [quantityKg, setQuantityKg] = useState<number>(250);
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);

  // Set default farm
  useEffect(() => {
    if (farms.length > 0 && !farmId) {
      setFarmId(String(farms[0].id));
    }
  }, [farms, farmId]);

  // Fetch current live rate for selected farm
  const { data: rawRates } = useLiveRates(farmId);
  const rates = Array.isArray(rawRates) ? rawRates : [];
  const selectedFarm = farms.find((f) => String(f.id) === String(farmId)) || farms[0];
  const liveRateObj = rates.find((r) => String(r.farmId) === String(farmId) && r.chickenType === chickenType);
  const currentRate = liveRateObj ? liveRateObj.ratePerKg : selectedFarm?.currentRate || 102;

  const totalAmount = quantityKg * currentRate;

  // Reset Shop selection whenever Retailer changes
  const handleRetailerChange = (newRetailerId: string) => {
    setRetailerId(newRetailerId);
    setShopId(''); // Reset shop selection
    setError(null);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // CRITICAL VALIDATIONS
    if (!farmId) {
      setError('Farm selection is required.');
      return;
    }
    if (!retailerId) {
      setError('Retailer selection is required.');
      return;
    }
    if (!shopId) {
      setError('Shop selection is required.');
      return;
    }
    if (!quantityKg || quantityKg <= 0) {
      setError('Quantity must be greater than 0 KG.');
      return;
    }

    // Check available inventory
    if (selectedFarm && quantityKg > (selectedFarm.availableStock ?? 0)) {
      setError(
        `Insufficient available stock at ${selectedFarm.name}. Requested: ${quantityKg} KG, Available: ${selectedFarm.availableStock ?? 0} KG`
      );
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        farmId: String(farmId),
        retailerId,
        shopId,
        chickenType,
        quantityKg: Number(quantityKg),
        items: [{ chickenType, quantity: Number(quantityKg), quantityKg: Number(quantityKg) }],
        notes,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to place order.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Create B2B Chicken Order</h3>
            <p className="text-xs text-slate-500">Cascading Retailer → Shop ownership order workflow</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Farm */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Supply Farm *
            </label>
            <select
              value={farmId}
              onChange={(e) => setFarmId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              {farms.map((f) => (
                <option key={f.id} value={String(f.id)}>
                  {f.name} ({(f.availableStock ?? 0).toLocaleString()} KG Available)
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Retailer */}
          <RetailerSelector value={retailerId} onChange={handleRetailerChange} />

          {/* Step 3: Shop (Strict retailerId dependent) */}
          <ShopSelector retailerId={retailerId} value={shopId} onChange={setShopId} />

          {/* Step 4: Chicken Type & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Chicken Type *
              </label>
              <select
                value={chickenType}
                onChange={(e) => setChickenType(e.target.value as ChickenType)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="BROILER">Broiler Chicken</option>
                <option value="LAYER">Layer Chicken</option>
                <option value="KADAKNATH">Kadaknath Specialty</option>
                <option value="COUNTRY">Country Chicken</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Quantity (KG) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 500"
                value={quantityKg || ''}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Price Calculation Summary */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-500">Applied Live Rate:</span>
              <p className="text-sm font-extrabold text-brand-700">₹{currentRate} / KG</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Calculated Total Amount
              </label>
              <div className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-base font-extrabold text-white text-right">
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Stock availability hint */}
          {selectedFarm && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1">
                <Boxes className="w-4 h-4 text-slate-400" /> Farm Stock Check:
              </span>
              <span
                className={`font-bold ${
                  quantityKg <= (selectedFarm.availableStock ?? 0) ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {(selectedFarm.availableStock ?? 0).toLocaleString()} KG Available
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Order Notes / Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Priority early morning delivery request"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              disabled={createOrderMutation.isPending}
              className="px-5 py-2 text-sm font-bold text-white bg-brand-900 hover:bg-brand-950 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              {createOrderMutation.isPending ? 'Reserving Stock...' : 'Confirm & Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
