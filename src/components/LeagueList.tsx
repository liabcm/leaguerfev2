import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useLeagueApi } from '../api/useLeagueApi';
import { League } from '../models/League';
import BackButton from './General/BackButton';
import {
  StyledLoadingContainer,
  StyledSpinner,
  StyledErrorMessage,
} from './SharedStyles';

const LeagueList = () => {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const leagueApi = useLeagueApi();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPageNumber(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch leagues when debounced term or page changes
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await leagueApi.getAllLeagues(
          debouncedSearchTerm,
          pageNumber,
          pageSize
        );
        setLeagues(result.items);
        setTotalPages(Math.ceil(result.totalCount / pageSize));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch leagues'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, [debouncedSearchTerm, pageNumber]);

  return (
    <PageContainer>
      <FixedHeader>
        <BackButtonContainer>
          <BackButton />
        </BackButtonContainer>
        <HeaderContent>
          <StyledHeading>List of Leagues</StyledHeading>
          <StyledSearchInput
            type='text'
            placeholder='Search leagues...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
          ) : (
            <>
              {leagues.map((league) => (
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
                        variant={
                          league.isCompetitive ? 'competitive' : 'casual'
                        }
                      >
                        {league.isCompetitive ? 'Competitive' : 'Casual'}
                      </Badge>
                    </div>
                  </FlexContainer>
                </LeagueItem>
              ))}
            </>
          )}
        </ListContainer>

        {totalPages > 0 && (
          <PaginationContainer>
            <PaginationButton
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber === 1}
            >
              Previous
            </PaginationButton>
            <PageInfo>
              Page {pageNumber} of {totalPages}
            </PageInfo>
            <PaginationButton
              onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
              disabled={pageNumber >= totalPages}
            >
              Next
            </PaginationButton>
          </PaginationContainer>
        )}
      </ScrollableContent>
    </PageContainer>
  );
};

export default LeagueList;

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
  margin-top: 200px; // Adjust this value based on your header height
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px 20px;
`;

const StyledSearchInput = styled.input`
  width: 80%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  padding: 20px 0;
  background-color: white;
`;

const PaginationButton = styled.button<{ disabled: boolean }>`
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background-color: #f8f9fa;
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #666;
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
