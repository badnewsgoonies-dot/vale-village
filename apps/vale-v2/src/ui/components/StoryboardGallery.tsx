/**
 * Storyboard Gallery Component
 * Interactive gallery showcasing storyboard mockups for all major game screens
 */

import { useState } from 'react';
import { BattleSceneStoryboard } from './BattleSceneStoryboard';
import { OverworldStoryboard } from './OverworldStoryboard';
import { RewardsStoryboard } from './RewardsStoryboard';
import { ShopStoryboard } from './ShopStoryboard';
import { DialogueStoryboard } from './DialogueStoryboard';
import { MenuStoryboard } from './MenuStoryboard';

type GameScreen = 'battle' | 'overworld' | 'rewards' | 'shop' | 'dialogue' | 'menu';

const SCREEN_NAMES: Record<GameScreen, string> = {
  battle: 'Battle Scenes',
  overworld: 'Overworld Exploration',
  rewards: 'Rewards Screen',
  shop: 'Equipment Shop',
  dialogue: 'NPC Dialogue',
  menu: 'Menu Screens',
};

const SCREEN_DESCRIPTIONS: Record<GameScreen, string> = {
  battle: 'Planning phase, execution phase, and victory transitions',
  overworld: 'Top-down exploration with NPC interactions',
  rewards: 'Post-battle XP, gold, equipment, and level-ups',
  shop: 'Equipment purchasing and inventory management',
  dialogue: 'NPC conversations and story progression',
  menu: 'Save/load interface and main menu',
};

export function StoryboardGallery() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('battle');

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      fontFamily: 'monospace',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#2a2a2a',
        borderBottom: '2px solid #444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 100,
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffd700',
          }}>
            🎨 Vale Chronicles V2 - Storyboard Gallery
          </h1>
          <div style={{
            fontSize: '14px',
            color: '#aaa',
            marginTop: '4px',
          }}>
            Pixel-perfect mockups for all major game screens
          </div>
        </div>

        {/* Screen Selector */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {(Object.keys(SCREEN_NAMES) as GameScreen[]).map((screen) => (
            <button
              key={screen}
              onClick={() => setCurrentScreen(screen)}
              style={{
                padding: '8px 16px',
                backgroundColor: currentScreen === screen ? '#4CAF50' : '#333',
                color: '#fff',
                border: currentScreen === screen ? '2px solid #ffd700' : '2px solid #555',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'monospace',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentScreen !== screen) {
                  e.currentTarget.style.backgroundColor = '#444';
                }
              }}
              onMouseLeave={(e) => {
                if (currentScreen !== screen) {
                  e.currentTarget.style.backgroundColor = '#333';
                }
              }}
            >
              {SCREEN_NAMES[screen]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Screen Description */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#2a2a2a',
          borderBottom: '1px solid #444',
          fontSize: '16px',
          color: '#ccc',
        }}>
          <strong>{SCREEN_NAMES[currentScreen]}:</strong> {SCREEN_DESCRIPTIONS[currentScreen]}
        </div>

        {/* Storyboard Content */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {currentScreen === 'battle' && <BattleSceneStoryboard />}
          {currentScreen === 'overworld' && <OverworldStoryboard />}
          {currentScreen === 'rewards' && <RewardsStoryboard />}
          {currentScreen === 'shop' && <ShopStoryboard />}
          {currentScreen === 'dialogue' && <DialogueStoryboard />}
          {currentScreen === 'menu' && <MenuStoryboard />}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40px',
        backgroundColor: '#1a1a1a',
        borderTop: '1px solid #444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#666',
      }}>
        Use the buttons above to switch between different game screens. Each screen shows multiple states/phases.
      </div>
    </div>
  );
}