import { EventFormData, MatchData } from '../../../models/EventTypes';
import { MatchCreator } from '../MatchCreator';
import { StepContainer } from './StepStyled';

type Props = {
  formData: EventFormData;
  setFormData: (data: EventFormData) => void;
};

export const MatchesStep = ({ formData, setFormData }: Props) => {
  const handleAddMatch = (newMatch: MatchData) => {
    setFormData({
      ...formData,
      matches: [...formData.matches, newMatch],
    });
  };

  return (
    <StepContainer>
      <h2>Create Matches</h2>
      <MatchCreator
        participants={formData.participants}
        existingMatches={formData.matches}
        onAddMatch={handleAddMatch}
      />
    </StepContainer>
  );
};
