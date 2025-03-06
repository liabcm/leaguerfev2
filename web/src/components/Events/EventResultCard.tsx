import { format } from 'date-fns';
import { Clock, MapPin, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { EventResult } from '../../models/EventResult';
import BackButton from '../General/BackButton';

// Styled components
const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  max-width: 28rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
`;

const Badge = styled.span`
  background-color: #dbeafe;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 0.25rem;
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const TeamContainer = styled.div`
  text-align: center;
  flex: 1;
`;

const TeamLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const WinnerName = styled.p`
  font-weight: bold;
  color: #16a34a;
`;

const LoserName = styled.p`
  font-weight: bold;
  color: #dc2626;
`;

const ScoreDisplay = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0 1rem;
`;

const Divider = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  color: #4b5563;
  margin-left: 0.5rem;
`;

const StarPlayerText = styled.p`
  color: #4b5563;
  margin-left: 0.5rem;

  span {
    font-weight: 500;
  }
`;

const LoadingState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
`;

const ErrorState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #dc2626;
`;

const EventResultCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [eventResult, setEventResult] = useState<EventResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getEventResult } = useLeagueApi();

  useEffect(() => {
    const fetchEventResult = async () => {
      if (!id) {
        setError('No event ID found in URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getEventResult(id);
        setEventResult(result);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event result');
        setLoading(false);
      }
    };

    fetchEventResult();
  }, [id]);

  if (loading) {
    return <LoadingState>Loading event result...</LoadingState>;
  }

  if (error || !eventResult) {
    return <ErrorState>{error || 'Event result not found'}</ErrorState>;
  }

  const {
    score,
    winningTeam,
    losingTeam,
    winningUser,
    losingUser,
    starPlayer,
    event,
  } = eventResult;

  // Determine if it's a team match or individual match
  const isTeamMatch = Boolean(winningTeam && losingTeam);

  // Get winner and loser names directly from the updated model
  const winnerName = isTeamMatch
    ? winningTeam?.name || 'Unknown Team'
    : winningUser?.name || 'Unknown Player';

  const loserName = isTeamMatch
    ? losingTeam?.name || 'Unknown Team'
    : losingUser?.name || 'Unknown Player';

  // Format the date and time
  const formattedTime = event.eventTime
    ? format(new Date(event.eventTime), 'MMM d, yyyy h:mm a')
    : 'Time not specified';

  return (
    <div>
      <BackButton />
      <Card>
        <CardHeader>
          <Title>Match Result</Title>
          <Badge>{isTeamMatch ? 'Team Match' : 'Individual Match'}</Badge>
        </CardHeader>

        <ScoreContainer>
          <TeamContainer>
            <TeamLabel>Winner</TeamLabel>
            <WinnerName>{winnerName}</WinnerName>
          </TeamContainer>

          <ScoreDisplay>{score}</ScoreDisplay>

          <TeamContainer>
            <TeamLabel>Loser</TeamLabel>
            <LoserName>{loserName}</LoserName>
          </TeamContainer>
        </ScoreContainer>

        <Divider>
          <InfoRow>
            <MapPin size={16} color='#6b7280' />
            <InfoText>{event.location || 'Location not specified'}</InfoText>
          </InfoRow>

          <InfoRow>
            <Clock size={16} color='#6b7280' />
            <InfoText>{formattedTime}</InfoText>
          </InfoRow>

          {starPlayer && (
            <InfoRow>
              <Star size={16} color='#f59e0b' fill='#f59e0b' />
              <StarPlayerText>
                Star Player: <span>{starPlayer.name}</span>
              </StarPlayerText>
            </InfoRow>
          )}
        </Divider>
      </Card>
    </div>
  );
};

export default EventResultCard;
