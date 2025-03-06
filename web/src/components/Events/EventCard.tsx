import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { Event } from '../../models/Event';
import MembersSection from '../General/MembersSection';

// Styled components
const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 24px 0;
  position: relative;
`;

const EventHeader = styled.div`
  background: linear-gradient(135deg, #4a6ff3, #7e57c2);
  color: white;
  padding: 24px;
  position: relative;
`;

const EventTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px 0;
  flex-wrap: wrap;
`;

const TeamBox = styled.div`
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 0 8px;
  text-align: center;
  backdrop-filter: blur(4px);
  flex: 1;
  min-width: 120px;
  max-width: 200px;
`;

const TeamName = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const VS = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin: 0 16px;
  color: rgba(255, 255, 255, 0.8);
`;

const EventDetails = styled.div`
  padding: 24px;
`;

const LocationTimeSection = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const LocationContainer = styled.div`
  flex: 1;
  min-width: 250px;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  position: relative;

  &::before {
    content: '📍';
    font-size: 24px;
    position: absolute;
    top: 16px;
    left: 16px;
  }
`;

const TimeContainer = styled.div`
  flex: 1;
  min-width: 250px;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  position: relative;

  &::before {
    content: '🕒';
    font-size: 24px;
    position: absolute;
    top: 16px;
    left: 16px;
  }
`;

const InfoLabel = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  padding-left: 36px;
`;

const InfoContent = styled.p`
  margin: 0;
  font-size: 18px;
  padding-left: 36px;
`;

const LoadingState = styled.div`
  padding: 48px 24px;
  text-align: center;
  font-size: 18px;
  color: #666;
`;

const ErrorState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #e53935;
  font-size: 18px;
`;

const EventCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getEventById } = useLeagueApi();

  const members = event?.users?.length
    ? event.users
    : event?.teams?.map((t) => ({ id: t.teamId, name: t.name }));

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) {
          setError('Event ID not found in route');
          setLoading(false);
          return;
        }

        const eventData = await getEventById(id);
        setEvent(eventData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load event details');
        setLoading(false);
        console.error('Error fetching event:', err);
      }
    };

    fetchEvent();
  }, [id]);

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    }).format(date);
  };

  if (loading) {
    return (
      <CardContainer>
        <LoadingState>Loading event details...</LoadingState>
      </CardContainer>
    );
  }

  if (error || !event) {
    return (
      <CardContainer>
        <ErrorState>{error || 'Event not found'}</ErrorState>
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <EventHeader>
        <EventTitle>Event Details</EventTitle>

        {event.teams && event.teams.length > 0 ? (
          <TeamsContainer>
            {event.teams.map((team, index) => (
              <React.Fragment key={team.teamId}>
                <TeamBox>
                  <TeamName>{team.name}</TeamName>
                </TeamBox>
                {index < event.teams!.length - 1 && <VS>VS</VS>}
              </React.Fragment>
            ))}
          </TeamsContainer>
        ) : null}
      </EventHeader>

      <EventDetails>
        <LocationTimeSection>
          <LocationContainer>
            <InfoLabel>Location</InfoLabel>
            <InfoContent>{event.location}</InfoContent>
          </LocationContainer>

          <TimeContainer>
            <InfoLabel>Date & Time</InfoLabel>
            <InfoContent>{formatEventTime(event.eventTime)}</InfoContent>
          </TimeContainer>
        </LocationTimeSection>
        <MembersSection
          members={members!.map((u) => {
            return {
              userId: u.id,
              parentId: event.id,
              parentName: event.location,
              name: u.name,
            };
          })}
        />
      </EventDetails>
    </CardContainer>
  );
};

export default EventCard;
