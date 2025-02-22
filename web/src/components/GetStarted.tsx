import { useNavigate } from 'react-router-dom';

const LeagueActions = () => {
  const navigate = useNavigate();

  const handleCreateLeague = () => {
    navigate('/league');
  };

  const handleJoinLeague = () => {
    navigate('/leagues');
  };

  const handleMyLeagues = () => {
    navigate('/league/joined');
  };

  return (
    <div>
      <button onClick={handleCreateLeague}>Create League</button>
      <button onClick={handleJoinLeague}>Join a League</button>
      <button onClick={handleMyLeagues}>My Leagues</button>
    </div>
  );
};

export default LeagueActions;
