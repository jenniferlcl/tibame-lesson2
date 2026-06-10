import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (user === undefined) return null; // loading
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user } = useAuth();
  if (user === undefined) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}
