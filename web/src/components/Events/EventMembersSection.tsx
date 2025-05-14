// EventMembersSection.tsx
import { Event } from '../../models/Event';
import MemberRow from '../League/MemberRow';
import {
  ActionContainer,
  Button,
  Count,
  MembersHeader,
  MembersList,
  MembersSection,
} from '../League/SharedLeagueStyles';

interface EventMembersSectionProps {
  event: Event;
  isManaged: boolean;
  onRemove: (userId: string) => void;
  onSearchUsers: () => void;
}

const EventMembersSection = ({
  event,
  isManaged,
  onRemove,
  onSearchUsers,
}: EventMembersSectionProps) => {
  const members = event.isTeamEvent
    ? event.teamPlayers?.map((tp) => ({ userId: tp.id, name: tp.name }))
    : event.users;

  return (
    <MembersSection>
      <MembersHeader>
        <h3>Members</h3>
        <Count>{event.users?.length || 0}</Count>
        {isManaged && onSearchUsers && (
          <ActionContainer>
            <Button onClick={onSearchUsers}>Search Users</Button>
          </ActionContainer>
        )}
      </MembersHeader>
      <MembersList>
        {members?.map((user) => (
          <MemberRow
            key={user.userId}
            member={{
              userId: user.userId,
              parentId: event.id,
              parentName: event.location,
              name: user.name,
            }}
            isManaged={isManaged}
            onRemove={onRemove}
          />
        ))}
      </MembersList>
    </MembersSection>
  );
};

export default EventMembersSection;
