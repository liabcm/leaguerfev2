import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Participant } from '../../models/EventTypes';

type Props = {
  participants: Participant[];
  selected: string[];
  onSelect: (ids: string[]) => void;
  onSearch: (term: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  isTeam?: boolean;
};

const debounce = <F extends (...args: any[]) => any>(fn: F, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const ParticipantPicker = ({
  participants,
  selected,
  onSelect,
  onSearch,
  onLoadMore,
  hasMore,
  isLoading,
  isTeam,
}: Props) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  // Memoize the debounced search function
  const debouncedSearch = useMemo(() => {
    return debounce(onSearch, 300);
  }, [onSearch]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - (scrollTop + clientHeight) < 50 &&
      hasMore &&
      !isLoading
    ) {
      onLoadMore();
    }
  };

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setLocalSearchTerm(term);
      debouncedSearch(term);
    },
    [debouncedSearch]
  );

  const handleCheckboxChange = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onSelect(newSelected);
  };

  return (
    <PickerContainer>
      <SearchInput
        type='text'
        placeholder={`Search ${isTeam ? 'teams' : 'players'}...`}
        value={localSearchTerm}
        onChange={handleSearchChange}
      />

      <ParticipantList onScroll={handleScroll}>
        {participants.map((participant) => (
          <ParticipantItem key={participant.id}>
            <input
              type='checkbox'
              checked={selected.includes(participant.id)}
              onChange={() => handleCheckboxChange(participant.id)}
            />
            <span>{participant.name}</span>
          </ParticipantItem>
        ))}

        {isLoading && (
          <LoadingMessage>
            Loading more {isTeam ? 'teams' : 'players'}...
          </LoadingMessage>
        )}

        {!hasMore && (
          <EndMessage>
            No more {isTeam ? 'teams' : 'players'} to show
          </EndMessage>
        )}
      </ParticipantList>
    </PickerContainer>
  );
};

// Styled components remain the same as in the original code
const PickerContainer = styled.div`
  margin: 1rem 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
`;

const ParticipantList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 4px;
`;

const ParticipantItem = styled.label`
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background: #f8f9fa;
  }

  input[type='checkbox'] {
    margin-right: 1rem;
  }
`;

const LoadingMessage = styled.div`
  padding: 1rem;
  text-align: center;
  color: #6c757d;
`;

const EndMessage = styled.div`
  padding: 1rem;
  text-align: center;
  color: #6c757d;
  font-style: italic;
`;
