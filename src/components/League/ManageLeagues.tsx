import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLeagueApi } from '../../api/useLeagueApi';
import { League } from '../../models/League';
import LeagueDetails from './LeagueDetails';
import SearchUsersModal from './SearchUsersModal';

const ManageLeagues = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
  const { getMyLeagues, kickFromLeague, inviteUserToLeague } = useLeagueApi();
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

  const handleCreateEvent = () => {
    selectedLeague && navigate(`/event/${selectedLeague.id}`);
  };

  const handleLeagueSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = e.target.value;
    setSearchParams(leagueId ? { leagueId } : {});
    setSelectedLeague(leagues.find((l) => l.id === leagueId) || null);
  };

  const handleInviteUser = async (userId: string) => {
    try {
      console.log(userId);
      await inviteUserToLeague(selectedLeague?.id!, userId, true);
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  const handleRemoveMember = async (leagueId: string, memberId: string) => {
    try {
      await kickFromLeague(leagueId, memberId);
      setLeagues(
        leagues.map((league) => {
          if (league.id === leagueId) {
            return {
              ...league,
              leagueUsers: league.leagueUsers.filter(
                (user) => user.userId !== memberId
              ),
            };
          }
          return league;
        })
      );
    } catch (error) {
      console.error('Error removing member:', error);
    }
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
        <LeagueDetails
          league={selectedLeague}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          eventsHeaderAction={
            <Button onClick={handleCreateEvent}>Create New Event</Button>
          }
          detailsHeaderAction={
            selectedLeague?.isTeamLeague ? (
              <Button onClick={() => console.log('team')}>Add Team</Button>
            ) : (
              <Button onClick={() => setShowSearchUsersModal(true)}>
                Search Users
              </Button>
            )
          }
          isManaged={true}
          onRemoveMember={handleRemoveMember}
        />
      )}
      {showSearchUsersModal && (
        <SearchUsersModal
          isOpen={showSearchUsersModal}
          onClose={() => setShowSearchUsersModal(false)}
          onInviteUser={handleInviteUser}
          leagueId={selectedLeague?.id!}
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

const Button = styled.button<{ variant?: 'secondary' }>`
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
  width: 100%;
  max-width: 15rem;

  ${({ variant }) =>
    variant === 'secondary'
      ? `
        background-color: white;
        border: 1px solid #ddd;
        color: #333;

        &:hover {
          background-color: #f5f5f5;
        }
      `
      : `
        background-color: #0066cc;
        border: none;
        color: white;

        &:hover {
          background-color: #0052a3;
        }
      `}
`;
