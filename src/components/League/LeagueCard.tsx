import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import { LeagueUser } from '../../models/LeagueUser';
import { LeagueUserStatus } from '../../models/LeagueUserStatusEnum';
import BackButton from '../General/BackButton';
import ConfirmationModal from '../General/ConfirmationModal';
import { StyledSpinner } from '../SharedStyles';
import LeagueDetails from './LeagueDetails';

const LeagueCard = () => {
  const { id } = useParams<{ id: string }>();
  const { accounts } = useMsal();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [requested, setRequested] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false); // New state for modal
  const { getLeagueById, inviteUserToLeague, leaveLeague } = useLeagueApi();
  const user = accounts[0];

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('No league ID provided');
        const data = await getLeagueById(id);
        setLeague(data);
        const leagueUser = data.leagueUsers.find(
          (u) => u.userId == user.idTokenClaims?.sub
        );
        setJoined(leagueUser?.status == LeagueUserStatus.Member);
        console.log(joined);
        setRequested(
          !!leagueUser && leagueUser.status == LeagueUserStatus.Requested
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
        leagueUsers: [
          ...league.leagueUsers,
          {
            userId: user.idTokenClaims?.sub,
            name: user?.name,
            status: LeagueUserStatus.Requested,
          } as LeagueUser,
        ],
      });

      await inviteUserToLeague(id, user.idTokenClaims?.sub!, false);

      const updatedLeague = await getLeagueById(id);
      setLeague(updatedLeague);

      const leagueUser = updatedLeague.leagueUsers.find(
        (u) => u.userId === user.idTokenClaims?.sub
      );
      setRequested(
        !!leagueUser && leagueUser.status == LeagueUserStatus.Requested
      );
    } catch (err) {
      const originalLeague = await getLeagueById(id);
      setLeague(originalLeague);
      const leagueUser = originalLeague.leagueUsers.find(
        (u) => u.userId === user.idTokenClaims?.sub
      );
      setRequested(
        !!leagueUser && leagueUser.status == LeagueUserStatus.Requested
      );
    }
  };

  const handleLeave = () => {
    if (!id || !league) return;
    setShowLeaveModal(true); // Show modal instead of leaving immediately
  };

  const confirmLeave = async () => {
    if (!id || !league) return;
    try {
      setLeague({
        ...league,
        leagueUsers: league.leagueUsers.filter(
          (u) => u.userId !== user.idTokenClaims?.sub
        ),
      });
      await leaveLeague(id);
      setJoined(false);
      const updatedLeague = await getLeagueById(id);
      setLeague(updatedLeague);
    } catch (err) {
      const originalLeague = await getLeagueById(id);
      setLeague(originalLeague);
      setJoined(
        !!originalLeague.leagueUsers.find(
          (u) => u.userId === user.idTokenClaims?.sub
        )
      );
    } finally {
      setShowLeaveModal(false); // Close modal after action
    }
  };

  if (loading) return <StyledSpinner />;
  if (error || !league)
    return <ErrorMessage message={error || 'League not found'} />;

  return (
    <Container>
      <BackButton />
      <LeagueDetails
        league={league}
        enableMembershipActions
        joined={joined}
        onJoin={handleJoinRequest}
        onLeave={handleLeave}
        requested={requested}
      />
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

const Container = styled.div`
  padding: clamp(1.5rem, 5vw, 4rem) clamp(0.75rem, 3vw, 2.5rem);
  width: 100%;
  max-width: 100rem;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export default LeagueCard;

const ErrorMessage = ({ message }: { message: string }) => (
  <div
    style={{
      color: '#ef4444',
      textAlign: 'center',
      padding: '2rem',
    }}
  >
    {message}
  </div>
);
