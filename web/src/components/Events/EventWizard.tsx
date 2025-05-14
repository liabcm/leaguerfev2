import { useCallback, useState } from 'react';
import { useLeagueApi } from '../../api/useLeagueApi';
import {
  EventFormData,
  EventJoinType,
  EventType,
} from '../../models/EventTypes';
import { StyledSpinner } from '../SharedStyles';
import { BaseInfoStep } from './steps/BaseInfoStep';
import { MatchesStep } from './steps/MatchesStep';
import { ParticipantsStep } from './steps/ParticipantsStep';
import { SummaryStep } from './steps/SummaryStep';
import {
  Button,
  Error,
  Navigation,
  ProgressBar,
  WizardContainer,
} from './WizardStyled';

export const EventWizard = () => {
  const { createEvent } = useLeagueApi();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    location: '',
    eventTime: new Date(),
    joinType: EventJoinType.Open,
    eventType: EventType.Single,
    maxParticipants: 10,
    isTeamEvent: false,
    participants: [],
    matches: [],
  });
  const [stepValidities, setStepValidities] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiresMatches = [EventType.MultiRound, EventType.Tournament].includes(
    formData.eventType
  );
  const totalSteps = requiresMatches ? 4 : 3;

  const validateStep = useCallback(
    (stepNumber: number) => {
      switch (stepNumber) {
        case 1:
          return !!formData.location && !!formData.eventTime;
        case 2:
          return true; //formData.participants.length > 0;
        case 3:
          return formData.matches.length > 0;
        default:
          return true;
      }
    },
    [formData]
  );

  const updateFormData = useCallback(
    (newData: Partial<EventFormData>) => {
      const updatedData = { ...formData, ...newData };
      setFormData(updatedData);

      // Update validation state
      setStepValidities((prev) => {
        const newValidities = [...prev];
        newValidities[step - 1] = validateStep(step);
        return newValidities;
      });
    },
    [formData, step, validateStep]
  );

  const nextStep = useCallback(() => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  }, [step, totalSteps, validateStep]);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const isStepValid = useCallback(
    (stepNumber: number) => {
      return stepValidities[stepNumber - 1];
    },
    [stepValidities]
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      //await createEvent(formData);
      // Handle success
    } catch (err) {
      setError('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WizardContainer>
      <ProgressBar $totalSteps={totalSteps} $currentStep={step}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={i + 1 <= step ? 'active' : ''} />
        ))}
      </ProgressBar>

      {isSubmitting && <StyledSpinner />}
      {error && <Error>{error}</Error>}

      {step === 1 && (
        <BaseInfoStep
          formData={formData}
          setFormData={updateFormData}
          validate={() => validateStep(1)}
        />
      )}

      {step === 2 && (
        <ParticipantsStep formData={formData} setFormData={updateFormData} />
      )}

      {step === 3 && requiresMatches && (
        <MatchesStep formData={formData} setFormData={updateFormData} />
      )}

      {step === (requiresMatches ? 4 : 3) && (
        <SummaryStep formData={formData} onSubmit={handleSubmit} />
      )}

      <Navigation>
        {step > 1 && (
          <Button onClick={prevStep} disabled={isSubmitting}>
            Back
          </Button>
        )}
        {step < totalSteps ? (
          <Button
            onClick={nextStep}
            disabled={!isStepValid(step) || isSubmitting}
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            Create Event
          </Button>
        )}
      </Navigation>
    </WizardContainer>
  );
};
