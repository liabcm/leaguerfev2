import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { LeagueUser } from '../../models/LeagueUser';
import { LeagueUserStatus } from '../../models/LeagueUserStatusEnum';
import { useAppContext } from '../../provider/AppContext';
import ConfirmationRemoveModal from '../General/ConfirmationModal';
import LoadingButton from '../General/LoadingButton';

const InvitesPage = () => {
  const { invites, setInvites } = useAppContext();
  const [selectedInvite, setSelectedInvite] = useState<LeagueUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const { getCurrentUserInvites, declineInvite, acceptInvite } = useLeagueApi();
  const navigate = useNavigate();

  const [loadingAccept, setLoadingAccept] = useState<string | null>(null);

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

  const handleAcceptInviteClick = async (invite: LeagueUser) => {
    const inviteKey = `${invite.leagueId}-${invite.userId}`;
    if (loadingAccept === inviteKey) return;

    setLoadingAccept(inviteKey);
    try {
      await acceptInvite(invite.leagueId, invite.userId);
      const updatedInvites = await getCurrentUserInvites();
      setInvites(updatedInvites);
    } catch (error) {
      console.error('Failed to accept invite:', error);
    } finally {
      setLoadingAccept(null);
    }
  };

  const handleDeclineInvite = async (leagueId: string, userId: string) => {
    try {
      await declineInvite(leagueId, userId);
      const updatedInvites = await getCurrentUserInvites();
      setInvites(updatedInvites);
    } catch (error) {
      console.error('Failed to decline invite:', error);
    }
  };

  const openDeclineModal = (invite: LeagueUser) => {
    setSelectedInvite(invite);
    setIsModalOpen(true);
  };

  const closeDeclineModal = () => {
    setSelectedInvite(null);
    setIsModalOpen(false);
  };

  const confirmDecline = async () => {
    if (selectedInvite) {
      await handleDeclineInvite(selectedInvite.leagueId, selectedInvite.userId);
      closeDeclineModal();
    }
  };

  const handleViewLeague = (leagueId: string) => {
    navigate(`/league/${leagueId}`);
  };

  const toggleRequestsSection = () => {
    setIsRequestsOpen((prev) => !prev);
  };

  const receivedInvites = invites.filter(
    (invite) => invite.status !== LeagueUserStatus.Requested
  );
  const pendingRequests = invites.filter(
    (invite) => invite.status === LeagueUserStatus.Requested
  );

  return (
    <PageContainer>
      <Title>League Invites</Title>

      {/* Invites Section */}
      <InvitesList>
        {receivedInvites.length === 0 ? (
          <NoInvites>No pending invites</NoInvites>
        ) : (
          receivedInvites.map((invite) => {
            const inviteKey = `${invite.leagueId}-${invite.userId}`;
            return (
              <InviteCard key={inviteKey}>
                <LeagueName>{invite.leagueName}</LeagueName>
                <Description>
                  You've been invited to join this league
                </Description>
                <ButtonContainer>
                  <AcceptButton
                    isLoading={loadingAccept === inviteKey}
                    loadingText='Accepting...'
                    onClick={() => handleAcceptInviteClick(invite)}
                  >
                    Accept
                  </AcceptButton>
                  <DeclineButton onClick={() => openDeclineModal(invite)}>
                    Decline
                  </DeclineButton>
                  <ViewLeagueButton
                    onClick={() => handleViewLeague(invite.leagueId)}
                  >
                    View League
                  </ViewLeagueButton>
                </ButtonContainer>
              </InviteCard>
            );
          })
        )}
      </InvitesList>

      {/* Pending Requests Section */}
      <RequestsSection>
        <RequestsHeader onClick={toggleRequestsSection}>
          <RequestsText>
            Pending Requests ({pendingRequests.length})
          </RequestsText>
          <ToggleIcon>{isRequestsOpen ? '▲' : '▼'}</ToggleIcon>
        </RequestsHeader>
        {isRequestsOpen && (
          <RequestsList>
            {pendingRequests.length === 0 ? (
              <NoRequests>No pending requests</NoRequests>
            ) : (
              pendingRequests.map((request) => {
                const requestKey = `${request.leagueId}-${request.userId}`;
                return (
                  <RequestCard key={requestKey}>
                    <LeagueName>{request.leagueName}</LeagueName>
                    <Description>
                      Your request to join this league is pending
                    </Description>
                    <ButtonContainer>
                      <DeclineButton onClick={() => openDeclineModal(request)}>
                        Cancel Request
                      </DeclineButton>
                      <ViewLeagueButton
                        onClick={() => handleViewLeague(request.leagueId)}
                      >
                        View League
                      </ViewLeagueButton>
                    </ButtonContainer>
                  </RequestCard>
                );
              })
            )}
          </RequestsList>
        )}
      </RequestsSection>

      {selectedInvite && (
        <ConfirmationRemoveModal
          isOpen={isModalOpen}
          onClose={closeDeclineModal}
          onConfirm={confirmDecline}
          entityName={selectedInvite.leagueName}
          action={
            selectedInvite.status === LeagueUserStatus.Requested
              ? 'cancel'
              : 'decline'
          }
        />
      )}
    </PageContainer>
  );
};

export default InvitesPage;

// Styled components

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

const AcceptButton = styled(LoadingButton)`
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
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

// Updated styled components for Pending Requests section

const RequestsSection = styled.div`
  margin-top: 2rem;
`;

const RequestsHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const RequestsText = styled.span`
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
`;

const ToggleIcon = styled.span`
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

const RequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const RequestCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NoRequests = styled.div`
  text-align: center;
  color: #666;
  padding: 1rem;
`;
