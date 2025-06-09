// routes/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.role)) {
    return user.role === 'ROLE_ADMIN' ? <Navigate to="/admin/signup-requests" /> : <Navigate to="/user" />;
  }

  return children;
}
