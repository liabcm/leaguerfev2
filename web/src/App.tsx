// App.tsx
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Pages from './components/Pages';
import GlobalStyles from './GlobalStyles';
import { AppProvider } from './provider/AppContext';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <AppProvider>
        <NavBar />
        <Pages />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
