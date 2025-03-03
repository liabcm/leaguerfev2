import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { useLeagueApi } from '../api/useLeagueApi';
import { useAppContext } from '../provider/AppContext';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const Navbar = () => {
  const { getCurrentUserInvites, getCurrentUserTeamInvites } = useLeagueApi();
  const { setInvites, setTeamInvites } = useAppContext();
  const { accounts } = useMsal();

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const userInvites = await getCurrentUserInvites();
        setInvites(userInvites);
        const teamInvites = await getCurrentUserTeamInvites();
        setTeamInvites(teamInvites);
      } catch (error) {
        console.error('Failed to fetch invites:', error);
      }
    };

    if (accounts.length > 0) {
      fetchInvites();
      const intervalId = setInterval(fetchInvites, 240000);
      return () => clearInterval(intervalId);
    }
  }, [accounts]);

  const isMobile = useMobile();
  return isMobile ? <MobileNavbar /> : <DesktopNavbar />;
};

export default Navbar;
