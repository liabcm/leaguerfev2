import { useMsal } from '@azure/msal-react';
import { UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LeagueUserStatus } from '../models/LeagueUserStatusEnum';
import { TeamUserStatus } from '../models/TeamUserStatusEnum';
import { useAppContext } from '../provider/AppContext';

interface PopupMenuProps {
  isOffScreen: boolean;
}

const DesktopNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOffScreen, setIsOffScreen] = useState(false);
  const { invites, teamInvites } = useAppContext();
  const navigate = useNavigate();
  const popupMenuRef = useRef<HTMLDivElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const { instance } = useMsal();

  const handleHomeClick = () => navigate('/');
  const handleProfileClick = () => navigate('/profile');
  const handleManageLeaguesClick = () => navigate('/manager');
  const handleInvitesClick = () => navigate('/invites');
  const handleUpcomingEventsClick = () => navigate('/upcoming-events');
  const handleMyLeaguesClick = () => navigate('/my-leagues');
  const handleMyTeamsClick = () => navigate('/my-teams');

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

  const handleAvatarClick = () => setIsMenuOpen(!isMenuOpen);

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

  useEffect(() => {
    if (isMenuOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popupMenuRef.current &&
          !popupMenuRef.current.contains(event.target as Node) &&
          avatarContainerRef.current &&
          !avatarContainerRef.current.contains(event.target as Node)
        ) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMenuOpen]);

  const inviteCount =
    invites.filter((invite) => invite.status === LeagueUserStatus.Invited)
      .length +
    teamInvites.filter((invite) => invite.status === TeamUserStatus.Invited)
      .length;

  return (
    <NavbarContainer>
      <HomeButton onClick={handleHomeClick}>Home</HomeButton>
      <MenuItems>
        <MenuItemButton onClick={handleUpcomingEventsClick}>
          Upcoming Events
        </MenuItemButton>
        <MenuItemButton onClick={handleMyLeaguesClick}>
          My Leagues
        </MenuItemButton>
        <MenuItemButton onClick={handleMyTeamsClick}>My Teams</MenuItemButton>
        <MenuItemButton onClick={handleManageLeaguesClick}>
          Manager
        </MenuItemButton>
      </MenuItems>
      <AvatarContainer ref={avatarContainerRef}>
        <UserRound
          size={30}
          color='#333'
          onClick={handleAvatarClick}
          style={{ cursor: 'pointer' }}
        />
        {inviteCount > 0 && <InviteBadge>{inviteCount}</InviteBadge>}
        {isMenuOpen && (
          <PopupMenu isOffScreen={isOffScreen} ref={popupMenuRef}>
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleInvitesClick}>
              Invites
              {inviteCount > 0 && <InviteCount>{inviteCount}</InviteCount>}
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </PopupMenu>
        )}
      </AvatarContainer>
    </NavbarContainer>
  );
};

export default DesktopNavbar;

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
`;

const MenuItems = styled.div`
  display: flex;
  gap: 20px;
  margin-left: 2rem;
`;

const MenuItemButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  color: #333;

  &:hover {
    color: #666;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
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
`;

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
