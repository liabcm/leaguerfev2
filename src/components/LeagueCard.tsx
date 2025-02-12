import { Trophy, Users } from 'lucide-react';
import { League } from '../models/League';
import { useLeagueApi } from '../api/useLeagueApi';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from './General/BackButton';
import styled, { keyframes } from 'styled-components';

const LeagueCard = () => {
  const { id } = useParams<{ id: string }>();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getLeagueById, joinLeague } = useLeagueApi();

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          throw new Error('No league ID provided');
        }
        const data = await getLeagueById(id);
        setLeague(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch league');
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [id]); // Re-fetch when id changes

  const handleJoin = async () => {
    if (league) {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          throw new Error('No league ID provided');
        }
        await joinLeague(id);
        const data = await getLeagueById(id);
        setLeague(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch league');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <StyledLoadingContainer>
        <StyledSpinner />
      </StyledLoadingContainer>
    );
  }

  if (error || !league) {
    return (
      <StyledCard>
        <StyledErrorMessage>{error || 'League not found'}</StyledErrorMessage>
      </StyledCard>
    );
  }

  return (
    <StyledContainer>
      <BackButton />
      <StyledCard>
        <StyledCardHeader>
          <StyledTitle>{league.name}</StyledTitle>
          <StyledBadge $isPublic={league.isPublic}>
            {league.isPublic ? 'Public' : 'Private'}
          </StyledBadge>
        </StyledCardHeader>

        <StyledInfoContainer>
          <StyledInfoItem>
            <Trophy size={20} />
            <span>{league.isCompetitive ? 'Competitive' : 'Casual'}</span>
          </StyledInfoItem>

          <StyledInfoItem>
            <Users size={20} />
            <span>{league.sport}</span>
          </StyledInfoItem>
        </StyledInfoContainer>

        <StyledButton onClick={handleJoin}>Join League</StyledButton>

        <StyledMembersSection>
          <StyledMembersHeader>
            <h3>Members</h3>
            <StyledMemberCount>{league.leagueUsers.length}</StyledMemberCount>
          </StyledMembersHeader>
          <StyledMembersList>
            {league.leagueUsers.map((member) => (
              <StyledMemberItem key={member.id}>{member.name}</StyledMemberItem>
            ))}
          </StyledMembersList>
        </StyledMembersSection>
      </StyledCard>
    </StyledContainer>
  );
};

export default LeagueCard;

// Styled components at the bottom
const StyledContainer = styled.div`
  padding-top: 4rem;
`;

const StyledCard = styled.div`
  max-width: 24rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 0 auto;
`;

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StyledTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
`;

const StyledBadge = styled.span<{ $isPublic: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ $isPublic }) => ($isPublic ? '#60a5fa' : '#6b7280')};
  color: white;
`;

const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StyledInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-weight: 500;

  svg {
    color: #6b7280;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const StyledErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  padding: 1rem;
`;

const StyledMembersSection = styled.div`
  margin-bottom: 1.5rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

const StyledMembersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
  }
`;

const StyledMemberCount = styled.span`
  background-color: #e5e7eb;
  color: #4b5563;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const StyledMembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 12rem;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 0.125rem;
  }
`;

const StyledMemberItem = styled.div`
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
`;
