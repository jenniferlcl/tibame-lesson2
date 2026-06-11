import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DEPARTMENT_LIST = ['業務部', '工程部', '管理部', '資訊部', '財務部'];
const EMPTY_FORM = { employee_no: '', name: '', department: '', email: '', phone: '', username: '', password: '', role: 'user' };

function EmployeeDialog({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEdit = !!initial?.id;

  useEffect(() => { setForm(initial ?? EMPTY_FORM); setError(''); }, [initial, open]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!isEdit && (!form.employee_no || !form.name || !form.username || !form.password)) {
      setError('員工編號、姓名、帳號、密碼為必填'); return;
    }
    setError(''); setLoading(true);
    try {
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;
      if (isEdit) await api.put(`/employees/${initial.id}`, payload);
      else await api.post('/employees', payload);
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
          <DialogTitle>{isEdit ? '編輯員工' : '新增員工'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {[['employee_no','員工編號'],['name','姓名'],['email','Email'],['phone','電話'],['username','帳號']].map(([k, label]) => (
            <div key={k} className="space-y-1.5">
              <label className="text-sm font-medium">{label}</label>
              <Input value={form[k]} onChange={e => setField(k, e.target.value)} />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">部門</label>
            <Select value={form.department} onValueChange={v => setField('department', v)}>
              <SelectTrigger><SelectValue placeholder="選擇部門" /></SelectTrigger>
              <SelectContent>{DEPARTMENT_LIST.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">密碼{isEdit && ' (留空不修改)'}</label>
            <Input type="password" value={form.password} onChange={e => setField('password', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">角色</label>
            <Select value={form.role} onValueChange={v => setField('role', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="user">一般使用者</SelectItem>
                <SelectItem value="admin">管理者</SelectItem>
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

export function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState({ open: false, employee: null });
  const [delEmployee, setDelEmployee] = useState(null);
  const [delError, setDelError] = useState('');

  async function load() {
    const { data } = await api.get('/employees', { params: search ? { search } : {} });
    setEmployees(data);
  }

  useEffect(() => { load(); }, [search]);

  async function handleDelete() {
    setDelError('');
    try {
      await api.delete(`/employees/${delEmployee.id}`);
      setDelEmployee(null);
      load();
    } catch (err) {
      setDelError(err.response?.data?.message ?? '刪除失敗');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">員工管理</h2>
          <p className="text-muted-foreground text-sm mt-1">共 {employees.length} 位員工</p>
        </div>
        <Button onClick={() => setDialog({ open: true, employee: null })}>
          <Plus size={16} className="mr-2" /> 新增員工
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
        <Input className="pl-9" placeholder="搜尋姓名..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {['員工編號','姓名','部門','Email','電話','帳號','角色','操作'].map(h => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map(e => (
              <TableRow key={e.id} className="border-l-2 border-l-transparent hover:border-l-brand-primary/40 transition-colors">
                <TableCell className="font-mono">{e.employee_no}</TableCell>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell>{e.department ?? '—'}</TableCell>
                <TableCell>{e.email ?? '—'}</TableCell>
                <TableCell>{e.phone ?? '—'}</TableCell>
                <TableCell>{e.username}</TableCell>
                <TableCell>
                  <Badge className={e.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'} variant="outline">
                    {e.role === 'admin' ? '管理者' : '一般使用者'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setDialog({ open: true, employee: e })}>
                      <Pencil size={15} />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => { setDelError(''); setDelEmployee(e); }}>
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!employees.length && (
              <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">尚無員工資料</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EmployeeDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, employee: null })}
        initial={dialog.employee}
        onSave={() => { setDialog({ open: false, employee: null }); load(); }}
      />

      <AlertDialog open={!!delEmployee} onOpenChange={v => !v && setDelEmployee(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除</AlertDialogTitle>
            <AlertDialogDescription>
              確定要刪除員工 <strong>{delEmployee?.name}</strong>？此操作也會刪除對應登入帳號。
            </AlertDialogDescription>
          </AlertDialogHeader>
          {delError && <p className="text-destructive text-sm px-1">{delError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDelError('')}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">刪除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
