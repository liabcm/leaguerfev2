import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain='dev-17vjnirqr7rdq6n1.us.auth0.com'
    clientId='qScLc4V8Q3MoXIe17X9Q8W1wgdUBN3Pt'
    authorizationParams={{
      redirect_uri: window.location.origin + '/',
      scope: 'openid profile email',
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </Auth0Provider>
);
