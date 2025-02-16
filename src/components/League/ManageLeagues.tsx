// components/ManageLeagues.tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { useNavigate } from 'react-router-dom';
import EventList from '../Events/EventList';
import { League } from '../../models/League';

const ManageLeagues = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [activeTab, setActiveTab] = useState<'league' | 'events'>('league');
  const { getMyLeagues } = useLeagueApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const data = await getMyLeagues();
        setLeagues(data);
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
    };
    fetchLeagues();
  }, []);

  const handleCreateEvent = () => {
    selectedLeague && navigate(`/event/${selectedLeague.id}`);
  };

  return (
    <Container>
      <Select
        onChange={(e) =>
          setSelectedLeague(
            leagues.find((l) => l.id === e.target.value) || null
          )
        }
      >
        <option value=''>Select a league</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </Select>

      {selectedLeague && (
        <>
          <Tabs>
            <TabButton
              $active={activeTab === 'league'}
              onClick={() => setActiveTab('league')}
            >
              League Info
            </TabButton>
            <TabButton
              $active={activeTab === 'events'}
              onClick={() => setActiveTab('events')}
            >
              Events
            </TabButton>
          </Tabs>

          {activeTab === 'league' && (
            <LeagueInfo>
              <h2>{selectedLeague.name}</h2>
              <InfoGrid>
                <div>
                  <p>Sport: {selectedLeague.sport}</p>
                  <p>Members: {selectedLeague.leagueUsers.length}</p>
                </div>
                <Badges>
                  {selectedLeague.isCompetitive && <Badge>Competitive</Badge>}
                  {selectedLeague.isPublic && <Badge>Public</Badge>}
                </Badges>
              </InfoGrid>
            </LeagueInfo>
          )}

          {activeTab === 'events' && (
            <EventsContainer>
              <Button onClick={handleCreateEvent}>Create New Event</Button>
              <EventList events={selectedLeague.events || []} />
            </EventsContainer>
          )}
        </>
      )}
    </Container>
  );
};

// Styled components
const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 3rem 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1rem;
  background-color: ${({ $active }) => ($active ? '#3b82f6' : '#f3f4f6')};
  color: ${({ $active }) => ($active ? 'white' : '#4b5563')};
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
`;

const LeagueInfo = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
`;

const Badges = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  font-size: 0.875rem;
`;

const EventsContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button<{ variant?: 'secondary' }>`
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;

  ${({ variant }) =>
    variant === 'secondary'
      ? `
    background-color: white;
    border: 1px solid #ddd;
    color: #333;

    &:hover {
      background-color: #f5f5f5;
    }
  `
      : `
    background-color: #0066cc;
    border: none;
    color: white;

    &:hover {
      background-color: #0052a3;
    }
  `}
`;

export default ManageLeagues;
