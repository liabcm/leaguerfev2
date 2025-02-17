// Pages.tsx
import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useLeagueApi } from '../api/useLeagueApi';

// Components
import EventForm from './Events/EventForm';
import GetStarted from './GetStarted';
import LeagueCard from './League/LeagueCard';
import LeagueForm from './League/LeagueForm';
import LeagueList from './League/LeagueList';
import ManageLeagues from './League/ManageLeagues';
import MyLeagues from './League/MyLeagues';
import Profile from './Profile';
import ProtectedRoute from './ProtectedRoute';
import SportForm from './Sport/SportForm';

function Pages() {
  const { instance, accounts } = useMsal();
  const { getCurrentUser, createUser } = useLeagueApi();

  useEffect(() => {
    const checkOrCreateUser = async () => {
      if (accounts.length === 0) return;

      try {
        await getCurrentUser();
      } catch (error) {
        try {
          await createUser();
        } catch (error) {
          console.error('Error during user check/creation:', error);
        }
      }
    };

    checkOrCreateUser();
  }, [accounts, instance]);

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<GetStarted />} />
        <Route path='/league' element={<LeagueForm />} />
        <Route path='/leagues' element={<LeagueList />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='league/:id' element={<LeagueCard />} />
        <Route path='manager' element={<ManageLeagues />} />
        <Route path='event/:leagueId' element={<EventForm />} />
        <Route path='league/joined' element={<MyLeagues />} />
        <Route path='sport' element={<SportForm />} />
      </Route>
    </Routes>
  );
}

export default Pages;
