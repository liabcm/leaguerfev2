import { AccountInfo } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';

const Profile = () => {
  const { instance, inProgress } = useMsal();
  const [user, setUser] = useState<AccountInfo | null>(null);

  // Check if authentication is still in progress
  if (inProgress === 'login') {
    return <div>Loading ...</div>;
  }

  // Use useEffect to handle the active account after the component mounts
  useEffect(() => {
    // Get the active account
    const activeAccount = instance.getActiveAccount();
    if (activeAccount) {
      setUser(activeAccount);
    }
  }, [instance]);

  // Check if the user is authenticated
  const isAuthenticated = !!user;

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    isAuthenticated && (
      <div>
        <button onClick={handleLogout}>Logout</button>
        <p>Welcome, {user?.name}!</p>
        <p>Email: {user?.username}</p>
      </div>
    )
  );
};

export default Profile;
