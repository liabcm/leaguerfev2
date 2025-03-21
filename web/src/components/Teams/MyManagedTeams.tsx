import { ChevronLeft } from 'lucide-react';
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

const MyManagedTeams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getMyTeams } = useLeagueApi();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getMyTeams();
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
          <BackButtonContainer>
            <BackButton onClick={() => navigate(-1)}>
              <ChevronLeft size={24} />
            </BackButton>
            <StyledHeading>My Teams</StyledHeading>
          </BackButtonContainer>
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
                onClick={() => navigate(`/manage-teams/${team.id}`)}
              >
                <FlexContainer>
                  <div>
                    <TeamName>{team.name}</TeamName>
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
            <EmptyStateContainer>
              <EmptyStateMessage>
                No teams to display. Request a team in one of your leagues.
              </EmptyStateMessage>
              <ViewLeaguesButton onClick={() => navigate('/my-leagues')}>
                View My Leagues
              </ViewLeaguesButton>
            </EmptyStateContainer>
          )}
        </ListContainer>
      </ScrollableContent>
    </PageContainer>
  );
};

export default MyManagedTeams;

// Styled Components
const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding-top: 60px; /* Add top padding to account for the navbar */
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 60px; /* Position below the navbar */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;
  background-color: white;
  z-index: 900; /* Lower than navbar's z-index (1000) */
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const HeaderContent = styled.div`
  text-align: center;
`;

const ScrollableContent = styled.div`
  margin-top: 130px; /* Adjusted to account for navbar + header */
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
  width: 100%;
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

const BackButtonContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
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

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const EmptyStateMessage = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const ViewLeaguesButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1557b0;
  }
`;
