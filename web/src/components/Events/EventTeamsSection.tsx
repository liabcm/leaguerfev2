// EventTeamsSection.tsx
import { Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Event } from '../../models/Event';
import {
  ActionContainer,
  Button,
  Count,
  MembersHeader,
  MembersList,
  MembersSection,
} from '../League/SharedLeagueStyles';

interface EventTeamsSectionProps {
  event: Event;
  isManaged: boolean;
  onRemove: (teamId: string) => void;
  onSearchTeams: () => void;
}

const EventTeamsSection = ({
  event,
  isManaged,
  onRemove,
  onSearchTeams,
}: EventTeamsSectionProps) => {
  const navigate = useNavigate();

  const handleRowClick = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  const handleRemoveClick = (e: React.MouseEvent, teamId: string) => {
    e.stopPropagation(); // Prevent navigating when clicking remove
    onRemove(teamId);
  };

  return (
    <MembersSection>
      <MembersHeader>
        <h3>Teams</h3>
        <Count>{event.teams?.length || 0}</Count>
        {isManaged && onSearchTeams && (
          <ActionContainer>
            <Button onClick={onSearchTeams}>Search Teams</Button>
          </ActionContainer>
        )}
      </MembersHeader>
      <MembersList>
        {event.teams?.map((team) => (
          <TeamRow
            key={team.teamId}
            onClick={() => handleRowClick(team.teamId)}
          >
            <span>{team.name}</span>
            {isManaged && (
              <RemoveButton onClick={(e) => handleRemoveClick(e, team.teamId)}>
                <Trash2 size={16} />
              </RemoveButton>
            )}
          </TeamRow>
        ))}
      </MembersList>
    </MembersSection>
  );
};

export default EventTeamsSection;

const TeamRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  cursor: pointer;
  &:hover {
    background-color: #e5e7eb;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }
`;
