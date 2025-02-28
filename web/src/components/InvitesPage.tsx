import { useState } from 'react';
import styled from 'styled-components';
import LeagueInvitesTab from './League/LeagueInvitesTab';
import { TabButton, Tabs } from './League/SharedLeagueStyles';
import TeamInvitesTab from './Teams/TeamInvitesTab';

const InvitesPage = () => {
  const [activeTab, setActiveTab] = useState<'leagues' | 'teams'>('leagues');

  return (
    <PageContainer>
      <Title>Invites & Requests</Title>

      <Tabs>
        <TabButton
          $active={activeTab === 'leagues'}
          onClick={() => setActiveTab('leagues')}
        >
          League Invites
        </TabButton>
        <TabButton
          $active={activeTab === 'teams'}
          onClick={() => setActiveTab('teams')}
        >
          Team Invites
        </TabButton>
      </Tabs>

      {activeTab === 'leagues' && <LeagueInvitesTab />}

      {activeTab === 'teams' && <TeamInvitesTab />}
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
