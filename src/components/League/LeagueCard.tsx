// components/LeagueCard.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Users, Calendar } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import { League } from '../../models/League';
import { useLeagueApi } from '../../api/useLeagueApi';
import BackButton from '../General/BackButton';
import EventList from '../Events/EventList';
import { User } from '../../models/User';

const LeagueCard = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth0();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
  const { getLeagueById, joinLeague, leaveLeague } = useLeagueApi();

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('No league ID provided');

        const data = await getLeagueById(id);
        setLeague(data);
        setJoined(!!data.leagueUsers.find((u) => u.id === user?.internal_id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch league');
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [id]);

  const handleJoinLeave = async (action: 'join' | 'leave') => {
    if (!league || !id) return;

    try {
      setLoading(true);
      action === 'join' ? await joinLeague(id) : await leaveLeague(id);
      const updatedLeague = await getLeagueById(id);
      setLeague(updatedLeague);
      setJoined(action === 'join');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to ${action} league`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
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
            <Users size={20} />
            <span>{league.sport}</span>
          </InfoItem>
        </InfoContainer>

        <ActionButton
          onClick={() => handleJoinLeave(joined ? 'leave' : 'join')}
          $joined={joined}
        >
          {joined ? 'Leave League' : 'Join League'}
        </ActionButton>

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
              <h3>Members</h3>
              <Count>{league.leagueUsers.length}</Count>
            </MembersHeader>
            <MembersList>
              {league.leagueUsers.map((member: User) => (
                <Member key={member.id}>{member.name}</Member>
              ))}
            </MembersList>
          </MembersSection>
        )}

        {activeTab === 'events' && (
          <EventsSection>
            <EventsHeader>
              <Calendar size={20} />
              <h3>Upcoming Events</h3>
            </EventsHeader>
            <EventList events={league.events || []} />
          </EventsSection>
        )}
      </Card>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  padding: 4rem 1rem 1rem;
  max-width: 768px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const Badge = styled.span<{ $isPublic: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background-color: ${({ $isPublic }) => ($isPublic ? '#60a5fa' : '#6b7280')};
  color: white;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
`;

const ActionButton = styled.button<{ $joined: boolean }>`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: ${({ $joined }) => ($joined ? '#ef4444' : '#3b82f6')};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.5rem;
  background-color: ${({ $active }) => ($active ? '#3b82f6' : '#e5e7eb')};
  color: ${({ $active }) => ($active ? 'white' : '#4b5563')};
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
`;

const MembersSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
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
  border-radius: 9999px;
  font-size: 0.875rem;
`;

const MembersList = styled.div`
  display: grid;
  gap: 0.5rem;
  max-height: 200px;
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
  padding-top: 1.5rem;
`;

const EventsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #3b82f6;
`;

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

export default LeagueCard;
