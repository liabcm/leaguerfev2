// App.tsx
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import Pages from './components/Pages';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Pages />
    </BrowserRouter>
  );
}

export default App;
