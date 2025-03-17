import { Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { PagedResult } from '../../models/PagedResult';
import { Team } from '../../models/Team';
import { TeamUser } from '../../models/TeamUser';
import { User } from '../../models/User';
import BackButton from '../General/BackButton';
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
import { StyledSpinner } from '../SharedStyles';
import TeamPendingSection from './TeamPendingSection';

const ManageTeams = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'roster' | 'upcoming' | 'results'>(
    'roster'
  );
  const [showSearchUsersModal, setShowSearchUsersModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const {
    searchUsersForTeamInvite,
    inviteOrRequestUserToTeam,
    declineTeamInvite,
    acceptTeamInvite,
    leaveTeam,
    getTeamById,
  } = useLeagueApi();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setIsLoading(true);
        const data = await getTeamById(id!);
        setTeam(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const teamToLeague = (team: Team) => {
    return {
      id: team.id,
      name: team.name,
      leagueMembers: [...team.teamUsers, ...team.teamManagers],
    } as any;
  };

  const handleInviteUserToTeam = async (user: User): Promise<void> => {
    try {
      await inviteOrRequestUserToTeam(team?.id!, user.id, true);
    } catch (error) {
      console.error('Error inviting user to team:', error);
    }
  };

  const handleSearchUsers = async (
    query: string,
    pageNum: number
  ): Promise<PagedResult<User>> => {
    return await searchUsersForTeamInvite(team?.id!, query, pageNum);
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const teamId = team?.id!;
      await leaveTeam(teamId, memberId);
      const updatedTeam = {
        ...team,
        teamUsers: team!.teamUsers.filter((user) => user.userId !== memberId),
        teamManagers: team!.teamManagers.filter(
          (user) => user.userId !== memberId
        ),
      } as Team;
      setTeam(updatedTeam);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const onDecline = async (member: TeamUser) => {
    try {
      await declineTeamInvite(team?.id!, member.userId);
      const updatedTeam = {
        ...team,
        teamRequests: team!.teamRequests.filter(
          (user) => user.userId !== member.userId
        ),
      } as Team;
      setTeam(updatedTeam);
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const onRemoveInvite = async (member: TeamUser) => {
    try {
      await declineTeamInvite(team?.id!, member.userId);
      const updatedTeam = {
        ...team,
        teamInvites: team!.teamInvites.filter(
          (user) => user.userId !== member.userId
        ),
      } as Team;
      setTeam(updatedTeam);
    } catch (error) {
      console.error('Error removing invite:', error);
    }
  };

  const onAccept = async (member: TeamUser) => {
    try {
      await acceptTeamInvite(team?.id!, member.userId);
      const updatedTeam = {
        ...team,
        teamUsers: [...team!.teamUsers, member],
        teamRequests: team!.teamRequests.filter(
          (user) => user.userId !== member.userId
        ),
      } as Team;
      setTeam(updatedTeam);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  if (isLoading) {
    return <StyledSpinner />;
  }

  return (
    <Container>
      <BackButton />

      {team && (
        <Card>
          <Header>
            <Title>
              {team.name} - {team.leagueName}
            </Title>
          </Header>

          <InfoContainer>
            <InfoItem>
              <Trophy size={20} />
              <span>Rank: {team.rank}</span>
            </InfoItem>
            <InfoItem>
              <Users size={20} />
              <span>
                Record: {team.wins}W - {team.losses}L
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
              Events
            </TabButton>
          </Tabs>

          {activeTab === 'roster' && (
            <>
              <LeagueMembersSection
                league={teamToLeague(team)}
                isManaged={true}
                onSearchUsers={() => setShowSearchUsersModal(true)}
                onRemove={handleRemoveMember}
              />
              <TeamPendingSection
                title='Pending Invites'
                items={team.teamInvites}
                onDecline={onRemoveInvite}
                type='invite'
              />
              <TeamPendingSection
                title='Join Requests'
                items={team.teamRequests}
                onAccept={onAccept}
                onDecline={onDecline}
                type='request'
              />
            </>
          )}

          {activeTab === 'upcoming' && (
            <LeagueEventsSection
              events={team.eventTeams.map((et) => et.event) || []}
              isTeamEvents={true}
              showCreateButton={false}
            />
          )}
        </Card>
      )}

      {showSearchUsersModal && team && (
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

const InfoContainer = styled.div`
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  padding: 0 clamp(0.25rem, 2vw, 2rem);
`;
