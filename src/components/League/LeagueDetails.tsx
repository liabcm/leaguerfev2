// components/League/LeagueDetails.tsx
import { Trophy, Users, Calendar, User as UserIcon } from 'lucide-react';
import styled from 'styled-components';
import EventList from '../Events/EventList';
import { League } from '../../models/League';
import { User } from '../../models/User';
import { useState } from 'react';
import { Team } from '../../models/Team';

interface LeagueDetailsProps {
  league: League;
  enableMembershipActions?: boolean;
  joined?: boolean;
  onJoin?: () => Promise<void>;
  onLeave?: () => Promise<void>;
  eventsHeaderAction?: React.ReactNode;
  detailsContent?: React.ReactNode;
  activeTab?: 'details' | 'events';
  onTabChange?: (tab: 'details' | 'events') => void;
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
}: LeagueDetailsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState<
    'details' | 'events'
  >('details');
  const [actionLoading, setActionLoading] = useState(false);

  const isControlled =
    propActiveTab !== undefined && propOnTabChange !== undefined;
  const activeTab = isControlled ? propActiveTab : internalActiveTab;

  const handleTabChange = (tab: 'details' | 'events') => {
    if (isControlled) propOnTabChange?.(tab);
    else setInternalActiveTab(tab);
  };

  const handleMembershipAction = async () => {
    if (actionLoading || !(onJoin && onLeave)) return;

    setActionLoading(true);
    try {
      joined ? await onLeave() : await onJoin();
    } finally {
      setActionLoading(false);
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

      {enableMembershipActions && (
        <ActionButton
          onClick={handleMembershipAction}
          $joined={joined}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <ButtonContent>
              <SmallSpinner />
              {joined ? 'Leaving...' : 'Joining...'}
            </ButtonContent>
          ) : joined ? (
            'Leave League'
          ) : (
            'Join League'
          )}
        </ActionButton>
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
              <Count>{league.leagueUsers.length}</Count>
            </MembersHeader>
            <MembersList>
              {league.isTeamLeague
                ? league.teams?.map((team: Team) => (
                    <Member key={team.id}>{team.name}</Member>
                  ))
                : league.leagueUsers?.map((member: User) => (
                    <Member key={member.id}>{member.name}</Member>
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  min-width: 20rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const Badge = styled.span<{ $isPublic: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background-color: ${({ $isPublic }) => ($isPublic ? '#60a5fa' : '#6b7280')};
  color: white;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const SmallSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ActionButton = styled.button<{ $joined: boolean }>`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: ${({ $joined }) => ($joined ? '#ef4444' : '#3b82f6')};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.5rem;
  background-color: ${({ $active }) => ($active ? '#3b82f6' : '#e5e7eb')};
  color: ${({ $active }) => ($active ? 'white' : '#4b5563')};
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
`;

const MembersSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
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
  border-radius: 9999px;
  font-size: 0.875rem;
`;

const MembersList = styled.div`
  display: grid;
  gap: 0.5rem;
  max-height: 200px;
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
  padding-top: 1.5rem;
`;

const EventsHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;
