import { useMsal } from "@azure/msal-react";

export const LogoutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    try {
      // Clear local state regardless of auth status
      sessionStorage.clear();
      
      // Attempt logout only if authenticated
      const account = instance.getActiveAccount();
      if (account) {
        instance.logoutRedirect({
          postLogoutRedirectUri: window.location.origin,
          account: account
        });
      } else {
        // Redirect to home if no session exists
        window.location.href = "/";
      }
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = "/error";
    }
  };

  return <button onClick={handleLogout}>Sign Out</button>;
};