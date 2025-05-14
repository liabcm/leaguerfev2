import { Trash, User as UserIcon, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import { LeagueUser } from '../../models/LeagueUser';
import { LeagueUserStatus } from '../../models/LeagueUserStatusEnum';
import { PagedResult } from '../../models/PagedResult';
import { Team } from '../../models/Team';
import { User } from '../../models/User';
import LogResultModal from '../Events/LogResultModal';
import BackButton from '../General/BackButton';
import ConfirmationModal from '../General/ConfirmationModal';
import { StyledSpinner } from '../SharedStyles';
import LeagueEventsSection from './LeagueEventsSection';
import LeagueMembersSection from './LeagueMembersSection';
import LeaguePendingSection from './LeaguePendingSection';
import LeagueTeamsSection from './LeagueTeamsSection';
import SearchUsersModal from './SearchUsersModal';
import {
  Badge,
  Card,
  Header,
  InfoItem,
  TabButton,
  Tabs,
  Title,
} from './SharedLeagueStyles';

const ManageLeagues = () => {
  const [league, setLeague] = useState<League | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'teams' | 'events'>(
    'members'
  );
  const {
    getLeagueById,
    kickFromLeague,
    inviteUserToLeague,
    acceptInvite,
    declineInvite,
    acceptTeamRequest,
    rejectTeamRequest,
    searchUsersForLeagueInvite,
    deleteLeague,
    createEventResult,
  } = useLeagueApi();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showSearchUsersModal, setShowSearchUsersModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        if (id) {
          setIsLoading(true);
          const data = await getLeagueById(id);
          setLeague(data);
        }
      } catch (error) {
        console.error('Error fetching league:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeague();
  }, [id]);

  const handleCreateEvent = () => {
    league && navigate(`/event-create/${league.id}`);
  };

  const handleLogResult = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSubmitResult = async (formData: {
    winningId: string;
    score: string;
    starPlayerUserId: string;
    eventId: string;
    losingId: string;
  }) => {
    try {
      const newEventResult = await createEventResult(formData);

      setLeague((prevLeague) => {
        if (!prevLeague) return prevLeague;

        // Create a deep copy of the league
        const updatedLeague = { ...prevLeague };

        // Find the event to update
        const eventIndex = updatedLeague.events.findIndex(
          (event) => event.id === formData.eventId
        );

        if (eventIndex !== -1) {
          // Create a new event object with the result
          updatedLeague.events[eventIndex] = {
            ...updatedLeague.events[eventIndex],
            eventResult: {
              id: newEventResult?.id || '',
              eventId: formData.eventId,
              winningTeamId: formData.winningId.startsWith('team_')
                ? formData.winningId.substring(5)
                : undefined,
              winningUserId: formData.winningId.startsWith('user_')
                ? formData.winningId.substring(5)
                : undefined,
              score: formData.score,
              starPlayerUserId: formData.starPlayerUserId,
              event: updatedLeague.events[eventIndex],
            },
          };
        }

        return updatedLeague;
      });
    } catch (error) {
      console.error('Error creating event result:', error);
    }
  };

  const handleDeleteLeague = async () => {
    try {
      await deleteLeague(league?.id!);
      navigate(-1);
    } catch (error) {
      console.error('Error deleting league:', error);
    }
  };

  const handleInviteUser = async (user: User) => {
    try {
      await inviteUserToLeague(league?.id!, user.id, true);
      const updatedLeague = {
        ...league,
        leagueInvites: [
          ...league!.leagueInvites,
          {
            userId: user.id,
            name: user.name,
            leagueId: league!.id,
            leagueName: league!.name,
            email: user.email,
            isManager: false,
            status: LeagueUserStatus.Invited,
          },
        ],
      } as League;
      setLeague(updatedLeague);
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const leagueId = league?.id!;
      await kickFromLeague(leagueId, memberId);
      const updatedLeague = {
        ...league,
        leagueMembers: league!.leagueMembers.filter(
          (user) => user.userId !== memberId
        ),
      } as League;
      setLeague(updatedLeague);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const onAccept = async (member: LeagueUser) => {
    try {
      await acceptInvite(league?.id!, member.userId);
      const updatedLeague = {
        ...league,
        leagueMembers: [...league!.leagueMembers, member],
        leagueRequests: league!.leagueRequests.filter(
          (user) => user.userId !== member.userId
        ),
      } as League;
      setLeague(updatedLeague);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const onAcceptTeam = async (item: LeagueUser) => {
    try {
      await acceptTeamRequest(item.userId);
      const updatedLeague = {
        ...league,
        teams: [...league!.teams, { id: item.userId, name: item.name } as Team],
        teamRequests: league!.teamRequests.filter(
          (team) => item.userId !== team.id
        ),
      } as League;
      setLeague(updatedLeague);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const onDecline = async (member: LeagueUser) => {
    try {
      await declineInvite(league?.id!, member.userId);
      const updatedLeague = {
        ...league,
        leagueRequests: league!.leagueRequests.filter(
          (user) => user.userId !== member.userId
        ),
      } as League;
      setLeague(updatedLeague);
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const onDeclineTeam = async (member: LeagueUser) => {
    try {
      await rejectTeamRequest(member.userId);
      const updatedLeague = {
        ...league,
        teamRequests: league!.teamRequests.filter(
          (team) => team.id !== member.userId
        ),
      } as League;
      setLeague(updatedLeague);
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const onRemoveInvite = async (member: LeagueUser) => {
    try {
      await declineInvite(league?.id!, member.userId);
      const updatedLeague = {
        ...league,
        leagueInvites: league!.leagueInvites.filter(
          (user) => user.userId !== member.userId
        ),
      } as League;
      setLeague(updatedLeague);
    } catch (error) {
      console.error('Error removing invite:', error);
    }
  };

  const handleSearchUsers = async (
    query: string,
    pageNum: number
  ): Promise<PagedResult<User>> => {
    const users = await searchUsersForLeagueInvite(league?.id!, query, pageNum);
    return users;
  };

  const handleAddTeam = () => {
    navigate(`/league/${league?.id}/team`);
  };

  if (isLoading) {
    return <StyledSpinner />;
  }

  return (
    <Container>
      <BackButton />
      {league && (
        <Card>
          <Header>
            <Title>{league.name}</Title>
            <HeaderActions>
              <Badge $isPublic={league.isPublic}>
                {league.isPublic ? 'Public' : 'Private'}
              </Badge>
              <TrashButton onClick={() => setShowDeleteModal(true)}>
                <Trash size={18} />
              </TrashButton>
            </HeaderActions>
          </Header>

          <InfoContainer>
            <InfoItem>
              <span>{league.isCompetitive ? 'Competitive' : 'Casual'}</span>
            </InfoItem>
            <InfoItem>
              {league.isTeamLeague ? (
                <Users size={20} />
              ) : (
                <UserIcon size={20} />
              )}
              <span>{league.sport}</span>
            </InfoItem>
          </InfoContainer>

          <Tabs>
            <TabButton
              $active={activeTab === 'members'}
              onClick={() => setActiveTab('members')}
            >
              Members
            </TabButton>
            {league.isTeamLeague && (
              <TabButton
                $active={activeTab === 'teams'}
                onClick={() => setActiveTab('teams')}
              >
                Teams
              </TabButton>
            )}
            <TabButton
              $active={activeTab === 'events'}
              onClick={() => setActiveTab('events')}
            >
              Events
            </TabButton>
          </Tabs>

          {activeTab === 'members' && (
            <>
              <LeagueMembersSection
                league={league}
                isManaged={true}
                onRemove={handleRemoveMember}
                onSearchUsers={() => setShowSearchUsersModal(true)}
              />
              <LeaguePendingSection
                title='Pending Invites'
                items={league.leagueInvites}
                onDecline={onRemoveInvite}
                type='invite'
              />
              <LeaguePendingSection
                title='Join Requests'
                items={league.leagueRequests}
                onAccept={onAccept}
                onDecline={onDecline}
                type='request'
              />
            </>
          )}

          {activeTab === 'teams' && league.isTeamLeague && (
            <>
              <LeagueTeamsSection
                league={league}
                isManaged={true}
                onAddTeam={handleAddTeam}
              />
              <LeaguePendingSection
                title='Team Requests'
                items={league.teamRequests.map(
                  (tr) => ({ userId: tr.id, name: tr.name } as LeagueUser)
                )}
                onDecline={onDeclineTeam}
                type='request'
                onAccept={onAcceptTeam}
              />
            </>
          )}

          {activeTab === 'events' && (
            <LeagueEventsSection
              events={league.events || []}
              isTeamEvents={league.isTeamLeague}
              showCreateButton={true}
              onCreateEvent={handleCreateEvent}
              onLogResult={handleLogResult}
            />
          )}
        </Card>
      )}

      {showSearchUsersModal && league && (
        <SearchUsersModal
          isOpen={showSearchUsersModal}
          onClose={() => setShowSearchUsersModal(false)}
          onInviteUser={handleInviteUser}
          onSearchUsers={handleSearchUsers}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteLeague}
        entityName={league?.name || 'league'}
        action='Delete'
      />
      <LogResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        onSubmit={handleSubmitResult}
        isTeamEvent={league?.isTeamLeague || false}
      />
    </Container>
  );
};

export default ManageLeagues;

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
