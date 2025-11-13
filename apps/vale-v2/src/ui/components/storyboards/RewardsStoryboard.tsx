/**
 * Rewards Screen Storyboard
 * 
 * Shows post-battle rewards screen with XP distribution, gold, equipment,
 * and level-up notifications.
 */

import { useState } from 'react';
import { SimpleSprite, getSpriteById, searchSprites, getSpritesByCategory } from '../../sprites';

export function RewardsStoryboard() {
  const [showLevelUp, setShowLevelUp] = useState(true);

  // Find party sprites for level-up display
  const isaacSprite = getSpriteById('isaac-front') || searchSprites('isaac')[0];
  const garetSprite = getSpriteById('garet-front') || searchSprites('garet')[0];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      overflow: 'auto',
    }}>
      {/* Controls */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <button
          onClick={() => setShowLevelUp(!showLevelUp)}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: showLevelUp ? '#4CAF50' : '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
          }}
        >
          {showLevelUp ? 'Hide' : 'Show'} Level Up
        </button>
      </div>

      {/* Rewards Screen Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
      }}>
        {/* Victory Banner */}
        <div style={{
          backgroundColor: '#FFD700',
          color: '#000',
          padding: '20px 40px',
          borderRadius: '12px',
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(255, 215, 0, 0.5)',
          border: '4px solid #FFA500',
        }}>
          VICTORY!
        </div>

        {/* Rewards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          width: '100%',
          maxWidth: '600px',
        }}>
          {/* XP Card */}
          <div style={{
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✦</div>
            <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}>Experience</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4AFF4A' }}>+450 XP</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
              Split among 4 survivors
            </div>
          </div>

          {/* Gold Card */}
          <div style={{
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>◉</div>
            <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}>Gold</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>+120 G</div>
          </div>
        </div>

        {/* Equipment Rewards */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          backgroundColor: '#2a2a2a',
          border: '2px solid #666',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#FFD700' }}>ITEMS OBTAINED</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '16px',
          }}>
            {[
              { name: 'Iron Sword', icon: '⚔️' },
              { name: 'Leather Armor', icon: '🛡️' },
              { name: 'Healing Potion', icon: '🧪' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '12px', color: '#fff' }}>{item.name}</div>
                <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>x1</div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Up Notification */}
        {showLevelUp && (
          <div style={{
            width: '100%',
            maxWidth: '800px',
            backgroundColor: '#2a5a2a',
            border: '3px solid #4AFF4A',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#4AFF4A', textAlign: 'center' }}>
              LEVEL UP!
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}>
              {/* Isaac Level Up */}
              {isaacSprite && (
                <div style={{
                  backgroundColor: '#1a3a1a',
                  border: '2px solid #4AFF4A',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <SimpleSprite
                    id={isaacSprite.path}
                    width={64}
                    height={64}
                    imageRendering="pixelated"
                    style={{ marginBottom: '8px' }}
                  />
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                    Isaac
                  </div>
                  <div style={{ fontSize: '16px', color: '#4AFF4A', marginBottom: '8px' }}>
                    Lv 5 → Lv 6
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>
                    <div>+12 HP</div>
                    <div>+5 ATK</div>
                    <div>+3 DEF</div>
                  </div>
                </div>
              )}

              {/* Garet Level Up */}
              {garetSprite && (
                <div style={{
                  backgroundColor: '#1a3a1a',
                  border: '2px solid #4AFF4A',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <SimpleSprite
                    id={garetSprite.path}
                    width={64}
                    height={64}
                    imageRendering="pixelated"
                    style={{ marginBottom: '8px' }}
                  />
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                    Garet
                  </div>
                  <div style={{ fontSize: '16px', color: '#4AFF4A', marginBottom: '8px' }}>
                    Lv 4 → Lv 5
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>
                    <div>+10 HP</div>
                    <div>+4 ATK</div>
                    <div>+4 DEF</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          style={{
            padding: '12px 32px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'monospace',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5CBF6F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4CAF50';
          }}
        >
          Continue
        </button>
      </div>

      {/* Annotations */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        fontSize: '12px',
        color: '#aaa',
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#fff' }}>Layout Notes:</div>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Victory banner at top with golden styling</li>
          <li>XP and Gold displayed in grid cards with icons</li>
          <li>Equipment rewards shown in grid with icons and names</li>
          <li>Level-up notifications appear below with unit sprites and stat gains</li>
          <li>Continue button at bottom to proceed to next screen</li>
          <li>All elements use consistent spacing and dark theme</li>
        </ul>
      </div>
    </div>
  );
}
