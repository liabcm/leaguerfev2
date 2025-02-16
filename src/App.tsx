import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GetStarted from './components/GetStarted';
import LeagueForm from './components/League/LeagueForm';
import LeagueList from './components/League/LeagueList';
import Profile from './components/Profile';
import LeagueCard from './components/League/LeagueCard';
import LoginButton from './components/LoginButton';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import ManageLeagues from './components/League/ManageLeagues';
import EventForm from './components/Events/EventForm';
import MyLeagues from './components/League/MyLeagues';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Public route */}
        <Route path='/login' element={<LoginButton />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<GetStarted />} />
          <Route path='/league' element={<LeagueForm />} />
          <Route path='/leagues' element={<LeagueList />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='league/:id' element={<LeagueCard />} />
          <Route path='manager' element={<ManageLeagues />} />
          <Route path='event/:leagueId' element={<EventForm />} />
          <Route path='league/joined' element={<MyLeagues />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
