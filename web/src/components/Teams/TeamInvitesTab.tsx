import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { TeamUser } from '../../models/TeamUser';
import { TeamUserStatus } from '../../models/TeamUserStatusEnum';
import { useAppContext } from '../../provider/AppContext';
import ConfirmationRemoveModal from '../General/ConfirmationModal';
import InvitesList from '../General/InvitesList';
import RequestsList from '../General/RequestsList';

const TeamInvitesTab = () => {
  const { teamInvites, setTeamInvites } = useAppContext();
  const [selectedInvite, setSelectedInvite] = useState<TeamUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isTeamRequestsOpen, setIsTeamRequestsOpen] = useState(false);
  const { getCurrentUserTeamInvites, acceptTeamInvite, declineTeamInvite } =
    useLeagueApi();
  const navigate = useNavigate();
  const [loadingAccept, setLoadingAccept] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamInvites = async () => {
      try {
        const userTeamInvites = await getCurrentUserTeamInvites();
        setTeamInvites(userTeamInvites);
      } catch (error) {
        console.error('Failed to fetch team invites:', error);
      }
    };

    fetchTeamInvites();
  }, []);

  const handleAcceptTeamInviteClick = async (invite: TeamUser) => {
    const inviteKey = `${invite.teamId}-${invite.userId}`;
    if (loadingAccept === inviteKey) return;

    setLoadingAccept(inviteKey);
    try {
      await acceptTeamInvite(invite.teamId, invite.userId);
      const updatedInvites = await getCurrentUserTeamInvites();
      setTeamInvites(updatedInvites);
    } catch (error) {
      console.error('Failed to accept team invite:', error);
    } finally {
      setLoadingAccept(null);
    }
  };

  const handleDeclineTeamInvite = async (teamId: string, userId: string) => {
    try {
      await declineTeamInvite(teamId, userId);
      const updatedInvites = await getCurrentUserTeamInvites();
      setTeamInvites(updatedInvites);
    } catch (error) {
      console.error('Failed to decline team invite:', error);
    }
  };

  const openDeclineModal = (invite: TeamUser) => {
    setSelectedInvite(invite);
    setIsModalOpen(true);
  };

  const closeDeclineModal = () => {
    setSelectedInvite(null);
    setIsModalOpen(false);
  };

  const confirmDecline = async () => {
    if (selectedInvite) {
      await handleDeclineTeamInvite(
        selectedInvite.teamId,
        selectedInvite.userId
      );
      closeDeclineModal();
    }
  };

  const handleViewTeam = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  const toggleRequestsSection = () => {
    setIsRequestsOpen((prev) => !prev);
  };

  const toggleTeamRequestsSection = () => {
    setIsTeamRequestsOpen((prev) => !prev);
  };

  const receivedInvites = teamInvites.filter(
    (invite) => invite.status === TeamUserStatus.Invited
  );

  const pendingRequests = teamInvites.filter(
    (invite) => invite.status === TeamUserStatus.Requested
  );

  const teamCreationRequests = teamInvites.filter(
    (invite) => invite.status === TeamUserStatus.TeamRequested
  );

  return (
    <Container>
      {/* Team Invites Section */}
      <SectionTitle>Team Invites</SectionTitle>
      <InvitesList<TeamUser>
        items={receivedInvites}
        entityType='team'
        loadingKey={loadingAccept}
        onAccept={handleAcceptTeamInviteClick}
        onDecline={openDeclineModal}
        onView={(id) => handleViewTeam(id)}
        emptyMessage='No pending team invites'
      />

      {/* Team Creation Requests Section */}
      <RequestsSection>
        <RequestsHeader onClick={toggleTeamRequestsSection}>
          <RequestsText>
            Team Creation Requests ({teamCreationRequests.length})
          </RequestsText>
          <ToggleIcon>{isTeamRequestsOpen ? '▲' : '▼'}</ToggleIcon>
        </RequestsHeader>

        {isTeamRequestsOpen && (
          <RequestsList<TeamUser>
            items={teamCreationRequests}
            entityType='team'
            onCancel={openDeclineModal}
            onView={(id) => handleViewTeam(id)}
            requestType='team-creation'
            emptyMessage='No pending team creation requests'
          />
        )}
      </RequestsSection>

      {/* Join Team Requests Section */}
      <RequestsSection>
        <RequestsHeader onClick={toggleRequestsSection}>
          <RequestsText>
            Team Join Requests ({pendingRequests.length})
          </RequestsText>
          <ToggleIcon>{isRequestsOpen ? '▲' : '▼'}</ToggleIcon>
        </RequestsHeader>

        {isRequestsOpen && (
          <RequestsList<TeamUser>
            items={pendingRequests}
            entityType='team'
            onCancel={openDeclineModal}
            onView={(id) => handleViewTeam(id)}
            emptyMessage='No pending team join requests'
          />
        )}
      </RequestsSection>

      {selectedInvite && (
        <ConfirmationRemoveModal
          isOpen={isModalOpen}
          onClose={closeDeclineModal}
          onConfirm={confirmDecline}
          entityName={selectedInvite.teamName}
          action={
            selectedInvite.status === TeamUserStatus.TeamRequested
              ? 'cancel team creation'
              : selectedInvite.status === TeamUserStatus.Requested
              ? 'cancel'
              : 'decline'
          }
        />
      )}
    </Container>
  );
};

export default TeamInvitesTab;

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
