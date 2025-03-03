import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import { Sport } from '../../models/Sport';
import BackButton from '../General/BackButton';

const LeagueForm = () => {
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [id, setId] = useState<string | null>('');
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getAllSports, editLeague, createLeague } = useLeagueApi();
  const [searchParams] = useSearchParams();

  // Form setup happens after sports are loaded
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<League>({
    defaultValues: {
      isPublic: true,
      isCompetitive: false,
    },
  });

  useEffect(() => {
    const id = searchParams.get('id');
    setId(id);
    fetchSports();
  }, [searchParams]);

  const fetchSports = async () => {
    setIsLoading(true);
    try {
      const sportsData = await getAllSports();
      setSports(sportsData);

      // Set the default sport value to the first sport in the list
      if (sportsData.length > 0) {
        reset({
          sport: sportsData[0].name,
          isPublic: true,
          isCompetitive: false,
        });
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: League) => {
    try {
      const sport = sports.find((s) => s.name === data.sport);
      if (!sport) {
        console.error('Selected sport not found');
        return;
      }

      if (id) {
        data.id = id;
        data.isTeamLeague = sport.isTeamSport;
        await editLeague(data);
        setIsEditing(false);
      } else {
        data.isTeamLeague = sport.isTeamSport;
        const createdLeague = await createLeague(data);
        setId(createdLeague.id);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to create league:', error);
    }
  };

  const onEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  if (isLoading) {
    return <div>Loading sports...</div>;
  }

  return (
    <StyledContainer>
      <BackButton />

      <StyledFormContainer>
        <StyledHeading>
          {id ? 'Edit League' : 'Create New League'}
        </StyledHeading>

        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <div>
            <StyledLabel htmlFor='sport'>Sport</StyledLabel>
            <StyledSelect
              disabled={!isEditing}
              id='sport'
              {...register('sport', { required: 'Sport is required' })}
            >
              {sports.map((sport) => (
                <option key={sport.id} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </StyledSelect>
            {errors.sport && <StyledError>{errors.sport.message}</StyledError>}
          </div>

          {/* Rest of the form remains the same */}
          <div>
            <StyledLabel htmlFor='name'>League Name</StyledLabel>
            <StyledInput
              id='name'
              type='text'
              disabled={!isEditing}
              {...register('name', { required: 'League name is required' })}
            />
            {errors.name && <StyledError>{errors.name.message}</StyledError>}
          </div>

          <StyledCheckboxContainer>
            <StyledCheckboxLabel>
              <StyledCheckbox
                type='checkbox'
                disabled={!isEditing}
                {...register('isPublic')}
              />
              <span>Public League</span>
            </StyledCheckboxLabel>

            <StyledCheckboxLabel>
              <StyledCheckbox
                type='checkbox'
                disabled={!isEditing}
                {...register('isCompetitive')}
              />
              <span>Competitive</span>
            </StyledCheckboxLabel>
          </StyledCheckboxContainer>

          {isEditing ? (
            <StyledSaveButton type='submit'>Save League</StyledSaveButton>
          ) : (
            <StyledEditButton type='button' onClick={onEdit}>
              Edit League
            </StyledEditButton>
          )}
        </StyledForm>
      </StyledFormContainer>
    </StyledContainer>
  );
};

export default LeagueForm;

// Styled components remain the same
const StyledContainer = styled.div`
  position: relative;
  max-width: 42rem;
  margin: 0 auto;
  padding: 4rem 1rem 0;
`;

const StyledFormContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
`;

const StyledHeading = styled.h1`
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const baseInputStyles = `
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
    outline: none;
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const StyledSelect = styled.select`
  ${baseInputStyles}
`;

const StyledInput = styled.input`
  ${baseInputStyles}
`;

const StyledCheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
`;

const StyledCheckbox = styled.input`
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const baseButtonStyles = `
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  cursor: pointer;
  border: none;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const StyledSaveButton = styled.button`
  ${baseButtonStyles}
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
  }
`;

const StyledEditButton = styled.button`
  ${baseButtonStyles}
  background-color: #6b7280;
  color: white;

  &:hover {
    background-color: #4b5563;
  }
`;

const StyledError = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;
