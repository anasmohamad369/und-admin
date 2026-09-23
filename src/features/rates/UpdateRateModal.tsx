import React, { useState, useEffect } from 'react';
import { X, TrendingUp, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { useFarms } from '../../hooks/useFarms';
import { useChickenTypes } from '../../hooks/useChickenTypes';
import { usePublishRate, useLiveRates } from '../../hooks/useRates';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface UpdateRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFarmId?: string;
}

export const UpdateRateModal: React.FC<UpdateRateModalProps> = ({
  isOpen,
  onClose,
  defaultFarmId,
}) => {
  const { data: farms = [] } = useFarms();
  const { data: chickenTypes = [] } = useChickenTypes();
  const publishRateMutation = usePublishRate();

  const [step, setStep] = useState<'edit' | 'preview' | 'success'>('edit');
  const [farmId, setFarmId] = useState<string>('');
  const [chickenTypeId, setChickenTypeId] = useState<string>('');
  
  // Dynamic live rate state
  const [marketPrice, setMarketPrice] = useState<number>(143.5);
  const [discount, setDiscount] = useState<number>(5.0);
  const [currency] = useState<string>('INR');
  const [reason, setReason] = useState<string>('Circle market rate update - retailer discount applied');
  const [error, setError] = useState<string | null>(null);

  const selectedFarm = farms.find((f) => String(f.id) === String(farmId)) || farms[0];
  const selectedType = chickenTypes.find((t) => String(t.id) === String(chickenTypeId)) || chickenTypes[0];

  // Fetch actual live rates for selected farm to auto-populate current pricing
  const { data: liveRates = [] } = useLiveRates(farmId || defaultFarmId || 'ALL');

  useEffect(() => {
    if (isOpen) {
      setStep('edit');
      setError(null);
      const initialFarmId = defaultFarmId || (farms.length > 0 ? String(farms[0].id) : '');
      if (initialFarmId) setFarmId(initialFarmId);
      if (chickenTypes.length > 0 && !chickenTypeId) setChickenTypeId(String(chickenTypes[0].id));
    }
  }, [isOpen, farms, chickenTypes, defaultFarmId]);

  // Auto-fill input fields with the selected farm's current live rate
  useEffect(() => {
    if (!isOpen) return;

    // 1. Try finding live rate from API
    const activeRate = liveRates.find((r) => String(r.farmId) === String(farmId));
    if (activeRate) {
      const curRate = activeRate.ratePerKg ?? activeRate.currentRate ?? 138.5;
      const discAmt = activeRate.discountPerKg ?? 5.0;
      const origRate = activeRate.originalRatePerKg ?? activeRate.originalRate ?? (curRate + discAmt);

      setMarketPrice(origRate);
      setDiscount(discAmt);
      if (activeRate.reason) setReason(activeRate.reason);
      return;
    }

    // 2. Fallback to selected Farm entity properties
    if (selectedFarm) {
      const curRate = selectedFarm.currentRate ?? 138.5;
      const discAmt = selectedFarm.discountPerKg ?? 5.0;
      const origRate = selectedFarm.originalRate ?? (curRate + discAmt);

      setMarketPrice(origRate);
      setDiscount(discAmt);
    }
  }, [isOpen, farmId, liveRates, selectedFarm]);

  if (!isOpen) return null;

  // Auto-calculated NutriFarm Final Rate per KG
  const nutriFarmPrice = Math.max(0, marketPrice - discount);

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!farmId) {
      setError('Farm Hub selection is required');
      return;
    }
    if (!chickenTypeId) {
      setError('Chicken Type selection is required');
      return;
    }
    if (!marketPrice || marketPrice <= 0) {
      setError('Original Market Price must be greater than 0');
      return;
    }
    if (discount < 0) {
      setError('Discount amount cannot be negative');
      return;
    }
    if (!reason.trim()) {
      setError('Reason for rate revision is required');
      return;
    }
    setStep('preview');
  };

  const handleConfirm = async () => {
    try {
      await publishRateMutation.mutateAsync({
        farmId: isNaN(Number(farmId)) ? farmId : Number(farmId),
        chickenTypeId: isNaN(Number(chickenTypeId)) ? chickenTypeId : Number(chickenTypeId),
        originalRatePerKg: Number(marketPrice),
        marketRatePerKg: Number(marketPrice),
        discountPerKg: Number(discount),
        ratePerKg: Number(nutriFarmPrice),
        currency,
        reason,
      });
      setStep('success');
    } catch (err: any) {
      setError(err?.message || 'Failed to publish rate.');
      setStep('edit');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. EDIT MODE */}
        {step === 'edit' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 leading-tight">
                  Update Price – {selectedFarm?.name || 'Farm Hub'}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Update live chicken rate and discount for retailers
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePreview} className="space-y-4">
              <div>
                <Label>Farm Hub / Circle *</Label>
                <Select value={farmId} onValueChange={setFarmId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select farm hub..." />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((f) => (
                      <SelectItem key={String(f.id)} value={String(f.id)}>
                        {f.name} ({f.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Chicken Product Type *</Label>
                <Select value={chickenTypeId} onValueChange={setChickenTypeId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select chicken type..." />
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Market Price (₹/KG) *</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(Number(e.target.value))}
                    className="mt-1 font-extrabold text-stone-900"
                  />
                </div>
                <div>
                  <Label>Discount (₹/KG)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="mt-1 font-extrabold text-stone-900"
                  />
                </div>
              </div>

              {/* Auto calculated NutriFarm Price */}
              <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  NutriFarm Price (₹/KG)
                </p>
                <p className="text-2xl font-black text-emerald-700 mt-0.5">
                  ₹{nutriFarmPrice.toFixed(2)}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                  Auto calculated (Market Price ₹{marketPrice.toFixed(2)} - Discount ₹{discount.toFixed(2)})
                </p>
              </div>

              <div>
                <Label>Reason for Rate Revision *</Label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Circle market rate update - retailer discount applied"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Preview <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* 2. PREVIEW MODE */}
        {step === 'preview' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Preview Price Update</h3>
            <p className="text-xs text-stone-500 mb-5 font-medium">
              Please review the rate and discount structure before updating.
            </p>

            <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-3 mb-4 text-xs font-medium">
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Farm Hub / Circle:</span>
                <span className="font-bold text-stone-900">{selectedFarm?.name || farmId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Chicken Product Type:</span>
                <span className="font-bold text-stone-900">{selectedType?.name || chickenTypeId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Original Market Price (₹/KG):</span>
                <span className="font-bold text-stone-900">₹{marketPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Discount Amount (₹/KG):</span>
                <span className="font-bold text-stone-900">₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-700 font-bold">NutriFarm Final Price (₹/KG):</span>
                <span className="font-black text-emerald-700 text-base">₹{nutriFarmPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium mb-6">
              ⓘ Retailers will see updated prices immediately after confirmation.
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <Button type="button" variant="outline" onClick={() => setStep('edit')}>
                Back
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={publishRateMutation.isPending}
              >
                {publishRateMutation.isPending ? 'Publishing...' : 'Confirm Update ✓'}
              </Button>
            </div>
          </div>
        )}

        {/* 3. SUCCESS MODE */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-1">
              Price Updated Successfully!
            </h3>
            <p className="text-xs text-stone-500 mb-6 font-medium">
              {selectedFarm?.name || 'Farm Hub'} price has been updated.
            </p>

            <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-2 text-xs font-medium mb-6 max-w-xs mx-auto text-left">
              <div className="flex justify-between">
                <span className="text-stone-500">Market Price:</span>
                <span className="font-bold text-stone-900">₹{marketPrice.toFixed(2)} / KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Discount:</span>
                <span className="font-bold text-stone-900">₹{discount.toFixed(2)} / KG</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-200">
                <span className="text-stone-700 font-bold">NutriFarm Price:</span>
                <span className="font-black text-emerald-700 text-sm">₹{nutriFarmPrice.toFixed(2)} / KG</span>
              </div>
            </div>

            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
