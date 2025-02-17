// Pages.tsx
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useLeagueApi } from '../api/useLeagueApi';

// Components
import GetStarted from './GetStarted';
import LeagueForm from './League/LeagueForm';
import LeagueList from './League/LeagueList';
import Profile from './Profile';
import LeagueCard from './League/LeagueCard';
import LoginButton from './LoginButton';
import ProtectedRoute from './ProtectedRoute';
import ManageLeagues from './League/ManageLeagues';
import EventForm from './Events/EventForm';
import MyLeagues from './League/MyLeagues';
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
