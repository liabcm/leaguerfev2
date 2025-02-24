import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { User } from '../../models/User'; // You'll need to create this type

interface SearchUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteUser: (user: User) => Promise<void>;
  leagueId: string;
}

const SearchUsersModal = ({
  isOpen,
  onClose,
  onInviteUser,
  leagueId,
}: SearchUsersModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [invitingUsers, setInvitingUsers] = useState<Set<string>>(new Set());
  const { searchUsers } = useLeagueApi();

  const fetchUsers = async (query: string, pageNum: number) => {
    setLoading(true);
    try {
      const data = await searchUsers(leagueId, query, pageNum);
      if (pageNum === 1) {
        setUsers(data.items);
      } else {
        setUsers((prev) => [...prev, ...data.items]);
      }
      setHasMore(data.items.length === data.pageSize);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && searchTerm) {
      const debounceTimer = setTimeout(() => {
        setPage(1);
        fetchUsers(searchTerm, 1);
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, isOpen]);

  const handleInvite = async (user: User) => {
    console.log(users);
    setInvitingUsers((prev) => new Set(prev).add(user.id));
    try {
      await onInviteUser(user);
      // Optionally remove the user from the list after successful invite
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error('Error inviting user:', error);
    } finally {
      setInvitingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(user.id);
        return newSet;
      });
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(searchTerm, nextPage);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Search Users</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <SearchInput
          type='text'
          placeholder='Search users...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <UserList>
          {users.map((user) => (
            <UserRow key={user.id}>
              <UserInfo>
                <UserDetails>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserDetails>
              </UserInfo>
              <InviteButton
                onClick={() => handleInvite(user)}
                disabled={invitingUsers.has(user.id)}
              >
                {invitingUsers.has(user.id) ? 'Inviting...' : 'Invite'}
              </InviteButton>
            </UserRow>
          ))}
        </UserList>

        {loading && <LoadingText>Loading...</LoadingText>}

        {!loading && hasMore && (
          <LoadMoreButton onClick={loadMore}>Load More</LoadMoreButton>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default SearchUsersModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  color: #666;
`;

const SearchInput = styled.input`
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 20px;
  width: 100%;
`;

const UserList = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const UserRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const UserEmail = styled.span`
  color: #666;
  font-size: 14px;
`;

const InviteButton = styled.button`
  padding: 8px 16px;
  min-width: 100px;
`;

const LoadMoreButton = styled.button`
  margin-top: 16px;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;
