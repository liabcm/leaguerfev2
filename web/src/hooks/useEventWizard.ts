import { useCallback, useState } from 'react';
import { EventFormData, EventJoinType, EventType } from '../models/EventTypes';

export const useEventWizard = () => {
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

  const validateStep = useCallback(
    (stepNumber: number) => {
      switch (stepNumber) {
        case 1:
          return !!formData.location && !!formData.eventTime;
        case 2:
          return formData.participants.length > 0;
        case 3:
          return formData.matches.length > 0;
        default:
          return true;
      }
    },
    [formData]
  );

  const requiresMatches = [EventType.MultiRound, EventType.Tournament].includes(
    formData.eventType
  );
  const totalSteps = requiresMatches ? 4 : 3;

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (newData: Partial<EventFormData>) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    setStepValidities((prev) => {
      const newValidities = [...prev];
      newValidities[step - 1] = validateStep(step);
      return newValidities;
    });
  };

  const isStepValid = (stepNumber: number) => stepValidities[stepNumber - 1];

  return {
    step,
    formData,
    setFormData: updateFormData,
    nextStep,
    prevStep,
    isStepValid,
    requiresMatches,
    totalSteps,
    validateStep,
  };
};
