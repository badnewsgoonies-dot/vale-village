/**
 * Battle Scene Storyboard
 * 
 * Mockups for queue-based battle system:
 * - Planning Phase: Action queue, mana circles, Djinn bar
 * - Execution Phase: Battle animations and log
 * - Victory Phase: Victory overlay and transition
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, searchSprites } from '../../sprites';

type BattlePhase = 'planning' | 'execution' | 'victory';

export function BattleSceneStoryboard() {
  const [phase, setPhase] = useState<BattlePhase>('planning');

  // Find party sprites
  const isaacSprite = getSpriteById('isaac-lblade-front') || getSpriteById('isaac-front');
  const garetSprite = getSpriteById('garet-axe-front') || getSpriteById('garet-front');
  const ivanSprite = getSpriteById('ivan-staff-front') || getSpriteById('ivan-lblade-front') || getSpriteById('ivan-front');
  const miaSprite = getSpriteById('mia-staff-front') || getSpriteById('mia-mace-front') || getSpriteById('mia-front');

  // Find enemy sprites
  const enemySprites = searchSprites('golem').slice(0, 1).concat(
    searchSprites('winged').slice(0, 2)
  );

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000',
    }}>
      {/* Phase Selector */}
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.9rem', color: '#aaa', marginRight: '1rem' }}>Phase:</span>
        {(['planning', 'execution', 'victory'] as BattlePhase[]).map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: phase === p ? '#4CAF50' : '#333',
              color: '#fff',
              border: `1px solid ${phase === p ? '#66BB6A' : '#555'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Battle Scene */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        imageRendering: 'pixelated',
      }}>
        {/* Background */}
        <BackgroundSprite
          id="/sprites/backgrounds/gs1/World_Map_Shore.gif"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 0,
          }}
          sizeMode="cover"
        />

        {/* Battle Scene Container */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: 'calc(100% - 50px)',
          bottom: '50px',
          left: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingLeft: '5%',
          paddingRight: '5%',
          paddingBottom: '8%',
          zIndex: 1,
        }}>
          {/* Player Party (Left Side) */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-end',
            height: '100%',
          }}>
            {[
              { sprite: isaacSprite, name: 'Isaac' },
              { sprite: garetSprite, name: 'Garet' },
              { sprite: ivanSprite, name: 'Ivan' },
              { sprite: miaSprite, name: 'Mia' },
            ].map((char, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <SimpleSprite
                  id={char.sprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
                  width={64}
                  height={64}
                  imageRendering="pixelated"
                />
                {/* Unit Card Overlay (Execution Phase) */}
                {phase === 'execution' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '70px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid #666',
                    padding: '4px 8px',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    fontFamily: 'monospace',
                  }}>
                    <div style={{ color: '#fff' }}>{char.name}</div>
                    <div style={{ color: '#4CAF50' }}>HP: 85/100</div>
                    <div style={{ color: '#2196F3' }}>PP: 20/30</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Enemy Party (Right Side) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            gap: '0px',
            height: '100%',
            position: 'relative',
          }}>
            {/* Large Golem */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              marginBottom: '0px',
            }}>
              {/* Shadow */}
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90px',
                height: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '50%',
                zIndex: 0,
              }} />
              <SimpleSprite
                id={enemySprites[0]?.path || '/sprites/battle/enemies/golem.gif'}
                width={96}
                height={96}
                imageRendering="pixelated"
                style={{ position: 'relative', zIndex: 1 }}
              />
              {phase === 'execution' && (
                <div style={{
                  position: 'absolute',
                  bottom: '100px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid #666',
                  padding: '4px 8px',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                  fontFamily: 'monospace',
                }}>
                  <div style={{ color: '#fff' }}>Golem</div>
                  <div style={{ color: '#f44336' }}>HP: 120/200</div>
                </div>
              )}
            </div>

            {/* Winged Enemies */}
            <div style={{
              display: 'flex',
              gap: '12px',
              position: 'absolute',
              right: '-40px',
              top: '20%',
              alignItems: 'flex-start',
            }}>
              {[1, 2].map((idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '32px',
                    height: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '50%',
                    zIndex: 0,
                  }} />
                  <SimpleSprite
                    id={enemySprites[idx]?.path || '/sprites/battle/enemies/winged.gif'}
                    width={48}
                    height={48}
                    imageRendering="pixelated"
                    style={{ position: 'relative', zIndex: 1 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* UI Overlays */}
        {phase === 'planning' && (
          <>
            {/* Action Queue Panel */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '12px',
              zIndex: 10,
              minWidth: '200px',
            }}>
              <div style={{
                fontSize: '12px',
                color: '#aaa',
                marginBottom: '8px',
                fontFamily: 'monospace',
              }}>
                ACTION QUEUE
              </div>
              {[0, 1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  style={{
                    backgroundColor: slot < 2 ? '#2a2a2a' : '#1a1a1a',
                    border: '1px solid #444',
                    padding: '6px',
                    marginBottom: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: slot < 2 ? '#fff' : '#666',
                  }}
                >
                  {slot === 0 && 'Isaac → Attack'}
                  {slot === 1 && 'Garet → Flame'}
                  {slot >= 2 && `Slot ${slot + 1} (empty)`}
                </div>
              ))}
            </div>

            {/* Mana Circles Bar */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{
                fontSize: '12px',
                color: '#aaa',
                marginBottom: '8px',
                fontFamily: 'monospace',
              }}>
                MANA CIRCLES
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2, 3, 4].map((circle) => (
                  <div
                    key={circle}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: circle < 3 ? '#2196F3' : '#333',
                      border: '1px solid #666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                  >
                    {circle < 3 ? '●' : '○'}
                  </div>
                ))}
              </div>
            </div>

            {/* Djinn Bar */}
            <div style={{
              position: 'absolute',
              top: '100px',
              left: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{
                fontSize: '12px',
                color: '#aaa',
                marginBottom: '8px',
                fontFamily: 'monospace',
              }}>
                DJINN
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '150px' }}>
                {['Venus', 'Mars', 'Mercury', 'Jupiter'].map((element, idx) => (
                  <div
                    key={element}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: idx < 2 ? '#4CAF50' : '#333',
                      border: '1px solid #666',
                      borderRadius: '2px',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      color: '#fff',
                    }}
                  >
                    {element}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {phase === 'execution' && (
          <>
            {/* Battle Log */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '12px',
              zIndex: 10,
              maxWidth: '400px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}>
              <div style={{
                fontSize: '12px',
                color: '#aaa',
                marginBottom: '8px',
                fontFamily: 'monospace',
              }}>
                BATTLE LOG
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', lineHeight: '1.6' }}>
                <div style={{ color: '#fff', marginBottom: '4px' }}>Isaac attacks Golem!</div>
                <div style={{ color: '#4CAF50', marginBottom: '4px' }}>→ 45 damage</div>
                <div style={{ color: '#fff', marginBottom: '4px' }}>Garet uses Flame!</div>
                <div style={{ color: '#f44336', marginBottom: '4px' }}>→ 62 fire damage</div>
                <div style={{ color: '#aaa', marginBottom: '4px' }}>Golem's turn...</div>
              </div>
            </div>

            {/* Turn Order Indicator */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{
                fontSize: '12px',
                color: '#aaa',
                marginBottom: '8px',
                fontFamily: 'monospace',
              }}>
                TURN ORDER
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                <div style={{ color: '#4CAF50', marginBottom: '2px' }}>→ Isaac</div>
                <div style={{ color: '#fff', marginBottom: '2px' }}>Garet</div>
                <div style={{ color: '#fff', marginBottom: '2px' }}>Ivan</div>
                <div style={{ color: '#f44336', marginBottom: '2px' }}>Golem</div>
              </div>
            </div>
          </>
        )}

        {phase === 'victory' && (
          <>
            {/* Victory Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
            }}>
              <div style={{
                backgroundColor: '#1a1a1a',
                border: '4px solid #4CAF50',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '48px',
                  color: '#4CAF50',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}>
                  VICTORY!
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#aaa',
                  fontFamily: 'monospace',
                  marginBottom: '20px',
                }}>
                  All enemies defeated
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  fontFamily: 'monospace',
                }}>
                  Transitioning to rewards screen...
                </div>
              </div>
            </div>
          </>
        )}

        {/* Battle Menu Bar (Bottom) */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50px',
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 10,
          borderTop: 'none',
        }}>
          {['Fight', 'Psynergy', 'Djimi', 'Item', 'Run'].map((option) => (
            <button
              key={option}
              style={{
                color: '#FFFFFF',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '16px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                padding: '0',
                flex: '1',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFD700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
