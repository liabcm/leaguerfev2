import { useNavigate } from 'react-router-dom';
import { useLeagueApi } from '../api/useLeagueApi';
import { useEffect, useState } from 'react';

const LeagueActions: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser, createUser } = useLeagueApi();
  const [loading, setLoading] = useState<Boolean>(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log(user);
      } catch (error) {
        console.log('here');
        if (!loading) {
          setLoading(true);
          const created = await createUser();
          console.log(created);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

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
