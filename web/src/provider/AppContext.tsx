// AppContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';
import { LeagueUser } from '../models/LeagueUser';
import { TeamUser } from '../models/TeamUser';

interface AppContextProps {
  invites: LeagueUser[];
  setInvites: (invites: LeagueUser[]) => void;
  teamInvites: TeamUser[];
  setTeamInvites: (teamInvites: TeamUser[]) => void;
  // You can add more global state properties here as needed
}

const AppContext = createContext<AppContextProps>({
  invites: [],
  setInvites: () => {},
  teamInvites: [],
  setTeamInvites: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [invites, setInvites] = useState<LeagueUser[]>([]);
  const [teamInvites, setTeamInvites] = useState<TeamUser[]>([]);

  return (
    <AppContext.Provider
      value={{ invites, setInvites, teamInvites, setTeamInvites }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
