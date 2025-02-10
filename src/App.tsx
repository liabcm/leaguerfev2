import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GetStarted from './components/GetStarted';
import LeagueForm from './components/LeagueForm';
import LeagueList from './components/LeagueList';
import Profile from './components/Profile';
import LeagueCard from './components/LeagueCard';
import LoginButton from './components/LoginButton';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
