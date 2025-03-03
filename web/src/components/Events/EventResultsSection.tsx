import { Calendar, CheckSquare } from 'lucide-react';
import styled from 'styled-components';
import { EventResult } from '../../models/EventResult';
import {
  EventsHeader,
  EventsSection,
  HeaderTopRow,
  MembersList,
} from '../League/SharedLeagueStyles';

interface EventResultsSectionProps {
  eventResults: EventResult[];
}

const EventResultsSection = ({ eventResults }: EventResultsSectionProps) => {
  return (
    <EventsSection>
      <EventsHeader>
        <HeaderTopRow>
          <CheckSquare size={20} />
          <h3>Completed Events</h3>
        </HeaderTopRow>
      </EventsHeader>
      <ResultsList>
        {eventResults.length === 0 ? (
          <NoResults>No completed events yet</NoResults>
        ) : (
          eventResults.map((result) => (
            <ResultItem key={result.id}>
              <ResultHeader>
                <ResultTitle>{result.location}</ResultTitle>
              </ResultHeader>
              <ResultDetails>
                <ResultDetail>
                  <Calendar size={16} />
                  <span>{new Date(result.eventTime).toLocaleDateString()}</span>
                </ResultDetail>
                <ResultDetail>
                  <span>Location: {result.location}</span>
                </ResultDetail>
                <ResultDetail>
                  <span>Result: {result.score}</span>
                </ResultDetail>
              </ResultDetails>
            </ResultItem>
          ))
        )}
      </ResultsList>
    </EventsSection>
  );
};

export default EventResultsSection;

const ResultsList = styled(MembersList)``;

const NoResults = styled.div`
  padding: 1rem;
  text-align: center;
  color: #6b7280;
`;

const ResultItem = styled.div`
  padding: clamp(0.75rem, 2vw, 1rem);
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ResultTitle = styled.h4`
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  font-weight: 600;
  margin: 0;
`;

const ResultDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ResultDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;
