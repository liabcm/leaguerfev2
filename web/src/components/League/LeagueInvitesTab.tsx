import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { LeagueUser } from '../../models/LeagueUser';
import { LeagueUserStatus } from '../../models/LeagueUserStatusEnum';
import { useAppContext } from '../../provider/AppContext';
import ConfirmationRemoveModal from '../General/ConfirmationModal';
import InvitesList from '../General/InvitesList';
import RequestsList from '../General/RequestsList';

const LeagueInvitesTab = () => {
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
    <Container>
      {/* Invites Section */}
      <SectionTitle>League Invites</SectionTitle>
      <InvitesList<LeagueUser>
        items={receivedInvites}
        entityType='league'
        loadingKey={loadingAccept}
        onAccept={handleAcceptInviteClick}
        onDecline={openDeclineModal}
        onView={(id) => handleViewLeague(id)}
        emptyMessage='No pending league invites'
      />

      {/* Pending Requests Section */}
      <RequestsSection>
        <RequestsHeader onClick={toggleRequestsSection}>
          <RequestsText>
            Pending League Requests ({pendingRequests.length})
          </RequestsText>
          <ToggleIcon>{isRequestsOpen ? '▲' : '▼'}</ToggleIcon>
        </RequestsHeader>

        {isRequestsOpen && (
          <RequestsList<LeagueUser>
            items={pendingRequests}
            entityType='league'
            onCancel={openDeclineModal}
            onView={(id) => handleViewLeague(id)}
            emptyMessage='No pending league requests'
          />
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
    </Container>
  );
};

export default LeagueInvitesTab;

const Container = styled.div`
  margin-top: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
`;

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
