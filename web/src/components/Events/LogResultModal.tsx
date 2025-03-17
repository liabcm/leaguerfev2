import { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { Event } from '../../models/Event';
import { Button } from '../League/SharedLeagueStyles';

interface LogResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  isTeamEvent: boolean;
  onSubmit: (formData: {
    winningId: string;
    score: string;
    starPlayerUserId: string;
    eventId: string;
    losingId: string;
  }) => void;
}

// Define the option type for react-select
interface SelectOption {
  value: string;
  label: string;
}

const LogResultModal = ({
  isOpen,
  onClose,
  event,
  onSubmit,
  isTeamEvent,
}: LogResultModalProps) => {
  const [formData, setFormData] = useState({
    winningId: '',
    score: '',
    starPlayerUserId: '',
  });

  // Reset form when opening modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        winningId: '',
        score: '',
        starPlayerUserId: '',
      });
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const winningOptions: SelectOption[] =
    isTeamEvent && event.teams
      ? event.teams?.map((team) => ({ value: team.teamId, label: team.name }))
      : event.users
      ? event.users.map((user) => ({ value: user.userId, label: user.name }))
      : [];

  const starPlayerOptions =
    !isTeamEvent && event.users
      ? event.users.map((u) => ({ value: u.userId, label: u.name }))
      : event.teamPlayers?.map((u) => ({ value: u.id, label: u.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const losingId = winningOptions.find(
      (id) => id.value !== formData.winningId
    );
    onSubmit({
      ...formData,
      eventId: event.id,
      losingId: losingId?.value || '',
    });
    onClose();
  };

  return (
    <ModalOverlay>
      <Modal>
        <h3>Log Result for {event.location}</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Winning {isTeamEvent ? 'Team' : 'User'}:</label>
            <Select
              options={winningOptions}
              placeholder={`Select a ${isTeamEvent ? 'Team' : 'User'}`}
              value={
                winningOptions.find(
                  (option) => option.value === formData.winningId
                ) || null
              }
              onChange={(selectedOption) => {
                console.log(selectedOption);
                setFormData({
                  ...formData,
                  winningId: selectedOption ? selectedOption.value : '',
                });
              }}
              isSearchable={true}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Score:</label>
            <input
              value={formData.score}
              onChange={(e) =>
                setFormData({ ...formData, score: e.target.value })
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <Select
              options={starPlayerOptions}
              placeholder={`Select a star player`}
              value={
                starPlayerOptions!.find(
                  (option) => option.value === formData.starPlayerUserId
                ) || null
              }
              onChange={(selectedOption) => {
                setFormData({
                  ...formData,
                  starPlayerUserId: selectedOption ? selectedOption.value : '',
                });
              }}
              isSearchable={true}
              required
            />
          </FormGroup>
          <ButtonGroup>
            <Button type='submit'>Submit</Button>
            <Button type='button' onClick={onClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </Modal>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 500px;
  max-width: 90%;

  h3 {
    margin-bottom: 1.5rem;
    color: #334155;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #334155;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.25rem;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 1px #4f46e5;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  justify-content: flex-end;

  button {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button[type='submit'] {
    background-color: #4f46e5;
    color: white;
    border: none;

    &:hover {
      background-color: #4338ca;
    }
  }

  button[type='button'] {
    background-color: #f1f5f9;
    color: #334155;
    border: 1px solid #cbd5e1;

    &:hover {
      background-color: #e2e8f0;
    }
  }
`;

export default LogResultModal;
