import { Calendar, Trophy, User as UserIcon, Users } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';
import { League } from '../../models/League';
import { LeagueUserStatus } from '../../models/LeagueUserStatusEnum';
import EventList from '../Events/EventList';
import LoadingButton from '../General/LoadingButton';
import MemberRow from './MemberRow';

interface LeagueDetailsProps {
  league: League;
  enableMembershipActions?: boolean;
  joined?: boolean;
  onJoin?: () => Promise<void>;
  onLeave?: () => void;
  eventsHeaderAction?: React.ReactNode;
  detailsContent?: React.ReactNode;
  activeTab?: 'details' | 'events';
  onTabChange?: (tab: 'details' | 'events') => void;
  detailsHeaderAction?: React.ReactNode;
  isManaged?: boolean;
  onRemoveMember?: (leagueId: string, memberId: string) => Promise<void>;
  requested?: boolean;
}

const LeagueDetails = ({
  league,
  enableMembershipActions = false,
  joined = false,
  onJoin,
  onLeave,
  eventsHeaderAction,
  detailsContent,
  activeTab: propActiveTab,
  onTabChange: propOnTabChange,
  detailsHeaderAction,
  isManaged = false,
  onRemoveMember,
  requested,
}: LeagueDetailsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState<
    'details' | 'events'
  >('details');
  const [actionLoading, setActionLoading] = useState(false);
  console.log(joined);

  const isControlled =
    propActiveTab !== undefined && propOnTabChange !== undefined;
  const activeTab = isControlled ? propActiveTab : internalActiveTab;

  const handleTabChange = (tab: 'details' | 'events') => {
    if (isControlled) propOnTabChange?.(tab);
    else setInternalActiveTab(tab);
  };

  const members = league.leagueUsers.filter(
    (lu) => lu.status == LeagueUserStatus.Member
  );

  const handleMembershipAction = async () => {
    if (actionLoading || !(onJoin && onLeave)) return;

    setActionLoading(true);
    try {
      joined ? await onLeave() : await onJoin();
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (onRemoveMember) {
      await onRemoveMember(league.id, memberId);
    }
  };

  return (
    <Card>
      <Header>
        <Title>{league.name}</Title>
        <Badge $isPublic={league.isPublic}>
          {league.isPublic ? 'Public' : 'Private'}
        </Badge>
      </Header>

      <InfoContainer>
        <InfoItem>
          <Trophy size={20} />
          <span>{league.isCompetitive ? 'Competitive' : 'Casual'}</span>
        </InfoItem>
        <InfoItem>
          {league.isTeamLeague ? <Users size={20} /> : <UserIcon size={20} />}
          <span>{league.sport}</span>
        </InfoItem>
      </InfoContainer>

      {enableMembershipActions && (league.isPublic || joined) && (
        <StyledLoadingButton
          disabled={requested}
          isLoading={actionLoading}
          loadingText={joined ? 'Leaving...' : 'Requesting...'}
          onClick={handleMembershipAction}
          $joined={joined}
        >
          {joined
            ? 'Leave League'
            : requested
            ? 'Requested'
            : 'Request to Join'}
        </StyledLoadingButton>
      )}

      <Tabs>
        <TabButton
          $active={activeTab === 'details'}
          onClick={() => handleTabChange('details')}
        >
          Details
        </TabButton>
        <TabButton
          $active={activeTab === 'events'}
          onClick={() => handleTabChange('events')}
        >
          Events
        </TabButton>
      </Tabs>

      {activeTab === 'details' &&
        (detailsContent || (
          <MembersSection>
            <MembersHeader>
              {league.isTeamLeague ? <h3>Teams</h3> : <h3>Members</h3>}
              <Count>
                {league.isTeamLeague
                  ? league.teams?.length || 0
                  : members.length || 0}
              </Count>
              <ActionContainer>{detailsHeaderAction}</ActionContainer>
            </MembersHeader>
            <MembersList>
              {league.isTeamLeague
                ? league.teams?.map((team) => (
                    <Member key={team.id}>{team.name}</Member>
                  ))
                : members.map((member) => (
                    <MemberRow
                      key={member.userId}
                      member={member}
                      isManaged={isManaged}
                      onRemove={handleRemoveMember}
                    />
                  ))}
            </MembersList>
          </MembersSection>
        ))}

      {activeTab === 'events' && (
        <EventsSection>
          <EventsHeader>
            <HeaderTopRow>
              <Calendar size={20} />
              <h3>Upcoming Events</h3>
            </HeaderTopRow>
            <ActionContainer>{eventsHeaderAction}</ActionContainer>
          </EventsHeader>
          <EventList events={league.events || []} />
        </EventsSection>
      )}
    </Card>
  );
};

export default LeagueDetails;

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ActionContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1);
  padding: clamp(1rem, 3vw, 2.5rem);
  width: 100%;
  max-width: 100%;
  min-width: clamp(18rem, 85vw, 30rem); /* Tighter for mobile */
  overflow-x: hidden; /* Safety net */
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
  padding: 0 clamp(0.25rem, 2vw, 2rem); /* Reduced min padding */
  width: 100%;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
  flex: 1;
`;

const StyledLoadingButton = styled(LoadingButton)<{ $joined: boolean }>`
  background-color: ${({ $joined }) => ($joined ? '#ef4444' : '#3b82f6')};
  color: white;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  padding: clamp(0.5rem, 2vw, 0.75rem);
  font-size: clamp(0.75rem, 2.5vw, 1rem);

  &:hover {
    opacity: 0.9;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
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
  padding-left: clamp(0.25rem, 2vw, 2rem); /* Reduced min padding */
  padding-right: clamp(0.25rem, 2vw, 2rem);
`;

const MembersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const Count = styled.span`
  background-color: #e5e7eb;
  padding: 0.25rem 0.75rem;
  border-radius: 9999rem;
  font-size: 0.875rem;
`;

const MembersList = styled.div`
  display: grid;
  gap: 0.5rem;
  max-height: clamp(9.375rem, 50vh, 12.5rem);
  overflow-y: auto;
  width: 100%;
`;

const Member = styled.div`
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 100%;
`;

const EventsSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: clamp(1rem, 3vw, 1.5rem);
  padding-left: clamp(0.25rem, 2vw, 2rem); /* Reduced min padding */
  padding-right: clamp(0.25rem, 2vw, 2rem);
`;

const EventsHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;
