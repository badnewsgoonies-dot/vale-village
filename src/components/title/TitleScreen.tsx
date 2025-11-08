import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import './TitleScreen.css';
import type { Screen } from '@/context/types';

interface TitleScreenProps {
  onNavigate: (screen: Screen) => void;
  onStartBattle: (enemyIds: string[]) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onNavigate, onStartBattle }) => {
  const { actions } = useGame();
  const [showPressStart, setShowPressStart] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('[TitleScreen] Component mounted');
    console.log('[TitleScreen] menuVisible:', menuVisible);
    console.log('[TitleScreen] showPressStart:', showPressStart);
    console.log('[TitleScreen] actions:', actions);
  }, [menuVisible, showPressStart, actions]);

  // Blinking "Press Start" effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPressStart(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setMenuVisible(true);
  };

  const handleNewGame = () => {
    // Start fresh: Only Isaac, no items, 0 gold
    actions.startNewGame('fresh');
  };

  const handleDebugGame = () => {
    // Start with everything unlocked: All units, all equipment, all Djinn
    actions.startNewGame('debug');
  };

  const handleTestBattle = () => {
    onStartBattle(['goblin', 'wild-wolf', 'slime']);
    onNavigate({ type: 'BATTLE' });
  };

  if (!menuVisible) {
    console.log('[TitleScreen] Rendering initial screen (Press Start)');
    return (
      <div className="title-screen" onClick={handleStart}>
        <div className="title-background" />
        <div className="title-content">
          <h1 className="title-logo">
            <span className="title-word">VALE</span>
            <span className="title-word">CHRONICLES</span>
          </h1>
          <div className="title-subtitle">
            A Golden Sun Tribute
          </div>
          {showPressStart && (
            <div className="press-start">
              Press anywhere to start
            </div>
          )}
        </div>
        <div className="title-footer">
          Built with React + TypeScript | 2,553 sprites integrated
        </div>
      </div>
    );
  }

  console.log('[TitleScreen] Rendering menu screen');
  return (
    <div className="title-screen with-menu">
      <div className="title-background" />
      <div className="title-content">
        <h1 className="title-logo small">
          <span className="title-word">VALE</span>
          <span className="title-word">CHRONICLES</span>
        </h1>
        <nav className="title-menu">
          <button className="title-menu-item primary" onClick={handleNewGame}>
            <span className="menu-icon">▶</span>
            <span className="menu-text">New Game</span>
          </button>
          <button className="title-menu-item secondary" onClick={handleDebugGame}>
            <span className="menu-icon">★</span>
            <span className="menu-text">New Game (All Unlocked)</span>
          </button>
          <button className="title-menu-item debug" onClick={handleTestBattle}>
            <span className="menu-icon">⚔</span>
            <span className="menu-text">Test Battle</span>
          </button>
        </nav>
      </div>
      <div className="title-footer">
        Use W/A/S/D to move | Space to interact | ESC for menu
      </div>
    </div>
  );
};
