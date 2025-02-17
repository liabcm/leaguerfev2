// components/ManageLeagues.tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LeagueDetails from './LeagueDetails';
import { League } from '../../models/League';

const ManageLeagues = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
  const { getMyLeagues } = useLeagueApi();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const data = await getMyLeagues();
        setLeagues(data);
        const leagueId = searchParams.get('leagueId');
        if (leagueId) {
          const league = data.find((l) => l.id === leagueId);
          setSelectedLeague(league || null);
        }
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
    };
    fetchLeagues();
  }, []);

  const handleCreateEvent = () => {
    selectedLeague && navigate(`/event/${selectedLeague.id}`);
  };

  const handleLeagueSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = e.target.value;
    setSearchParams(leagueId ? { leagueId } : {});
    setSelectedLeague(leagues.find((l) => l.id === leagueId) || null);
  };

  return (
    <Container>
      <Select onChange={handleLeagueSelect}>
        <option value=''>Select a league</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </Select>

      {selectedLeague && (
        <LeagueDetails
          league={selectedLeague}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          eventsHeaderAction={
            <Button onClick={handleCreateEvent}>Create New Event</Button>
          }
        />
      )}
    </Container>
  );
};

// Keep your existing styled components, update names if needed
export default ManageLeagues;

// Styled components
const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 3rem 1rem;
`;

const Select = styled.select`
  min-width: 15rem;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
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
