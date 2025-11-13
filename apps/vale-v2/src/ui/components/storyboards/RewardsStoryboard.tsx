/**
 * Rewards Storyboard Component
 * 
 * Shows post-battle rewards screen mockup with XP distribution,
 * gold rewards, equipment drops, and level-up notifications.
 */

import { useState } from 'react';
import { SimpleSprite, getSpriteById, searchSprites } from '../../sprites';

export function RewardsStoryboard() {
  const [showLevelUp, setShowLevelUp] = useState(true);
  const [showEquipmentChoice, setShowEquipmentChoice] = useState(false);

  // Find party sprites for level-up display
  const isaacSprite = getSpriteById('isaac-front') || searchSprites('isaac')[0];
  const garetSprite = getSpriteById('garet-front') || searchSprites('garet')[0];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a2e',
      backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      overflow: 'auto',
    }}>
      {/* Controls */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setShowLevelUp(!showLevelUp)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showLevelUp ? '#4CAF50' : '#444',
            color: '#fff',
            border: '1px solid #666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          {showLevelUp ? 'Hide' : 'Show'} Level Up
        </button>
        <button
          onClick={() => setShowEquipmentChoice(!showEquipmentChoice)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showEquipmentChoice ? '#4CAF50' : '#444',
            color: '#fff',
            border: '1px solid #666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          {showEquipmentChoice ? 'Hide' : 'Show'} Equipment Choice
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
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* Victory Banner */}
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#FFD700',
          textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
          textAlign: 'center',
        }}>
          VICTORY!
        </div>

        {/* Rewards Grid (XP + Gold) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
          width: '100%',
        }}>
          {/* XP Card */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #4CAF50',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{
              fontSize: '48px',
              color: '#4CAF50',
            }}>
              ✦
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '4px' }}>
                Experience
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                +450 XP
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Split among 4 survivors
              </div>
            </div>
          </div>

          {/* Gold Card */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #FFD700',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{
              fontSize: '48px',
              color: '#FFD700',
            }}>
              ◉
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '4px' }}>
                Gold
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>
                +120 G
              </div>
            </div>
          </div>
        </div>

        {/* Items Obtained */}
        <div style={{
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid #4CAF50',
          borderRadius: '12px',
          padding: '1.5rem',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#4CAF50',
            marginTop: 0,
            marginBottom: '1rem',
          }}>
            ITEMS OBTAINED
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { name: 'Iron Sword', icon: '⚔️' },
              { name: 'Leather Armor', icon: '🛡️' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #4CAF50',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '12px', color: '#fff' }}>{item.name}</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>x1</div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Up Panel */}
        {showLevelUp && (
          <div style={{
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #FFD700',
            borderRadius: '12px',
            padding: '1.5rem',
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#FFD700',
              marginTop: 0,
              marginBottom: '1rem',
            }}>
              LEVEL UP!
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              {[
                { name: 'Isaac', oldLevel: 3, newLevel: 4, hp: 15, pp: 5 },
                { name: 'Garet', oldLevel: 3, newLevel: 4, hp: 18, pp: 3 },
              ].map((unit, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #FFD700',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#1a1a1a',
                    border: '2px solid #FFD700',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <SimpleSprite
                      id={idx === 0 ? isaacSprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif' : garetSprite?.path || '/sprites/battle/party/garet/Garet_Axe_Front.gif'}
                      width={48}
                      height={48}
                      imageRendering="pixelated"
                    />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
                    {unit.name}
                  </div>
                  <div style={{ fontSize: '16px', color: '#FFD700' }}>
                    Lv {unit.oldLevel} → Lv {unit.newLevel}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4CAF50' }}>
                    +{unit.hp} HP, +{unit.pp} PP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment Choice (Boss Battle) */}
        {showEquipmentChoice && (
          <div style={{
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '3px solid #FFD700',
            borderRadius: '12px',
            padding: '2rem',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFD700',
              marginTop: 0,
              marginBottom: '1rem',
              textAlign: 'center',
            }}>
              Choose Your Reward
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}>
              {[
                { name: 'Flame Sword', icon: '⚔️', stats: '+15 ATK' },
                { name: 'Crystal Armor', icon: '🛡️', stats: '+20 DEF' },
                { name: 'Magic Ring', icon: '💍', stats: '+10 PP' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  style={{
                    backgroundColor: '#2a2a2a',
                    border: '2px solid #FFD700',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3a3a3a';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ fontSize: '48px' }}>{item.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4CAF50' }}>
                    {item.stats}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          style={{
            padding: '1rem 3rem',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'monospace',
            marginTop: '1rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5CBF60';
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
        fontSize: '0.875rem',
        color: '#aaa',
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>
          Layout Notes:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
          <li>Victory banner at top with golden text</li>
          <li>XP and Gold cards displayed side-by-side</li>
          <li>Items obtained section shows equipment drops with icons</li>
          <li>Level-up panel displays unit sprites with stat gains</li>
          <li>Equipment choice picker appears for boss battles (3 options)</li>
          <li>Continue button at bottom to proceed</li>
          <li>Dark gradient background maintains Golden Sun aesthetic</li>
        </ul>
      </div>
    </div>
  );
}
