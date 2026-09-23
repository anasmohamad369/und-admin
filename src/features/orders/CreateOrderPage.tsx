import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, AlertTriangle, Boxes, Store, CreditCard } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { RetailerSelector } from '../../components/selectors/RetailerSelector';
import { ShopSelector } from '../../components/selectors/ShopSelector';
import { useFarms } from '../../hooks/useFarms';
import { useChickenTypes } from '../../hooks/useChickenTypes';
import { useLiveRates } from '../../hooks/useRates';
import { useCreateOrder } from '../../hooks/useOrders';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: farms = [] } = useFarms();
  const { data: chickenTypes = [] } = useChickenTypes();
  const createOrderMutation = useCreateOrder();

  const [farmId, setFarmId] = useState('');
  const [retailerId, setRetailerId] = useState('');
  const [shopId, setShopId] = useState('');
  const [chickenTypeId, setChickenTypeId] = useState<string>('');
  const [quantityKg, setQuantityKg] = useState<number>(250);
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (farms.length > 0 && !farmId) {
      setFarmId(String(farms[0].id));
    }
  }, [farms, farmId]);

  useEffect(() => {
    if (chickenTypes.length > 0 && !chickenTypeId) {
      setChickenTypeId(String(chickenTypes[0].id));
    }
  }, [chickenTypes, chickenTypeId]);

  const { data: rates = [] } = useLiveRates(farmId);
  const selectedFarm = farms.find((f) => String(f.id) === String(farmId)) || farms[0];
  const liveRateObj = rates.find((r) => String(r.farmId) === String(farmId) && String(r.chickenTypeId) === String(chickenTypeId));
  const currentRate = liveRateObj ? liveRateObj.ratePerKg : selectedFarm?.currentRate || 105.5;

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
    if (!chickenTypeId) {
      setError('Chicken Product Type is required.');
      return;
    }
    if (!quantityKg || quantityKg <= 0) {
      setError('Order quantity must be greater than 0 KG.');
      return;
    }

    try {
      const newOrder = await createOrderMutation.mutateAsync({
        farmId: isNaN(Number(farmId)) ? farmId : Number(farmId),
        retailerId: isNaN(Number(retailerId)) ? retailerId : Number(retailerId),
        shopId: isNaN(Number(shopId)) ? shopId : Number(shopId),
        paymentMethod,
        items: [
          {
            chickenTypeId: isNaN(Number(chickenTypeId)) ? chickenTypeId : Number(chickenTypeId),
            quantity: Number(quantityKg),
            quantityKg: Number(quantityKg),
            ratePerKg: currentRate,
          },
        ],
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
        subtitle="Dedicated order entry page (Step 6: POST /api/v1/orders)"
        breadcrumbs={[
          { label: 'Orders', href: '/orders' },
          { label: 'New Order' },
        ]}
        actions={
          <Link to="/orders">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Cancel & Return
            </Button>
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
          <Select value={farmId} onValueChange={setFarmId}>
            <SelectTrigger>
              <SelectValue placeholder="Select farm hub..." />
            </SelectTrigger>
            <SelectContent>
              {farms.map((f) => (
                <SelectItem key={String(f.id)} value={String(f.id)}>
                  {f.name} ({(f.availableStock ?? 10000).toLocaleString()} KG Stock)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <ShoppingCart className="w-5 h-5 text-emerald-700" /> 3. Product Specification & Payment Method
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Chicken Product Type *</Label>
              <Select value={chickenTypeId} onValueChange={setChickenTypeId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {chickenTypes.map((ct) => (
                    <SelectItem key={String(ct.id)} value={String(ct.id)}>
                      {ct.name} ({ct.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI / QR Code</SelectItem>
                  <SelectItem value="NET_BANKING">Net Banking / NEFT</SelectItem>
                  <SelectItem value="CREDIT_LINE">Credit Line / Deferred</SelectItem>
                  <SelectItem value="CASH">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Active Live Rate</Label>
              <div className="mt-1 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-sm font-extrabold text-emerald-900 h-10">
                <span>₹{currentRate} / KG</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 uppercase">
                  LIVE
                </span>
              </div>
            </div>

            <div>
              <Label>Order Quantity (KG) *</Label>
              <Input
                type="number"
                min="10"
                step="5"
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                className="mt-1 font-extrabold text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Calculation Summary Box */}
        <div className="p-5 bg-stone-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              ORDER SUMMARY & PAYMENT METHOD ({paymentMethod})
            </span>
            <p className="text-xl font-extrabold mt-0.5">
              {quantityKg} KG @ ₹{currentRate}/KG = <span className="text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</span>
            </p>
          </div>
          {selectedFarm && (
            <div className="text-xs text-right font-medium">
              <span className="text-stone-400">Farm Available Stock:</span>
              <p className="font-bold text-emerald-300 text-sm">{(selectedFarm.availableStock ?? 10000).toLocaleString()} KG Available</p>
            </div>
          )}
        </div>

        <div>
          <Label>Special Instructions / Delivery Notes</Label>
          <Input
            type="text"
            placeholder="e.g. Priority morning delivery slot"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
          <Link to="/orders">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button
            type="submit"
            disabled={createOrderMutation.isPending}
            size="lg"
          >
            {createOrderMutation.isPending ? 'Reserving Stock...' : 'Confirm & Place Order ✓'}
          </Button>
        </div>
      </form>
    </div>
  );
};
