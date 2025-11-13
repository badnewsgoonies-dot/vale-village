/**
 * Rewards Screen Storyboard
 * 
 * Mockup for post-battle rewards:
 * - Victory banner
 * - XP distribution cards
 * - Gold reward display
 * - Equipment rewards grid
 * - Level-up notifications
 * - Equipment choice picker (boss battles)
 */

import { useState } from 'react';
import { SimpleSprite, getSpriteById } from '../../sprites';

type RewardsState = 'standard' | 'levelup' | 'equipment-choice';

export function RewardsStoryboard() {
  const [state, setState] = useState<RewardsState>('standard');

  // Find unit sprites for level-up display
  const isaacSprite = getSpriteById('isaac-front') || getSpriteById('isaac-lblade-front');
  const garetSprite = getSpriteById('garet-front') || getSpriteById('garet-axe-front');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      overflow: 'auto',
    }}>
      {/* State Selector */}
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.9rem', color: '#aaa', marginRight: '1rem' }}>State:</span>
        {(['standard', 'levelup', 'equipment-choice'] as RewardsState[]).map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: state === s ? '#4CAF50' : '#333',
              color: '#fff',
              border: `1px solid ${state === s ? '#66BB6A' : '#555'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
            }}
          >
            {s.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Content */}
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
          backgroundColor: '#2a2a2a',
          border: '3px solid #4CAF50',
          borderRadius: '8px',
          padding: '20px 40px',
          textAlign: 'center',
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '36px',
            color: '#4CAF50',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}>
            VICTORY!
          </h1>
        </div>

        {/* Rewards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          width: '100%',
          maxWidth: '600px',
        }}>
          {/* XP Card */}
          <div style={{
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              fontSize: '32px',
              color: '#FFD700',
            }}>
              ✦
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                color: '#aaa',
                fontFamily: 'monospace',
                marginBottom: '4px',
              }}>
                Experience
              </div>
              <div style={{
                fontSize: '24px',
                color: '#4CAF50',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}>
                +250 XP
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                fontFamily: 'monospace',
                marginTop: '4px',
              }}>
                Split among 4 survivors
              </div>
            </div>
          </div>

          {/* Gold Card */}
          <div style={{
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              fontSize: '32px',
              color: '#FFD700',
            }}>
              ◉
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                color: '#aaa',
                fontFamily: 'monospace',
                marginBottom: '4px',
              }}>
                Gold
              </div>
              <div style={{
                fontSize: '24px',
                color: '#FFD700',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}>
                +150 G
              </div>
            </div>
          </div>
        </div>

        {/* Level Up Panel */}
        {state === 'levelup' && (
          <div style={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: '#2a2a2a',
            border: '3px solid #4CAF50',
            borderRadius: '8px',
            padding: '24px',
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: '24px',
              color: '#4CAF50',
              fontFamily: 'monospace',
              textAlign: 'center',
            }}>
              LEVEL UP!
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}>
              {[
                { sprite: isaacSprite, name: 'Isaac', oldLevel: 3, newLevel: 4 },
                { sprite: garetSprite, name: 'Garet', oldLevel: 3, newLevel: 4 },
              ].map((unit) => (
                <div
                  key={unit.name}
                  style={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  {unit.sprite && (
                    <SimpleSprite
                      id={unit.sprite.path}
                      width={64}
                      height={64}
                      imageRendering="pixelated"
                      style={{ marginBottom: '8px' }}
                    />
                  )}
                  <div style={{
                    fontSize: '16px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    marginBottom: '8px',
                  }}>
                    {unit.name}
                  </div>
                  <div style={{
                    fontSize: '18px',
                    color: '#4CAF50',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}>
                    Lv {unit.oldLevel} → Lv {unit.newLevel}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#aaa',
                    fontFamily: 'monospace',
                  }}>
                    +15 HP, +5 ATK, +3 DEF
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment Rewards */}
        {state !== 'equipment-choice' && (
          <div style={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '8px',
            padding: '24px',
          }}>
            <h2 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              color: '#fff',
              fontFamily: 'monospace',
            }}>
              ITEMS OBTAINED
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}>
              {['Iron Sword', 'Leather Armor', 'Health Potion'].map((item) => (
                <div
                  key={item}
                  style={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    fontSize: '24px',
                    marginBottom: '8px',
                  }}>
                    ⚔️
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#fff',
                    fontFamily: 'monospace',
                  }}>
                    {item}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#666',
                    fontFamily: 'monospace',
                    marginTop: '4px',
                  }}>
                    x1
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment Choice (Boss Battle) */}
        {state === 'equipment-choice' && (
          <div style={{
            width: '100%',
            maxWidth: '700px',
            backgroundColor: '#2a2a2a',
            border: '3px solid #FFD700',
            borderRadius: '8px',
            padding: '24px',
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: '20px',
              color: '#FFD700',
              fontFamily: 'monospace',
              textAlign: 'center',
            }}>
              CHOOSE YOUR REWARD
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}>
              {[
                { name: 'Flame Sword', icon: '⚔️', stats: '+25 ATK, +5 Fire' },
                { name: 'Guardian Shield', icon: '🛡️', stats: '+20 DEF, +10 HP' },
                { name: 'Speed Boots', icon: '👢', stats: '+15 SPD, +5 AGI' },
              ].map((item) => (
                <button
                  key={item.name}
                  style={{
                    backgroundColor: '#1a1a1a',
                    border: '2px solid #666',
                    borderRadius: '4px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FFD700';
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#666';
                    e.currentTarget.style.backgroundColor = '#1a1a1a';
                  }}
                >
                  <div style={{
                    fontSize: '32px',
                    marginBottom: '8px',
                  }}>
                    {item.icon}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#aaa',
                    fontFamily: 'monospace',
                  }}>
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
            padding: '12px 32px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontFamily: 'monospace',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#66BB6A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4CAF50';
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
