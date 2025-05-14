import { ChevronLeft, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import {
  StyledErrorMessage,
  StyledLoadingContainer,
  StyledSpinner,
} from '../SharedStyles';

const MyManagedLeagues = () => {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getMyManagedLeagues } = useLeagueApi();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getMyManagedLeagues();
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <PageContainer>
      <FixedHeader>
        <HeaderContent>
          <BackButtonContainer>
            <BackButton onClick={handleBack}>
              <ChevronLeft size={24} />
            </BackButton>
            <StyledHeading>My Managed Leagues</StyledHeading>
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
            ) : leagues.length > 0 ? (
              leagues.map((league) => (
                <LeagueItem
                  key={league.id}
                  onClick={() => navigate(`/manage-leagues/${league.id}`)}
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
                        variant={
                          league.isCompetitive ? 'competitive' : 'casual'
                        }
                      >
                        {league.isCompetitive ? 'Competitive' : 'Casual'}
                      </Badge>
                    </div>
                  </FlexContainer>
                </LeagueItem>
              ))
            ) : (
              <EmptyStateContainer>
                <EmptyStateMessage>
                  No managed leagues to display
                </EmptyStateMessage>
              </EmptyStateContainer>
            )}
          </ListContainer>
        </ScrollableContent>

        <FixedButtonContainer>
          <StyledButton onClick={() => navigate('/league')}>
            <Plus size={18} />
            Create League
          </StyledButton>
        </FixedButtonContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default MyManagedLeagues;

const HeaderContent = styled.div`
  text-align: center;
`;

const ListContainer = styled.div`
  padding: 0 15px 80px;
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
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 80px;

  @media (max-width: 768px) {
    padding-bottom: 140px; // Extra padding for mobile
  }
`;

const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding-top: 120px; // Reduced from 60px to account for navbar
  position: relative;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 60px; // Position below navbar
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 190px);
  margin-top: 0; // Remove previous margin-top
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
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: auto;
  min-width: 200px;

  &:hover {
    background-color: #1557b0;
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

const StyledHeading = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  width: 100%;
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
