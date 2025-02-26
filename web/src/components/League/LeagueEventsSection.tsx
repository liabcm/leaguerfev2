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
  events: any[]; // Adjust type as per your Event model
  isTeamEvents: boolean;
  showCreateButton?: boolean;
  onCreateEvent?: () => void;
}

const LeagueEventsSection = ({
  events,
  isTeamEvents,
  showCreateButton,
  onCreateEvent,
}: LeagueEventsSectionProps) => {
  return (
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
      <EventList events={events} isTeamEvents={isTeamEvents} />
    </EventsSection>
  );
};

export default LeagueEventsSection;
