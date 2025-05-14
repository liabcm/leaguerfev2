import { useState } from 'react';
import { MatchData } from '../../models/EventTypes';
import {
  AddMatchButton,
  MatchForm,
  MatchItem,
  MatchList,
  RoundInput,
  SelectOpponent,
  VSSeperator,
} from './MatchStyled';

type Props = {
  participants: string[];
  existingMatches: MatchData[];
  onAddMatch: (match: MatchData) => void;
};

export const MatchCreator = ({
  participants,
  existingMatches,
  onAddMatch,
}: Props) => {
  const [currentMatch, setCurrentMatch] = useState<
    Omit<MatchData, 'matchNumber'>
  >({
    opponent1Id: '',
    opponent2Id: '',
    round: 1,
  });

  const handleAdd = () => {
    const newMatch: MatchData = {
      ...currentMatch,
      matchNumber: existingMatches.length + 1,
    };
    onAddMatch(newMatch);
    setCurrentMatch({ opponent1Id: '', opponent2Id: '', round: 1 });
  };

  return (
    <div>
      <MatchForm>
        <SelectOpponent
          value={currentMatch.opponent1Id}
          onChange={(e) =>
            setCurrentMatch({ ...currentMatch, opponent1Id: e.target.value })
          }
          data-testid='opponent1-select'
        >
          <option value=''>Select Opponent 1</option>
          {participants.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </SelectOpponent>

        <VSSeperator>VS</VSSeperator>

        <SelectOpponent
          value={currentMatch.opponent2Id}
          onChange={(e) =>
            setCurrentMatch({ ...currentMatch, opponent2Id: e.target.value })
          }
          data-testid='opponent2-select'
        >
          <option value=''>Select Opponent 2</option>
          {participants.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </SelectOpponent>

        <RoundInput
          type='number'
          value={currentMatch.round}
          onChange={(e) =>
            setCurrentMatch({
              ...currentMatch,
              round: parseInt(e.target.value),
            })
          }
          min='1'
          data-testid='round-input'
        />

        <AddMatchButton
          onClick={handleAdd}
          disabled={!currentMatch.opponent1Id || !currentMatch.opponent2Id}
          data-testid='add-match-button'
        >
          Add Match
        </AddMatchButton>
      </MatchForm>

      <MatchList>
        {existingMatches.map((match) => (
          <MatchItem key={match.matchNumber}>
            <span>Match #{match.matchNumber}</span>
            <span>Round {match.round}</span>
            <span>
              {match.opponent1Id} vs {match.opponent2Id}
            </span>
          </MatchItem>
        ))}
      </MatchList>
    </div>
  );
};
