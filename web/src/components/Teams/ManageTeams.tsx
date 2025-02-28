import { Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { PagedResult } from '../../models/PagedResult';
import { Team } from '../../models/Team';
import { User } from '../../models/User';
import EventResultsSection from '../Events/EventResultsSection';
import LeagueEventsSection from '../League/LeagueEventsSection';
import LeagueMembersSection from '../League/LeagueMembersSection';
import SearchUsersModal from '../League/SearchUsersModal';
import {
  Card,
  Header,
  InfoItem,
  TabButton,
  Tabs,
  Title,
} from '../League/SharedLeagueStyles';

const ManageTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'roster' | 'upcoming' | 'results'>(
    'roster'
  );
  const [showSearchUsersModal, setShowSearchUsersModal] = useState(false);
  const { getMyTeams, searchUsersForTeamInvite, inviteOrRequestUserToTeam } =
    useLeagueApi();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getMyTeams();
        setTeams(data);
        const teamId = searchParams.get('teamId');
        if (teamId) {
          const team = data.find((t) => t.id === teamId);
          setSelectedTeam(team || null);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    setActiveTab('roster');
  }, [selectedTeam?.id]);

  const handleTeamSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = e.target.value;
    setSearchParams(teamId ? { teamId } : {});
    setSelectedTeam(teams.find((t) => t.id === teamId) || null);
  };

  // Convert team to League format for LeagueMembersSection
  const teamToLeague = (team: Team) => {
    return {
      id: team.id,
      name: team.name,
      leagueMembers: [...team.teamUsers, ...team.teamManagers],
    } as any;
  };

  const handleInviteUserToTeam = async (user: User): Promise<void> => {
    try {
      await inviteOrRequestUserToTeam(selectedTeam?.id!, user.id, true);
    } catch (error) {
      console.error('Error inviting user to team:', error);
    }
  };

  const handleSearchUsers = async (
    query: string,
    pageNum: number
  ): Promise<PagedResult> => {
    return await searchUsersForTeamInvite(selectedTeam?.id!, query, pageNum);
  };

  return (
    <Container>
      <Select onChange={handleTeamSelect}>
        <option value=''>Select a team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </Select>

      {selectedTeam && (
        <Card>
          <Header>
            <Title>
              {selectedTeam.name} - {selectedTeam.leagueName}
            </Title>
          </Header>

          <InfoContainer>
            <InfoItem>
              <Trophy size={20} />
              <span>Rank: {selectedTeam.rank}</span>
            </InfoItem>
            <InfoItem>
              <Users size={20} />
              <span>
                Record: {selectedTeam.wins}W - {selectedTeam.losses}L
              </span>
            </InfoItem>
          </InfoContainer>

          <Tabs>
            <TabButton
              $active={activeTab === 'roster'}
              onClick={() => setActiveTab('roster')}
            >
              Team Roster
            </TabButton>
            <TabButton
              $active={activeTab === 'upcoming'}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Events
            </TabButton>
            <TabButton
              $active={activeTab === 'results'}
              onClick={() => setActiveTab('results')}
            >
              Event Results
            </TabButton>
          </Tabs>

          {activeTab === 'roster' && (
            <LeagueMembersSection
              league={teamToLeague(selectedTeam)}
              isManaged={true}
              onSearchUsers={() => setShowSearchUsersModal(true)}
            />
          )}

          {activeTab === 'upcoming' && (
            <LeagueEventsSection
              events={selectedTeam.eventTeams.map((et) => et.event) || []}
              isTeamEvents={true}
              showCreateButton={false}
            />
          )}

          {activeTab === 'results' && (
            <EventResultsSection
              eventResults={selectedTeam.eventResults || []}
            />
          )}
        </Card>
      )}

      {showSearchUsersModal && selectedTeam && (
        <SearchUsersModal
          isOpen={showSearchUsersModal}
          onClose={() => setShowSearchUsersModal(false)}
          onInviteUser={handleInviteUserToTeam}
          onSearchUsers={handleSearchUsers}
        />
      )}
    </Container>
  );
};

export default ManageTeams;

const Container = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  padding: clamp(1rem, 5vw, 3rem) 1rem;
`;

const Select = styled.select`
  width: 100%;
  max-width: 25rem;
  padding: clamp(0.5rem, 2vw, 0.75rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
`;

const InfoContainer = styled.div`
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  padding: 0 clamp(0.25rem, 2vw, 2rem);
`;
