import styled from 'styled-components';
import { LeagueUser } from '../../models/LeagueUser';
import { TeamUser } from '../../models/TeamUser';

interface RequestsListProps<T extends LeagueUser | TeamUser> {
  items: T[];
  entityType: 'league' | 'team';
  onCancel: (item: T) => void;
  onView: (id: string) => void;
  requestType?: 'join' | 'team-creation';
  emptyMessage: string;
}

function RequestsList<T extends LeagueUser | TeamUser>({
  items,
  entityType,
  onCancel,
  onView,
  requestType = 'join',
  emptyMessage,
}: RequestsListProps<T>) {
  if (items.length === 0) {
    return <NoRequests>{emptyMessage}</NoRequests>;
  }

  return (
    <ListContainer>
      {items.map((item) => {
        const id =
          entityType === 'league'
            ? 'leagueId' in item
              ? item.leagueId
              : ''
            : 'teamId' in item
            ? item.teamId
            : '';
        const name =
          entityType === 'league'
            ? 'leagueName' in item
              ? item.leagueName
              : ''
            : 'teamName' in item
            ? item.teamName
            : '';
        const userId = item.userId;
        const requestKey = `${id}-${userId}`;

        return (
          <RequestCard key={requestKey}>
            <EntityName>{name}</EntityName>
            <Description>
              {requestType === 'team-creation'
                ? `Your request to create this team is pending`
                : `Your request to join this ${entityType} is pending`}
            </Description>
            <ButtonContainer>
              <CancelButton onClick={() => onCancel(item)}>
                Cancel Request
              </CancelButton>
              <ViewEntityButton onClick={() => onView(id)}>
                View {entityType === 'league' ? 'League' : 'Team'}
              </ViewEntityButton>
            </ButtonContainer>
          </RequestCard>
        );
      })}
    </ListContainer>
  );
}

export default RequestsList;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const RequestCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EntityName = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #e53935;
  }
`;

const ViewEntityButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #1976d2;
  }
`;

const NoRequests = styled.div`
  text-align: center;
  color: #666;
  padding: 1rem;
`;
