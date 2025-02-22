import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import BackButton from '../General/BackButton';
import {
  StyledErrorMessage,
  StyledLoadingContainer,
  StyledSpinner,
} from '../SharedStyles';

const MyLeagues = () => {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getJoinedLeagues } = useLeagueApi();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getJoinedLeagues();
        setLeagues(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch leagues'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  return (
    <PageContainer>
      <FixedHeader>
        <BackButtonContainer>
          <BackButton />
        </BackButtonContainer>
        <HeaderContent>
          <StyledHeading>My Leagues</StyledHeading>
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
          ) : leagues.length > 0 ? (
            leagues.map((league) => (
              <LeagueItem
                key={league.id}
                onClick={() => navigate(`/league/${league.id}`)}
              >
                <FlexContainer>
                  <div>
                    <LeagueName>{league.name}</LeagueName>
                    <SportName>{league.sport}</SportName>
                  </div>
                  <div>
                    <Badge variant={league.isPublic ? 'public' : 'private'}>
                      {league.isPublic ? 'Public' : 'Private'}
                    </Badge>
                    <Badge
                      variant={league.isCompetitive ? 'competitive' : 'casual'}
                    >
                      {league.isCompetitive ? 'Competitive' : 'Casual'}
                    </Badge>
                  </div>
                </FlexContainer>
              </LeagueItem>
            ))
          ) : (
            <div>
              <p>no leagues to display...</p>
              <button onClick={() => navigate('/leagues')}>
                find a league
              </button>
            </div>
          )}
        </ListContainer>
      </ScrollableContent>
    </PageContainer>
  );
};

export default MyLeagues;

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

const BackButtonContainer = styled.div`
  margin-bottom: 20px;
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

const LeagueItem = styled.div`
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

const LeagueName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SportName = styled.div`
  color: #666;
  margin-bottom: 8px;
`;

const Badge = styled.span<{
  variant: 'public' | 'private' | 'competitive' | 'casual';
}>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  margin-right: 8px;

  ${({ variant }) => {
    switch (variant) {
      case 'public':
        return `background-color: #e6f4ea; color: #137333;`;
      case 'private':
        return `background-color: #fce8e6; color: #c5221f;`;
      case 'competitive':
        return `background-color: #e8f0fe; color: #1a73e8;`;
      case 'casual':
        return `background-color: #fef7e0; color: #f9ab00;`;
    }
  }}
`;
