import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return children;
}
