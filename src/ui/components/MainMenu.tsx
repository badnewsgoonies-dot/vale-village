/**
 * Main Menu Component
 * Menu screen with New Game, Continue, Compendium options
 */

import { useEffect, useState } from 'react';
import { useStore } from '../state/store';
import './MainMenu.css';

export function MainMenu() {
  const setMode = useStore((s) => s.setMode);
  const hasSave = useStore((s) => s.hasSave);
  const loadGame = useStore((s) => s.loadGame);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasSaveFile = hasSave();

  const menuOptions = [
    { id: 'new-game', label: 'New Game', enabled: true },
    { id: 'continue', label: 'Continue', enabled: hasSaveFile },
    { id: 'compendium', label: 'Compendium', enabled: true },
  ];

  const enabledOptions = menuOptions.filter(opt => opt.enabled);
  
  // Ensure selectedIndex is within bounds
  const safeSelectedIndex = Math.min(selectedIndex, enabledOptions.length - 1);
  const currentOption = enabledOptions[safeSelectedIndex] || enabledOptions[0];

  useEffect(() => {
    // Reset selected index when enabled options change
    if (selectedIndex >= enabledOptions.length) {
      setSelectedIndex(0);
    }
  }, [enabledOptions.length, selectedIndex]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        event.stopPropagation();
        
        if (event.key === 'ArrowUp') {
          setSelectedIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : enabledOptions.length - 1;
            return newIndex;
          });
        } else {
          setSelectedIndex((prev) => {
            const newIndex = prev < enabledOptions.length - 1 ? prev + 1 : 0;
            return newIndex;
          });
        }
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        if (currentOption) {
          handleSelectOption(currentOption.id);
        }
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setMode('title-screen');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentOption, enabledOptions.length, setMode]);

  const handleSelectOption = (optionId: string) => {
    if (optionId === 'new-game') {
      setMode('intro');
    } else if (optionId === 'continue') {
      if (hasSaveFile) {
        loadGame();
        setMode('overworld');
      }
    } else if (optionId === 'compendium') {
      setMode('compendium');
    }
  };

  return (
    <div className="main-menu">
      <div className="main-menu-content">
        <h1 className="main-menu-title">Vale Chronicles</h1>
        <div className="main-menu-options">
          {menuOptions.map((option) => {
            const isEnabled = option.enabled;
            const enabledIndex = enabledOptions.findIndex(opt => opt.id === option.id);
            const isSelected = enabledIndex === safeSelectedIndex && isEnabled;
            
            return (
              <button
                key={option.id}
                className={`main-menu-option ${isSelected ? 'selected' : ''} ${!isEnabled ? 'disabled' : ''}`}
                onClick={() => isEnabled && handleSelectOption(option.id)}
                disabled={!isEnabled}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
