import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StaffRoute() {
  const { user } = useAuth();
  return user?.is_staff ? <Outlet /> : <Navigate to="/login" replace />;
}