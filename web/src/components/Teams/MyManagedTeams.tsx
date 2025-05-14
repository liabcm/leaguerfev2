import { ChevronLeft, Plus } from 'lucide-react';
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

      <ContentWrapper>
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
                    <TeamInfo>
                      <TeamName>{team.name}</TeamName>
                    </TeamInfo>
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
                      {team.isPending && (
                        <Badge variant='pending'>Pending</Badge>
                      )}
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

        <FixedButtonContainer>
          <StyledButton onClick={() => navigate('/create-team')}>
            <Plus size={18} />
            Create Team
          </StyledButton>
        </FixedButtonContainer>
      </ContentWrapper>
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
  padding-top: 120px;
  position: relative;
  width: 100%;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;
  background-color: white;
  z-index: 900;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
`;

const HeaderContent = styled.div`
  position: relative;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const FixedButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 760px;
  z-index: 1000;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    bottom: 80px; // Add space for mobile navbar
  }
`;

const ScrollableContent = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 0 20px 80px;

  @media (max-width: 768px) {
    padding-bottom: 140px; // Extra padding for mobile
  }
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: auto;
  min-width: 200px;

  &:hover {
    background-color: #1557b0;
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
`;

const BackButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  left: 0;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const StyledHeading = styled.h1`
  font-size: 24px;
  margin: 0;
  text-align: center;
  width: 100%;
`;

const TeamItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
  cursor: pointer;
  transition: transform 0.2s;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
`;

const TeamInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TeamName = styled.div`
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TeamStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
`;

const Stat = styled.div`
  text-align: center;
  min-width: 50px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const StatValue = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const Badge = styled.span<{ variant: 'pending' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  ${({ variant }) =>
    variant === 'pending' && 'background-color: #fef7e0; color: #f9ab00;'}
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
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1557b0;
  }
`;
