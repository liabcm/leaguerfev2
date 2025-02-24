import { Calendar, Trophy, User as UserIcon, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import { LeagueUser } from '../../models/LeagueUser';
import { LeagueUserStatus } from '../../models/LeagueUserStatusEnum';
import { User } from '../../models/User';
import EventList from '../Events/EventList';
import LeaguePendingSection from './LeaguePendingSection';
import MemberRow from './MemberRow';
import SearchUsersModal from './SearchUsersModal';

const ManageLeagues = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  // Now activeTab tracks one of three states: members, teams, or events
  const [activeTab, setActiveTab] = useState<'members' | 'teams' | 'events'>(
    'members'
  );
  const {
    getMyLeagues,
    kickFromLeague,
    inviteUserToLeague,
    acceptInvite,
    declineInvite,
  } = useLeagueApi();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSearchUsersModal, setShowSearchUsersModal] = useState(false);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const data = await getMyLeagues();
        setLeagues(data);
        const leagueId = searchParams.get('leagueId');
        if (leagueId) {
          const league = data.find((l) => l.id === leagueId);
          setSelectedLeague(league || null);
        }
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
    };
    fetchLeagues();
  }, []);

  // Reset activeTab when a new league is selected.
  useEffect(() => {
    setActiveTab('members');
  }, [selectedLeague]);

  const handleCreateEvent = () => {
    selectedLeague && navigate(`/event/${selectedLeague.id}`);
  };

  const handleLeagueSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = e.target.value;
    setSearchParams(leagueId ? { leagueId } : {});
    setSelectedLeague(leagues.find((l) => l.id === leagueId) || null);
  };

  const handleInviteUser = async (user: User) => {
    try {
      await inviteUserToLeague(selectedLeague?.id!, user.id, true);
      setLeagues(
        leagues.map((league) => {
          if (league.id === selectedLeague?.id) {
            const updatedLeague = {
              ...league,
              leagueInvites: [
                ...league.leagueInvites,
                {
                  userId: user.id,
                  name: user.name,
                  leagueId: selectedLeague.id,
                  leagueName: selectedLeague.name,
                  email: user.email,
                  isManager: false,
                  status: LeagueUserStatus.Invited,
                },
              ],
            };
            setSelectedLeague(updatedLeague);
            return updatedLeague;
          }
          return league;
        })
      );
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const leagueId = selectedLeague?.id!;
      await kickFromLeague(leagueId, memberId);
      setLeagues(
        leagues.map((league) => {
          if (league.id === leagueId) {
            const updatedLeague = {
              ...league,
              leagueMembers: league.leagueMembers.filter(
                (user) => user.userId !== memberId
              ),
            };
            setSelectedLeague(updatedLeague);
            return updatedLeague;
          }
          return league;
        })
      );
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const onAccept = async (member: LeagueUser) => {
    try {
      await acceptInvite(selectedLeague?.id!, member.userId);
      setLeagues(
        leagues.map((league) => {
          if (league.id === selectedLeague?.id) {
            const updatedLeague = {
              ...league,
              leagueMembers: [...league.leagueMembers, member],
              leagueRequests: league.leagueRequests.filter(
                (user) => user.userId !== member.userId
              ),
            };
            setSelectedLeague(updatedLeague);
            return updatedLeague;
          }
          return league;
        })
      );
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const onDecline = async (member: LeagueUser) => {
    try {
      await declineInvite(selectedLeague?.id!, member.userId);
      setLeagues((prevLeagues) => {
        const updatedLeagues = prevLeagues.map((league) => {
          if (league.id === selectedLeague?.id) {
            const updatedLeague = {
              ...league,
              leagueRequests: league.leagueRequests.filter(
                (user) => user.userId !== member.userId
              ),
            };
            setSelectedLeague(updatedLeague);
            return updatedLeague;
          }
          return league;
        });
        return updatedLeagues;
      });
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const onRemoveInvite = async (member: LeagueUser) => {
    try {
      await declineInvite(selectedLeague?.id!, member.userId);
      setLeagues((prevLeagues) => {
        const updatedLeagues = prevLeagues.map((league) => {
          if (league.id === selectedLeague?.id) {
            const updatedLeague = {
              ...league,
              leagueInvites: league.leagueInvites.filter(
                (user) => user.userId !== member.userId
              ),
            };
            setSelectedLeague(updatedLeague);
            return updatedLeague;
          }
          return league;
        });
        return updatedLeagues;
      });
    } catch (error) {
      console.error('Error removing invite:', error);
    }
  };

  const handleAddTeam = () => {
    navigate(`/league/${selectedLeague?.id}/team`);
  };

  return (
    <Container>
      <Select onChange={handleLeagueSelect}>
        <option value=''>Select a league</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </Select>

      {selectedLeague && (
        <Card>
          <Header>
            <Title>{selectedLeague.name}</Title>
            <Badge $isPublic={selectedLeague.isPublic}>
              {selectedLeague.isPublic ? 'Public' : 'Private'}
            </Badge>
          </Header>

          <InfoContainer>
            <InfoItem>
              <Trophy size={20} />
              <span>
                {selectedLeague.isCompetitive ? 'Competitive' : 'Casual'}
              </span>
            </InfoItem>
            <InfoItem>
              {selectedLeague.isTeamLeague ? (
                <Users size={20} />
              ) : (
                <UserIcon size={20} />
              )}
              <span>{selectedLeague.sport}</span>
            </InfoItem>
          </InfoContainer>

          {/* Three tabs: Members, Teams (if applicable), and Events */}
          <Tabs>
            <TabButton
              $active={activeTab === 'members'}
              onClick={() => setActiveTab('members')}
            >
              Members
            </TabButton>
            {selectedLeague.isTeamLeague && (
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
              <MembersSection>
                <MembersHeader>
                  <h3>Members</h3>
                  <Count>{selectedLeague.leagueMembers.length || 0}</Count>
                  <ActionContainer>
                    <Button onClick={() => setShowSearchUsersModal(true)}>
                      Search Users
                    </Button>
                  </ActionContainer>
                </MembersHeader>
                <MembersList>
                  {selectedLeague.leagueMembers.map((member) => (
                    <MemberRow
                      key={member.userId}
                      member={member}
                      isManaged={true}
                      onRemove={handleRemoveMember}
                    />
                  ))}
                </MembersList>
              </MembersSection>
              <LeaguePendingSection
                title='Pending Invites'
                items={selectedLeague.leagueInvites}
                onDecline={onRemoveInvite}
                type='invite'
              />
              <LeaguePendingSection
                title='Join Requests'
                items={selectedLeague.leagueRequests}
                onAccept={onAccept}
                onDecline={onDecline}
                type='request'
              />
            </>
          )}

          {activeTab === 'teams' && selectedLeague.isTeamLeague && (
            <MembersSection>
              <MembersHeader>
                <h3>Teams</h3>
                <Count>{selectedLeague.teams?.length || 0}</Count>
                <ActionContainer>
                  <Button onClick={handleAddTeam}>Add Team</Button>
                </ActionContainer>
              </MembersHeader>
              <MembersList>
                {selectedLeague.teams?.map((team) => (
                  <Member key={team.id}>{team.name}</Member>
                ))}
              </MembersList>
            </MembersSection>
          )}

          {activeTab === 'events' && (
            <EventsSection>
              <EventsHeader>
                <HeaderTopRow>
                  <Calendar size={20} />
                  <h3>Upcoming Events</h3>
                </HeaderTopRow>
                <ActionContainer>
                  <Button onClick={handleCreateEvent}>Create New Event</Button>
                </ActionContainer>
              </EventsHeader>
              <EventList events={selectedLeague.events || []} />
            </EventsSection>
          )}
        </Card>
      )}

      {showSearchUsersModal && selectedLeague && (
        <SearchUsersModal
          isOpen={showSearchUsersModal}
          onClose={() => setShowSearchUsersModal(false)}
          onInviteUser={handleInviteUser}
          leagueId={selectedLeague.id}
        />
      )}
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

const Select = styled.select`
  width: 100%;
  max-width: 25rem;
  padding: clamp(0.5rem, 2vw, 0.75rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1);
  padding: clamp(1rem, 3vw, 2.5rem);
  width: 100%;
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const Badge = styled.span<{ $isPublic: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999rem;
  font-size: 0.875rem;
  background-color: ${({ $isPublic }) => ($isPublic ? '#60a5fa' : '#6b7280')};
  color: white;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  padding: 0 clamp(0.25rem, 2vw, 2rem);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
  flex: 1;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: clamp(0.375rem, 1.5vw, 0.5rem);
  background-color: ${({ $active }) => ($active ? '#3b82f6' : '#e5e7eb')};
  color: ${({ $active }) => ($active ? 'white' : '#4b5563')};
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  font-size: clamp(0.75rem, 2vw, 1rem);
`;

const MembersSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: clamp(1rem, 3vw, 1.5rem);
`;

const MembersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Count = styled.span`
  background-color: #e5e7eb;
  padding: 0.25rem 0.75rem;
  border-radius: 9999rem;
  font-size: 0.875rem;
`;

const ActionContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const MembersList = styled.div`
  display: grid;
  gap: 0.5rem;
  max-height: clamp(9.375rem, 50vh, 12.5rem);
  overflow-y: auto;
`;

const Member = styled.div`
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

const EventsSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: clamp(1rem, 3vw, 1.5rem);
`;

const EventsHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.25rem);
  border-radius: 0.25rem;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.25rem, 1vw, 0.5rem);
  background-color: #0066cc;
  border: none;
  color: white;

  &:hover {
    background-color: #0052a3;
  }
`;
