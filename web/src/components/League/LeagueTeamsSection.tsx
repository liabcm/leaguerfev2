import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { League } from '../../models/League';
import {
  ActionContainer,
  Button,
  Count,
  HoverableMember,
  Input,
  MembersHeader,
  MembersList,
  MembersSection,
} from './SharedLeagueStyles';

interface LeagueTeamsSectionProps {
  league: League;
  isManaged: boolean;
  onAddTeam?: () => void;
  onRequestSend?: (teamName: string) => Promise<void>;
  joined?: boolean;
}

const LeagueTeamsSection = ({
  league,
  isManaged,
  onAddTeam,
  onRequestSend,
  joined,
}: LeagueTeamsSectionProps) => {
  const [showAddTeamInput, setShowAddTeamInput] = useState(false);
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

  const handleRequestSendButtonClick = async () => {
    if (showAddTeamInput) {
      if (onRequestSend) {
        await onRequestSend(teamName);
      }
      setShowAddTeamInput(false);
    } else {
      setShowAddTeamInput(true);
    }
  };

  const handleRowClick = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  return (
    <MembersSection>
      <MembersHeader>
        <h3>Teams</h3>
        <Count>{league.teams?.length || 0}</Count>
        {isManaged && onAddTeam && (
          <ActionContainer>
            <Button onClick={onAddTeam}>Add Team</Button>
          </ActionContainer>
        )}
      </MembersHeader>
      <MembersList>
        {league.teams?.map((team) => (
          <HoverableMember
            onClick={() => handleRowClick(team.id)}
            key={team.id}
          >
            {team.name}
          </HoverableMember>
        ))}
      </MembersList>
      {!isManaged && joined && (
        <ActionContainer>
          <GreenButton onClick={handleRequestSendButtonClick}>
            {showAddTeamInput ? 'Send' : 'Request Team'}
          </GreenButton>
        </ActionContainer>
      )}
      {showAddTeamInput && (
        <ActionContainer>
          <Input
            placeholder='Team Name'
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </ActionContainer>
      )}
    </MembersSection>
  );
};

export default LeagueTeamsSection;

const GreenButton = styled.button`
  background-color: rgb(22, 179, 33);
  border: none;
  color: white;
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
`;
