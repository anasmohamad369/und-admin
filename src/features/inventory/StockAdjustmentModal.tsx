import React, { useState, useEffect } from 'react';
import { X, Boxes, AlertTriangle } from 'lucide-react';
import { useFarms } from '../../hooks/useFarms';
import { useChickenTypes } from '../../hooks/useChickenTypes';
import { useStockIn, useAdjustInventory } from '../../hooks/useInventory';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AdjustmentType } from '../../types/inventory';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFarmId?: string;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  defaultFarmId,
}) => {
  const { data: farms = [] } = useFarms();
  const { data: chickenTypes = [] } = useChickenTypes();
  const stockInMutation = useStockIn();
  const adjustMutation = useAdjustInventory();

  const [mode, setMode] = useState<'STOCK_IN' | 'ADJUST'>('STOCK_IN');
  const [farmId, setFarmId] = useState<string>('');
  const [chickenTypeId, setChickenTypeId] = useState<string>('');
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('DAMAGE');
  const [quantity, setQuantity] = useState<number>(2500);
  const [quantityDelta, setQuantityDelta] = useState<number>(-150);
  const [reason, setReason] = useState('Fresh batch arrival from hatchery');
  const [notes, setNotes] = useState('Verified by farm supervisor');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (farms.length > 0 && !farmId) setFarmId(defaultFarmId || String(farms[0].id));
      if (chickenTypes.length > 0 && !chickenTypeId) setChickenTypeId(String(chickenTypes[0].id));
    }
  }, [isOpen, farms, chickenTypes, defaultFarmId]);

  if (!isOpen) return null;

  const selectedType = chickenTypes.find((ct) => String(ct.id) === String(chickenTypeId)) || chickenTypes[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!farmId) {
      setError('Farm Hub selection is required.');
      return;
    }
    if (!reason.trim()) {
      setError('Reason is required.');
      return;
    }

    try {
      if (mode === 'STOCK_IN') {
        if (!chickenTypeId) {
          setError('Chicken Type selection is required for Stock-In.');
          return;
        }
        if (quantity <= 0) {
          setError('Quantity must be greater than 0.');
          return;
        }

        await stockInMutation.mutateAsync({
          farmId: isNaN(Number(farmId)) ? farmId : Number(farmId),
          chickenTypeId: isNaN(Number(chickenTypeId)) ? chickenTypeId : Number(chickenTypeId),
          quantity: Number(quantity),
          reason,
        });
      } else {
        // Stock Adjustment (Deduction / Damage / Correction)
        await adjustMutation.mutateAsync({
          farmId: String(farmId),
          chickenType: selectedType?.code || 'CHICKEN-LIVE',
          chickenTypeId: selectedType?.id ? Number(selectedType.id) : 3,
          adjustmentType,
          quantity: Number(quantity),
          reason,
          notes,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to process inventory transaction.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {mode === 'STOCK_IN' ? 'Physical Stock-In (+ Intake)' : 'Inventory Stock Adjustment / Correction'}
            </h3>
            <p className="text-xs text-stone-500">
              {mode === 'STOCK_IN' ? 'POST /api/v1/inventory/stock-in' : 'POST /api/v1/inventory/adjustments'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Transaction Mode</Label>
              <Select
                value={mode}
                onValueChange={(v) => {
                  setMode(v as any);
                  if (v === 'STOCK_IN') {
                    setReason('Fresh batch arrival from hatchery');
                  } else {
                    setReason('Mortality deduction during transit');
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STOCK_IN">📦 Stock-In (+ Add Stock)</SelectItem>
                  <SelectItem value="ADJUST">⚠️ Stock Adjustment / Deduct</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Farm Hub *</Label>
              <Select value={farmId} onValueChange={setFarmId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select farm..." />
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
          </div>

          <div className="grid grid-cols-2 gap-3">
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

            {mode === 'STOCK_IN' ? (
              <div>
                <Label>Quantity to Add (KG) *</Label>
                <Input
                  type="number"
                  min="1"
                  // step="50"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1 font-extrabold text-stone-900"
                />
              </div>
            ) : (
              <div>
                <Label>Adjustment Type</Label>
                <Select value={adjustmentType} onValueChange={(v) => setAdjustmentType(v as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAMAGE">DAMAGE (Mortality / Loss)</SelectItem>
                    <SelectItem value="REMOVE_STOCK">REMOVE_STOCK (Deduction)</SelectItem>
                    <SelectItem value="CORRECTION">CORRECTION (Audit Fix)</SelectItem>
                    <SelectItem value="ADD_STOCK">ADD_STOCK (Manual Add)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {mode === 'ADJUST' && (
            <div>
              <Label>Quantity Delta (KG) * (Use negative for deduction, e.g. -150.00)</Label>
              <Input
                type="number"
                step="1"
                required
                value={quantityDelta}
                onChange={(e) => setQuantityDelta(Number(e.target.value))}
                className="mt-1 font-extrabold text-rose-700"
              />
            </div>
          )}

          <div>
            <Label>Reason *</Label>
            <Input
              type="text"
              required
              placeholder={mode === 'STOCK_IN' ? 'Fresh batch arrival from hatchery' : 'Mortality deduction during transit'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1"
            />
          </div>

          {mode === 'ADJUST' && (
            <div>
              <Label>Audit Notes</Label>
              <Input
                type="text"
                placeholder="e.g. Verified by farm supervisor"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={stockInMutation.isPending || adjustMutation.isPending}
            >
              {stockInMutation.isPending || adjustMutation.isPending ? 'Processing...' : 'Submit Transaction ✓'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
