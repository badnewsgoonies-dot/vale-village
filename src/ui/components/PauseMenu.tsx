/**
 * PauseMenu Component
 *
 * Golden Sun-inspired pause menu with full keyboard navigation.
 * Features:
 * - Arrow key navigation (↑↓)
 * - Enter/Space to select
 * - Escape to resume
 * - Keyboard shortcuts for quick access (T, I, D, S, O, H, Q)
 * - Status bar showing game progress
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../state/store';
import './PauseMenu.css';

interface PauseMenuProps {
  onClose: () => void;
  onTeamManagement?: () => void;
  onInventory?: () => void;
  onDjinnCollection?: () => void;
  onSaveGame?: () => void;
  onSettings?: () => void;
  onHowToPlay?: () => void;
  onReturnToTitle?: () => void;
}

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  shortcut: string;
  action?: () => void;
  dividerAfter?: boolean;
}

export function PauseMenu({
  onClose,
  onTeamManagement,
  onInventory,
  onDjinnCollection,
  onSaveGame,
  onSettings,
  onHowToPlay,
  onReturnToTitle,
}: PauseMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get game state for status bar
  const story = useStore((s) => s.story);
  const gold = useStore((s) => s.gold);
  const roster = useStore((s) => s.roster);

  // Define menu items
  const menuItems: MenuItem[] = [
    { id: 'resume', icon: '▶️', label: 'Resume Game', shortcut: 'ESC', action: onClose },
    { id: 'team', icon: '👥', label: 'Team Management', shortcut: 'T', action: onTeamManagement },
    { id: 'inventory', icon: '🎒', label: 'Inventory', shortcut: 'I', action: onInventory },
    { id: 'djinn', icon: '✨', label: 'Djinn Collection', shortcut: 'D', action: onDjinnCollection, dividerAfter: true },
    { id: 'save', icon: '💾', label: 'Save Game', shortcut: 'S', action: onSaveGame },
    { id: 'settings', icon: '⚙️', label: 'Settings', shortcut: 'O', action: onSettings },
    { id: 'help', icon: '❓', label: 'How to Play', shortcut: 'H', action: onHowToPlay, dividerAfter: true },
    { id: 'title', icon: '🏠', label: 'Return to Title', shortcut: 'Q', action: onReturnToTitle },
  ];

  // Execute menu action with flash effect
  const executeAction = useCallback((index: number) => {
    const item = menuItems[index];
    if (item?.action) {
      setFlashIndex(index);
      setTimeout(() => {
        setFlashIndex(null);
        item.action?.();
      }, 150);
    }
  }, [menuItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for navigation keys
      if (['ArrowUp', 'ArrowDown', 'Enter', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      switch (e.key) {
        case 'ArrowDown':
          setSelectedIndex((prev) => (prev + 1) % menuItems.length);
          break;
        case 'ArrowUp':
          setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
          break;
        case 'Enter':
        case ' ':
          executeAction(selectedIndex);
          break;
        case 'Escape':
          onClose();
          break;
        // Keyboard shortcuts
        case 't':
        case 'T':
          if (onTeamManagement) {
            const idx = menuItems.findIndex((m) => m.id === 'team');
            executeAction(idx);
          }
          break;
        case 'i':
        case 'I':
          if (onInventory) {
            const idx = menuItems.findIndex((m) => m.id === 'inventory');
            executeAction(idx);
          }
          break;
        case 'd':
        case 'D':
          if (onDjinnCollection) {
            const idx = menuItems.findIndex((m) => m.id === 'djinn');
            executeAction(idx);
          }
          break;
        case 's':
        case 'S':
          if (onSaveGame) {
            const idx = menuItems.findIndex((m) => m.id === 'save');
            executeAction(idx);
          }
          break;
        case 'o':
        case 'O':
          if (onSettings) {
            const idx = menuItems.findIndex((m) => m.id === 'settings');
            executeAction(idx);
          }
          break;
        case 'h':
        case 'H':
          if (onHowToPlay) {
            const idx = menuItems.findIndex((m) => m.id === 'help');
            executeAction(idx);
          }
          break;
        case 'q':
        case 'Q':
          if (onReturnToTitle) {
            const idx = menuItems.findIndex((m) => m.id === 'title');
            executeAction(idx);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [selectedIndex, menuItems, executeAction, onClose, onTeamManagement, onInventory, onDjinnCollection, onSaveGame, onSettings, onHowToPlay, onReturnToTitle]);

  // Focus management
  useEffect(() => {
    menuRef.current?.focus();
  }, []);

  return (
    <div className="pause-overlay" role="dialog" aria-modal="true" aria-label="Pause Menu">
      {/* Status Bar */}
      <div className="pause-status-bar">
        <div className="status-item">
          <span className="status-label">Chapter:</span>
          <span className="status-value">{story.chapter}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Units:</span>
          <span className="status-value">{roster.length}/10</span>
        </div>
        <div className="status-item">
          <span className="status-label">Gold:</span>
          <span className="status-value">{gold.toLocaleString()}</span>
        </div>
      </div>

      {/* Pause Menu Container */}
      <div className="pause-menu" ref={menuRef} tabIndex={-1}>
        <h1 className="pause-title">PAUSED</h1>

        <div className="menu-options" role="menu">
          {menuItems.map((item, index) => (
            <div key={item.id}>
              <button
                className={`menu-option ${selectedIndex === index ? 'selected' : ''} ${flashIndex === index ? 'flash' : ''}`}
                onClick={() => {
                  setSelectedIndex(index);
                  executeAction(index);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                role="menuitem"
                aria-selected={selectedIndex === index}
                disabled={!item.action}
              >
                <span className="menu-icon" aria-hidden="true">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
                <span className="menu-hint">{item.shortcut}</span>
              </button>
              {item.dividerAfter && <div className="menu-divider" />}
            </div>
          ))}
        </div>

        <div className="pause-footer">
          <div className="keyboard-hints">
            <div className="hint">
              <span className="key">↑↓</span>
              <span>Navigate</span>
            </div>
            <div className="hint">
              <span className="key">Enter</span>
              <span>Select</span>
            </div>
            <div className="hint">
              <span className="key">ESC</span>
              <span>Resume</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
