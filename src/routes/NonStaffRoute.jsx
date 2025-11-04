import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Allows access only to authenticated users who are NOT staff/admins.
// If there is no user, or the user is staff, redirect to /login.
export default function NonStaffRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.is_staff) {
    // Block staff users from entering the shopping/Home area
    return <Navigate to="/login" replace />;
  }

  return children;
}
