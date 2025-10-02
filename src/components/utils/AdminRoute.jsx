import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  
  // The check is now much more reliable
  if (isAuthenticated && user?.role === 'admin') {
    return children;
  }
  
  // If not an admin, redirect to home page as they might be a logged in user
  return <Navigate to="/" replace />;
}