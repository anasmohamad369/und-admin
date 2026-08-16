import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowLeft, ShieldCheck, Navigation, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { useCreateFarm } from '../../hooks/useFarms';
import { useStates, useCitiesForState } from '../../hooks/useCities';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export const OnboardFarmPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const createFarmMutation = useCreateFarm();

  const isSuperAdmin = role === 'SUPER_ADMIN';

  const allStates = useStates();

  // Default: Andhra Pradesh (isoCode = 'AP')
  const [selectedStateCode, setSelectedStateCode] = useState('AP');
  const [selectedCity, setSelectedCity] = useState('Vijayawada');

  const cities = useCitiesForState(selectedStateCode);
  const selectedStateName = useMemo(
    () => allStates.find((s) => s.isoCode === selectedStateCode)?.name || 'Andhra Pradesh',
    [allStates, selectedStateCode]
  );

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [currentRate, setCurrentRate] = useState<number>(102);
  const [physicalStock, setPhysicalStock] = useState<number>(10000);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState<number>(50);
  const [deliverableAreasText, setDeliverableAreasText] = useState('Vijayawada, Guntur, Eluru');

  const [error, setError] = useState<string | null>(null);

  const handleStateChange = (isoCode: string) => {
    setSelectedStateCode(isoCode);
    setSelectedCity(''); // reset city when state changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSuperAdmin) { setError('Super Admin privileges are required to onboard a new farm.'); return; }
    if (!name.trim()) { setError('Farm Name is required.'); return; }
    if (!code.trim()) { setError('Farm Code is required.'); return; }
    if (!contactPerson.trim() || !phone.trim()) { setError('Contact person details are required.'); return; }
    if (!selectedCity.trim()) { setError('City / Circle selection is required.'); return; }
    if (!selectedStateCode.trim()) { setError('State selection is required.'); return; }
    if (!location.trim()) { setError('Location address is required.'); return; }
    if (!deliveryRadiusKm || deliveryRadiusKm <= 0) { setError('Delivery radius must be greater than 0 KM.'); return; }

    const deliverableAreas = deliverableAreasText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const newFarm = await createFarmMutation.mutateAsync({
        name,
        code,
        ownerName: contactPerson,
        address: location,
        status: 'ACTIVE',
        phone,
        city: selectedCity,
        state: selectedStateName,
        currentRate: Number(currentRate),
        physicalStock: Number(physicalStock),
        deliveryRadiusKm: Number(deliveryRadiusKm),
        deliverableAreas,
      });
      navigate(`/farms/${newFarm.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to onboard farm.');
    }
  };

  if (!isSuperAdmin) {
    return (
      <Card className="max-w-xl mx-auto p-8 text-center my-12 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          403
        </div>
        <h2 className="text-xl font-bold text-stone-900">Super Admin Privilege Required</h2>
        <p className="text-sm text-stone-500 mt-2">
          Only Super Administrator accounts are authorized to onboard new farm hubs and set delivery radiuses.
        </p>
        <div className="mt-6">
          <Link to="/farms">
            <Button variant="default">Back to Farms Directory</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Farm Onboarding Page"
        subtitle="Setup page for new farm supply hubs and deliverable coverage radius"
        breadcrumbs={[
          { label: 'Farms', href: '/farms' },
          { label: 'Onboard New Farm' },
        ]}
        actions={
          <Link to="/farms">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Cancel & Return
            </Button>
          </Link>
        }
      />

      {/* Super Admin Access Banner */}
      <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs font-bold text-white">Super Admin Authorization Active</p>
            <p className="text-[11px] text-stone-400">Onboarding initializes core pricing contracts & stock ledgers</p>
          </div>
        </div>
        <Badge variant="brand">SUPER_ADMIN_MODE</Badge>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Section 1: Farm Identity */}
            <div>
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" /> 1. Farm Hub Identity & Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-1.5">
                  <Label>Farm Hub Name *</Label>
                  <Input
                    required
                    placeholder="e.g. NutriFarm Andhra Hub 01"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Farm Code *</Label>
                  <Input
                    required
                    placeholder="e.g. NF-AP01"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-bold font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Contact Person Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Ravi Kumar"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Contact Phone *</Label>
                  <Input
                    required
                    placeholder="e.g. 9898011223"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* State Dropdown — first, drives city list */}
                <div className="space-y-1.5">
                  <Label>State *</Label>
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

                {/* City Dropdown — populated by selected state */}
                <div className="space-y-1.5">
                  <Label>City / Circle *</Label>
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

                <div className="md:col-span-2 space-y-1.5">
                  <Label>Full Location Address *</Label>
                  <Input
                    required
                    placeholder="e.g. NH-16 Highway, Vijayawada"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Initial Stock */}
            <div>
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" /> 2. Pricing & Initial Physical Stock
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Initial Live Rate / KG (₹) *</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={currentRate}
                    onChange={(e) => setCurrentRate(Number(e.target.value))}
                    className="font-bold text-stone-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Initial Physical Stock Capacity (KG) *</Label>
                  <Input
                    type="number"
                    min="100"
                    step="500"
                    required
                    value={physicalStock}
                    onChange={(e) => setPhysicalStock(Number(e.target.value))}
                    className="font-bold text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Delivery Radius & Coverage */}
            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-4">
              <h3 className="text-sm font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-700" /> 3. Logistics Delivery Radius & Coverage Setup
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Delivery Radius (KM) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="5"
                      max="300"
                      required
                      value={deliveryRadiusKm}
                      onChange={(e) => setDeliveryRadiusKm(Number(e.target.value))}
                      className="w-full font-bold bg-white"
                    />
                    <span className="text-xs font-bold text-stone-600 whitespace-nowrap">KM</span>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label>Deliverable Service Areas / Cities (Comma Separated) *</Label>
                  <Input
                    required
                    placeholder="e.g. Vijayawada, Guntur, Eluru"
                    value={deliverableAreasText}
                    onChange={(e) => setDeliverableAreasText(e.target.value)}
                    className="bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <Link to="/farms">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={createFarmMutation.isPending} size="lg">
                {createFarmMutation.isPending ? 'Onboarding Farm...' : 'Complete Farm Onboarding ✓'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
