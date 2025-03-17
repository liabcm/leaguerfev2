import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #343a40;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-width: 160px;

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

const CreateLeagueButton = styled(Button)`
  background-color: rgb(51, 189, 44);
  color: white;

  &:hover {
    background-color: #3ab7dc;
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

  const handleCreateLeague = () => {
    navigate('/league');
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
        <CreateLeagueButton onClick={handleCreateLeague}>
          Create League
        </CreateLeagueButton>
      </ButtonContainer>
    </Container>
  );
};

export default Manager;
