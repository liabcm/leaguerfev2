// src/hooks/useLeaguerApi.ts
import { useAuth0 } from '@auth0/auth0-react';
import { League } from '../models/League';
import { User } from '../models/User';
import { PagedResult } from '../models/PagedResult';
import { Event } from '../models/Event';

const API_BASE_URL = 'https://localhost:44378/api';

export const useLeagueApi = () => {
  const { getAccessTokenSilently, loginWithPopup, user } = useAuth0();

  const getAuthHeader = async () => {
    let token;
    try {
      // Attempt to get token silently first
      token = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'leaguerapi',
          scope: 'api-access',
          prompt: 'consent',
        },
      });
    } catch (error: any) {
      if (error.error === 'consent_required') {
        console.log('maybe');
        // If consent is needed, show login popup
        try {
          await loginWithPopup({
            authorizationParams: {
              audience: 'leaguerapi',
              scope: 'api-access',
            },
          });
          console.log('are we here');

          // After consent, try to get token again
          token = await getAccessTokenSilently({
            authorizationParams: {
              audience: 'leaguerapi',
              scope: 'api-access',
            },
          });
        } catch (popupError) {
          console.error('Popup login error:', popupError);
        }
      } else {
        console.error('Other error:', error);
      }
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  return {
    //leagues
    createLeague: async (leagueData: Omit<League, 'id'>): Promise<League> => {
      //console.log(user);
      const response = await fetch(`${API_BASE_URL}/league`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify({
          ...leagueData,
        }),
      });

      if (!response.ok) throw new Error('Failed to create league');
      return response.json();
    },

    editLeague: async (leagueData: League): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/league`, {
        method: 'PUT',
        headers: await getAuthHeader(),
        body: JSON.stringify(leagueData),
      });

      if (!response.ok) throw new Error('Failed to create league');
      return;
    },

    getLeagueById: async (id: string): Promise<League> => {
      const response = await fetch(`${API_BASE_URL}/league/${id}`, {
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to fetch league');
      return response.json();
    },

    getMyLeagues: async (): Promise<League[]> => {
      const response = await fetch(`${API_BASE_URL}/league/my-leagues`, {
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to fetch league');
      return response.json();
    },

    getJoinedLeagues: async (): Promise<League[]> => {
      const response = await fetch(`${API_BASE_URL}/league/joined`, {
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to fetch league');
      return response.json();
    },

    getAllLeagues: async (
      searchTerm: string,
      page: number,
      pageSize: number
    ): Promise<PagedResult> => {
      let url = `${API_BASE_URL}/league`;
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('searchTerm', searchTerm);
      }
      if (page) {
        params.append('page', page.toString());
      }
      if (pageSize) {
        params.append('pageSize', pageSize.toString());
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await fetch(url, {
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to fetch leagues');
      return response.json();
    },

    joinLeague: async (leagueId: string): Promise<boolean> => {
      const response = await fetch(`${API_BASE_URL}/league/${leagueId}/join`, {
        method: 'POST',
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to join league');
      return response.json();
    },

    leaveLeague: async (leagueId: string): Promise<boolean> => {
      const response = await fetch(`${API_BASE_URL}/league/${leagueId}/leave`, {
        method: 'POST',
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to leave league');
      return response.json();
    },

    //events
    createEvent: async (
      eventData: Omit<Event, 'id' | 'createdBy'>
    ): Promise<Event> => {
      const response = await fetch(`${API_BASE_URL}/event`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify({
          ...eventData,
        }),
      });

      if (!response.ok) throw new Error('Failed to create league');
      return response.json();
    },

    //USER SECTION
    getCurrentUser: async (): Promise<User> => {
      console.log(user);
      const response = await fetch(
        `${API_BASE_URL}/user/${user?.internal_id}`,
        {
          headers: await getAuthHeader(),
        }
      );

      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },

    createUser: async (): Promise<User> => {
      //console.log(user);
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify({
          id: user?.internal_id,
          name: user?.name,
          email: user?.email,
        }),
      });

      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
  };
};
