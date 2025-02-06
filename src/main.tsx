import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { b2cConfig } from './authConfig' // Your existing config file
import './index.css'
import App from './App.tsx'

// Create MSAL instance
const msalInstance = new PublicClientApplication(b2cConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </StrictMode>
)