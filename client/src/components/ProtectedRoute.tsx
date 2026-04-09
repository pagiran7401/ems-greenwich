import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'organizer' | 'attendee';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.userType !== requiredRole) {
    // User doesn't have the required role — send them to a page they can actually see
    const fallback = user?.userType === 'organizer' ? '/dashboard' : '/my-bookings';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
