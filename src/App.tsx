import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GetStarted from './components/GetStarted'
import CreateLeagueForm from './components/CreateLeagueForm'
import LeaguesList from './components/LeagueList'
import { useMsal } from '@azure/msal-react'
import { useEffect } from 'react'
import { apiScopes } from './authConfig'
import { RedirectHandler } from './components/RedirectHandler'

function App() {
  const { instance } = useMsal();

  useEffect(() => {
    instance.handleRedirectPromise()
      .then((tokenResponse) => {
        if (!tokenResponse) {
          // No existing token found
          instance.loginRedirect({ scopes: apiScopes })
        }
      })
      .catch(error => {
        console.error('Authentication error:', error)
      })
  }, [instance])

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<GetStarted/>}/>
      <Route path="/league" element={<CreateLeagueForm/>}/>
      <Route path="/leagues" element={<LeaguesList/>}/>
      <Route path="/redirect" element={<RedirectHandler />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
