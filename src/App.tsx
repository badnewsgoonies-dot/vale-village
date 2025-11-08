import { GameProvider } from './context/GameProvider';
import { CameraProvider } from './context/CameraContext';
import { GameViewport } from './components/viewport';
import { ScreenRouter } from './router/ScreenRouter';
import './App.css';
import './tokens.css';

function App() {
  return (
    <GameProvider>
      <GameViewport
        aspectRatio={1.6} // 16:10 like Golden Sun
        baseWidth={800}
        integerScaling={false} // Set to true for pixel-perfect scaling
      >
        <CameraProvider>
          <div className="app-container">
            <ScreenRouter />
          </div>
        </CameraProvider>
      </GameViewport>
    </GameProvider>
  );
}

export default App;
