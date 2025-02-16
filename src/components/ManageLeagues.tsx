import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLeagueApi } from '../api/useLeagueApi';
import { League } from '../models/League';
import { useNavigate } from 'react-router-dom';

const ManageLeagues = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const { getMyLeagues } = useLeagueApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const data = await getMyLeagues();
        setLeagues(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leagues:', error);
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const handleLeagueSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const league = leagues.find((l) => l.id === event.target.value);
    setSelectedLeague(league || null);
  };

  const handleCreateEvent = () => {
    if (selectedLeague) {
      navigate(`/event/${selectedLeague.id}`);
    }
  };

  const handleCreateTeam = () => {
    console.log('Creating team for league:', selectedLeague?.id);
  };

  if (loading) {
    return <Container>Loading leagues...</Container>;
  }

  return (
    <Container>
      <Select onChange={handleLeagueSelect} defaultValue=''>
        <option value='' disabled>
          Select a league
        </option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </Select>

      {selectedLeague && (
        <LeagueCard>
          <LeagueHeader>
            <LeagueName>{selectedLeague.name}</LeagueName>
          </LeagueHeader>

          <InfoGrid>
            <InfoSection>
              <InfoItem>Sport: {selectedLeague.sport}</InfoItem>
              <InfoItem>Members: {selectedLeague.leagueUsers?.length}</InfoItem>
              <div>
                {selectedLeague.isCompetitive && (
                  <Badge variant='competitive'>Competitive</Badge>
                )}
                {selectedLeague.isPublic && (
                  <Badge variant='public'>Public</Badge>
                )}
                {selectedLeague.isTeamLeague && (
                  <Badge variant='team'>Team League</Badge>
                )}
              </div>
            </InfoSection>

            <ButtonContainer>
              <Button onClick={handleCreateEvent}>Create Event</Button>
              {selectedLeague.isTeamLeague && (
                <Button variant='secondary' onClick={handleCreateTeam}>
                  Create Team
                </Button>
              )}
            </ButtonContainer>
          </InfoGrid>
        </LeagueCard>
      )}
    </Container>
  );
};

export default ManageLeagues;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const LeagueCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
`;

const LeagueHeader = styled.div`
  margin-bottom: 20px;
`;

const LeagueName = styled.h2`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
`;

const Badge = styled.span<{ variant: 'competitive' | 'public' | 'team' }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  margin-right: 8px;

  ${({ variant }) => {
    switch (variant) {
      case 'competitive':
        return 'background-color: #e6f4ea; color: #137333;';
      case 'public':
        return 'background-color: #e8f0fe; color: #1967d2;';
      case 'team':
        return 'background-color: #f3e8fd; color: #8430ce;';
    }
  }}
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
