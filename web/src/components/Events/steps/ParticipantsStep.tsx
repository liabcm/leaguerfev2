import { useCallback, useEffect, useState } from 'react';
import { useLeagueApi } from '../../../api/useLeagueApi';
import { EventFormData, EventType } from '../../../models/EventTypes';
import { StyledSpinner } from '../../SharedStyles';
import { ParticipantPicker } from '../ParticipantPicker';
import { Error, StepContainer } from './StepStyled';

const PAGE_SIZE = 10;

export const ParticipantsStep = ({
  formData,
  setFormData,
}: {
  formData: EventFormData;
  setFormData: any;
}) => {
  const { searchUsers, searchTeams } = useLeagueApi();
  const [participants, setParticipants] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isTeamEvent =
    formData.isTeamEvent && formData.eventType !== EventType.FreePlay;

  const loadParticipants = useCallback(
    async (page: number, search: string) => {
      try {
        setLoading(true);
        setError('');

        const searchFn = isTeamEvent ? searchTeams : searchUsers;
        const result = await searchFn(search, page, PAGE_SIZE);

        setParticipants((prev) =>
          page === 1 ? result.items : [...prev, ...result.items]
        );
        setHasMore(result.totalCount > page * PAGE_SIZE);
        setCurrentPage(page);
      } catch (err) {
        setError('Failed to load participants');
      } finally {
        setLoading(false);
      }
    },
    [isTeamEvent]
  );

  // Handle initial load and search term changes
  useEffect(() => {
    loadParticipants(1, searchTerm);
  }, [searchTerm, loadParticipants]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadParticipants(currentPage + 1, searchTerm);
    }
  }, [currentPage, hasMore, loading, loadParticipants, searchTerm]);

  const handleSelect = (selectedIds: string[]) => {
    setFormData({ ...formData, participants: selectedIds });
  };

  return (
    <StepContainer>
      <h2>Select {isTeamEvent ? 'Teams' : 'Players'}</h2>

      {error && <Error>{error}</Error>}

      <ParticipantPicker
        participants={participants}
        selected={formData.participants}
        onSelect={handleSelect}
        onSearch={handleSearch}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={loading}
        isTeam={isTeamEvent}
      />

      {loading && <StyledSpinner />}
    </StepContainer>
  );
};
