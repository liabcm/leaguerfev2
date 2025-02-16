import { Trophy, Users } from 'lucide-react';
import { League } from '../../models/League';
import styled from 'styled-components';

export const LeagueTabContent = ({
  league,
  joined,
  onJoin,
  onLeave,
}: {
  league: League;
  joined: boolean;
  onJoin: () => void;
  onLeave: () => void;
}) => (
  <>
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

    {!joined ? (
      <StyledButton onClick={onJoin}>Join League</StyledButton>
    ) : (
      <StyledButton color='red' onClick={onLeave}>
        Leave League
      </StyledButton>
    )}

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
  </>
);

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

export const StyledButton = styled.button<{ color?: string }>`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) =>
    props.color === 'red' ? '#ef4444' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.color === 'red' ? '#dc2626' : '#2563eb'};
  }

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.color === 'red'
          ? 'rgba(239, 68, 68, 0.5)'
          : 'rgba(59, 130, 246, 0.5)'};
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
