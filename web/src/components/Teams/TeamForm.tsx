import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import { LeagueUser } from '../../models/LeagueUser';
import { TeamCreateDTO, TeamUpdateDTO } from '../../models/TeamCreateDTO';
import BackButton from '../General/BackButton';

const TeamForm = () => {
  const { leagueId } = useParams<{
    leagueId: string;
  }>();

  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');

  const navigate = useNavigate();

  if (!leagueId) {
    return <ErrorMessage>League ID is missing from the URL.</ErrorMessage>;
  }

  const { getLeagueById, createTeam, getTeamById, updateTeam } = useLeagueApi();

  const [league, setLeague] = useState<League | null>(null);
  const [loadingLeague, setLoadingLeague] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableLeagueMembers, setAvailableLeagueMembers] = useState<
    LeagueUser[]
  >([]);

  const [formData, setFormData] = useState<TeamCreateDTO>({
    teamManagerIds: [],
    name: '',
    teamUserIds: [],
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(!teamId);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [managerError, setManagerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        setLoadingLeague(true);
        const leagueData = await getLeagueById(leagueId);
        setLeague(leagueData);
        const membersInTeam = leagueData.teams
          .concat(...leagueData.teamRequests)
          .flatMap((t) => [
            ...t.teamUsers,
            ...t.teamInvites,
            ...t.teamRequests,
          ]);
        setAvailableLeagueMembers(
          leagueData.leagueMembers.filter((m) => {
            // If we're in edit mode, we need to include the current team members in the available list
            if (teamId) {
              const currentTeam = leagueData.teams
                .concat(...leagueData.teamRequests)
                .find((t) => t.id === teamId);
              if (currentTeam) {
                const isInCurrentTeam = [...currentTeam.teamUsers].some(
                  (tm) => tm.userId === m.userId
                );

                if (isInCurrentTeam) return true;
              }
            }
            return !membersInTeam.find((mt) => mt.userId === m.userId);
          })
        );
      } catch (err) {
        console.log(err);
        setError('Failed to fetch team.');
      } finally {
        setLoadingLeague(false);
      }
    };
    fetchLeague();
  }, [leagueId, teamId]);

  useEffect(() => {
    if (teamId) {
      const fetchTeam = async () => {
        try {
          const teamData = await getTeamById(teamId);
          setFormData({
            teamManagerIds:
              teamData.teamUsers
                .filter((tu) => tu.isManager)
                .map((tu) => tu.userId) || [],
            name: teamData.name,
            teamUserIds: teamData.teamUsers.map((user) => user.userId) || [],
          });
        } catch (err) {
          setError('Failed to fetch team data.');
        }
      };
      fetchTeam();
    }
  }, [teamId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditMode(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setManagerError(null); // Reset previous error

    if (formData.teamManagerIds.length === 0) {
      setManagerError('At least one team manager is required.');
      setSubmitting(false);
      return;
    }
    try {
      if (teamId) {
        const teamUpdateDTO: TeamUpdateDTO = { id: teamId, ...formData };
        await updateTeam(teamUpdateDTO);
        setIsEditMode(false);
      } else {
        const result = await createTeam(formData, leagueId);
        navigate(`/league/${leagueId}/team?teamId=${result.id}`);
        setIsEditMode(false);
      }
    } catch (err) {
      setError('An error occurred.' + err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingLeague) return <Spinner>Loading...</Spinner>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!league) return <ErrorMessage>No league found.</ErrorMessage>;

  return (
    <Container>
      <BackButton />
      <FormCard>
        <Header>
          <Title>{teamId ? 'Edit Team' : 'Create Team'}</Title>
        </Header>
        <Form onSubmit={handleSubmit}>
          <Label>
            Team Name
            <Input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              disabled={!isEditMode}
            />
          </Label>
          <Label>
            Team Managers
            <Select
              isMulti
              closeMenuOnSelect={false}
              name='teamManagerIds'
              isDisabled={!isEditMode}
              value={availableLeagueMembers
                .filter((member) =>
                  formData.teamManagerIds.includes(member.userId)
                )
                .map((member) => ({
                  value: member.userId,
                  label: member.name,
                }))}
              onChange={(selected) => {
                const selectedIds = selected
                  ? selected.map((option) => option.value)
                  : [];
                setFormData((prev) => ({
                  ...prev,
                  teamManagerIds: selectedIds,
                }));
              }}
              options={availableLeagueMembers
                .filter(
                  (member) =>
                    !formData.teamUserIds.includes(member.userId) ||
                    formData.teamManagerIds.includes(member.userId)
                )
                .map((member) => ({
                  value: member.userId,
                  label: member.name,
                }))}
              placeholder='Select team managers...'
              classNamePrefix='select'
            />
            {managerError && <ErrorText>{managerError}</ErrorText>}
          </Label>
          <Label>
            Team Users
            <Select
              isMulti
              closeMenuOnSelect={false}
              name='teamUserIds'
              isDisabled={!isEditMode}
              value={availableLeagueMembers
                .filter(
                  (member) =>
                    formData.teamUserIds.includes(member.userId) &&
                    !member.isManager
                )
                .map((member) => ({
                  value: member.userId,
                  label: member.name,
                }))}
              onChange={(selected) => {
                const selectedIds = selected
                  ? selected.map((option) => option.value)
                  : [];
                setFormData((prev) => ({
                  ...prev,
                  teamUserIds: selectedIds,
                }));
              }}
              options={availableLeagueMembers
                .filter(
                  (member) =>
                    !formData.teamManagerIds.includes(member.userId) ||
                    formData.teamUserIds.includes(member.userId)
                )
                .map((member) => ({
                  value: member.userId,
                  label: member.name,
                }))}
              placeholder='Select team users...'
              classNamePrefix='select'
            />
          </Label>
          {isEditMode ? (
            <SubmitButton type='submit' disabled={submitting}>
              {submitting
                ? 'Submitting...'
                : teamId
                ? 'Save Team'
                : 'Create Team'}
            </SubmitButton>
          ) : (
            <EditButton type='button' onClick={handleEdit}>
              Edit Team
            </EditButton>
          )}
        </Form>
      </FormCard>
    </Container>
  );
};

export default TeamForm;

// Styled Components

const Container = styled.div`
  padding: clamp(1.5rem, 5vw, 4rem);
  width: 100%;
  max-width: 100rem;
  margin: 0 auto;
  box-sizing: border-box;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1);
  padding: clamp(1rem, 3vw, 2.5rem);
  width: 100%;
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #4b5563;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const EditButton = styled.button`
  padding: 0.75rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #4b5563;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  margin: 1rem 0;
`;

const Spinner = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.5rem;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;
