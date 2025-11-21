import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { validateAllGameData } from './core/validation/validateAll';
import { GameErrorBoundary } from './ui/components/GameErrorBoundary';

// Validate all game data at startup
let validationError: Error | null = null;
try {
  validateAllGameData();
} catch (error) {
  console.error('❌ CRITICAL: Data validation failed at startup:', error);
  validationError = error instanceof Error ? error : new Error(String(error));
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error(
    'Root element not found. Expected element with id="root" in index.html.'
  );
}

// If validation failed, render error screen instead of app
if (validationError) {
  createRoot(rootElement).render(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ff4444',
      fontFamily: 'monospace',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1>❌ Game Data Validation Failed</h1>
      <p style={{ maxWidth: '600px', marginTop: '1rem', color: '#ffaaaa' }}>
        The game data failed validation checks and cannot be loaded safely.
        This indicates corrupted or invalid game data files.
      </p>
      <pre style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderRadius: '4px',
        maxWidth: '800px',
        overflow: 'auto',
        textAlign: 'left',
        color: '#ffcccc'
      }}>
        {validationError.message}
      </pre>
      <p style={{ marginTop: '2rem', color: '#ffaaaa' }}>
        Please report this issue to the development team.
      </p>
    </div>
  );
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <GameErrorBoundary>
        <App />
      </GameErrorBoundary>
    </React.StrictMode>,
  );
}

