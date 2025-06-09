import { Navigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
console.log('PublicRoute user:', user);
  if (user?.role === 'ROLE_ADMIN') return <Navigate to="/admin" />;
  if (user?.role === 'ROLE_USER') return <Navigate to="/user" />;

  return children;
}
// PublicRoute.js

