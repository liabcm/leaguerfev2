// components/League/LeagueCard.tsx
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import { User } from '../../models/User';
import BackButton from '../General/BackButton';
import LeagueDetails from './LeagueDetails';

const LeagueCard = () => {
  const { id } = useParams<{ id: string }>();
  const { accounts } = useMsal();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const { getLeagueById, joinLeague, leaveLeague } = useLeagueApi();
  const user = accounts[0];

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('No league ID provided');
        const data = await getLeagueById(id);
        setLeague(data);
        setJoined(
          !!data.leagueUsers.find((u) => u.id === user.idTokenClaims?.sub)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch league');
      } finally {
        setLoading(false);
      }
    };
    fetchLeague();
  }, [id]);

  const handleJoin = async () => {
    if (!id || !league) return;
    try {
      // Optimistic update
      setLeague({
        ...league,
        leagueUsers: [
          ...league.leagueUsers,
          { id: user.idTokenClaims?.sub, name: user?.name } as User,
        ],
      });
      setJoined(true);
      await joinLeague(id);
      const updatedLeague = await getLeagueById(id);
      setLeague(updatedLeague);
    } catch (err) {
      const originalLeague = await getLeagueById(id);
      setLeague(originalLeague);
      setJoined(
        !!originalLeague.leagueUsers.find(
          (u) => u.id === user.idTokenClaims?.sub
        )
      );
    }
  };

  const handleLeave = async () => {
    if (!id || !league) return;
    try {
      // Optimistic update
      setLeague({
        ...league,
        leagueUsers: league.leagueUsers.filter(
          (u) => u.id !== user.idTokenClaims?.sub
        ),
      });
      setJoined(false);
      await leaveLeague(id);
      const updatedLeague = await getLeagueById(id);
      setLeague(updatedLeague);
    } catch (err) {
      const originalLeague = await getLeagueById(id);
      setLeague(originalLeague);
      setJoined(
        !!originalLeague.leagueUsers.find(
          (u) => u.id === user.idTokenClaims?.sub
        )
      );
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !league)
    return <ErrorMessage message={error || 'League not found'} />;

  return (
    <Container>
      <BackButton />
      <LeagueDetails
        league={league}
        enableMembershipActions
        joined={joined}
        onJoin={handleJoin}
        onLeave={handleLeave}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 4rem 1rem 1rem;
  max-width: 768px;
  margin: 0 auto;
`;

export default LeagueCard;

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
    <div className='spinner'></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
    {message}
  </div>
);
