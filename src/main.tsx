import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GameProvider } from './context/GameProvider'
import { DataValidator } from './core/validators'

// Validate all game data at startup
if (import.meta.env.DEV) {
  const result = DataValidator.validateAll();
  if (!result.ok) {
    console.error('Data validation failed:', result.error);
    // In development, we want to know about validation errors
    // In production, we'll just log warnings
  }
} else {
  // In production, just warn (non-fatal)
  DataValidator.validateAndWarn();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
)
