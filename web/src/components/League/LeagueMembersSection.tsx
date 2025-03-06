import { League } from '../../models/League';
import MemberRow from './MemberRow';
import {
  ActionContainer,
  Button,
  Count,
  MembersHeader,
  MembersList,
  MembersSection,
} from './SharedLeagueStyles';

interface LeagueMembersSectionProps {
  league: League;
  isManaged: boolean;
  onRemove?: (memberId: string) => void;
  onSearchUsers?: () => void;
}

const LeagueMembersSection = ({
  league,
  isManaged,
  onRemove,
  onSearchUsers,
}: LeagueMembersSectionProps) => {
  return (
    <MembersSection>
      <MembersHeader>
        <h3>Members</h3>
        <Count>{league.leagueMembers.length || 0}</Count>
        {isManaged && onSearchUsers && (
          <ActionContainer>
            <Button onClick={onSearchUsers}>Search Users</Button>
          </ActionContainer>
        )}
      </MembersHeader>
      <MembersList>
        {league.leagueMembers.map((member) => (
          <MemberRow
            key={member.userId}
            member={{
              userId: member.userId,
              parentId: member.leagueId,
              parentName: member.leagueName,
              name: member.name,
            }}
            isManaged={isManaged}
            onRemove={onRemove}
          />
        ))}
      </MembersList>
    </MembersSection>
  );
};

export default LeagueMembersSection;
