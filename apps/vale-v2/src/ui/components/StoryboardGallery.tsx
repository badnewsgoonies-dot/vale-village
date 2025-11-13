/**
 * Storyboard Gallery Component
 * Interactive gallery of storyboard mockups for all major game screens
 */

import { useState } from 'react';
import { BattleSceneStoryboard } from './storyboards/BattleSceneStoryboard';
import { OverworldStoryboard } from './storyboards/OverworldStoryboard';
import { RewardsStoryboard } from './storyboards/RewardsStoryboard';
import { ShopStoryboard } from './storyboards/ShopStoryboard';
import { DialogueStoryboard } from './storyboards/DialogueStoryboard';
import { MenuStoryboard } from './storyboards/MenuStoryboard';

type ScreenType = 'battle' | 'overworld' | 'rewards' | 'shop' | 'dialogue' | 'menu';

const SCREEN_OPTIONS: { value: ScreenType; label: string; description: string }[] = [
  {
    value: 'battle',
    label: 'Battle Scenes',
    description: 'Queue-based battle system with planning/execution phases'
  },
  {
    value: 'overworld',
    label: 'Overworld Exploration',
    description: 'Top-down tile-based map with NPCs and dialogue'
  },
  {
    value: 'rewards',
    label: 'Rewards Screen',
    description: 'Post-battle rewards: XP, gold, equipment, level-ups'
  },
  {
    value: 'shop',
    label: 'Shop Screen',
    description: 'Equipment shop with unlock system'
  },
  {
    value: 'dialogue',
    label: 'Dialogue Scenes',
    description: 'NPC dialogue system with character sprites'
  },
  {
    value: 'menu',
    label: 'Menu Screens',
    description: 'Save menu and main menu interfaces'
  }
];

export function StoryboardGallery() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('battle');

  const currentOption = SCREEN_OPTIONS.find(opt => opt.value === currentScreen)!;

  const renderCurrentStoryboard = () => {
    switch (currentScreen) {
      case 'battle':
        return <BattleSceneStoryboard />;
      case 'overworld':
        return <OverworldStoryboard />;
      case 'rewards':
        return <RewardsStoryboard />;
      case 'shop':
        return <ShopStoryboard />;
      case 'dialogue':
        return <DialogueStoryboard />;
      case 'menu':
        return <MenuStoryboard />;
      default:
        return <BattleSceneStoryboard />;
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 2rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            🎨 Vale Chronicles V2 - Storyboard Gallery
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>
            {currentOption.description}
          </p>
        </div>

        {/* Screen Selector */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {SCREEN_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => setCurrentScreen(option.value)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentScreen === option.value ? '#4CAF50' : '#333',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: currentScreen === option.value ? 'bold' : 'normal',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentScreen !== option.value) {
                  e.currentTarget.style.backgroundColor = '#444';
                }
              }}
              onMouseLeave={(e) => {
                if (currentScreen !== option.value) {
                  e.currentTarget.style.backgroundColor = '#333';
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Storyboard Content */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {renderCurrentStoryboard()}
      </div>

      {/* Footer */}
      <div style={{
        padding: '0.5rem 2rem',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        fontSize: '0.8rem',
        color: '#666',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        Golden Sun-inspired tactical RPG • Pixel-perfect rendering • Storyboard mockups for UI design reference
      </div>
    </div>
  );
}