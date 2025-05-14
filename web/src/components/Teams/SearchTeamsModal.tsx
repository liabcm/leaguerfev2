import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { EventTeam } from '../../models/EventTeam';
import { PagedResult } from '../../models/PagedResult';

interface SearchTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteTeam: (team: EventTeam) => Promise<void>;
  onSearchTeams: (
    query: string,
    pageNum: number
  ) => Promise<PagedResult<EventTeam>>;
}

const SearchTeamsModal = ({
  isOpen,
  onClose,
  onInviteTeam,
  onSearchTeams,
}: SearchTeamsModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<EventTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [invitingTeams, setInvitingTeams] = useState<Set<string>>(new Set());

  const fetchTeams = async (query: string, pageNum: number) => {
    setLoading(true);
    try {
      const data = await onSearchTeams(query, pageNum);
      if (pageNum === 1) {
        setTeams(data.items);
      } else {
        setTeams((prev) => [...prev, ...data.items]);
      }
      setHasMore(data.items.length === data.pageSize);
    } catch (error) {
      console.error('Error searching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && searchTerm) {
      const debounceTimer = setTimeout(() => {
        setPage(1);
        fetchTeams(searchTerm, 1);
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, isOpen]);

  const handleInvite = async (team: EventTeam) => {
    setInvitingTeams((prev) => new Set(prev).add(team.teamId));
    try {
      await onInviteTeam(team);
      setTeams((prev) => prev.filter((t) => t.teamId !== team.teamId));
    } catch (error) {
      console.error('Error inviting team:', error);
    } finally {
      setInvitingTeams((prev) => {
        const newSet = new Set(prev);
        newSet.delete(team.teamId);
        return newSet;
      });
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTeams(searchTerm, nextPage);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Search Teams</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <SearchInput
          type='text'
          placeholder='Search teams...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <TeamList>
          {teams.map((team) => (
            <TeamRow key={team.teamId}>
              <TeamInfo>
                <TeamName>{team.name}</TeamName>
              </TeamInfo>
              <InviteButton
                onClick={() => handleInvite(team)}
                disabled={invitingTeams.has(team.teamId)}
              >
                {invitingTeams.has(team.teamId) ? 'Inviting...' : 'Invite'}
              </InviteButton>
            </TeamRow>
          ))}
        </TeamList>

        {loading && <LoadingText>Loading...</LoadingText>}

        {!loading && hasMore && (
          <LoadMoreButton onClick={loadMore}>Load More</LoadMoreButton>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default SearchTeamsModal;

// Reuse styles from SearchUsersModal with some renaming
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

const TeamList = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const TeamRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TeamName = styled.span`
  font-weight: 500;
`;

const InviteButton = styled.button`
  padding: 8px 16px;
  min-width: 100px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const LoadMoreButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #e2e8f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #cbd5e1;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;
