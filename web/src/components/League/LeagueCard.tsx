import { useMsal } from '@azure/msal-react';
import { Trophy, User as UserIcon, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import { LeagueUser } from '../../models/LeagueUser';
import { LeagueUserStatus } from '../../models/LeagueUserStatusEnum';
import BackButton from '../General/BackButton';
import ConfirmationModal from '../General/ConfirmationModal';
import LoadingButton from '../General/LoadingButton';
import { StyledSpinner } from '../SharedStyles';
import LeagueEventsSection from './LeagueEventsSection';
import LeagueMembersSection from './LeagueMembersSection';
import LeagueTeamsSection from './LeagueTeamsSection';
import {
  Badge,
  Card,
  Header,
  InfoItem,
  TabButton,
  Tabs,
  Title,
} from './SharedLeagueStyles';

const LeagueCard = () => {
  const { id } = useParams<{ id: string }>();
  const { accounts } = useMsal();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [requested, setRequested] = useState(false);
  const [invited, setInvited] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const {
    getLeagueById,
    inviteUserToLeague,
    leaveLeague,
    acceptInvite,
    sendTeamRequest,
  } = useLeagueApi();
  const user = accounts[0];

  const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('No league ID provided');
        const data = await getLeagueById(id);
        setLeague(data);
        setJoined(
          data.leagueMembers.some((u) => u.userId === user.idTokenClaims?.sub)
        );
        setRequested(
          data.leagueRequests.some((u) => u.userId === user.idTokenClaims?.sub)
        );
        setInvited(
          data.leagueInvites.some((u) => u.userId === user.idTokenClaims?.sub)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch league');
      } finally {
        setLoading(false);
      }
    };
    fetchLeague();
  }, [id]);

  const handleJoinRequest = async () => {
    if (!id || !league) return;
    try {
      setLeague({
        ...league,
        leagueRequests: [
          ...league.leagueRequests,
          {
            userId: user.idTokenClaims?.sub,
            name: user?.name,
            status: LeagueUserStatus.Requested,
          } as LeagueUser,
        ],
      });
      await inviteUserToLeague(id, user.idTokenClaims?.sub!, false);
      setRequested(true);
    } catch (err) {
      const originalLeague = await getLeagueById(id);
      setLeague(originalLeague);
      setRequested(
        originalLeague.leagueRequests.some(
          (u) => u.userId === user.idTokenClaims?.sub
        )
      );
    }
  };

  const handleAcceptInvite = async () => {
    if (!id || !league) return;
    try {
      setLeague({
        ...league,
        leagueMembers: [
          ...league.leagueMembers,
          {
            userId: user.idTokenClaims?.sub,
            name: user?.name,
            status: LeagueUserStatus.Member,
          } as LeagueUser,
        ],
      });
      await acceptInvite(id, user.idTokenClaims?.sub!);
      setJoined(true);
    } catch (err) {
      const originalLeague = await getLeagueById(id);
      setLeague(originalLeague);
      setRequested(
        originalLeague.leagueRequests.some(
          (u) => u.userId === user.idTokenClaims?.sub
        )
      );
    }
  };

  const handleLeave = () => {
    if (!id || !league) return;
    setShowLeaveModal(true);
  };

  const confirmLeave = async () => {
    if (!id || !league) return;
    try {
      setLeague({
        ...league,
        leagueMembers: league.leagueMembers.filter(
          (u) => u.userId !== user.idTokenClaims?.sub
        ),
      });
      await leaveLeague(id);
      setJoined(false);
    } catch (err) {
      const originalLeague = await getLeagueById(id);
      setLeague(originalLeague);
      setJoined(
        !!originalLeague.leagueMembers.find(
          (u) => u.userId === user.idTokenClaims?.sub
        )
      );
    } finally {
      setShowLeaveModal(false);
    }
  };

  const handleMembershipAction = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      if (joined) await handleLeave();
      else if (invited) await handleAcceptInvite();
      else await handleJoinRequest();
    } finally {
      setActionLoading(false);
    }
  };

  const handleTeamRequest = async (teamName: string) => {
    if (!teamName || !league) return;
    try {
      await sendTeamRequest(teamName, league.id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <StyledSpinner />;
  if (error || !league)
    return <ErrorMessage message={error || 'League not found'} />;

  return (
    <Container>
      <BackButton />
      <Card>
        <Header>
          <Title>{league.name}</Title>
          <Badge $isPublic={league.isPublic}>
            {league.isPublic ? 'Public' : 'Private'}
          </Badge>
        </Header>

        <InfoContainer>
          <InfoItem>
            <Trophy size={20} />
            <span>{league.isCompetitive ? 'Competitive' : 'Casual'}</span>
          </InfoItem>
          <InfoItem>
            {league.isTeamLeague ? <Users size={20} /> : <UserIcon size={20} />}
            <span>{league.sport}</span>
          </InfoItem>
        </InfoContainer>

        {(league.isPublic || joined) && (
          <StyledLoadingButton
            disabled={requested}
            isLoading={actionLoading}
            loadingText={
              joined ? 'Leaving...' : invited ? 'Inviting...' : 'Requesting...'
            }
            onClick={handleMembershipAction}
            $joined={joined}
          >
            {joined
              ? 'Leave League'
              : requested
              ? 'Requested'
              : invited
              ? 'Accept Invite'
              : 'Request to Join'}
          </StyledLoadingButton>
        )}

        <Tabs>
          <TabButton
            $active={activeTab === 'details'}
            onClick={() => setActiveTab('details')}
          >
            Details
          </TabButton>
          <TabButton
            $active={activeTab === 'events'}
            onClick={() => setActiveTab('events')}
          >
            Events
          </TabButton>
        </Tabs>

        {activeTab === 'details' &&
          (league.isTeamLeague ? (
            <LeagueTeamsSection
              league={league}
              isManaged={false}
              onRequestSend={handleTeamRequest}
              joined={joined}
            />
          ) : (
            <LeagueMembersSection league={league} isManaged={false} />
          ))}

        {activeTab === 'events' && (
          <LeagueEventsSection
            events={league.events || []}
            isTeamEvents={league.isTeamLeague}
            showCreateButton={false}
          />
        )}
      </Card>
      <ConfirmationModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={confirmLeave}
        entityName={league?.name || 'this league'}
        action='Leave'
      />
    </Container>
  );
};

export default LeagueCard;

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
