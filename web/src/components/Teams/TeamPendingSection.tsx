import { User } from 'lucide-react';
import styled from 'styled-components';
import { TeamUser } from '../../models/TeamUser';

interface TeamPendingSectionProps {
  title: string;
  items?: TeamUser[];
  onAccept?: (member: TeamUser) => Promise<void>;
  onDecline: (member: TeamUser) => Promise<void>;
  type: 'invite' | 'request';
  isLoading?: boolean;
}

const TeamPendingSection = ({
  title,
  items = [],
  onAccept,
  onDecline,
  type,
  isLoading = false,
}: TeamPendingSectionProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <Container>
      <Header>
        <User size={20} />
        <Title>{title}</Title>
        <Count>{items.length}</Count>
      </Header>

      <ItemsList>
        {items.map((item) => (
          <ItemCard key={item.userId}>
            <ItemInfo>
              <UserName>{item.name}</UserName>
              <StatusText>
                {type === 'invite' ? 'Invited' : 'Requested'} on{' '}
              </StatusText>
            </ItemInfo>
            <ButtonGroup>
              {type === 'request' && (
                <ActionButton
                  onClick={() => onAccept!(item)}
                  disabled={isLoading}
                  $variant='primary'
                >
                  Accept
                </ActionButton>
              )}
              <ActionButton
                onClick={() => onDecline(item)}
                disabled={isLoading}
                $variant='danger'
              >
                {type === 'invite' ? 'Remove' : 'Decline'}
              </ActionButton>
            </ButtonGroup>
          </ItemCard>
        ))}
      </ItemsList>
    </Container>
  );
};

export default TeamPendingSection;

const Container = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  margin-top: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
`;

const Count = styled.span`
  background-color: #e5e7eb;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 16rem;
  overflow-y: auto;
`;

const ItemCard = styled.div`
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.p`
  font-weight: 500;
`;

const StatusText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'danger' }>`
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease;

  background-color: ${({ $variant }) =>
    $variant === 'primary' ? '#3b82f6' : '#ef4444'};

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === 'primary' ? '#2563eb' : '#dc2626'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
