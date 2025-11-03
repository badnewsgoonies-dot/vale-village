import { GameProvider } from './context/GameProvider';
import { ScreenRouter } from './router/ScreenRouter';
import './App.css';
import './tokens.css';

function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <ScreenRouter />
      </div>
    </GameProvider>
  );
}

export default App;
