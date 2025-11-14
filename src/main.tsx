import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GameProvider } from './context/GameProvider'
import { validateAllGameData, formatValidationReport } from './core/validators/DataValidator'
import { EQUIPMENT } from './data/equipment'
import * as ENEMIES from './data/enemies'
import type { Equipment } from './types/Equipment'
import type { Enemy } from './data/enemies'

// Phase 1: Validate all game data at startup
console.log('🔍 Validating game data...');

// Convert equipment object to array
const equipmentArray = Object.values(EQUIPMENT) as Equipment[];

// Get all enemies (filter out the Enemy interface and helper functions)
const enemyArray = Object.values(ENEMIES).filter(
  (value) => typeof value === 'object' && value !== null && 'id' in value
) as Enemy[];

const validationResult = validateAllGameData(equipmentArray, enemyArray);
console.log(formatValidationReport(validationResult));

if (!validationResult.success) {
  console.error('❌ Game data validation failed! See errors above.');
  // In development, show errors but allow game to run
  // In production, you might want to prevent startup
  if (import.meta.env.MODE === 'production') {
    throw new Error('Game data validation failed');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
)
