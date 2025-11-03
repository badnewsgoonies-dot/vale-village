import React, { useState, useEffect } from 'react';
import './TitleScreen.css';
import type { Screen } from '@/context/types';

interface TitleScreenProps {
  onNavigate: (screen: Screen) => void;
  onStartBattle: (enemyIds: string[]) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onNavigate, onStartBattle }) => {
  const [showPressStart, setShowPressStart] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

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
    onNavigate({ type: 'OVERWORLD' });
  };

  const handleContinue = () => {
    // TODO: Load saved game
    onNavigate({ type: 'OVERWORLD' });
  };

  const handleTestBattle = () => {
    onStartBattle(['goblin', 'wild_wolf', 'slime']);
    onNavigate({ type: 'BATTLE' });
  };

  const handleUnitCollection = () => {
    onNavigate({ type: 'UNIT_COLLECTION' });
  };

  if (!menuVisible) {
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
          <button className="title-menu-item secondary" onClick={handleContinue}>
            <span className="menu-icon">⟳</span>
            <span className="menu-text">Continue</span>
          </button>
          <button className="title-menu-item secondary" onClick={handleUnitCollection}>
            <span className="menu-icon">★</span>
            <span className="menu-text">Unit Collection</span>
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
