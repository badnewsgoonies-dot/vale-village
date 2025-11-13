/**
 * Rewards Screen Storyboard
 * 
 * Shows post-battle rewards screen with XP, gold, equipment, and level-ups.
 */

import { SimpleSprite, getSpriteById, getSpritesByCategory } from '../../sprites';

export function RewardsStoryboard() {
  // Find party sprites for level-up display
  const isaacSprite = getSpriteById('isaac-lblade-front') || getSpriteById('isaac-front');
  const garetSprite = getSpriteById('garet-axe-front') || getSpriteById('garet-front');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      overflow: 'auto',
    }}>
      {/* Rewards Screen */}
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
          padding: '20px 40px',
          backgroundColor: '#FFD700',
          border: '4px solid #FFA500',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '36px',
            color: '#000',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(255,255,255,0.5)',
          }}>
            VICTORY!
          </h1>
        </div>

        {/* Rewards Grid (XP + Gold) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '800px',
        }}>
          {/* XP Card */}
          <div style={{
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '8px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{
              fontSize: '48px',
              color: '#FFD700',
            }}>
              ✦
            </div>
            <div>
              <div style={{
                color: '#aaa',
                fontSize: '14px',
                marginBottom: '4px',
              }}>
                Experience
              </div>
              <div style={{
                color: '#4a9eff',
                fontSize: '24px',
                fontWeight: 'bold',
              }}>
                +450 XP
              </div>
              <div style={{
                color: '#666',
                fontSize: '12px',
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
              <div style={{
                color: '#aaa',
                fontSize: '14px',
                marginBottom: '4px',
              }}>
                Gold
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '24px',
                fontWeight: 'bold',
              }}>
                +120 G
              </div>
            </div>
          </div>
        </div>

        {/* Items Obtained */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          backgroundColor: '#2a2a2a',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '1.5rem',
        }}>
          <h2 style={{
            margin: '0 0 1rem 0',
            color: '#fff',
            fontSize: '18px',
            fontFamily: 'monospace',
          }}>
            ITEMS OBTAINED
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '1rem',
          }}>
            {['Iron Sword', 'Leather Armor'].map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#333',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#444',
                  border: '2px solid #666',
                  borderRadius: '4px',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '24px',
                }}>
                  ⚔️
                </div>
                <div style={{
                  color: '#fff',
                  fontSize: '12px',
                  marginBottom: '4px',
                }}>
                  {item}
                </div>
                <div style={{
                  color: '#aaa',
                  fontSize: '10px',
                }}>
                  x1
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Up Notification */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          backgroundColor: '#2a2a2a',
          border: '2px solid #4a9eff',
          borderRadius: '8px',
          padding: '1.5rem',
        }}>
          <h2 style={{
            margin: '0 0 1rem 0',
            color: '#4a9eff',
            fontSize: '18px',
            fontFamily: 'monospace',
          }}>
            LEVEL UP!
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
          }}>
            {isaacSprite && (
              <div style={{
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '4px',
                padding: '1rem',
                textAlign: 'center',
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <SimpleSprite
                    id={isaacSprite.path}
                    width={64}
                    height={64}
                    imageRendering="pixelated"
                  />
                </div>
                <div style={{
                  color: '#fff',
                  fontSize: '14px',
                  marginBottom: '4px',
                }}>
                  Isaac
                </div>
                <div style={{
                  color: '#4a9eff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}>
                  Lv 3 → Lv 4
                </div>
                <div style={{
                  color: '#aaa',
                  fontSize: '11px',
                }}>
                  +12 HP, +5 ATK, +3 DEF
                </div>
              </div>
            )}
            {garetSprite && (
              <div style={{
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '4px',
                padding: '1rem',
                textAlign: 'center',
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <SimpleSprite
                    id={garetSprite.path}
                    width={64}
                    height={64}
                    imageRendering="pixelated"
                  />
                </div>
                <div style={{
                  color: '#fff',
                  fontSize: '14px',
                  marginBottom: '4px',
                }}>
                  Garet
                </div>
                <div style={{
                  color: '#4a9eff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}>
                  Lv 2 → Lv 3
                </div>
                <div style={{
                  color: '#aaa',
                  fontSize: '11px',
                }}>
                  +10 HP, +4 ATK, +2 DEF
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <button
          style={{
            padding: '12px 32px',
            backgroundColor: '#4a9eff',
            color: '#fff',
            border: '2px solid #6bb6ff',
            borderRadius: '4px',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#6bb6ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4a9eff';
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
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#fff' }}>Layout Notes:</strong>
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Victory banner at top with golden styling</li>
          <li>XP and gold displayed in side-by-side cards</li>
          <li>Equipment rewards shown in grid with icons</li>
          <li>Level-up notifications highlight stat gains</li>
          <li>Continue button returns to overworld</li>
        </ul>
      </div>
    </div>
  );
}
