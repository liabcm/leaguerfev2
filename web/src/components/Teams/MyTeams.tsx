import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { Team } from '../../models/Team';
import {
  StyledErrorMessage,
  StyledLoadingContainer,
  StyledSpinner,
} from '../SharedStyles';

const MyTeams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getMyJoinedTeams } = useLeagueApi();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getMyJoinedTeams();
        setTeams(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <PageContainer>
      <FixedHeader>
        <HeaderContent>
          <StyledHeading>My Teams</StyledHeading>
        </HeaderContent>
      </FixedHeader>

      <ScrollableContent>
        <ListContainer>
          {error ? (
            <StyledErrorMessage>{error}</StyledErrorMessage>
          ) : loading ? (
            <StyledLoadingContainer>
              <StyledSpinner />
            </StyledLoadingContainer>
          ) : teams.length > 0 ? (
            teams.map((team) => (
              <TeamItem
                key={team.id}
                onClick={() => navigate(`/team/${team.id}`)}
              >
                <FlexContainer>
                  <div>
                    <TeamName>{team.name}</TeamName>
                    <LeagueName>{team.leagueName}</LeagueName>
                  </div>
                  <TeamStats>
                    <Stat>
                      <StatLabel>Rank</StatLabel>
                      <StatValue>{team.rank}</StatValue>
                    </Stat>
                    <Stat>
                      <StatLabel>W-L</StatLabel>
                      <StatValue>
                        {team.wins}-{team.losses}
                      </StatValue>
                    </Stat>
                    {team.isPending && <Badge variant='pending'>Pending</Badge>}
                  </TeamStats>
                </FlexContainer>
              </TeamItem>
            ))
          ) : (
            <div>
              <p>No teams to display...</p>
              <button onClick={() => navigate('/leagues')}>
                find a league to join
              </button>
            </div>
          )}
        </ListContainer>
      </ScrollableContent>
    </PageContainer>
  );
};

export default MyTeams;

// Styled Components
const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;
  background-color: white;
  z-index: 10;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const HeaderContent = styled.div`
  text-align: center;
`;

const ScrollableContent = styled.div`
  margin-top: 160px; // Reduced height since we removed search and pagination
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px 20px;
`;

const ListContainer = styled.div`
  padding: 0 15px;
`;

const StyledHeading = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const TeamItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: white;

  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TeamName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const LeagueName = styled.div`
  color: #666;
  margin-bottom: 8px;
`;

const TeamStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.75em;
  color: #666;
`;

const StatValue = styled.div`
  font-weight: 600;
`;

const Badge = styled.span<{
  variant: 'pending';
}>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  margin-right: 8px;

  ${({ variant }) => {
    switch (variant) {
      case 'pending':
        return `background-color: #fef7e0; color: #f9ab00;`;
    }
  }}
`;
