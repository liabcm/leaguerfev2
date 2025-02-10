import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const LeagueActions: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateLeague = () => {
    navigate('/league');
  };

  const handleJoinLeague = () => {
    navigate('/leagues');
  };

  return (
    <div>
      <button onClick={handleCreateLeague}>Create League</button>
      <button onClick={handleJoinLeague}>Join a League</button>
      <button onClick={() => navigate('profile')}>navigate</button>
      <LogoutButton />
    </div>
  );
};

export default LeagueActions;
