// Equivale a un Guard de Angular: si no hay sesión, redirige al login y recuerda a dónde quería ir.
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="status">Cargando…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
