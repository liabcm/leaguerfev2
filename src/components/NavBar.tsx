import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';

interface PopupMenuProps {
  isOffScreen: boolean;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOffScreen, setIsOffScreen] = useState(false);
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const popupMenuRef = useRef<HTMLDivElement>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const defaultAvatar = '';

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
        {isMenuOpen && (
          <PopupMenu isOffScreen={isOffScreen} ref={popupMenuRef}>
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleManageLeaguesClick}>
              Manage Leagues
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </PopupMenu>
        )}
      </AvatarContainer>
    </NavbarContainer>
  );
};

export default Navbar;

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
