import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { validateAllGameData } from './core/validation/validateAll';

// Validate all game data at startup
try {
  validateAllGameData();
} catch (error) {
  console.error('Data validation failed:', error);
  if (import.meta.env.DEV) {
    // In development, throw to prevent bad data
    throw error;
  }
  // In production, log but continue (graceful degradation)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

