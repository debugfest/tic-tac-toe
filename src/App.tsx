import { Game } from './components/Game';
import { AudioPlayer } from './components/AudioPlayer';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {

	return (
    <>
      <AudioPlayer />
      <ThemeProvider>
          <Game />;
      </ThemeProvider>

    </>
  );
}


export default App;
