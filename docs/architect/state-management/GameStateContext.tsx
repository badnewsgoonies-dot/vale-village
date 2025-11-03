// src/state/GameStateContext.tsx
// Complete implementation template

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { gameReducer, type GameState, type GameAction } from './gameReducer';
import { createInitialState } from './initialState';

interface GameStateContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameStateContext = createContext<GameStateContextValue | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
}

