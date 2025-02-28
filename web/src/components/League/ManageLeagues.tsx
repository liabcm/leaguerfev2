import { Trophy, User as UserIcon, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import { LeagueUser } from '../../models/LeagueUser';
import { LeagueUserStatus } from '../../models/LeagueUserStatusEnum';
import { PagedResult } from '../../models/PagedResult';
import { Team } from '../../models/Team';
import { User } from '../../models/User';
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
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'teams' | 'events'>(
    'members'
  );
  const {
    getMyLeagues,
    kickFromLeague,
    inviteUserToLeague,
    acceptInvite,
    declineInvite,
    acceptTeamRequest,
    searchUsers,
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

  useEffect(() => {
    setActiveTab('members');
  }, [selectedLeague?.id]);

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

  const onAcceptTeam = async (item: LeagueUser) => {
    try {
      await acceptTeamRequest(item.userId);
      setLeagues(
        leagues.map((league) => {
          if (league.id === selectedLeague?.id) {
            const updatedLeague = {
              ...league,
              teams: [
                ...league.teams,
                { id: item.userId, name: item.name } as Team,
              ],
              teamRequests: league.teamRequests.filter(
                (team) => item.userId !== team.id
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

  const onDeclineTeam = async (member: LeagueUser) => {
    try {
      setLeagues((prevLeagues) => {
        const updatedLeagues = prevLeagues.map((league) => {
          if (league.id === selectedLeague?.id) {
            const updatedLeague = {
              ...league,
              teamRequests: league.teamRequests.filter(
                (team) => team.id !== member.userId
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

  const handleSearchUsers = async (
    query: string,
    pageNum: number
  ): Promise<PagedResult> => {
    const users = await searchUsers(selectedLeague?.id!, query, pageNum);
    return users;
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
              <LeagueMembersSection
                league={selectedLeague}
                isManaged={true}
                onRemove={handleRemoveMember}
                onSearchUsers={() => setShowSearchUsersModal(true)}
              />
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
            <>
              <LeagueTeamsSection
                league={selectedLeague}
                isManaged={true}
                onAddTeam={handleAddTeam}
              />
              <LeaguePendingSection
                title='Team Requests'
                items={selectedLeague.teamRequests.map(
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
              events={selectedLeague.events || []}
              isTeamEvents={selectedLeague.isTeamLeague}
              showCreateButton={true}
              onCreateEvent={handleCreateEvent}
            />
          )}
        </Card>
      )}

      {showSearchUsersModal && selectedLeague && (
        <SearchUsersModal
          isOpen={showSearchUsersModal}
          onClose={() => setShowSearchUsersModal(false)}
          onInviteUser={handleInviteUser}
          onSearchUsers={handleSearchUsers}
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

const InfoContainer = styled.div`
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  padding: 0 clamp(0.25rem, 2vw, 2rem);
`;
