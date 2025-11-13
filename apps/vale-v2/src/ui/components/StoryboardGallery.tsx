/**
 * Storyboard Gallery Component
 * 
 * Main gallery that displays storyboard mockups for all major game screens.
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

  const screens: Array<{ id: StoryboardScreen; label: string; icon: string }> = [
    { id: 'battle', label: 'Battle Scenes', icon: '⚔️' },
    { id: 'overworld', label: 'Overworld', icon: '🗺️' },
    { id: 'rewards', label: 'Rewards Screen', icon: '✨' },
    { id: 'shop', label: 'Shop Screen', icon: '🛒' },
    { id: 'dialogue', label: 'Dialogue', icon: '💬' },
    { id: 'menu', label: 'Menus', icon: '📋' },
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
      imageRendering: 'pixelated',
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
        <div style={{ fontSize: '0.85rem', color: '#aaa' }}>
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
      }}>
        {screens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => setCurrentScreen(screen.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentScreen === screen.id ? '#4a9eff' : '#333',
              color: '#fff',
              border: `1px solid ${currentScreen === screen.id ? '#6bb6ff' : '#555'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              transition: 'all 0.2s',
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
            {screen.icon} {screen.label}
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
