import { Calendar } from 'lucide-react';
import { useState } from 'react';
import EventList from '../Events/EventList';
import LogResultModal from '../Events/LogResultModal';
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
}

const LeagueEventsSection = ({
  events,
  isTeamEvents,
  showCreateButton,
  onCreateEvent,
}: LeagueEventsSectionProps) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentTime = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventTime) > currentTime
  );
  const completedEvents = events.filter(
    (event) => new Date(event.eventTime) <= currentTime
  );

  const handleLogResult = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSubmitResult = (formData: {
    winningTeam: string;
    score: string;
    starPlayerUserId: string;
  }) => {
    console.log({
      ...formData,
      eventId: selectedEvent?.id,
    });
  };

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
            onLogResult={handleLogResult}
          />
        </EventsSection>
      )}

      {/* Log Result Modal */}
      <LogResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        onSubmit={handleSubmitResult}
      />
    </>
  );
};

export default LeagueEventsSection;
