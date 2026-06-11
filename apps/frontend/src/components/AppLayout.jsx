import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.06),transparent)]">
        <Outlet />
      </main>
    </div>
  );
}
