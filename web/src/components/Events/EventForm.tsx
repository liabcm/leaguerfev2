import moment from 'moment'; // For date/time formatting and handling
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { Event, EventJoinType, EventType } from '../../models/Event'; // Updated import
import { League } from '../../models/League';
import BackButton from '../General/BackButton';

const EventForm = () => {
  const { leagueId } = useParams<{ leagueId?: string }>();
  const { getLeagueById, createEvent } = useLeagueApi();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [eventTime, setEventTime] = useState(
    moment().format('YYYY-MM-DDTHH:mm')
  );
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // New state variables with default values
  const [maxParticipants, setMaxParticipants] = useState<number>(0);
  const [isTeamEvent, setIsTeamEvent] = useState<boolean>(false);
  const [eventType, setEventType] = useState<EventType>(EventType.Single);
  const [joinType, setJoinType] = useState<EventJoinType>(EventJoinType.Open);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        setLoading(true);
        const data = await getLeagueById(leagueId!);
        setLeague(data);
        // Set isTeamEvent based on league type
        setIsTeamEvent(data.isTeamLeague);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching league:', error);
        setLoading(false);
      }
    };
    if (leagueId) {
      fetchLeague();
    } else {
    }
  }, [leagueId]);

  const handleCreateEvent = async () => {
    console.log(league);

    const eventData: Partial<Event> = {
      eventTime: moment(eventTime).toISOString(),
      leagueId: league?.id,
      location: location,
      maxParticipants,
      isTeamEvent,
      eventType,
      joinType,
      opponentIds: league?.isTeamLeague ? selectedTeams : selectedUsers,
    };

    try {
      if (isEditing) {
        console.log('Editing event with data:', eventData);
      } else {
        await createEvent(eventData);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error creating/editing event:', error);
    }
  };

  // Event type options
  const eventTypeOptions = [
    { value: EventType.Single, label: 'Single' },
    { value: EventType.MultiRound, label: 'Multi-Round' },
    { value: EventType.FreePlay, label: 'Free Play' },
    { value: EventType.Tournament, label: 'Tournament' },
  ];

  // Join type options
  const joinTypeOptions = [
    { value: EventJoinType.AddOnly, label: 'Add Only' },
    { value: EventJoinType.InviteOnly, label: 'Invite Only' },
    { value: EventJoinType.Request, label: 'Request' },
    { value: EventJoinType.Open, label: 'Open' },
  ];

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <BackButton />
      <FormCard>
        <FormHeader>
          <FormTitle>{isEditing ? 'Edit Event' : 'Create Event'}</FormTitle>
        </FormHeader>

        <FormGroup>
          <Label htmlFor='location'>Location:</Label>
          <Input
            type='text'
            id='location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor='eventTime'>Event Time:</Label>
          <Input
            type='datetime-local'
            id='eventTime'
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor='maxParticipants'>Max Participants:</Label>
          <Input
            type='number'
            id='maxParticipants'
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 0)}
            min='0'
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor='eventType'>Event Type:</Label>
          <Select
            id='eventType'
            options={eventTypeOptions}
            value={eventTypeOptions.find(
              (option) => option.value === eventType
            )}
            onChange={(selected) => {
              if (selected) setEventType(selected.value);
            }}
            classNamePrefix='select'
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor='joinType'>Join Type:</Label>
          <Select
            id='joinType'
            options={joinTypeOptions}
            value={joinTypeOptions.find((option) => option.value === joinType)}
            onChange={(selected) => {
              if (selected) setJoinType(selected.value);
            }}
            classNamePrefix='select'
          />
        </FormGroup>

        {leagueId &&
          (league?.isTeamLeague ? (
            <FormGroup>
              <Label htmlFor='teams'>Teams:</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                name='teams'
                options={league.teams?.map((team) => ({
                  value: team.id,
                  label: team.name,
                }))}
                onChange={(selected) => {
                  const selectedIds = selected
                    ? selected.map((option) => option.value)
                    : [];
                  setSelectedTeams(selectedIds);
                }}
                classNamePrefix='select'
                placeholder='Select teams...'
              />
            </FormGroup>
          ) : (
            <FormGroup>
              <Label htmlFor='users'>Users:</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                name='users'
                options={league?.leagueMembers.map((user) => ({
                  value: user.userId,
                  label: user.name,
                }))}
                onChange={(selected) => {
                  const selectedIds = selected
                    ? selected.map((option) => option.value)
                    : [];
                  setSelectedUsers(selectedIds);
                }}
                classNamePrefix='select'
                placeholder='Select users...'
              />
            </FormGroup>
          ))}

        <StyledButton
          color={isEditing ? 'red' : 'blue'}
          onClick={handleCreateEvent}
        >
          {isEditing ? 'Update Event' : 'Create Event'}
        </StyledButton>
      </FormCard>
    </Container>
  );
};

export default EventForm;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const FormHeader = styled.div`
  margin-bottom: 20px;
`;

const FormTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

export const StyledButton = styled.button<{ color?: string }>`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) =>
    props.color === 'red' ? '#ef4444' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.color === 'red' ? '#dc2626' : '#2563eb'};
  }

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.color === 'red'
          ? 'rgba(239, 68, 68, 0.5)'
          : 'rgba(59, 130, 246, 0.5)'};
  }
`;
