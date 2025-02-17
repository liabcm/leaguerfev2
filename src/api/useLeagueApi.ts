// src/hooks/useLeaguerApi.ts
import { League } from '../models/League';
import { User } from '../models/User';
import { PagedResult } from '../models/PagedResult';
import { Event } from '../models/Event';
import { useMsal } from '@azure/msal-react';
import { AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser';
import { useState, useEffect } from 'react';
import { apiScopes } from '../authConfig';
import { Sport } from '../models/Sport';

const API_BASE_URL = 'https://localhost:44378/api';

export const useLeagueApi = () => {
  const { instance } = useMsal();
  const getAuthHeader = async () => {
    // Get fresh account reference each time
    const account = instance.getActiveAccount();
    if (!account) {
      throw new Error('No active account available');
    }

    const request = {
      scopes: apiScopes.scopes,
      account: account,
    };

    try {
      const tokenResponse = await instance.acquireTokenSilent(request);
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      };
    } catch (error) {
      console.error('Token acquisition failed:', error);
      if (error instanceof InteractionRequiredAuthError) {
        const tokenResponse = await instance.acquireTokenPopup(request);
        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        };
      }
      throw error;
    }
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
      eventData: Omit<Event, 'id' | 'createdBy' | 'users'>
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

    //Sport
    createSport: async (sportData: Omit<Sport, 'id'>): Promise<Sport> => {
      const response = await fetch(`${API_BASE_URL}/sport`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify(sportData),
      });

      if (!response.ok) throw new Error('Failed to create sport');
      return response.json();
    },

    getAllSports: async (): Promise<Sport[]> => {
      const response = await fetch(`${API_BASE_URL}/sport`, {
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to fetch sports');
      return response.json();
    },

    //USER SECTION
    getCurrentUser: async (): Promise<User> => {
      const user = instance.getActiveAccount();

      const response = await fetch(
        `${API_BASE_URL}/user/${user?.localAccountId}`,
        {
          headers: await getAuthHeader(),
        }
      );

      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },

    createUser: async (): Promise<User> => {
      const user = instance.getActiveAccount();
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify({
          id: user?.idTokenClaims?.sub,
          name: user?.name,
          email: user?.username,
        }),
      });

      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
  };
};
