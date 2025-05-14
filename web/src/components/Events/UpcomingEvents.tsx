import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { Event } from '../../models/Event';
import { PagedResult } from '../../models/PagedResult';
import { TabButton, Tabs } from '../League/SharedLeagueStyles';
import { StyledSpinner } from '../SharedStyles';

const UpcomingEvents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my' | 'area'>('area');
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const pageSize = 10;

  const { getMyUpcomingEvents } = useLeagueApi();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [activeTab, currentPage]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let response: PagedResult<Event>;
      if (activeTab === 'my') {
        response = await getMyUpcomingEvents(currentPage, pageSize);
        setMyEvents(response.items);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } else {
        console.log('u gotta do something');
        response = await getEventsNearMe({ page: currentPage, pageSize });
        setNearbyEvents(response.items);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
        setNearbyEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'my' | 'area') => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setCurrentPage(1);
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const formatEventTime = (timeString: string) => {
    try {
      return format(new Date(timeString), 'MMM d, yyyy - h:mm a');
    } catch (error) {
      return timeString;
    }
  };

  const renderParticipants = (event: Event) => {
    if (event.users && event.users.length > 0) {
      return (
        <ParticipantsText>
          {event.users.length} {event.users.length === 1 ? 'User' : 'Users'}
        </ParticipantsText>
      );
    }

    if (event.teams && event.teams.length > 0) {
      return (
        <ParticipantsText>
          {event.teams.map((team) => team.name).join(' vs ')}
        </ParticipantsText>
      );
    }

    return (
      <ParticipantsText style={{ color: '#9ca3af' }}>
        No participants yet
      </ParticipantsText>
    );
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const events = activeTab === 'my' ? myEvents : nearbyEvents;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Container>
      <Tabs>
        <TabButton
          $active={activeTab === 'area'}
          onClick={() => handleTabChange('area')}
        >
          Joinable Events
        </TabButton>
        <TabButton
          $active={activeTab === 'my'}
          onClick={() => handleTabChange('my')}
        >
          My Upcoming Events
        </TabButton>
      </Tabs>

      <ContentContainer>
        {loading ? (
          <LoadingContainer>
            <StyledSpinner />
          </LoadingContainer>
        ) : (
          <EventList>
            {events.length > 0 ? (
              events.map((event) => (
                <EventItem
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                >
                  <EventItemContent>
                    <LocationContainer>
                      <LocationText>{event.location}</LocationText>
                      {renderParticipants(event)}
                    </LocationContainer>
                    <TimeContainer>
                      <TimeText>{formatEventTime(event.eventTime)}</TimeText>
                      {event.eventResult && (
                        <ResultBadge>Results Available</ResultBadge>
                      )}
                    </TimeContainer>
                  </EventItemContent>
                </EventItem>
              ))
            ) : (
              <EmptyState>
                {activeTab === 'my' ? (
                  'no upcoming events...'
                ) : (
                  <>
                    no events found...
                    <button onClick={() => navigate('event')}>
                      Create Event
                    </button>
                  </>
                )}
              </EmptyState>
            )}
          </EventList>
        )}

        {!loading && events.length > 0 && (
          <PaginationContainer>
            <PageInfo>
              Showing {startItem}-{endItem} of {totalCount}
            </PageInfo>
            <PageButtonsContainer>
              <PageButton
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
              >
                Previous
              </PageButton>
              <PageButton
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                Next
              </PageButton>
            </PageButtonsContainer>
          </PaginationContainer>
        )}
      </ContentContainer>
    </Container>
  );
};

export default UpcomingEvents;

const Container = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ContentContainer = styled.div`
  padding: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
`;

const EventItem = styled.div`
  padding: 1rem 0.5rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const EventItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const LocationContainer = styled.div``;

const LocationText = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ParticipantsText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const TimeContainer = styled.div`
  text-align: right;
`;

const TimeText = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
`;

const ResultBadge = styled.div`
  display: inline-block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background-color: #dcfce7;
  color: #166534;
  border-radius: 9999px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.5rem;
  border-top: 1px solid #e2e8f0;
`;

const PageInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const PageButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  color: ${(props) => (props.disabled ? '#d1d5db' : '#3b82f6')};
  font-size: 0.875rem;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? 'white' : '#f9fafb')};
  }

  &:focus {
    outline: none;
    ring: 2px solid #93c5fd;
  }
`;
