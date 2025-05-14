import { ChevronLeft, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { Event } from '../../models/Event';
import {
  StyledErrorMessage,
  StyledLoadingContainer,
  StyledSpinner,
} from '../SharedStyles';

const MyManagedEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { getMyManagedEvents } = useLeagueApi();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getMyManagedEvents(
          debouncedSearchTerm,
          pageNumber,
          pageSize
        );
        setEvents(result.items);
        setTotalPages(Math.ceil(result.totalCount / pageSize));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, pageNumber, pageSize]);

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
            <StyledHeading>My Managed Events</StyledHeading>
          </BackButtonContainer>
          <SearchInput
            type='text'
            placeholder='Search events...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            ) : events.length > 0 ? (
              events.map((event) => (
                <EventItem
                  key={event.id}
                  onClick={() => navigate(`/manage-events/${event.id}`)}
                >
                  <FlexContainer>
                    <div>
                      <EventName>{event.location}</EventName>
                      <EventDetails>
                        {new Date(event.eventTime).toLocaleDateString()} •{' '}
                        {event.location}
                      </EventDetails>
                    </div>
                  </FlexContainer>
                </EventItem>
              ))
            ) : (
              <EmptyStateContainer>
                <EmptyStateMessage>
                  No managed events found
                  {debouncedSearchTerm && ' matching your search'}.
                </EmptyStateMessage>
              </EmptyStateContainer>
            )}
          </ListContainer>

          {totalPages > 1 && (
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
                onClick={() =>
                  setPageNumber((p) => Math.min(totalPages, p + 1))
                }
                disabled={pageNumber >= totalPages}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          )}
        </ScrollableContent>
      </ContentWrapper>

      <FixedButtonContainer>
        <StyledButton onClick={() => navigate('/event-create')}>
          <Plus size={18} />
          Create Event
        </StyledButton>
      </FixedButtonContainer>
    </PageContainer>
  );
};

export default MyManagedEvents;

const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding-top: 210px;
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
  text-align: center;
  position: relative;
`;

const SearchInput = styled.input`
  width: 80%;
  max-width: 400px;
  padding: 10px 12px;
  margin-top: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 1px #1a73e8;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 0;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 100px;

  @media (max-width: 768px) {
    padding-bottom: 140px;
  }
`;

const ListContainer = styled.div``;

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
    bottom: 80px;
  }
`;

const BackButtonContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-bottom: 0;
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
  top: 50%;
  transform: translateY(-50%);
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  color: #333;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const StyledHeading = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  text-align: center;
  flex: 1;
`;

const EventItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 15px 20px;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: white;

  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EventName = styled.div`
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
`;

const EventDetails = styled.div`
  font-size: 14px;
  color: #555;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 200px;
`;

const EmptyStateMessage = styled.p`
  font-size: 16px;
  color: #666;
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
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: auto;
  min-width: 180px;

  &:hover {
    background-color: #1557b0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  svg {
    margin-right: 4px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 25px 0 15px 0;
  background-color: transparent;
  margin-top: 10px;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  color: #333;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: background-color 0.2s, border-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #f8f9fa;
    border-color: #bbb;
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #555;
  white-space: nowrap;
`;
