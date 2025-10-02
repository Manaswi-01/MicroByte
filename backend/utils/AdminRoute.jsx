import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  // If the user is authenticated and their role is 'admin', render the page
  if (isAuthenticated && user?.role === 'admin') {
    return children;
  }
  
  // If user is logged in but not an admin, redirect to home with a message
  if (isAuthenticated && user?.role !== 'admin') {
    return <Navigate to="/" replace state={{ message: "You are not authorized to access this page." }} />;
  }

  // If not logged in at all, redirect to login
  return <Navigate to="/login" replace />;
}