import { Game } from './components/Game';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return(
    <ThemeProvider>
      <Game />;
    </ThemeProvider>
  );
}

export default App;
