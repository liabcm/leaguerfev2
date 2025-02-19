// App.tsx
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Pages from './components/Pages';
import GlobalStyles from './GlobalStyles';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <NavBar />
      <Pages />
    </BrowserRouter>
  );
}

export default App;
