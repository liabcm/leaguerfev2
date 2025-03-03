import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LeagueUserStatus } from '../models/LeagueUserStatusEnum';
import { TeamUserStatus } from '../models/TeamUserStatusEnum';
import { useAppContext } from '../provider/AppContext';

const MobileNavbar = () => {
  const { invites, teamInvites } = useAppContext();
  const navigate = useNavigate();

  const inviteCount =
    invites.filter((invite) => invite.status === LeagueUserStatus.Invited)
      .length +
    teamInvites.filter((invite) => invite.status === TeamUserStatus.Invited)
      .length;

  return (
    <MobileNavbarContainer>
      <NavIcon onClick={() => navigate('/')}>🏠</NavIcon>
      <NavIcon onClick={() => navigate('/upcoming-events')}>📅</NavIcon>
      <NavIcon onClick={() => navigate('/my-leagues')}>🥇</NavIcon>
      <NavIcon onClick={() => navigate('/my-teams')}>👥</NavIcon>
      <NavIcon onClick={() => navigate('/manager')}>⚙️</NavIcon>
      <NavIcon onClick={() => navigate('/profile')}>👤</NavIcon>
      <NavIconWithBadge onClick={() => navigate('/invites')}>
        📨
        {inviteCount > 0 && <Badge>{inviteCount}</Badge>}
      </NavIconWithBadge>
    </MobileNavbarContainer>
  );
};

export default MobileNavbar;

const MobileNavbarContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
  background-color: #ffffff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
`;

const NavIcon = styled.div`
  cursor: pointer;
  font-size: 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavIconWithBadge = styled(NavIcon)`
  position: relative;
`;

const Badge = styled.span`
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
