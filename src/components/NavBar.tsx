import { useMsal } from '@azure/msal-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../api/useLeagueApi';
import { useAppContext } from '../provider/AppContext';

interface PopupMenuProps {
  isOffScreen: boolean;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOffScreen, setIsOffScreen] = useState(false);
  const { invites, setInvites } = useAppContext();
  const navigate = useNavigate();
  const popupMenuRef = useRef<HTMLDivElement>(null);
  const [avatarUrl] = useState('');
  const { getCurrentUserInvites } = useLeagueApi();
  const { instance, accounts } = useMsal();
  // Add accounts

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const userInvites = await getCurrentUserInvites();
        setInvites(userInvites);
      } catch (error) {
        console.error('Failed to fetch invites:', error);
      }
    };

    if (accounts.length > 0) {
      // Only fetch when authenticated
      fetchInvites();
      const intervalId = setInterval(fetchInvites, 120000);
      return () => clearInterval(intervalId);
    }
  }, [accounts]);

  const handleHomeClick = () => {
    console.log('go home');
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };

  const handleManageLeaguesClick = () => {
    navigate('/manager');
    setIsMenuOpen(false);
  };

  const handleInvitesClick = () => {
    navigate('/invites');
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (error) {
      console.error('Logout Error:', error);
    }
    setIsMenuOpen(false);
  };

  const handleAvatarClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      const checkOffScreen = () => {
        if (popupMenuRef.current) {
          const rect = popupMenuRef.current.getBoundingClientRect();
          const screenWidth = window.innerWidth;
          setIsOffScreen(rect.right > screenWidth);
        }
      };
      checkOffScreen();
      window.addEventListener('resize', checkOffScreen);
      return () => window.removeEventListener('resize', checkOffScreen);
    } else {
      setIsOffScreen(false);
    }
  }, [isMenuOpen]);

  return (
    <NavbarContainer>
      <HomeButton onClick={handleHomeClick}>Home</HomeButton>
      <AvatarContainer>
        <Avatar
          onClick={handleAvatarClick}
          style={{ backgroundImage: `url(${avatarUrl})` }}
        />
        {/* Display invite count badge on the avatar even when menu is closed */}
        {invites.length > 0 && <InviteBadge>{invites.length}</InviteBadge>}
        {isMenuOpen && (
          <PopupMenu isOffScreen={isOffScreen} ref={popupMenuRef}>
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleManageLeaguesClick}>
              Manage Leagues
            </MenuItem>
            <MenuItem onClick={handleInvitesClick}>
              Invites
              {invites.length > 0 && (
                <InviteCount>{invites.length}</InviteCount>
              )}
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </PopupMenu>
        )}
      </AvatarContainer>
    </NavbarContainer>
  );
};

export default Navbar;

const InviteCount = styled.span`
  background-color: #ff4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.75rem;
  margin-left: 8px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
  display: inline-block;
`;

const InviteBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem 0.5rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HomeButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  color: #333;

  &:hover {
    color: #666;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  background-size: cover;
  background-position: center;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }
`;

const PopupMenu = styled.div<PopupMenuProps>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 1000;

  @media (max-width: 768px) {
    right: -5px;
    min-width: 130px;

    ${({ isOffScreen }) =>
      isOffScreen &&
      `
        right: auto;
        left: -5px;
      `}
  }
`;

const MenuItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #f5f5f5;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;
