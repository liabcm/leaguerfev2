import { useNavigate } from 'react-router-dom';

const LeagueActions = () => {
  const navigate = useNavigate();

  const handleJoinLeague = () => {
    navigate('/leagues');
  };

  return (
    <div>
      <button onClick={handleJoinLeague}>Join a League</button>
    </div>
  );
};

export default LeagueActions;
