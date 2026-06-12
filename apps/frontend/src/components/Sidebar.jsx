import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, Users, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItem = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150';

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <aside className="w-60 shrink-0 bg-white border-r flex flex-col h-screen sticky top-0 shadow-sm">
      <div className="p-5 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Car size={17} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 leading-tight">VMS 車隊管理</h1>
            <p className="text-xs text-slate-400 truncate max-w-[120px]">
              {user?.username} · {user?.role === 'admin' ? '管理者' : '一般使用者'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => cn(navItem, isActive
            ? 'bg-brand-primary/10 text-brand-primary font-semibold'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          <LayoutDashboard size={18} /> 儀表板
        </NavLink>
        <NavLink
          to="/vehicles"
          className={({ isActive }) => cn(navItem, isActive
            ? 'bg-brand-primary/10 text-brand-primary font-semibold'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          <Car size={18} /> 車輛管理
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink
            to="/employees"
            className={({ isActive }) => cn(navItem, isActive
              ? 'bg-brand-primary/10 text-brand-primary font-semibold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Users size={18} /> 員工管理
          </NavLink>
        )}
        {user?.role === 'admin' && (
          <NavLink
            to="/audit-log"
            className={({ isActive }) => cn(navItem, isActive
              ? 'bg-brand-primary/10 text-brand-primary font-semibold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <ClipboardList size={18} /> 操作紀錄
          </NavLink>
        )}
      </nav>

      <div className="p-3 border-t border-border-subtle">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} /> 登出
        </Button>
      </div>
    </aside>
  );
}
