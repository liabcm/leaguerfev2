import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment'; // For date/time formatting and handling
import Select from 'react-select';
import BackButton from '../General/BackButton';
import { Event } from '../../models/Event';

const EventForm = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  const { getLeagueById, createEvent } = useLeagueApi();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [eventTime, setEventTime] = useState(
    moment().format('YYYY-MM-DDTHH:mm')
  ); // Initialize with current time
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false); // Track if it's a new event or edit

  useEffect(() => {
    console.log(leagueId);
    const fetchLeague = async () => {
      try {
        const data = await getLeagueById(leagueId!);
        setLeague(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching league:', error);
        setLoading(false);
      }
    };

    fetchLeague();
  }, [leagueId]);

  const handleCreateEvent = async () => {
    console.log(league);
    if (!league) return;

    const eventData: Omit<Event, 'id' | 'createdBy' | 'users'> = {
      eventTime: moment(eventTime).toISOString(), // Send in ISO format
      leagueId: league.id,
      location: location,
      ...(league.isTeamLeague
        ? { opponentIds: selectedTeams }
        : { opponentIds: selectedUsers }),
    };

    try {
      if (isEditing) {
        // Handle edit logic here (e.g., call an updateEvent API method)
        console.log('Editing event with data:', eventData);
        // After successful edit, you might want to update the event in the league state
      } else {
        await createEvent(eventData);
        //const newEvent = await createEvent(eventData);
        //console.log("Event created:", newEvent);
        setIsEditing(true); // Switch to edit mode after successful creation
        // Optionally update the league state with the new event
      }
    } catch (error) {
      console.error('Error creating/editing event:', error);
    }
  };

  const handleTeamSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedTeams(selectedOptions);
  };

  const handleUserSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedUsers(selectedOptions);
  };

  if (loading || !league) {
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
            type='datetime-local' // Use datetime-local for combined date and time
            id='eventTime'
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
        </FormGroup>

        {league.isTeamLeague ? (
          <FormGroup>
            <Label htmlFor='teams'>Teams:</Label>
            <Select
              isMulti
              closeMenuOnSelect={false}
              name='teams'
              options={league.teams.map((team) => ({
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
              options={league.leagueUsers.map((user) => ({
                value: user.id,
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
        )}

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

// Styled Components (similar to your ManageLeagues styling)
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

// const Select = styled.select`
//   width: 100%;
//   padding: 10px;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   font-size: 16px;
//   multiple &:focus {
//     outline: none;
//     border-color: #0066cc;
//   }
// `;

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
