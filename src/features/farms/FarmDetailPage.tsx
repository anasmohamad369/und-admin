import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Phone, User, TrendingUp, Boxes, ShoppingCart, ArrowLeft, Navigation, Edit3, Trash2, ShieldCheck, X, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useFarm, useUpdateFarm, useDeleteFarm } from '../../hooks/useFarms';
import { useOrders } from '../../hooks/useOrders';
import { useLiveRates } from '../../hooks/useRates';
import { useAuth } from '../../context/AuthContext';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import { ErrorState } from '../../components/feedback/ErrorState';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export const FarmDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const { data: farm, isLoading, isError } = useFarm(id || '');
  const { data: orders = [] } = useOrders(id);
  const { data: rates = [] } = useLiveRates(id);

  const updateFarmMutation = useUpdateFarm();
  const deleteFarmMutation = useDeleteFarm();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'rates'>('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editOwnerName, setEditOwnerName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStatus, setEditStatus] = useState<'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'>('ACTIVE');
  const [editRate, setEditRate] = useState<number>(102);
  const [editStock, setEditStock] = useState<number>(10000);
  const [editRadius, setEditRadius] = useState<number>(50);
  const [editError, setEditError] = useState<string | null>(null);

  const openEditModal = () => {
    if (!farm) return;
    setEditName(farm.name || '');
    setEditCode(farm.code || '');
    setEditOwnerName(farm.ownerName || farm.contactPerson || '');
    setEditAddress(farm.address || farm.location || '');
    setEditPhone(farm.phone || '');
    setEditStatus(farm.status || 'ACTIVE');
    setEditRate(farm.currentRate ?? 102);
    setEditStock(farm.physicalStock ?? 10000);
    setEditRadius(farm.deliveryRadiusKm ?? 50);
    setEditError(null);
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farm) return;
    setEditError(null);

    try {
      await updateFarmMutation.mutateAsync({
        id: farm.id,
        payload: {
          name: editName,
          code: editCode,
          ownerName: editOwnerName,
          address: editAddress,
          phone: editPhone,
          status: editStatus,
          currentRate: editRate,
          physicalStock: editStock,
          deliveryRadiusKm: editRadius,
        },
      });
      setIsEditOpen(false);
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update farm hub.');
    }
  };

  const handleDelete = async () => {
    if (!farm) return;
    try {
      await deleteFarmMutation.mutateAsync(farm.id);
      navigate('/farms');
    } catch (err: any) {
      alert(err?.message || 'Failed to delete farm hub.');
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !farm) return <ErrorState title="Farm Not Found" message="The requested farm hub could not be found." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={farm.name}
        subtitle={`${farm.code} • ${farm.location || farm.address || ''}`}
        breadcrumbs={[
          { label: 'Farms', href: '/farms' },
          { label: farm.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={farm.status} />
            {isSuperAdmin && (
              <>
                <Button variant="outline" size="sm" onClick={openEditModal}>
                  <Edit3 className="w-4 h-4 mr-1.5 text-stone-600" /> Edit Hub
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setIsDeleteConfirmOpen(true)}>
                  <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </Button>
              </>
            )}
            <Link to="/farms">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Directory
              </Button>
            </Link>
          </div>
        }
      />

      {/* Delivery Coverage Highlight Box */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 rounded-2xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              DELIVERY COVERAGE & LOGISTICS RADIUS
            </span>
            <h3 className="text-lg font-bold text-white leading-tight">
              {farm.deliveryRadiusKm || 50} KM Delivery Radius
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Service Areas: {farm.deliverableAreas?.join(', ') || farm.city || farm.address || 'All Areas'}
            </p>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 self-start md:self-auto">
          Active Coverage Hub
        </span>
      </div>

      {/* Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase text-stone-500">Current Live Rate</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">₹{farm.currentRate ?? 0} / KG</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase text-stone-500">Physical Stock</p>
          <p className="text-2xl font-extrabold text-stone-900 mt-1">{(farm.physicalStock ?? 0).toLocaleString()} KG</p>
        </div>
        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase text-amber-800">Reserved Stock</p>
          <p className="text-2xl font-extrabold text-amber-900 mt-1">{(farm.reservedStock ?? 0).toLocaleString()} KG</p>
        </div>
        <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase text-emerald-800">Available Stock</p>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1">{(farm.availableStock ?? 0).toLocaleString()} KG</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="border-b border-stone-200 px-6 flex gap-6">
          {(['overview', 'orders', 'rates'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-emerald-700 text-stone-900 font-extrabold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab === 'overview' ? 'Farm Information & Coverage' : tab === 'orders' ? `Orders (${orders.length})` : 'Rate History'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">Facility Details</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Owner / Contact Name:</span>
                    <span className="font-bold text-stone-900">{farm.ownerName || farm.contactPerson || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Phone:</span>
                    <span className="font-bold text-stone-900">{farm.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Address / Location:</span>
                    <span className="font-bold text-stone-900">{farm.address || farm.location || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">City & State:</span>
                    <span className="font-bold text-stone-900">{farm.city ? `${farm.city}, ${farm.state || ''}` : farm.state || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">Delivery & Capacity Metrics</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Deliverable Radius:</span>
                    <span className="font-bold text-emerald-800">{farm.deliveryRadiusKm || 50} KM Radius</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Covered Areas:</span>
                    <span className="font-bold text-stone-900">{farm.deliverableAreas?.join(', ') || farm.city || farm.address || 'All Areas'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Active Orders Count:</span>
                    <span className="font-bold text-stone-900">{farm.activeOrdersCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Last Rate Sync:</span>
                    <span className="font-bold text-stone-900">{farm.updatedAt ? new Date(farm.updatedAt).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">No orders associated with this farm hub yet.</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 text-sm">{o.orderNumber}</span>
                      <p className="text-xs text-stone-500">{o.retailerName} ({o.shopName})</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-900 text-sm">{o.totalQuantityKg} KG</span>
                      <p className="text-xs text-emerald-700 font-bold">₹{(o.totalAmount ?? 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'rates' && (
            <div className="space-y-3">
              {rates.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">No live rate history recorded yet.</p>
              ) : (
                rates.map((r) => (
                  <div key={r.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">₹{r.ratePerKg} / KG</span>
                      <span className="text-stone-500 ml-2">({r.reason})</span>
                    </div>
                    <span className="text-stone-400">{r.effectiveFrom ? new Date(r.effectiveFrom).toLocaleString() : 'N/A'}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* EDIT FARM MODAL (PUT /api/v1/farms/{id}) */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 relative my-8">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Update Farm Hub</h3>
                <p className="text-xs text-stone-500">PUT /api/v1/farms/{farm.id}</p>
              </div>
            </div>

            {editError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Farm Name *</Label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} required />
                </div>
                <div>
                  <Label>Farm Code *</Label>
                  <Input value={editCode} onChange={(e) => setEditCode(e.target.value)} required />
                </div>
                <div>
                  <Label>Owner Name *</Label>
                  <Input value={editOwnerName} onChange={(e) => setEditOwnerName(e.target.value)} required />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
                </div>
                <div>
                  <Label>Status *</Label>
                  <Select value={editStatus} onValueChange={(v) => setEditStatus(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                      <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Live Rate (₹/KG) *</Label>
                  <Input type="number" value={editRate} onChange={(e) => setEditRate(Number(e.target.value))} required />
                </div>
                <div className="md:col-span-2">
                  <Label>Full Address *</Label>
                  <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} required />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateFarmMutation.isPending}>
                  {updateFarmMutation.isPending ? 'Updating...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE FARM CONFIRMATION MODAL (DELETE /api/v1/farms/{id}) */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Delete Farm Hub?</h3>
            <p className="text-xs text-stone-500 mt-2">
              Are you sure you want to delete <span className="font-bold text-stone-900">{farm.name}</span>?
              This executes <span className="font-mono text-rose-600">DELETE /api/v1/farms/{farm.id}</span>.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteFarmMutation.isPending}
              >
                {deleteFarmMutation.isPending ? 'Deleting...' : 'Delete Farm Hub'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
