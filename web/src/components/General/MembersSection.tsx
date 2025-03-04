import { MemberModel } from '../../models/MemberModel';
import MemberRow from '../League/MemberRow';
import {
  ActionContainer,
  Button,
  Count,
  MembersHeader,
  MembersList,
  MembersSection,
} from '../League/SharedLeagueStyles';

interface MembersSectionProps {
  members: MemberModel[];
  isManaged?: boolean;
  onRemove?: (memberId: string) => void;
  onSearchUsers?: () => void;
}

const GeneralMembersSection = ({
  members,
  isManaged = false,
  onRemove,
  onSearchUsers,
}: MembersSectionProps) => {
  return (
    <MembersSection>
      <MembersHeader>
        <h3>Participants</h3>
        <Count>{members.length || 0}</Count>
        {isManaged && onSearchUsers && (
          <ActionContainer>
            <Button onClick={onSearchUsers}>Add Participants</Button>
          </ActionContainer>
        )}
      </MembersHeader>
      <MembersList>
        {members.map((user) => (
          <MemberRow
            key={user.userId}
            member={user}
            isManaged={isManaged}
            onRemove={onRemove}
          />
        ))}
      </MembersList>
    </MembersSection>
  );
};

export default GeneralMembersSection;
