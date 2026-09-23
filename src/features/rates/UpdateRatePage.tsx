import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { useFarms } from '../../hooks/useFarms';
import { useChickenTypes, useCreateChickenType } from '../../hooks/useChickenTypes';
import { usePublishRate } from '../../hooks/useRates';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export const UpdateRatePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: farms = [] } = useFarms();
  const { data: chickenTypes = [] } = useChickenTypes();
  const publishRateMutation = usePublishRate();
  const createChickenTypeMutation = useCreateChickenType();

  const [farmId, setFarmId] = useState<string>('');
  const [chickenTypeId, setChickenTypeId] = useState<string>('');
  const [ratePerKg, setRatePerKg] = useState<number>(125.0);
  const [discountPerKg, setDiscountPerKg] = useState<number>(15.0);
  const [currency] = useState<string>('INR');
  const [reason, setReason] = useState<string>('Market surge & feed cost adjustment');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Chicken Type modal state
  const [isAddTypeOpen, setIsAddTypeOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeCode, setNewTypeCode] = useState('');

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

  const selectedFarm = farms.find((f) => String(f.id) === String(farmId)) || farms[0];
  const selectedType = chickenTypes.find((t) => String(t.id) === String(chickenTypeId)) || chickenTypes[0];

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!farmId) {
      setError('Farm selection is required.');
      return;
    }
    if (!chickenTypeId) {
      setError('Chicken Type selection is required.');
      return;
    }
    if (!ratePerKg || ratePerKg <= 0) {
      setError('Rate per KG must be greater than 0.');
      return;
    }
    if (!reason.trim()) {
      setError('Reason for rate update is required.');
      return;
    }

    setShowConfirm(true);
  };

  const handlePublish = async () => {
    try {
      const originalRate = Number(ratePerKg); // Base price per KG
      const discountAmt = Number(discountPerKg); // Flat discount per KG
      const finalRate = Math.max(0, originalRate - discountAmt);

      await publishRateMutation.mutateAsync({
        farmId: isNaN(Number(farmId)) ? farmId : Number(farmId),
        chickenTypeId: isNaN(Number(chickenTypeId)) ? chickenTypeId : Number(chickenTypeId),
        originalRatePerKg: originalRate,
        discountPerKg: discountAmt,
        ratePerKg: finalRate,
        currency,
        reason,
      });
      navigate('/rates');
    } catch (err: any) {
      setError(err?.message || 'Failed to publish live rate.');
      setShowConfirm(false);
    }
  };

  const handleCreateChickenType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim() || !newTypeCode.trim()) return;
    try {
      const created = await createChickenTypeMutation.mutateAsync({
        name: newTypeName,
        code: newTypeCode.toUpperCase(),
        unit: 'KG',
        status: 'ACTIVE',
      });
      setChickenTypeId(String(created.id));
      setIsAddTypeOpen(false);
      setNewTypeName('');
      setNewTypeCode('');
    } catch (err: any) {
      alert(err?.message || 'Failed to create chicken type');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Update Live Chicken Rate"
        subtitle="Dedicated page to revise live pricing across farm hubs (POST /api/v1/rates)"
        breadcrumbs={[
          { label: 'Live Rates', href: '/rates' },
          { label: 'Update Live Rate' },
        ]}
        actions={
          <Link to="/rates">
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

      <div className="bg-white rounded-2xl border border-stone-200/80 p-8 shadow-xs">
        {!showConfirm ? (
          <form onSubmit={handleReview} className="space-y-5">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" /> Rate Specification
            </h3>

            <div>
              <Label>Select Farm Hub *</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Chicken Type (POST /api/v1/chicken-types) *</Label>
                  <button
                    type="button"
                    onClick={() => setIsAddTypeOpen(true)}
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add New
                  </button>
                </div>
                <Select value={chickenTypeId} onValueChange={setChickenTypeId}>
                  <SelectTrigger>
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

              <div>
                <Label>New Rate / KG (₹) *</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                    ₹
                  </span>
                  <Input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={ratePerKg}
                    onChange={(e) => setRatePerKg(Number(e.target.value))}
                    className="pl-9 font-extrabold text-stone-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Reason for Rate Update *</Label>
              <Input
                type="text"
                required
                placeholder="e.g. Market surge & feed cost adjustment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <Link to="/rates">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" size="lg">
                Review Rate Update →
              </Button>
            </div>
          </form>
        ) : (
          /* Confirmation Step */
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-700 border-b border-stone-100 pb-3">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-lg font-bold text-stone-900">Review & Confirm Rate Publication</h3>
            </div>

            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4">
              <div className="flex justify-between text-xs font-medium text-stone-600">
                <span>Target Farm:</span>
                <span className="font-bold text-stone-900 text-sm">{selectedFarm?.name || farmId}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-stone-600">
                <span>Chicken Type:</span>
                <span className="font-bold text-stone-900">{selectedType?.name || chickenTypeId} ({selectedType?.code})</span>
              </div>

              <div className="flex items-center justify-center gap-6 py-4 bg-white rounded-xl border border-stone-200 text-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-emerald-700">New Published Rate</p>
                  <p className="text-3xl font-extrabold text-emerald-700">₹{ratePerKg} / KG</p>
                </div>
              </div>

              <div className="text-xs text-stone-600 space-y-1 pt-2 border-t border-stone-200/60">
                <p><strong>Reason:</strong> {reason}</p>
                <p><strong>Currency:</strong> {currency}</p>
                <p><strong>WebSocket Broadcast:</strong> Enabled (live notification on publication)</p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>
                Back to Edit
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={publishRateMutation.isPending}
                size="lg"
              >
                {publishRateMutation.isPending ? 'Publishing...' : 'Confirm & Publish Live Rate'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE CHICKEN TYPE MODAL */}
      {isAddTypeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">Add New Chicken Type</h3>
            <p className="text-xs text-stone-500 mb-4">POST /api/v1/chicken-types</p>

            <form onSubmit={handleCreateChickenType} className="space-y-4">
              <div>
                <Label>Chicken Type Name *</Label>
                <Input
                  required
                  placeholder="e.g. Broiler Live Chicken"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                />
              </div>
              <div>
                <Label>Chicken Type Code *</Label>
                <Input
                  required
                  placeholder="e.g. CHICKEN-BROILER"
                  value={newTypeCode}
                  onChange={(e) => setNewTypeCode(e.target.value)}
                  className="font-mono font-bold"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-stone-100">
                <Button type="button" variant="outline" onClick={() => setIsAddTypeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createChickenTypeMutation.isPending}>
                  {createChickenTypeMutation.isPending ? 'Creating...' : 'Create Type'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
