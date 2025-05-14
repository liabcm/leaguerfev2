import { EventJoinType } from '../../../models/Event';
import { EventFormData, EventType } from '../../../models/EventTypes';
import {
  SummaryContainer,
  SummaryItem,
  SummarySection,
  SummaryTitle,
} from './StepStyled';

type Props = {
  formData: EventFormData;
  onSubmit: () => void;
};

export const SummaryStep = ({ formData, onSubmit }: Props) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date);
  };

  const getEventTypeName = (type: EventType) => {
    return EventType[type] || 'Unknown';
  };

  const getJoinTypeName = (type: EventJoinType) => {
    return EventJoinType[type] || 'Unknown';
  };

  return (
    <SummaryContainer>
      <SummaryTitle>Event Summary</SummaryTitle>

      <SummarySection>
        <h3>Basic Information</h3>
        <SummaryItem>
          <strong>Location:</strong> {formData.location}
        </SummaryItem>
        <SummaryItem>
          <strong>Date & Time:</strong> {formatDate(formData.eventTime)}
        </SummaryItem>
        <SummaryItem>
          <strong>Event Type:</strong> {getEventTypeName(formData.eventType)}
        </SummaryItem>
        <SummaryItem>
          <strong>Join Type:</strong> {getJoinTypeName(formData.joinType)}
        </SummaryItem>
        <SummaryItem>
          <strong>Max Participants:</strong> {formData.maxParticipants}
        </SummaryItem>
        <SummaryItem>
          <strong>Team Event:</strong> {formData.isTeamEvent ? 'Yes' : 'No'}
        </SummaryItem>
      </SummarySection>

      <SummarySection>
        <h3>Participants</h3>
        {formData.participants.length > 0 ? (
          <ul>
            {formData.participants.map((participant) => (
              <SummaryItem as='li' key={participant}>
                {participant}
              </SummaryItem>
            ))}
          </ul>
        ) : (
          <SummaryItem>No participants selected</SummaryItem>
        )}
      </SummarySection>

      {(formData.eventType === EventType.MultiRound ||
        formData.eventType === EventType.Tournament) && (
        <SummarySection>
          <h3>Matches</h3>
          {formData.matches.length > 0 ? (
            <ul>
              {formData.matches.map((match) => (
                <SummaryItem as='li' key={match.matchNumber}>
                  <strong>Match #{match.matchNumber}</strong> (Round{' '}
                  {match.round}): {match.opponent1Id} vs {match.opponent2Id}
                </SummaryItem>
              ))}
            </ul>
          ) : (
            <SummaryItem>No matches created</SummaryItem>
          )}
        </SummarySection>
      )}

      <button
        onClick={onSubmit}
        style={{
          padding: '1rem 2rem',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '2rem',
        }}
      >
        Confirm & Create Event
      </button>
    </SummaryContainer>
  );
};
