import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { UserInvite } from '../../models/UserInvite';

const InvitesPage = () => {
  const [invites, setInvites] = useState<UserInvite[]>([]);
  const { getCurrentUserInvites, inviteUserToLeague } = useLeagueApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const userInvites = await getCurrentUserInvites();
        setInvites(userInvites);
      } catch (error) {
        console.error('Failed to fetch invites:', error);
      }
    };

    fetchInvites();
  }, []);

  const handleAcceptInvite = async (leagueId: string) => {
    try {
      // Uncomment the following line once the API endpoint is ready
      // await inviteUserToLeague(leagueId);
      // Refresh invites after accepting
      const updatedInvites = await getCurrentUserInvites();
      setInvites(updatedInvites);
    } catch (error) {
      console.error('Failed to accept invite:', error);
    }
  };

  const handleDeclineInvite = async (leagueId: string) => {
    try {
      // Refresh invites after declining
      const updatedInvites = await getCurrentUserInvites();
      setInvites(updatedInvites);
    } catch (error) {
      console.error('Failed to decline invite:', error);
    }
  };

  const handleViewLeague = (leagueId: string) => {
    navigate(`/league/${leagueId}`);
  };

  return (
    <PageContainer>
      <Title>League Invites</Title>
      <InvitesList>
        {invites.length === 0 ? (
          <NoInvites>No pending invites</NoInvites>
        ) : (
          invites.map((invite) => (
            <InviteCard key={`${invite.leagueId}-${invite.userId}`}>
              <LeagueName>{invite.league.name}</LeagueName>
              <Description>You've been invited to join this league</Description>
              <ButtonContainer>
                <AcceptButton
                  onClick={() => handleAcceptInvite(invite.leagueId)}
                >
                  Accept
                </AcceptButton>
                <DeclineButton
                  onClick={() => handleDeclineInvite(invite.leagueId)}
                >
                  Decline
                </DeclineButton>
                <ViewLeagueButton
                  onClick={() => handleViewLeague(invite.leagueId)}
                >
                  View League
                </ViewLeagueButton>
              </ButtonContainer>
            </InviteCard>
          ))
        )}
      </InvitesList>
    </PageContainer>
  );
};

export default InvitesPage;

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 60px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InvitesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InviteCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LeagueName = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const AcceptButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #45a049;
  }
`;

const DeclineButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #e53935;
  }
`;

const ViewLeagueButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #1976d2;
  }
`;

const NoInvites = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;
