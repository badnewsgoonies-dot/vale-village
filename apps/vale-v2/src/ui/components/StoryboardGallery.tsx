/**
 * Storyboard Gallery Component
 * 
 * Main component for viewing storyboard mockups of all game screens.
 * Allows switching between different screens and viewing different states/phases.
 */

import { useState } from 'react';
import { BattleSceneStoryboard } from './storyboards/BattleSceneStoryboard';
import { OverworldStoryboard } from './storyboards/OverworldStoryboard';
import { RewardsStoryboard } from './storyboards/RewardsStoryboard';
import { ShopStoryboard } from './storyboards/ShopStoryboard';
import { DialogueStoryboard } from './storyboards/DialogueStoryboard';
import { MenuStoryboard } from './storyboards/MenuStoryboard';

type ScreenType = 'battle' | 'overworld' | 'rewards' | 'shop' | 'dialogue' | 'menu';

const SCREENS: Array<{ id: ScreenType; label: string; description: string }> = [
  { id: 'battle', label: 'Battle Scene', description: 'Queue-based battle system' },
  { id: 'overworld', label: 'Overworld', description: 'Top-down exploration' },
  { id: 'rewards', label: 'Rewards Screen', description: 'Post-battle rewards' },
  { id: 'shop', label: 'Shop Screen', description: 'Equipment shop' },
  { id: 'dialogue', label: 'Dialogue', description: 'NPC conversations' },
  { id: 'menu', label: 'Menus', description: 'Save/load and main menu' },
];

export function StoryboardGallery() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('battle');

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '2px solid #444',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'monospace' }}>
          🎨 Storyboard Gallery
        </h1>
        <div style={{ fontSize: '0.85rem', color: '#aaa' }}>
          Visual mockups for Vale Chronicles V2
        </div>
      </div>

      {/* Screen Selector */}
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: '#222',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        overflowX: 'auto',
      }}>
        {SCREENS.map((screen) => (
          <button
            key={screen.id}
            onClick={() => setCurrentScreen(screen.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentScreen === screen.id ? '#4CAF50' : '#333',
              color: '#fff',
              border: `1px solid ${currentScreen === screen.id ? '#66BB6A' : '#555'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (currentScreen !== screen.id) {
                e.currentTarget.style.backgroundColor = '#3a3a3a';
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

      {/* Current Storyboard */}
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
