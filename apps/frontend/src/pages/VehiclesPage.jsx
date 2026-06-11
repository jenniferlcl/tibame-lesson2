import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const STATUS_LABEL = { available: '可用', in_use: '使用中', maintenance: '維修中', retired: '報廢' };
const STATUS_VARIANT = { available: 'default', in_use: 'secondary', maintenance: 'outline', retired: 'outline' };
const STATUS_CLASS = {
  available: 'bg-green-100 text-green-700 border-green-200',
  in_use: 'bg-blue-100 text-blue-700 border-blue-200',
  maintenance: 'bg-amber-100 text-amber-700 border-amber-200',
  retired: 'bg-slate-100 text-slate-500 border-slate-200',
};
const STATUS_OPTIONS = Object.entries(STATUS_LABEL);
const BRAND_LIST  = ['Toyota', 'Honda', 'Ford', 'Mazda', 'Nissan', 'Mitsubishi', 'BMW', 'Mercedes-Benz', '其他'];
const COLOR_LIST  = ['白色', '銀色', '黑色', '灰色', '紅色', '藍色', '棕色', '橘色', '黃色', '綠色', '其他'];
const NO_EMPLOYEE = '__none__';
const EMPTY_FORM = { plate: '', brand: '', model: '', color: '', year: '', mileage: '', status: 'available', assigned_employee_id: NO_EMPLOYEE };

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <ArrowUpDown size={14} className="ml-1 text-slate-400" />;
  return sortDir === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
}

function VehicleDialog({ open, onClose, initial, employees, onSave }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setForm(initial ?? EMPTY_FORM); setError(''); }, [initial, open]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.plate || !form.brand || !form.model) { setError('車牌、廠牌、車型為必填'); return; }
    setError(''); setLoading(true);
    try {
      const payload = {
        ...form,
        year: form.year ? parseInt(form.year) : null,
        mileage: form.mileage ? parseInt(form.mileage) : 0,
        assigned_employee_id: (form.assigned_employee_id && form.assigned_employee_id !== NO_EMPLOYEE) ? parseInt(form.assigned_employee_id) : null,
      };
      if (initial?.id) await api.put(`/vehicles/${initial.id}`, payload);
      else await api.post('/vehicles', payload);
      onSave();
    } catch (err) {
      setError(err.response?.data?.message ?? '儲存失敗');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial?.id ? '編輯車輛' : '新增車輛'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {[['plate','車牌號碼'],['model','車型']].map(([k, label]) => (
            <div key={k} className="space-y-1.5">
              <label className="text-sm font-medium">{label}</label>
              <Input value={form[k]} onChange={e => setField(k, e.target.value)} />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">顏色</label>
            <Select value={form.color} onValueChange={v => setField('color', v)}>
              <SelectTrigger><SelectValue placeholder="選擇顏色" /></SelectTrigger>
              <SelectContent>{COLOR_LIST.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {[['year','年份','number'],['mileage','里程 (km)','number']].map(([k, label, type]) => (
            <div key={k} className="space-y-1.5">
              <label className="text-sm font-medium">{label}</label>
              <Input type={type} value={form[k]} onChange={e => setField(k, e.target.value)} />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">廠牌</label>
            <Select value={form.brand} onValueChange={v => setField('brand', v)}>
              <SelectTrigger><SelectValue placeholder="選擇廠牌" /></SelectTrigger>
              <SelectContent>{BRAND_LIST.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">狀態</label>
            <Select value={form.status} onValueChange={v => setField('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUS_OPTIONS.map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">指派員工</label>
            <Select value={form.assigned_employee_id?.toString() || ''} onValueChange={v => setField('assigned_employee_id', v)}>
              <SelectTrigger><SelectValue placeholder="— 未指派 —" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_EMPLOYEE}>— 未指派 —</SelectItem>
                {employees.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name} ({e.employee_no})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? '儲存中...' : '儲存'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function VehiclesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [vehicles, setVehicles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortCol, setSortCol] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  function toDialogVehicle(v) {
    if (!v) return null;
    return { ...v, assigned_employee_id: v.assigned_employee_id?.toString() || NO_EMPLOYEE };
  }

  const [dialog, setDialog] = useState({ open: false, vehicle: null });
  const [delVehicle, setDelVehicle] = useState(null);

  async function load() {
    const params = {};
    if (search) params.search = search;
    if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
    const { data } = await api.get('/vehicles', { params });
    setVehicles(data);
  }

  useEffect(() => {
    if (isAdmin) api.get('/employees').then(r => setEmployees(r.data)).catch(() => {});
  }, [isAdmin]);

  useEffect(() => { load(); }, [search, statusFilter]);

  function toggleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  }

  const sorted = [...vehicles].sort((a, b) => {
    if (!sortCol) return 0;
    const va = a[sortCol] ?? ''; const vb = b[sortCol] ?? '';
    const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  async function handleDelete() {
    await api.delete(`/vehicles/${delVehicle.id}`);
    setDelVehicle(null);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">車輛管理</h2>
          <p className="text-muted-foreground text-sm mt-1">共 {vehicles.length} 台車輛</p>
        </div>
        <Button onClick={() => setDialog({ open: true, vehicle: null })}>
          <Plus size={16} className="mr-2" /> 新增車輛
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
          <Input className="pl-9" placeholder="搜尋車牌..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="全部狀態" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部狀態</SelectItem>
            {STATUS_OPTIONS.map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {[['plate','車牌'],['brand','廠牌'],['model','車型'],['color','顏色'],
                ['year','年份'],['mileage','里程'],['status','狀態']].map(([col, label]) => (
                <TableHead key={col}>
                  <button className="flex items-center text-left font-medium hover:text-foreground" onClick={() => toggleSort(col)}>
                    {label}<SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
                  </button>
                </TableHead>
              ))}
              <TableHead>指派員工</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(v => (
              <TableRow key={v.id} className="border-l-2 border-l-transparent hover:border-l-brand-primary/40 transition-colors">
                <TableCell className="font-mono">{v.plate}</TableCell>
                <TableCell>{v.brand}</TableCell>
                <TableCell>{v.model}</TableCell>
                <TableCell>{v.color ?? '—'}</TableCell>
                <TableCell>{v.year ?? '—'}</TableCell>
                <TableCell>{v.mileage?.toLocaleString()} km</TableCell>
                <TableCell>
                  <Badge className={STATUS_CLASS[v.status] ?? ''} variant="outline">
                    {STATUS_LABEL[v.status] ?? v.status}
                  </Badge>
                </TableCell>
                <TableCell>{v.assigned_employee_name ?? '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setDialog({ open: true, vehicle: toDialogVehicle(v) })}>
                      <Pencil size={15} />
                    </Button>
                    {isAdmin && (
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDelVehicle(v)}>
                        <Trash2 size={15} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!sorted.length && (
              <TableRow><TableCell colSpan={9} className="py-8 text-center text-muted-foreground">尚無車輛資料</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <VehicleDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, vehicle: null })}
        initial={dialog.vehicle}
        employees={employees}
        onSave={() => { setDialog({ open: false, vehicle: null }); load(); }}
      />

      <AlertDialog open={!!delVehicle} onOpenChange={v => !v && setDelVehicle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除</AlertDialogTitle>
            <AlertDialogDescription>
              確定要刪除車輛 <strong>{delVehicle?.plate}</strong>？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">刪除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
