import React, { useState } from 'react';
import { X, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useFarms } from '../../hooks/useFarms';
import { useUpdateRate } from '../../hooks/useRates';
import { ChickenType } from '../../types/rate';

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
  const updateRateMutation = useUpdateRate();

  const [farmId, setFarmId] = useState(defaultFarmId || farms[0]?.id || 'farm-01');
  const [chickenType, setChickenType] = useState<ChickenType>('LIVE_CHICKEN');
  const [ratePerKg, setRatePerKg] = useState<number>(102);
  const [effectiveFrom, setEffectiveFrom] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [reason, setReason] = useState<string>('Market price update');

  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedFarm = farms.find((f) => f.id === farmId) || farms[0];
  const previousRate = selectedFarm?.currentRate || 98;

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!farmId) {
      setError('Farm selection is required.');
      return;
    }
    if (!ratePerKg || ratePerKg <= 0) {
      setError('Rate per KG must be greater than 0.');
      return;
    }
    if (!effectiveFrom) {
      setError('Effective date and time is required.');
      return;
    }
    if (!reason.trim()) {
      setError('Reason for rate update is required.');
      return;
    }

    // Step 2: Show confirmation modal step
    setShowConfirm(true);
  };

  const handlePublish = async () => {
    try {
      await updateRateMutation.mutateAsync({
        farmId: String(farmId),
        chickenType,
        ratePerKg: Number(ratePerKg),
        effectiveFrom,
        reason,
      });
      setShowConfirm(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update live rate.');
      setShowConfirm(false);
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

        {!showConfirm ? (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Update Live Chicken Rate</h3>
                <p className="text-xs text-slate-500">Publish immediate rate update for farms</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                {error}
              </div>
            )}

            <form onSubmit={handleValidation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Farm *
                </label>
                <select
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (Current: ₹{f.currentRate}/KG)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Chicken Type *
                </label>
                <select
                  value={chickenType}
                  onChange={(e) => setChickenType(e.target.value as ChickenType)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="LIVE_CHICKEN">Live Chicken</option>
                  <option value="BROILER">Broiler Chicken</option>
                  <option value="COUNTRY_CHICKEN">Country Chicken</option>
                  <option value="PARENT_BIRD">Parent Bird</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  New Rate / KG (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={ratePerKg}
                    onChange={(e) => setRatePerKg(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-base font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Effective From *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Reason for Update *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Market price update, grain cost spike..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-900 hover:bg-brand-950 rounded-lg shadow-sm"
                >
                  Review Rate Update →
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Step 2: Rate Change Confirmation Dialog */
          <div>
            <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <div className="p-2.5 rounded-full bg-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Rate Publication</h3>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 my-4">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Farm:</span>
                <span className="font-bold text-slate-900">{selectedFarm?.name}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Chicken Type:</span>
                <span className="font-bold text-slate-900">{chickenType.replace('_', ' ')}</span>
              </div>

              <div className="flex items-center justify-center gap-4 py-3 bg-white rounded-lg border border-slate-200 text-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Current</p>
                  <p className="text-xl font-bold text-slate-600">₹{previousRate} / KG</p>
                </div>
                <span className="text-slate-400 font-bold">→</span>
                <div>
                  <p className="text-[10px] uppercase font-bold text-brand-600">New Live Rate</p>
                  <p className="text-2xl font-extrabold text-emerald-600">₹{ratePerKg} / KG</p>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>
                  <strong>Reason:</strong> {reason}
                </p>
                <p>
                  <strong>Effective:</strong> {new Date(effectiveFrom).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={updateRateMutation.isPending}
                className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                {updateRateMutation.isPending ? 'Publishing...' : 'Confirm & Publish Rate'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
