import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Responsive Container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #343a40;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
  width: 100%;
`;

// Vertical Button Container
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ManageLeaguesButton = styled(Button)`
  background-color: #4361ee;
  color: white;

  &:hover {
    background-color: #3a56d4;
  }
`;

const ManageTeamsButton = styled(Button)`
  background-color: #4cc9f0;
  color: white;

  &:hover {
    background-color: #3ab7dc;
  }
`;

const ManageEventsButton = styled(Button)`
  background-color: rgb(194, 16, 43);
  color: white;

  &:hover {
    background-color: rgb(230, 89, 28);
  }
`;

const Manager: React.FC = () => {
  const navigate = useNavigate();

  const handleManageLeagues = () => {
    navigate('/my-managed-leagues');
  };

  const handleManageTeams = () => {
    navigate('/my-managed-teams');
  };

  const handleManageEvents = () => {
    navigate('/my-managed-events');
  };

  return (
    <Container>
      <Title>Sports Management Dashboard</Title>
      <ButtonContainer>
        <ManageLeaguesButton onClick={handleManageLeagues}>
          Manage Leagues
        </ManageLeaguesButton>
        <ManageTeamsButton onClick={handleManageTeams}>
          Manage Teams
        </ManageTeamsButton>
        <ManageEventsButton onClick={handleManageEvents}>
          Manage Events
        </ManageEventsButton>
      </ButtonContainer>
    </Container>
  );
};

export default Manager;
