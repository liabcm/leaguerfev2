// src/components/RedirectHandler.tsx
import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

export const RedirectHandler = () => {
  const { instance } = useMsal();

  useEffect(() => {
    instance.handleRedirectPromise()
      .then(() => {
        window.history.replaceState({}, document.title, "/");
      })
      .catch(error => {
        console.error("Redirect error:", error);
        window.location.href = "/error";
      });
  }, [instance]);

  return null; // Silent processing
};