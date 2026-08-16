import React, { useState } from 'react';
import { X, Boxes, AlertTriangle } from 'lucide-react';
import { useFarms } from '../../hooks/useFarms';
import { useAdjustInventory } from '../../hooks/useInventory';
import { AdjustmentType } from '../../types/inventory';
import { ChickenType } from '../../types/rate';

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
  const adjustMutation = useAdjustInventory();

  const [farmId, setFarmId] = useState(defaultFarmId || farms[0]?.id || 'farm-01');
  const [chickenType, setChickenType] = useState<ChickenType>('LIVE_CHICKEN');
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('ADD_STOCK');
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [reason, setReason] = useState('New stock received');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!farmId) {
      setError('Farm selection is required.');
      return;
    }
    if (quantityKg < 0) {
      setError('Adjustment quantity cannot be negative.');
      return;
    }
    if (!reason.trim()) {
      setError('Reason for stock adjustment is required.');
      return;
    }

    try {
      await adjustMutation.mutateAsync({
        farmId: String(farmId),
        chickenType,
        adjustmentType,
        quantityKg: Number(quantityKg),
        reason,
        notes,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to record stock adjustment.');
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
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Stock Adjustment Entry</h3>
            <p className="text-xs text-slate-500">Record intake, removal, or damage stock adjustments</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Farm Hub *
            </label>
            <select
              value={farmId}
              onChange={(e) => setFarmId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              {farms.map((f) => (
                <option key={f.id} value={String(f.id)}>
                  {f.name} (Physical: {(f.physicalStock ?? 0).toLocaleString()} KG)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Adjustment Type *
              </label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as AdjustmentType)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="ADD_STOCK">Add Stock (+)</option>
                <option value="REMOVE_STOCK">Remove Stock (-)</option>
                <option value="DAMAGE">Damage / Loss (-)</option>
                <option value="CORRECTION">Correction (=)</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Quantity (KG) *
              </label>
              <input
                type="number"
                min="0"
                step="10"
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Mandatory Reason *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. New stock intake from coop 4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Internal Notes / Reference
            </label>
            <input
              type="text"
              placeholder="e.g. Weight voucher #WV-9012"
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
              disabled={adjustMutation.isPending}
              className="px-5 py-2 text-sm font-bold text-white bg-brand-900 hover:bg-brand-950 rounded-lg shadow-sm"
            >
              {adjustMutation.isPending ? 'Processing...' : 'Confirm Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
