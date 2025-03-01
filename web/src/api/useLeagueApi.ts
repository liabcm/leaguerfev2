// src/hooks/useLeaguerApi.ts
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { apiScopes } from '../authConfig';
import { Event } from '../models/Event';
import { League } from '../models/League';
import { PagedResult } from '../models/PagedResult';
import { Sport } from '../models/Sport';
import { Team } from '../models/Team';
import { TeamCreateDTO, TeamUpdateDTO } from '../models/TeamCreateDTO';
import { TeamUser } from '../models/TeamUser';
import { User } from '../models/User';

const API_BASE_URL =
  'https://leaguerapi-e3ekc8h6crcsd8ea.canadacentral-01.azurewebsites.net/api/v1';

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

    kickFromLeague: async (
      leagueId: string,
      memberId: string
    ): Promise<boolean> => {
      const params = new URLSearchParams();
      params.append('userIdToKick', memberId);
      const url = `${API_BASE_URL}/league/${leagueId}/leave?${params.toString()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to leave league');
      return response.json();
    },

    inviteUserToLeague: async (
      leagueId: string,
      userId: string,
      isInvite: boolean
    ): Promise<boolean> => {
      const response = await fetch(
        `${API_BASE_URL}/league/invite-user?leagueId=${leagueId}&userId=${userId}&isInvite=${isInvite}`,
        {
          method: 'POST',
          headers: await getAuthHeader(),
        }
      );

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || 'Failed to invite user');
      }

      const result = await response.json();
      return result.data;
    },

    declineInvite: async (
      leagueId: string,
      userId: string
    ): Promise<boolean> => {
      const response = await fetch(`${API_BASE_URL}/user/decline`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify({
          leagueId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || 'Failed to decline invite');
      }

      const result = await response.json();
      return result.data; // Extract the boolean from Response<bool>
    },

    acceptInvite: async (
      leagueId: string,
      userId: string
    ): Promise<boolean> => {
      const response = await fetch(`${API_BASE_URL}/user/accept`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify({
          leagueId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || 'Failed to accept invite');
      }

      const result = await response.json();
      return result.data; // Extract the boolean from Response<bool>
    },

    //events
    createEvent: async (
      eventData: Omit<Event, 'id' | 'createdBy' | 'users' | 'teams'>
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

    searchUsers: async (
      leagueId: string,
      searchTerm: string,
      page: number = 1,
      pageSize: number = 10
    ): Promise<PagedResult> => {
      let url = `${API_BASE_URL}/user/search`;
      const params = new URLSearchParams();
      params.append('leagueId', leagueId);

      if (searchTerm) {
        params.append('q', searchTerm);
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
      console.log(url);

      const response = await fetch(url, {
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to search users');
      return response.json();
    },

    searchUsersForTeamInvite: async (
      teamId: string,
      searchTerm: string,
      page: number = 1,
      pageSize: number = 10
    ): Promise<PagedResult> => {
      let url = `${API_BASE_URL}/user/search-team`;
      const params = new URLSearchParams();
      params.append('teamId', teamId);

      if (searchTerm) {
        params.append('q', searchTerm);
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
      console.log(url);

      const response = await fetch(url, {
        headers: await getAuthHeader(),
      });

      if (!response.ok) throw new Error('Failed to search users');
      return response.json();
    },

    getCurrentUserInvites: async (): Promise<any[]> => {
      const response = await fetch(`${API_BASE_URL}/user/current-invites`, {
        headers: await getAuthHeader(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || 'Failed to fetch invites');
      }

      const result = await response.json();
      return result.data;
    },

    //TEAM SECTION
    createTeam: async (teamData: TeamCreateDTO): Promise<Team> => {
      const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify(teamData),
      });

      if (!response.ok) throw new Error('Failed to create team');
      return response.json();
    },

    getTeamById: async (id: string): Promise<Team> => {
      const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        headers: await getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to fetch team');
      return response.json();
    },

    updateTeam: async (teamData: TeamUpdateDTO): Promise<Team> => {
      const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'PUT',
        headers: await getAuthHeader(),
        body: JSON.stringify(teamData),
      });

      if (!response.ok) throw new Error('Failed to update team');
      return response.json();
    },

    sendTeamRequest: async (
      teamName: string,
      leagueId: string
    ): Promise<boolean> => {
      const response = await fetch(`${API_BASE_URL}/team/request`, {
        method: 'POST',
        headers: await getAuthHeader(),
        body: JSON.stringify({ teamName, leagueId }),
      });
      if (!response.ok) throw new Error('Failed to send team request');
      return response.json();
    },

    acceptTeamRequest: async (teamId: string): Promise<boolean> => {
      const response = await fetch(`${API_BASE_URL}/team/accept/${teamId}`, {
        method: 'POST',
        headers: await getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to accept team request');
      return response.json();
    },

    getMyTeams: async (): Promise<Team[]> => {
      const response = await fetch(`${API_BASE_URL}/team/my-teams`, {
        headers: await getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to fetch my teams');
      return response.json();
    },

    inviteOrRequestUserToTeam: async (
      teamId: string,
      userId: string,
      isInvite: boolean
    ): Promise<boolean> => {
      const response = await fetch(
        `${API_BASE_URL}/team/invite-request?teamId=${teamId}&userId=${userId}&isInvite=${isInvite}`,
        {
          method: 'POST',
          headers: await getAuthHeader(),
        }
      );
      if (!response.ok)
        throw new Error('Failed to invite or request user to team');
      return response.json();
    },

    getCurrentUserTeamInvites: async (): Promise<TeamUser[]> => {
      const response = await fetch(
        `${API_BASE_URL}/user/current-team-invites`,
        {
          headers: await getAuthHeader(),
        }
      );
      if (!response.ok)
        throw new Error('Failed to fetch current user team invites');
      return response.json();
    },

    declineTeamInvite: async (
      teamId: string,
      userId: string
    ): Promise<boolean> => {
      const response = await fetch(
        `${API_BASE_URL}/team/decline?teamId=${teamId}&userId=${userId}`,
        {
          method: 'POST',
          headers: await getAuthHeader(),
        }
      );
      if (!response.ok) throw new Error('Failed to decline team invite');
      return response.json();
    },

    acceptTeamInvite: async (
      teamId: string,
      userId: string
    ): Promise<boolean> => {
      const response = await fetch(
        `${API_BASE_URL}/team/accept-invite?teamId=${teamId}&userId=${userId}`,
        {
          method: 'POST',
          headers: await getAuthHeader(),
        }
      );
      if (!response.ok) throw new Error('Failed to accept team invite');
      return response.json();
    },

    leaveTeam: async (
      teamId: string,
      userIdToKick?: string
    ): Promise<boolean> => {
      const url = userIdToKick
        ? `${API_BASE_URL}/team/${teamId}/leave?userIdToKick=${userIdToKick}`
        : `${API_BASE_URL}/team/${teamId}/leave`;
      const response = await fetch(url, {
        method: 'POST',
        headers: await getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to leave team');
      return response.json();
    },
  };
};
