import { useMsal } from '@azure/msal-react';
import { Calendar, Trophy, User as UserIcon, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import { LeagueUser } from '../../models/LeagueUser';
import { LeagueUserStatus } from '../../models/LeagueUserStatusEnum';
import EventList from '../Events/EventList';
import BackButton from '../General/BackButton';
import ConfirmationModal from '../General/ConfirmationModal';
import LoadingButton from '../General/LoadingButton';
import { StyledSpinner } from '../SharedStyles';
import MemberRow from './MemberRow';

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
  const { getLeagueById, inviteUserToLeague, leaveLeague, acceptInvite } =
    useLeagueApi();
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

        {activeTab === 'details' && (
          <MembersSection>
            <MembersHeader>
              {league.isTeamLeague ? <h3>Teams</h3> : <h3>Members</h3>}
              <Count>
                {league.isTeamLeague
                  ? league.teams?.length || 0
                  : league.leagueMembers.length || 0}
              </Count>
            </MembersHeader>
            <MembersList>
              {league.isTeamLeague
                ? league.teams?.map((team) => (
                    <Member key={team.id}>{team.name}</Member>
                  ))
                : league.leagueMembers.map((member) => (
                    <MemberRow
                      key={member.userId}
                      member={member}
                      isManaged={false}
                    />
                  ))}
            </MembersList>
          </MembersSection>
        )}

        {activeTab === 'events' && (
          <EventsSection>
            <EventsHeader>
              <HeaderTopRow>
                <Calendar size={20} />
                <h3>Upcoming Events</h3>
              </HeaderTopRow>
            </EventsHeader>
            <EventList events={league.events || []} />
          </EventsSection>
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

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1);
  padding: clamp(1rem, 3vw, 2.5rem);
  width: 100%;
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const Badge = styled.span<{ $isPublic: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999rem;
  font-size: 0.875rem;
  background-color: ${({ $isPublic }) => ($isPublic ? '#60a5fa' : '#6b7280')};
  color: white;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
  flex: 1;
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

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: clamp(0.375rem, 1.5vw, 0.5rem);
  background-color: ${({ $active }) => ($active ? '#3b82f6' : '#e5e7eb')};
  color: ${({ $active }) => ($active ? 'white' : '#4b5563')};
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  font-size: clamp(0.75rem, 2vw, 1rem);
`;

const MembersSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: clamp(1rem, 3vw, 1.5rem);
`;

const MembersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Count = styled.span`
  background-color: #e5e7eb;
  padding: 0.25rem 0.75rem;
  border-radius: 9999rem;
  font-size: 0.875rem;
`;

const MembersList = styled.div`
  display: grid;
  gap: 0.5rem;
  max-height: clamp(9.375rem, 50vh, 12.5rem);
  overflow-y: auto;
`;

const Member = styled.div`
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

const EventsSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: clamp(1rem, 3vw, 1.5rem);
`;

const EventsHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = ({ message }: { message: string }) => (
  <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
    {message}
  </div>
);
