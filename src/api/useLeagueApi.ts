// src/hooks/useLeaguerApi.ts
import { useAuth0 } from '@auth0/auth0-react';
import { League } from '../models/League';

const API_BASE_URL = 'https://localhost:44378/api';

export const useLeagueApi = () => {
  const { getAccessTokenSilently, loginWithPopup } = useAuth0();

  const getAuthHeader = async () => {
    let token;
    try {
            // Attempt to get token silently first
             token = await getAccessTokenSilently({
              authorizationParams: {
                audience: "leaguerapi",
                scope: "api-access"
              }
            });
            
          } catch (error : any) {
            if (error.error === "consent_required") {
              // If consent is needed, show login popup
              try {
                await loginWithPopup({
                  authorizationParams: {
                    audience: "leaguerapi",
                    scope: "api-access"
                  }
                });
                
                // After consent, try to get token again
                token = await getAccessTokenSilently({
                  authorizationParams: {
                    audience: "leaguerapi",
                    scope: "api-access"
                  }
                });
              } catch (popupError) {
                        console.error("Popup login error:", popupError);
                      }
                    } else {
                      console.error("Other error:", error);
                    }
                  }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  return {
    createLeague: async (leagueData: Omit<League, 'id'>): Promise<League> => {
      const response = await fetch(`${API_BASE_URL}/league`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify(leagueData),
      });

      if (!response.ok) throw new Error('Failed to create league');
      return response.json();
    },

    getLeagueById: async (id: string): Promise<League> => {
      const response = await fetch(`${API_BASE_URL}/league/${id}`, {
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to fetch league');
      return response.json();
    },

    getAllLeagues: async (): Promise<League[]> => {
      const response = await fetch(`${API_BASE_URL}/league`, {
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to fetch leagues');
      return response.json();
    },
  };
};