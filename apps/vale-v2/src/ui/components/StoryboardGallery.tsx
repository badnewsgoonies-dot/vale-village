/**
 * Storyboard Gallery Component
 * Showcases storyboard mockups for all major game screens
 * Design references for UI implementation
 */

import { useState } from 'react';
import { BattleSceneStoryboard } from './storyboards/BattleSceneStoryboard';
import { OverworldStoryboard } from './storyboards/OverworldStoryboard';
import { RewardsStoryboard } from './storyboards/RewardsStoryboard';
import { ShopStoryboard } from './storyboards/ShopStoryboard';
import { DialogueStoryboard } from './storyboards/DialogueStoryboard';
import { MenuStoryboard } from './storyboards/MenuStoryboard';

type ScreenType = 'battle' | 'overworld' | 'rewards' | 'shop' | 'dialogue' | 'menu';

export function StoryboardGallery() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('battle');

  const screens: Array<{ id: ScreenType; label: string; icon: string }> = [
    { id: 'battle', label: 'Battle Scene', icon: '⚔️' },
    { id: 'overworld', label: 'Overworld', icon: '🗺️' },
    { id: 'rewards', label: 'Rewards', icon: '🎁' },
    { id: 'shop', label: 'Shop', icon: '🛒' },
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
    }}>
      {/* Screen Selector */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '2px solid #444',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ fontWeight: 'bold', marginRight: '1rem' }}>Storyboard Gallery:</div>
        {screens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => setCurrentScreen(screen.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentScreen === screen.id ? '#4CAF50' : '#3a3a3a',
              color: '#fff',
              border: `2px solid ${currentScreen === screen.id ? '#6BCF7F' : '#555'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (currentScreen !== screen.id) {
                e.currentTarget.style.backgroundColor = '#4a4a4a';
              }
            }}
            onMouseLeave={(e) => {
              if (currentScreen !== screen.id) {
                e.currentTarget.style.backgroundColor = '#3a3a3a';
              }
            }}
          >
            {screen.icon} {screen.label}
          </button>
        ))}
      </div>

      {/* Current Storyboard */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
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






