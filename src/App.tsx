import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GetStarted from './components/GetStarted'
import CreateLeagueForm from './components/CreateLeagueForm'
import LeaguesList from './components/LeagueList'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<GetStarted/>}/>
      <Route path="/league" element={<CreateLeagueForm/>}/>
      <Route path="/leagues" element={<LeaguesList/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
