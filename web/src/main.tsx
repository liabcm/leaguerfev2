import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Handle redirect promise before rendering
msalInstance
  .initialize()
  .then(() => {
    // Handle redirect response after login
    msalInstance
      .handleRedirectPromise()
      .then((tokenResponse) => {
        if (tokenResponse) {
          msalInstance.setActiveAccount(tokenResponse.account);
        }
      })
      .catch((error) => {
        console.error('Redirect promise error:', error);
      });
  })
  .catch((error) => {
    console.error('MSAL initialization error:', error);
  });

createRoot(document.getElementById('root')!).render(
  <MsalProvider instance={msalInstance}>
    <StrictMode>
      <App />
    </StrictMode>
  </MsalProvider>
);
