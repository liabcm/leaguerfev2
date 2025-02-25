// components/EventList.tsx
import styled from 'styled-components';
import { Event } from '../../models/Event';

interface EventListProps {
  events: Event[];
  isTeamEvents: boolean;
}

const EventList = ({ events, isTeamEvents }: EventListProps) => {
  if (!events || events.length === 0) {
    return <NoEventsMessage>No events yet.</NoEventsMessage>;
  }

  return (
    <StyledEventList>
      {events.map((event) => (
        <StyledEventItem key={event.id}>
          <Location>{event.location}</Location>
          <EventTime>
            {new Date(event.eventTime).toLocaleDateString(undefined, {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </EventTime>
          <Opponents>
            {isTeamEvents
              ? event.teams?.map((t) => t.name).join(' vs ')
              : event.users?.map((u) => u.name).join(' vs ') || 'TBD'}
          </Opponents>
        </StyledEventItem>
      ))}
    </StyledEventList>
  );
};

export default EventList;

const StyledEventList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const StyledEventItem = styled.li`
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const EventTime = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const Opponents = styled.div`
  font-size: 0.875rem;
  color: #334155;
  margin-top: 0.25rem;
`;

const Location = styled.div`
  font-size: 0.875rem;
  color: rgb(171, 64, 175);
  margin-top: 0.25rem;
`;

const NoEventsMessage = styled.p`
  color: #94a3b8;
  text-align: center;
  padding: 1rem 0;
`;
