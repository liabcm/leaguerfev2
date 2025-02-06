import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';

const LeagueActions: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateLeague = () => {
    navigate('/league')
  };

  const handleJoinLeague = () => {
    navigate('/leagues')
  };

  return (
    <div>
      <button onClick={handleCreateLeague}>
        Create League
      </button>
      <button onClick={handleJoinLeague}>
        Join a League
      </button>
      <LoginButton/>
      <LogoutButton/>
    </div>
  );
};

export default LeagueActions;