import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  // Redirect to home after successful login
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};
export default ProtectedRoute;
