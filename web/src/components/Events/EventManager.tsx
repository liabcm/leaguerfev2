import { MapPin, SquarePen, Trash, UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { Event, EventType } from '../../models/Event';
import { EventTeam } from '../../models/EventTeam';
import { EventUser } from '../../models/EventUser';
import BackButton from '../General/BackButton';
import ConfirmationModal from '../General/ConfirmationModal';
import SearchUsersModal from '../League/SearchUsersModal';
import {
  Card,
  Header,
  InfoItem,
  TabButton,
  Tabs,
  Title,
} from '../League/SharedLeagueStyles';
import { StyledSpinner } from '../SharedStyles';
import SearchTeamsModal from '../Teams/SearchTeamsModal';
import EventMembersSection from './EventMembersSection';
import EventPendingSection, { PendingItem } from './EventPendingSection';
import EventTeamsSection from './EventTeamsSection';

const EventManager = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'teams' | 'matches'>(
    'members'
  );
  const {
    getEventById,
    kickFromEvent,
    inviteOrRequestUserToEvent,
    searchUsersForEventInvite,
    searchTeamsForEventInvite,
    deleteEvent,
    removeMemberInvite,
    acceptMemberRequest,
    declineMemberRequest,
    removeTeamInvite,
    acceptTeamEventRequest,
    declineTeamRequest,
  } = useLeagueApi();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showSearchUsersModal, setShowSearchUsersModal] = useState(false);
  const [showSearchTeamsModal, setShowSearchTeamsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (id) {
          setIsLoading(true);
          const data = await getEventById(id);
          setEvent(data);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Invite a new member
  const handleInviteUser = async (user: any) => {
    try {
      await inviteOrRequestUserToEvent(event?.id!, user.id, true);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              memberInvites: [
                ...(prev.memberInvites || []),
                {
                  userId: user.id,
                  eventId: prev.id,
                  name: user.name,
                  email: user.email,
                } as EventUser,
              ],
            }
          : prev
      );
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  // Invite a new team
  const handleInviteTeam = async (team: any) => {
    try {
      // If you have an API method for inviting a team, call it here.
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              teams: [
                ...(prev.teams || []),
                {
                  teamId: team.id,
                  eventId: prev.id,
                  name: team.name,
                } as EventTeam,
              ],
            }
          : prev
      );
    } catch (error) {
      console.error('Error inviting team:', error);
    }
  };

  // Remove a member from the event
  const handleRemoveMember = async (userId: string) => {
    try {
      await kickFromEvent(event?.id!, userId);
      setEvent((prev) =>
        prev
          ? { ...prev, users: prev.users?.filter((u) => u.userId !== userId) }
          : prev
      );
    } catch (error) {
      console.error('Error removing event user:', error);
    }
  };

  // Remove a team from the event
  const handleRemoveTeam = async (teamId: string) => {
    try {
      // If you have an API method to remove a team, call it here.
      setEvent((prev) =>
        prev
          ? { ...prev, teams: prev.teams?.filter((t) => t.teamId !== teamId) }
          : prev
      );
    } catch (error) {
      console.error('Error removing event team:', error);
    }
  };

  // Delete the entire event
  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(event?.id!);
      navigate(-1);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // ===== Pending Handlers for Members =====

  // Remove (decline) a member invite
  const handleRemoveMemberInvite = async (invite: PendingItem) => {
    try {
      await removeMemberInvite(event?.id!, invite.id);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              memberInvites: prev.memberInvites?.filter(
                (i) => i.userId !== invite.id
              ),
            }
          : prev
      );
    } catch (error) {
      console.error('Error removing member invite:', error);
    }
  };

  // Accept a member join request
  const handleAcceptMemberRequest = async (request: PendingItem) => {
    try {
      await acceptMemberRequest(event?.id!, request.id);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              // Remove from requests and add to members
              memberRequests: prev.memberRequests?.filter(
                (r) => r.userId !== request.id
              ),
              users: [
                ...(prev.users || []),
                {
                  userId: request.id,
                  eventId: prev.id,
                  name: request.name,
                  email: '',
                },
              ],
            }
          : prev
      );
    } catch (error) {
      console.error('Error accepting member request:', error);
    }
  };

  // Decline a member join request
  const handleDeclineMemberRequest = async (request: PendingItem) => {
    try {
      await declineMemberRequest(event?.id!, request.id);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              memberRequests: prev.memberRequests?.filter(
                (r) => r.userId !== request.id
              ),
            }
          : prev
      );
    } catch (error) {
      console.error('Error declining member request:', error);
    }
  };

  // ===== Pending Handlers for Teams =====

  // Remove (decline) a team invite
  const handleRemoveTeamInvite = async (invite: PendingItem) => {
    try {
      await removeTeamInvite(event?.id!, invite.id);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              teamInvites: prev.teamInvites?.filter(
                (i) => i.teamId !== invite.id
              ),
            }
          : prev
      );
    } catch (error) {
      console.error('Error removing team invite:', error);
    }
  };

  // Accept a team join request
  const handleAcceptTeamRequest = async (request: PendingItem) => {
    try {
      await acceptTeamRequest(event?.id!, request.id);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              teamRequests: prev.teamRequests?.filter(
                (r) => r.teamId !== request.id
              ),
              teams: [
                ...(prev.teams || []),
                { teamId: request.id, eventId: prev.id, name: request.name },
              ],
            }
          : prev
      );
    } catch (error) {
      console.error('Error accepting team request:', error);
    }
  };

  // Decline a team join request
  const handleDeclineTeamRequest = async (request: PendingItem) => {
    try {
      await declineTeamRequest(event?.id!, request.id);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              teamRequests: prev.teamRequests?.filter(
                (r) => r.teamId !== request.id
              ),
            }
          : prev
      );
    } catch (error) {
      console.error('Error declining team request:', error);
    }
  };

  if (isLoading) {
    return <StyledSpinner />;
  }

  return (
    <Container>
      <BackButton />
      {event && (
        <Card>
          <Header>
            <Title>
              {event.location}
              {'   '}
              <MapPin />
            </Title>
            <HeaderActions>
              <SquarePen size={18} />
              <TrashButton onClick={() => setShowDeleteModal(true)}>
                <Trash size={18} />
              </TrashButton>
            </HeaderActions>
          </Header>

          <InfoContainer>
            <InfoItem>
              <span>Location: {event.location}</span>
            </InfoItem>
            <InfoItem>
              <UserIcon size={20} />
              <span>Sport: {event.eventType}</span>
            </InfoItem>
            <InfoItem>
              <span>Max Participants: {event.maxParticipants}</span>
            </InfoItem>
          </InfoContainer>

          <Tabs>
            <TabButton
              $active={activeTab === 'members'}
              onClick={() => setActiveTab('members')}
            >
              Members
            </TabButton>
            {event.isTeamEvent && (
              <TabButton
                $active={activeTab === 'teams'}
                onClick={() => setActiveTab('teams')}
              >
                Teams
              </TabButton>
            )}
            {(event.eventType == EventType.MultiRound ||
              event.eventType == EventType.Tournament) && (
              <TabButton
                $active={activeTab === 'matches'}
                onClick={() => setActiveTab('matches')}
              >
                Matches
              </TabButton>
            )}
          </Tabs>

          {activeTab === 'members' && (
            <>
              <EventMembersSection
                event={event}
                isManaged={true}
                onRemove={handleRemoveMember}
                onSearchUsers={() => setShowSearchUsersModal(true)}
              />
              <EventPendingSection
                title='Pending Member Invites'
                items={
                  event.memberInvites?.map((invite) => ({
                    id: invite.userId,
                    name: invite.name,
                  })) || []
                }
                onDecline={handleRemoveMemberInvite}
                type='invite'
              />
              <EventPendingSection
                title='Member Join Requests'
                items={
                  event.memberRequests?.map((req) => ({
                    id: req.userId,
                    name: req.name,
                  })) || []
                }
                onAccept={handleAcceptMemberRequest}
                onDecline={handleDeclineMemberRequest}
                type='request'
              />
            </>
          )}

          {activeTab === 'teams' && event.isTeamEvent && (
            <>
              <EventTeamsSection
                event={event}
                isManaged={true}
                onRemove={handleRemoveTeam}
                onSearchTeams={() => setShowSearchTeamsModal(true)}
              />
              <EventPendingSection
                title='Pending Team Invites'
                items={
                  event.teamInvites?.map((invite) => ({
                    id: invite.teamId,
                    name: invite.name,
                  })) || []
                }
                onDecline={handleRemoveTeamInvite}
                type='invite'
              />
              <EventPendingSection
                title='Team Join Requests'
                items={
                  event.teamRequests?.map((req) => ({
                    id: req.teamId,
                    name: req.name,
                  })) || []
                }
                onAccept={handleAcceptTeamRequest}
                onDecline={handleDeclineTeamRequest}
                type='request'
              />
            </>
          )}
          {activeTab === 'matches' && <>test</>}
        </Card>
      )}

      {showSearchUsersModal && event && (
        <SearchUsersModal
          isOpen={showSearchUsersModal}
          onClose={() => setShowSearchUsersModal(false)}
          onInviteUser={handleInviteUser}
          onSearchUsers={(query, page) =>
            searchUsersForEventInvite(event.id, query, page)
          }
        />
      )}

      {showSearchTeamsModal && event && (
        <SearchTeamsModal
          isOpen={showSearchTeamsModal}
          onClose={() => setShowSearchTeamsModal(false)}
          onInviteTeam={handleInviteTeam}
          onSearchTeams={(query, page) =>
            searchTeamsForEventInvite(event.id, query, page)
          }
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteEvent}
        entityName={`Event at ${event?.location}`}
        action='Delete'
      />
    </Container>
  );
};

export default EventManager;

const Container = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  padding: clamp(1rem, 5vw, 3rem) 1rem;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  padding: 0 clamp(0.25rem, 2vw, 2rem);
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TrashButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }
`;
