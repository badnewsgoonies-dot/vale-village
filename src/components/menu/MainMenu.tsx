import React from 'react';
import { Button } from '../shared';
import './MainMenu.css';

interface MainMenuProps {
  onNavigateToDjinn: () => void;
  onNavigateToEquipment: () => void;
  onNavigateToParty: () => void;
  onResume: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNavigateToDjinn,
  onNavigateToEquipment,
  onNavigateToParty,
  onResume
}) => {
  return (
    <div className="main-menu-overlay">
      <div className="main-menu-container">
        <div className="main-menu-panel">
          <h2 className="main-menu-title">MENU</h2>
          
          <nav className="main-menu-options" role="navigation">
            <Button 
              onClick={onNavigateToDjinn}
              className="menu-option"
              ariaLabel="Open Djinn menu"
            >
              <span className="menu-icon">✦</span>
              <span className="menu-label">DJINN</span>
              <span className="menu-hint">Manage Djinn</span>
            </Button>

            <Button 
              onClick={onNavigateToEquipment}
              className="menu-option"
              ariaLabel="Open Equipment menu"
            >
              <span className="menu-icon">⚔</span>
              <span className="menu-label">EQUIPMENT</span>
              <span className="menu-hint">Equip Items</span>
            </Button>

            <Button 
              onClick={onNavigateToParty}
              className="menu-option"
              ariaLabel="Open Party menu"
            >
              <span className="menu-icon">★</span>
              <span className="menu-label">PARTY</span>
              <span className="menu-hint">Manage Units</span>
            </Button>

            <Button 
              onClick={onResume}
              className="menu-option menu-option-return"
              ariaLabel="Return to game"
            >
              <span className="menu-icon">←</span>
              <span className="menu-label">RETURN</span>
              <span className="menu-hint">Back to Game</span>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};
