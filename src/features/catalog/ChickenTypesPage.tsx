import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { useChickenTypes, useCreateChickenType, useUpdateChickenType, useDeleteChickenType } from '../../hooks/useChickenTypes';
import { ChickenType } from '../../types/chickenType';
import { Plus, Edit3, Trash2, ShieldCheck, Tag, X, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export const ChickenTypesPage: React.FC = () => {
  const { data: chickenTypes = [], isLoading } = useChickenTypes();
  const createMutation = useCreateChickenType();
  const updateMutation = useUpdateChickenType();
  const deleteMutation = useDeleteChickenType();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ChickenType | null>(null);
  const [deletingType, setDeletingType] = useState<ChickenType | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [unit, setUnit] = useState('KG');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [error, setError] = useState<string | null>(null);

  const openAddModal = () => {
    setName('');
    setCode('');
    setUnit('KG');
    setStatus('ACTIVE');
    setError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (ct: ChickenType) => {
    setEditingType(ct);
    setName(ct.name);
    setCode(ct.code);
    setUnit(ct.unit || 'KG');
    setStatus(ct.status || 'ACTIVE');
    setError(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !code.trim()) {
      setError('Name and Code are required.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        name,
        code: code.toUpperCase(),
        unit,
        status,
      });
      setIsAddModalOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to create chicken type');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;
    setError(null);

    try {
      await updateMutation.mutateAsync({
        id: editingType.id,
        payload: {
          name,
          code: code.toUpperCase(),
          unit,
          status,
        },
      });
      setEditingType(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to update chicken type');
    }
  };

  const handleDelete = async () => {
    if (!deletingType) return;
    try {
      await deleteMutation.mutateAsync(deletingType.id);
      setDeletingType(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete chicken type');
    }
  };

  const filteredTypes = chickenTypes.filter(
    (ct) =>
      ct.name.toLowerCase().includes(search.toLowerCase()) ||
      ct.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<ChickenType>[] = [
    {
      header: 'ID',
      cell: (row) => <span className="font-mono text-xs font-bold text-stone-500">#{row.id}</span>,
    },
    {
      header: 'Chicken Type Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-stone-900 text-sm block">{row.name}</span>
            <span className="text-xs text-stone-400">Master Catalog Entry</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Product Code',
      cell: (row) => (
        <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-0.5 rounded border border-stone-200 text-stone-800">
          {row.code}
        </span>
      ),
    },
    {
      header: 'Unit of Measure',
      cell: (row) => <Badge variant="secondary">{row.unit || 'KG'}</Badge>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'brand' : 'outline'}>
          {row.status || 'ACTIVE'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row)}>
            <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700" onClick={() => setDeletingType(row)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chicken Types Master Catalog"
        subtitle="Configure master chicken types across all farms (/api/v1/chicken-types)"
        actions={
          <Button onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-1.5 text-emerald-400" />
            Add New Chicken Type
          </Button>
        }
      />

      <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs font-bold">Step 1: Catalog Setup Active</p>
            <p className="text-[11px] text-stone-400">
              Chicken types define the baseline product categories used for stock-in, live pricing, and retailer orders.
            </p>
          </div>
        </div>
        <Badge variant="brand">CATALOG_LEVEL_1</Badge>
      </div>

      <DataTable
        columns={columns}
        data={filteredTypes}
        keyExtractor={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or code (e.g. Broiler, CHICKEN-COUNTRY)..."
        isLoading={isLoading}
        emptyTitle="No chicken types found"
      />

      {/* CREATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-stone-900 mb-1">Create Chicken Type</h3>
            <p className="text-xs text-stone-500 mb-4">POST /api/v1/chicken-types</p>

            {error && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Chicken Type Name *</Label>
                <Input
                  required
                  placeholder="e.g. Country / Nati Chicken"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>Product Code *</Label>
                <Input
                  required
                  placeholder="e.g. CHICKEN-COUNTRY"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Unit</Label>
                  <Input value={unit} onChange={(e) => setUnit(e.target.value)} required />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-stone-100">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Type ✓'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button onClick={() => setEditingType(null)} className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-stone-900 mb-1">Update Chicken Type</h3>
            <p className="text-xs text-stone-500 mb-4">PUT /api/v1/chicken-types/{editingType.id}</p>

            {error && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label>Chicken Type Name *</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>Product Code *</Label>
                <Input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Unit</Label>
                  <Input value={unit} onChange={(e) => setUnit(e.target.value)} required />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-stone-100">
                <Button type="button" variant="outline" onClick={() => setEditingType(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Delete Chicken Type?</h3>
            <p className="text-xs text-stone-500 mt-2">
              Are you sure you want to delete <span className="font-bold text-stone-900">{deletingType.name}</span> ({deletingType.code})?
              This executes <span className="font-mono text-rose-600">DELETE /api/v1/chicken-types/{deletingType.id}</span>.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => setDeletingType(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Type'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
