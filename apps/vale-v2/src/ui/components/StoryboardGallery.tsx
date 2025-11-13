/**
 * Storyboard Gallery Component
 * Collection of storyboard mockups for all major game screens
 */

import { useState } from 'react';
import { BattleSceneStoryboard } from './BattleSceneStoryboard';
import { OverworldStoryboard } from './OverworldStoryboard';
import { RewardsStoryboard } from './RewardsStoryboard';
import { ShopStoryboard } from './ShopStoryboard';
import { DialogueStoryboard } from './DialogueStoryboard';
import { MenuStoryboard } from './MenuStoryboard';

type GameScreen = 'battle' | 'overworld' | 'rewards' | 'shop' | 'dialogue' | 'menu';

export function StoryboardGallery() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('battle');

  const screens: { id: GameScreen; label: string; description: string }[] = [
    { id: 'battle', label: 'Battle Scenes', description: 'Planning, Execution, Victory phases' },
    { id: 'overworld', label: 'Overworld', description: 'Exploration and NPC interactions' },
    { id: 'rewards', label: 'Rewards', description: 'Post-battle rewards and level-ups' },
    { id: 'shop', label: 'Shop', description: 'Equipment shop interface' },
    { id: 'dialogue', label: 'Dialogue', description: 'NPC conversations' },
    { id: 'menu', label: 'Menus', description: 'Save/load and main menu screens' },
  ];

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
        return <div>Select a screen to view storyboard</div>;
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontFamily: 'monospace',
      overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 2rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '2px solid #444',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            color: '#FFD700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            🎨 Vale Chronicles V2 - Storyboard Mockups
          </h1>
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.9rem',
            color: '#aaa',
          }}>
            Pixel-perfect screen design references using Golden Sun assets
          </div>
        </div>

        {/* Screen Selector */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}>
          {screens.map(screen => (
            <button
              key={screen.id}
              onClick={() => setCurrentScreen(screen.id)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentScreen === screen.id ? '#4CAF50' : '#333',
                color: '#fff',
                border: currentScreen === screen.id ? '2px solid #FFD700' : '2px solid #555',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentScreen !== screen.id) {
                  e.currentTarget.style.backgroundColor = '#444';
                }
              }}
              onMouseLeave={(e) => {
                if (currentScreen !== screen.id) {
                  e.currentTarget.style.backgroundColor = '#333';
                }
              }}
            >
              {screen.label}
            </button>
          ))}
        </div>
      </div>

      {/* Screen Description */}
      <div style={{
        padding: '0.5rem 2rem',
        backgroundColor: '#222',
        borderBottom: '1px solid #444',
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: '#ccc',
        }}>
          <strong>{screens.find(s => s.id === currentScreen)?.label}:</strong> {screens.find(s => s.id === currentScreen)?.description}
        </div>
      </div>

      {/* Current Storyboard */}
      <div style={{
        flex: 1,
        padding: '1rem',
      }}>
        {renderCurrentStoryboard()}
      </div>

      {/* Footer */}
      <div style={{
        padding: '0.5rem 2rem',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        fontSize: '0.8rem',
        color: '#888',
        textAlign: 'center',
      }}>
        💡 Use these storyboards as visual references for implementing the actual UI components
      </div>
    </div>
  );
}