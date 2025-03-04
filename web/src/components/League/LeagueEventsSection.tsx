import { Calendar } from 'lucide-react';
import EventList from '../Events/EventList';
import {
  ActionContainer,
  Button,
  EventsHeader,
  EventsSection,
  HeaderTopRow,
} from './SharedLeagueStyles';

interface LeagueEventsSectionProps {
  events: any[];
  isTeamEvents: boolean;
  showCreateButton?: boolean;
  onCreateEvent?: () => void;
  onLogResult?: (event: any) => void;
}

const LeagueEventsSection = ({
  events,
  isTeamEvents,
  showCreateButton,
  onCreateEvent,
  onLogResult,
}: LeagueEventsSectionProps) => {
  const currentTime = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventTime) > currentTime
  );
  const completedEvents = events.filter(
    (event) => new Date(event.eventTime) <= currentTime
  );

  return (
    <>
      {/* Upcoming Events Section */}
      <EventsSection>
        <EventsHeader>
          <HeaderTopRow>
            <Calendar size={20} />
            <h3>Upcoming Events</h3>
          </HeaderTopRow>
          {showCreateButton && onCreateEvent && (
            <ActionContainer>
              <Button onClick={onCreateEvent}>Create New Event</Button>
            </ActionContainer>
          )}
        </EventsHeader>
        <EventList events={upcomingEvents} isTeamEvents={isTeamEvents} />
      </EventsSection>

      {/* Completed Events Section */}
      {completedEvents.length > 0 && (
        <EventsSection>
          <EventsHeader>
            <HeaderTopRow>
              <Calendar size={20} />
              <h3>Completed Events</h3>
            </HeaderTopRow>
          </EventsHeader>
          <EventList
            events={completedEvents}
            isTeamEvents={isTeamEvents}
            isCompletedSection
            onLogResult={onLogResult}
          />
        </EventsSection>
      )}
    </>
  );
};

export default LeagueEventsSection;
