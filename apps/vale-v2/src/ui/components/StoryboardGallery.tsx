/**
 * Storyboard Gallery Component
 * 
 * Main gallery component that allows switching between different game screen storyboards.
 * Each storyboard showcases visual layout, sprite placement, and UI composition.
 */

import { useState } from 'react';
import {
  BattleSceneStoryboard,
  OverworldStoryboard,
  RewardsStoryboard,
  ShopStoryboard,
  DialogueStoryboard,
  MenuStoryboard,
} from './storyboards';

type ScreenType = 'battle' | 'overworld' | 'rewards' | 'shop' | 'dialogue' | 'menu';

export function StoryboardGallery() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('battle');

  const screens: Array<{ id: ScreenType; label: string; description: string }> = [
    { id: 'battle', label: 'Battle Scene', description: 'Planning, execution, and victory phases' },
    { id: 'overworld', label: 'Overworld', description: 'Exploration and map navigation' },
    { id: 'rewards', label: 'Rewards Screen', description: 'Post-battle rewards and level-ups' },
    { id: 'shop', label: 'Shop Screen', description: 'Equipment shop interface' },
    { id: 'dialogue', label: 'Dialogue Scene', description: 'NPC conversations' },
    { id: 'menu', label: 'Menu Screens', description: 'Save menu and main menu' },
  ];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontFamily: 'monospace',
      overflow: 'hidden',
    }}>
      {/* Header with Screen Selector */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '2px solid #444',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          🎨 Storyboard Gallery
        </h1>
        
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginLeft: 'auto',
        }}>
          {screens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => setCurrentScreen(screen.id)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentScreen === screen.id ? '#4CAF50' : '#444',
                color: '#fff',
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentScreen !== screen.id) {
                  e.currentTarget.style.backgroundColor = '#555';
                }
              }}
              onMouseLeave={(e) => {
                if (currentScreen !== screen.id) {
                  e.currentTarget.style.backgroundColor = '#444';
                }
              }}
              title={screen.description}
            >
              {screen.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Storyboard Display */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        position: 'relative',
      }}>
        {currentScreen === 'battle' && <BattleSceneStoryboard />}
        {currentScreen === 'overworld' && <OverworldStoryboard />}
        {currentScreen === 'rewards' && <RewardsStoryboard />}
        {currentScreen === 'shop' && <ShopStoryboard />}
        {currentScreen === 'dialogue' && <DialogueStoryboard />}
        {currentScreen === 'menu' && <MenuStoryboard />}
      </div>
    </div>
  );
}
