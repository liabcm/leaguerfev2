import { InteractionType } from '@azure/msal-browser';
import { useIsAuthenticated, useMsalAuthentication } from '@azure/msal-react';
import { Outlet } from 'react-router-dom';
import { StyledSpinner } from './SharedStyles';

const ProtectedRoute = () => {
  // Automatically trigger redirect when unauthenticated
  const { error } = useMsalAuthentication(InteractionType.Redirect);
  const isAuthenticated = useIsAuthenticated();

  // Show error if authentication failed
  if (error) {
    return <div>Authentication Error: {error.message}</div>;
  }

  // Render protected content if authenticated
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Show loading state while redirect is in progress
  return <StyledSpinner />;
};

export default ProtectedRoute;
