import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, AlertTriangle, Boxes, Store, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { RetailerSelector } from '../../components/selectors/RetailerSelector';
import { ShopSelector } from '../../components/selectors/ShopSelector';
import { useFarms } from '../../hooks/useFarms';
import { useLiveRates } from '../../hooks/useRates';
import { useCreateOrder } from '../../hooks/useOrders';
import { ChickenType } from '../../types/rate';

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: farms = [] } = useFarms();
  const createOrderMutation = useCreateOrder();

  const [farmId, setFarmId] = useState('');
  const [retailerId, setRetailerId] = useState('');
  const [shopId, setShopId] = useState('');
  const [chickenType, setChickenType] = useState<ChickenType>('LIVE_CHICKEN');
  const [quantityKg, setQuantityKg] = useState<number>(250);
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (farms.length > 0 && !farmId) {
      setFarmId(String(farms[0].id));
    }
  }, [farms, farmId]);

  const { data: rates = [] } = useLiveRates(farmId);
  const selectedFarm = farms.find((f) => String(f.id) === String(farmId)) || farms[0];
  const liveRateObj = rates.find((r) => String(r.farmId) === String(farmId) && r.chickenType === chickenType);
  const currentRate = liveRateObj ? liveRateObj.ratePerKg : selectedFarm?.currentRate || 102;

  const totalAmount = quantityKg * currentRate;

  const handleRetailerChange = (newRetailerId: string) => {
    setRetailerId(newRetailerId);
    setShopId('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!farmId) {
      setError('Farm hub selection is required.');
      return;
    }
    if (!retailerId) {
      setError('Retailer account selection is required.');
      return;
    }
    if (!shopId) {
      setError('Shop branch selection is required.');
      return;
    }
    if (!quantityKg || quantityKg <= 0) {
      setError('Order quantity must be greater than 0 KG.');
      return;
    }

    if (selectedFarm && quantityKg > (selectedFarm.availableStock ?? 0)) {
      setError(
        `Insufficient available stock at ${selectedFarm.name}. Requested: ${quantityKg} KG, Available: ${selectedFarm.availableStock ?? 0} KG`
      );
      return;
    }

    try {
      const newOrder = await createOrderMutation.mutateAsync({
        farmId: String(farmId),
        retailerId,
        shopId,
        chickenType,
        quantityKg: Number(quantityKg),
        notes,
      });
      navigate(`/orders/${newOrder.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to place order.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Create B2B Chicken Order"
        subtitle="Dedicated order entry page with dynamic Retailer → Shop cascading dependency"
        breadcrumbs={[
          { label: 'Orders', href: '/orders' },
          { label: 'New Order' },
        ]}
        actions={
          <Link
            to="/orders"
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
        {/* Step 1: Supply Farm */}
        <div>
          <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2 mb-4 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-700" /> 1. Select Farm Supply Hub
          </h3>
          <select
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          >
            {farms.map((f) => (
              <option key={f.id} value={String(f.id)}>
                {f.name} ({(f.availableStock ?? 0).toLocaleString()} KG Available Stock)
              </option>
            ))}
          </select>
        </div>

        {/* Step 2 & 3: Retailer & Cascading Shop */}
        <div>
          <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-700" /> 2. Retailer Account & Shop Branch Selection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RetailerSelector value={retailerId} onChange={handleRetailerChange} />
            <ShopSelector retailerId={retailerId} value={shopId} onChange={setShopId} />
          </div>
        </div>

        {/* Step 4: Product & Pricing Calculation */}
        <div>
          <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-700" /> 3. Product Specification & Live Pricing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Chicken Product Type *
              </label>
              <select
                value={chickenType}
                onChange={(e) => setChickenType(e.target.value as ChickenType)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              >
                <option value="LIVE_CHICKEN">Live Chicken</option>
                <option value="BROILER">Broiler Chicken</option>
                <option value="COUNTRY_CHICKEN">Country Chicken</option>
                <option value="PARENT_BIRD">Parent Bird</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Active Live Rate
              </label>
              <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-sm font-extrabold text-emerald-900 h-11">
                <span>₹{currentRate} / KG</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 uppercase">
                  LIVE
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Order Quantity (KG) *
              </label>
              <input
                type="number"
                min="10"
                step="5"
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Calculation Summary & Stock Check Box */}
        <div className="p-5 bg-stone-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              ORDER SUMMARY & INVENTORY RESERVATION
            </span>
            <p className="text-xl font-extrabold mt-0.5">
              {quantityKg} KG @ ₹{currentRate}/KG = <span className="text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</span>
            </p>
          </div>
          {selectedFarm && (
            <div className="text-xs text-right font-medium">
              <span className="text-stone-400">Farm Available Stock:</span>
              <p className="font-bold text-emerald-300 text-sm">{(selectedFarm.availableStock ?? 0).toLocaleString()} KG Available</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Special Instructions / Delivery Notes
          </label>
          <input
            type="text"
            placeholder="e.g. Priority morning delivery slot"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          />
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
          <Link
            to="/orders"
            className="px-5 py-2.5 text-sm font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createOrderMutation.isPending}
            className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {createOrderMutation.isPending ? 'Reserving Stock...' : 'Confirm & Place Order ✓'}
          </button>
        </div>
      </form>
    </div>
  );
};
