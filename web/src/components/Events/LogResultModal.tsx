// components/LogResultModal.tsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Event } from '../../models/Event';
import { Button } from '../League/SharedLeagueStyles';

interface LogResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onSubmit: (formData: {
    winningTeam: string;
    score: string;
    starPlayerUserId: string;
  }) => void;
}

const LogResultModal = ({
  isOpen,
  onClose,
  event,
  onSubmit,
}: LogResultModalProps) => {
  const [formData, setFormData] = useState({
    winningTeam: '',
    score: '',
    starPlayerUserId: '',
  });

  // Reset form when opening modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        winningTeam: '',
        score: '',
        starPlayerUserId: '',
      });
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <ModalOverlay>
      <Modal>
        <h3>Log Result for {event.location}</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Winning Team:</label>
            <input
              value={formData.winningTeam}
              onChange={(e) =>
                setFormData({ ...formData, winningTeam: e.target.value })
              }
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
            <label>Star Player User ID:</label>
            <input
              value={formData.starPlayerUserId}
              onChange={(e) =>
                setFormData({ ...formData, starPlayerUserId: e.target.value })
              }
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
