import { useNavigate } from 'react-router-dom';
import { League } from '../../models/League';
import {
  ActionContainer,
  Button,
  Count,
  HoverableMember,
  MembersHeader,
  MembersList,
  MembersSection,
} from './SharedLeagueStyles';

interface LeagueTeamsSectionProps {
  league: League;
  isManaged: boolean;
  onAddTeam?: () => void;
}

const LeagueTeamsSection = ({
  league,
  isManaged,
  onAddTeam,
}: LeagueTeamsSectionProps) => {
  const navigate = useNavigate();

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
    </MembersSection>
  );
};

export default LeagueTeamsSection;
