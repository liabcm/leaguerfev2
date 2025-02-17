import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig'; // We'll add this to authConfig.ts

const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error('Login failed:', error);
    });
  };

  return <button onClick={handleLogin}>Log In</button>;
};

export default LoginButton;
