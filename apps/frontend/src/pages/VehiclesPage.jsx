import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Select } from '@/components/Select';
import { VehicleStatusBadge } from '@/components/VehicleStatusBadge';

const STATUS_LABEL = { available: '可用', in_use: '使用中', maintenance: '維修中', retired: '報廢' };
const STATUS_OPTIONS = Object.entries(STATUS_LABEL);
const STATUS_SELECT_OPTIONS = STATUS_OPTIONS.map(([value, label]) => ({ value, label }));

const BRAND_OPTIONS = [
  'Toyota', 'Honda', 'Ford', 'Mazda', 'Nissan', 'Mitsubishi', 'BMW', 'Mercedes-Benz', '其他',
].map(b => ({ value: b, label: b }));

const EMPTY_FORM = { plate: '', brand: '', model: '', color: '', year: '', mileage: '', status: 'available', assigned_employee_id: '' };

function VehicleDialog({ open, onClose, initial, employees, onSave }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => { setForm(initial ?? EMPTY_FORM); setError(''); }, [initial, open]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSave() {
    setError('');
    try {
      const payload = {
        ...form,
        year: form.year ? parseInt(form.year) : null,
        mileage: form.mileage ? parseInt(form.mileage) : 0,
        assigned_employee_id: form.assigned_employee_id ? parseInt(form.assigned_employee_id) : null,
      };
      if (initial?.id) {
        await api.put(`/vehicles/${initial.id}`, payload);
      } else {
        await api.post('/vehicles', payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message ?? '儲存失敗');
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h3 className="font-semibold text-lg">{initial?.id ? '編輯車輛' : '新增車輛'}</h3>
        {[
          ['plate','車牌號碼','text'],['model','車型','text'],
          ['color','顏色','text'],['year','年份','number'],['mileage','里程 (km)','number'],
        ].map(([k, label, type]) => (
          <div key={k}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input type={type} className="w-full border rounded-md px-3 py-2 text-sm" value={form[k]} onChange={set(k)} />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">廠牌</label>
          <Select options={BRAND_OPTIONS} value={form.brand} onChange={set('brand')} placeholder="選擇廠牌" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">狀態</label>
          <Select options={STATUS_SELECT_OPTIONS} value={form.status} onChange={set('status')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">指派員工</label>
          <select className="w-full border rounded-md px-3 py-2 text-sm" value={form.assigned_employee_id} onChange={set('assigned_employee_id')}>
            <option value="">— 未指派 —</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.employee_no})</option>)}
          </select>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-sm hover:bg-muted">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90">儲存</button>
        </div>
      </div>
    </div>
  );
}

function DeleteDialog({ open, vehicle, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <h3 className="font-semibold text-lg">確認刪除</h3>
        <p className="text-sm text-muted-foreground">確定要刪除車輛 <strong>{vehicle?.plate}</strong>？此操作無法復原。</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-sm hover:bg-muted">取消</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm hover:opacity-90">刪除</button>
        </div>
      </div>
    </div>
  );
}

export function VehiclesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [vehicles, setVehicles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialog, setDialog] = useState({ open: false, vehicle: null });
  const [delDialog, setDelDialog] = useState({ open: false, vehicle: null });

  async function load() {
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    const { data } = await api.get('/vehicles', { params });
    setVehicles(data);
  }

  useEffect(() => {
    if (isAdmin) api.get('/employees').then(r => setEmployees(r.data)).catch(() => {});
  }, [isAdmin]);

  useEffect(() => { load(); }, [search, statusFilter]);

  async function handleDelete() {
    await api.delete(`/vehicles/${delDialog.vehicle.id}`);
    setDelDialog({ open: false, vehicle: null });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">車輛管理</h2>
        <button onClick={() => setDialog({ open: true, vehicle: null })} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90">
          <Plus size={16} /> 新增車輛
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
          <input className="pl-9 w-full border rounded-md px-3 py-2 text-sm" placeholder="搜尋車牌..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="border rounded-md px-3 py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">全部狀態</option>
          {STATUS_OPTIONS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>{['車牌','廠牌','車型','顏色','年份','里程','狀態','指派員工','操作'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {vehicles.map(v => (
              <tr key={v.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-mono">{v.plate}</td>
                <td className="px-4 py-3">{v.brand}</td>
                <td className="px-4 py-3">{v.model}</td>
                <td className="px-4 py-3">{v.color ?? '—'}</td>
                <td className="px-4 py-3">{v.year ?? '—'}</td>
                <td className="px-4 py-3">{v.mileage?.toLocaleString()} km</td>
                <td className="px-4 py-3"><VehicleStatusBadge status={v.status} /></td>
                <td className="px-4 py-3">{v.assigned_employee_name ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setDialog({ open: true, vehicle: v })} className="p-1.5 rounded hover:bg-muted"><Pencil size={15} /></button>
                    {isAdmin && <button onClick={() => setDelDialog({ open: true, vehicle: v })} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={15} /></button>}
                  </div>
                </td>
              </tr>
            ))}
            {!vehicles.length && <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">尚無資料</td></tr>}
          </tbody>
        </table>
      </div>

      <VehicleDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, vehicle: null })}
        initial={dialog.vehicle}
        employees={employees}
        onSave={() => { setDialog({ open: false, vehicle: null }); load(); }}
      />
      <DeleteDialog
        open={delDialog.open}
        vehicle={delDialog.vehicle}
        onClose={() => setDelDialog({ open: false, vehicle: null })}
        onConfirm={handleDelete}
      />
    </div>
  );
}
