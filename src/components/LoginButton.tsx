// src/LoginButton.tsx
import { useMsal } from "@azure/msal-react";
import { apiScopes } from "../authConfig";

export const LoginButton = () => {
  const { instance } = useMsal();

  // LoginButton.tsx
const handleLogin = () => {
    // Clear any existing state
    sessionStorage.clear();
    
    instance.loginRedirect({
      scopes: apiScopes,
      prompt: 'login',
      redirectStartPage: window.location.origin + "/redirect",
      onRedirectNavigate: (url) => {
        // Force full redirect
        window.location.href = url;
        return false;
      }
    }).catch(error => {
      console.error('Login failed:', error);
    });
  }

  return <button onClick={handleLogin}>Sign In</button>
};