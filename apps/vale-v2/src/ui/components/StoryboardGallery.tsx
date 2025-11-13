/**
 * Storyboard Gallery Component
 * 
 * Main component for viewing storyboard mockups of all game screens.
 * Allows switching between different screens and viewing multiple states/phases.
 */

import { useState } from 'react';
import { BattleSceneStoryboard } from './storyboards/BattleSceneStoryboard';
import { OverworldStoryboard } from './storyboards/OverworldStoryboard';
import { RewardsStoryboard } from './storyboards/RewardsStoryboard';
import { ShopStoryboard } from './storyboards/ShopStoryboard';
import { DialogueStoryboard } from './storyboards/DialogueStoryboard';
import { MenuStoryboard } from './storyboards/MenuStoryboard';

export type StoryboardScreen = 'battle' | 'overworld' | 'rewards' | 'shop' | 'dialogue' | 'menu';

export function StoryboardGallery() {
  const [currentScreen, setCurrentScreen] = useState<StoryboardScreen>('battle');

  const screens: { id: StoryboardScreen; label: string; description: string }[] = [
    { id: 'battle', label: 'Battle Scene', description: 'Queue-based battle system with planning/execution phases' },
    { id: 'overworld', label: 'Overworld', description: 'Top-down exploration with tile-based maps' },
    { id: 'rewards', label: 'Rewards Screen', description: 'Post-battle rewards (XP, gold, equipment, level-ups)' },
    { id: 'shop', label: 'Shop Screen', description: 'Equipment shop with unlock system' },
    { id: 'dialogue', label: 'Dialogue Scene', description: 'NPC dialogue system' },
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
      {/* Header */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '2px solid #444',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🎨 Storyboard Gallery</h1>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Vale Chronicles V2 - Game Screen Mockups
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
        {screens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => setCurrentScreen(screen.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentScreen === screen.id ? '#4CAF50' : '#333',
              color: '#fff',
              border: `1px solid ${currentScreen === screen.id ? '#6BCF7F' : '#555'}`,
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
