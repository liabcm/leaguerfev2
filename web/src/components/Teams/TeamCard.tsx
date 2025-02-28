import { useMsal } from '@azure/msal-react';
import { Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { Team } from '../../models/Team';
import EventResultsSection from '../Events/EventResultsSection';
import BackButton from '../General/BackButton';
import ConfirmationModal from '../General/ConfirmationModal';
import LoadingButton from '../General/LoadingButton';
import LeagueEventsSection from '../League/LeagueEventsSection';
import LeagueMembersSection from '../League/LeagueMembersSection';
import {
  Card,
  Header,
  InfoItem,
  TabButton,
  Tabs,
  Title,
} from '../League/SharedLeagueStyles';
import { StyledSpinner } from '../SharedStyles';

const TeamCard = () => {
  const { id } = useParams<{ id: string }>();
  const { accounts } = useMsal();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [requested, setRequested] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'upcoming' | 'results'>(
    'roster'
  );

  const { getTeamById, inviteOrRequestUserToTeam } = useLeagueApi();

  const user = accounts[0];

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('No team ID provided');
        const data = await getTeamById(id);
        setTeam(data);

        // Check if user is in the team
        const isTeamUser = data.teamUsers.some(
          (u) => u.userId === user.idTokenClaims?.sub
        );
        const isTeamManager = data.teamManagers.some(
          (u) => u.userId === user.idTokenClaims?.sub
        );
        setJoined(isTeamUser || isTeamManager);

        // Check if user has requested to join
        setRequested(data.isPending);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch team');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  // Convert team to League format for LeagueMembersSection
  const teamToLeague = (team: Team) => {
    return {
      id: team.id,
      name: team.name,
      leagueMembers: [...team.teamUsers, ...team.teamManagers],
    } as any;
  };

  const handleJoinRequest = async () => {
    if (!id || !team) return;
    try {
      setActionLoading(true);
      await inviteOrRequestUserToTeam(id, user.idTokenClaims?.sub!, false);
      setRequested(true);
    } catch (err) {
      console.error('Error requesting to join team:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = () => {
    if (!id || !team) return;
    setShowLeaveModal(true);
  };

  const confirmLeave = async () => {
    if (!id || !team) return;
    try {
      setActionLoading(true);
      //await leaveTeam(id);

      // Update local state to reflect the change
      setTeam({
        ...team,
        teamUsers: team.teamUsers.filter(
          (u) => u.userId !== user.idTokenClaims?.sub
        ),
        teamManagers: team.teamManagers.filter(
          (u) => u.userId !== user.idTokenClaims?.sub
        ),
      });

      setJoined(false);
    } catch (err) {
      console.error('Error leaving team:', err);
    } finally {
      setActionLoading(false);
      setShowLeaveModal(false);
    }
  };

  const handleMembershipAction = async () => {
    if (actionLoading) return;

    if (joined) {
      handleLeave();
    } else {
      await handleJoinRequest();
    }
  };

  if (loading) return <StyledSpinner />;
  if (error || !team)
    return <ErrorMessage message={error || 'Team not found'} />;

  return (
    <Container>
      <BackButton />
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

        <StyledLoadingButton
          disabled={requested}
          isLoading={actionLoading}
          loadingText={joined ? 'Leaving...' : 'Requesting...'}
          onClick={handleMembershipAction}
          $joined={joined}
        >
          {joined
            ? 'Leave Team'
            : requested
            ? 'Request Pending'
            : 'Request to Join'}
        </StyledLoadingButton>

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
          <LeagueMembersSection league={teamToLeague(team)} isManaged={false} />
        )}

        {activeTab === 'upcoming' && (
          <LeagueEventsSection
            events={team.eventTeams.map((et) => et.event) || []}
            isTeamEvents={true}
            showCreateButton={false}
          />
        )}

        {activeTab === 'results' && (
          <EventResultsSection eventResults={team.eventResults || []} />
        )}
      </Card>

      <ConfirmationModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={confirmLeave}
        entityName={team?.name || 'this team'}
        action='Leave'
      />
    </Container>
  );
};

export default TeamCard;

const Container = styled.div`
  padding: clamp(1.5rem, 5vw, 4rem) clamp(0.75rem, 3vw, 2.5rem);
  width: 100%;
  max-width: 100rem;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
`;

const StyledLoadingButton = styled(LoadingButton)<{ $joined: boolean }>`
  background-color: ${({ $joined }) => ($joined ? '#ef4444' : '#3b82f6')};
  color: white;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  padding: clamp(0.5rem, 2vw, 0.75rem);
  font-size: clamp(0.75rem, 2.5vw, 1rem);
  &:hover {
    opacity: 0.9;
  }
`;

const ErrorMessage = ({ message }: { message: string }) => (
  <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
    {message}
  </div>
);
