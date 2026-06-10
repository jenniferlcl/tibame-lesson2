import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from '@/lib/api';
import { Select } from '@/components/Select';

const DEPARTMENT_OPTIONS = ['業務部', '工程部', '管理部', '資訊部', '財務部'].map(d => ({ value: d, label: d }));
const ROLE_OPTIONS = [
  { value: 'user', label: '一般使用者' },
  { value: 'admin', label: '管理者' },
];

const EMPTY_FORM = { employee_no: '', name: '', department: '', email: '', phone: '', username: '', password: '', role: 'user' };

function EmployeeDialog({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [error, setError] = useState('');
  const isEdit = !!initial?.id;

  useEffect(() => { setForm(initial ?? EMPTY_FORM); setError(''); }, [initial, open]);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSave() {
    setError('');
    try {
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;
      if (isEdit) {
        await api.put(`/employees/${initial.id}`, payload);
      } else {
        await api.post('/employees', payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message ?? '儲存失敗');
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl shadow-xl p-6 w-full max-w-md space-y-3 max-h-[90vh] overflow-auto">
        <h3 className="font-semibold text-lg">{isEdit ? '編輯員工' : '新增員工'}</h3>
        {[
          ['employee_no','員工編號'],['name','姓名'],
          ['email','Email'],['phone','電話'],['username','帳號'],
        ].map(([k, label]) => (
          <div key={k}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input type="text" className="w-full border rounded-md px-3 py-2 text-sm" value={form[k]} onChange={set(k)} />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">部門</label>
          <Select options={DEPARTMENT_OPTIONS} value={form.department} onChange={set('department')} placeholder="選擇部門" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">密碼{isEdit && ' (留空不修改)'}</label>
          <input type="password" className="w-full border rounded-md px-3 py-2 text-sm" value={form.password} onChange={set('password')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">角色</label>
          <Select options={ROLE_OPTIONS} value={form.role} onChange={set('role')} />
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

function DeleteDialog({ open, employee, onClose, onConfirm }) {
  const [error, setError] = useState('');

  async function handleConfirm() {
    setError('');
    try { await onConfirm(); }
    catch (err) { setError(err.response?.data?.message ?? '刪除失敗'); }
  }

  useEffect(() => { setError(''); }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <h3 className="font-semibold text-lg">確認刪除</h3>
        <p className="text-sm text-muted-foreground">確定要刪除員工 <strong>{employee?.name}</strong>？此操作也會刪除對應登入帳號。</p>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-sm hover:bg-muted">取消</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm hover:opacity-90">刪除</button>
        </div>
      </div>
    </div>
  );
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState({ open: false, employee: null });
  const [delDialog, setDelDialog] = useState({ open: false, employee: null });

  async function load() {
    const { data } = await api.get('/employees', { params: search ? { search } : {} });
    setEmployees(data);
  }

  useEffect(() => { load(); }, [search]);

  async function handleDelete() {
    await api.delete(`/employees/${delDialog.employee.id}`);
    setDelDialog({ open: false, employee: null });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">員工管理</h2>
        <button onClick={() => setDialog({ open: true, employee: null })} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90">
          <Plus size={16} /> 新增員工
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
        <input className="pl-9 w-full border rounded-md px-3 py-2 text-sm" placeholder="搜尋姓名..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>{['員工編號','姓名','部門','Email','電話','帳號','角色','操作'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {employees.map(e => (
              <tr key={e.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-mono">{e.employee_no}</td>
                <td className="px-4 py-3 font-medium">{e.name}</td>
                <td className="px-4 py-3">{e.department ?? '—'}</td>
                <td className="px-4 py-3">{e.email ?? '—'}</td>
                <td className="px-4 py-3">{e.phone ?? '—'}</td>
                <td className="px-4 py-3">{e.username}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${e.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {e.role === 'admin' ? '管理者' : '一般使用者'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setDialog({ open: true, employee: e })} className="p-1.5 rounded hover:bg-muted"><Pencil size={15} /></button>
                    <button onClick={() => setDelDialog({ open: true, employee: e })} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!employees.length && <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">尚無資料</td></tr>}
          </tbody>
        </table>
      </div>

      <EmployeeDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, employee: null })}
        initial={dialog.employee}
        onSave={() => { setDialog({ open: false, employee: null }); load(); }}
      />
      <DeleteDialog
        open={delDialog.open}
        employee={delDialog.employee}
        onClose={() => setDelDialog({ open: false, employee: null })}
        onConfirm={handleDelete}
      />
    </div>
  );
}
