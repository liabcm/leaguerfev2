// AppContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';
import { LeagueUser } from '../models/LeagueUser';

interface AppContextProps {
  invites: LeagueUser[];
  setInvites: (invites: LeagueUser[]) => void;
  // You can add more global state properties here as needed
}

const AppContext = createContext<AppContextProps>({
  invites: [],
  setInvites: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [invites, setInvites] = useState<LeagueUser[]>([]);

  return (
    <AppContext.Provider value={{ invites, setInvites }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
