/**
 * Battle Scene Storyboard
 * 
 * Shows battle scene mockups for planning, execution, and victory phases.
 * Uses actual sprites from the catalog to create realistic battle layouts.
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, getSpritesByCategory } from '../../sprites';

export function BattleSceneStoryboard() {
  const [phase, setPhase] = useState<'planning' | 'execution' | 'victory'>('planning');

  // Find party sprites
  const isaacSprite = getSpriteById('isaac-lblade-front') || getSpriteById('isaac-front');
  const garetSprite = getSpriteById('garet-axe-front') || getSpriteById('garet-front');
  const ivanSprite = getSpriteById('ivan-staff-front') || getSpriteById('ivan-lblade-front') || getSpriteById('ivan-front');
  const miaSprite = getSpriteById('mia-staff-front') || getSpriteById('mia-mace-front') || getSpriteById('mia-front');

  // Find enemy sprites
  const enemySprites = getSpritesByCategory('battle-enemies');
  const golemSprite = enemySprites.find(s => s.name.toLowerCase().includes('golem')) || enemySprites[0];
  const wingedEnemySprite = enemySprites.find(s => s.name.toLowerCase().includes('winged') || s.name.toLowerCase().includes('bat')) || enemySprites[1] || enemySprites[0];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
    }}>
      {/* Phase Selector */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <span style={{ color: '#aaa', marginRight: '0.5rem' }}>Phase:</span>
        {(['planning', 'execution', 'victory'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: phase === p ? '#4a9eff' : '#333',
              color: '#fff',
              border: `1px solid ${phase === p ? '#6bb6ff' : '#555'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
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
        backgroundColor: '#87CEEB',
      }}>
        {/* Background */}
        <BackgroundSprite
          id="random"
          category="backgrounds-gs1"
          style={{
            position: 'absolute',
            width: '100%',
            height: 'calc(100% - 50px)',
            top: 0,
            left: 0,
            zIndex: 0,
          }}
          sizeMode="cover"
        />

        {/* Battle Scene Content */}
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
          }}>
            {isaacSprite && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SimpleSprite
                  id={isaacSprite.path}
                  width={64}
                  height={64}
                  imageRendering="pixelated"
                />
                {phase === 'planning' && (
                  <div style={{
                    marginTop: '4px',
                    padding: '2px 6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    fontSize: '10px',
                    borderRadius: '2px',
                  }}>
                    Isaac
                  </div>
                )}
              </div>
            )}
            {garetSprite && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SimpleSprite
                  id={garetSprite.path}
                  width={64}
                  height={64}
                  imageRendering="pixelated"
                />
                {phase === 'planning' && (
                  <div style={{
                    marginTop: '4px',
                    padding: '2px 6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    fontSize: '10px',
                    borderRadius: '2px',
                  }}>
                    Garet
                  </div>
                )}
              </div>
            )}
            {ivanSprite && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SimpleSprite
                  id={ivanSprite.path}
                  width={64}
                  height={64}
                  imageRendering="pixelated"
                />
                {phase === 'planning' && (
                  <div style={{
                    marginTop: '4px',
                    padding: '2px 6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    fontSize: '10px',
                    borderRadius: '2px',
                  }}>
                    Ivan
                  </div>
                )}
              </div>
            )}
            {miaSprite && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SimpleSprite
                  id={miaSprite.path}
                  width={64}
                  height={64}
                  imageRendering="pixelated"
                />
                {phase === 'planning' && (
                  <div style={{
                    marginTop: '4px',
                    padding: '2px 6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    fontSize: '10px',
                    borderRadius: '2px',
                  }}>
                    Mia
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enemy Party (Right Side) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            position: 'relative',
          }}>
            {golemSprite && (
              <div style={{ position: 'relative' }}>
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
                  id={golemSprite.path}
                  width={96}
                  height={96}
                  imageRendering="pixelated"
                  style={{ position: 'relative', zIndex: 1 }}
                />
                {phase === 'planning' && (
                  <div style={{
                    marginTop: '4px',
                    padding: '2px 6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    fontSize: '10px',
                    borderRadius: '2px',
                    textAlign: 'center',
                  }}>
                    Golem
                  </div>
                )}
              </div>
            )}
            {wingedEnemySprite && (
              <div style={{
                display: 'flex',
                gap: '12px',
                position: 'absolute',
                right: '-40px',
                top: '20%',
              }}>
                {[1, 2].map((i) => (
                  <div key={i} style={{ position: 'relative' }}>
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
                      id={wingedEnemySprite.path}
                      width={48}
                      height={48}
                      imageRendering="pixelated"
                      style={{ position: 'relative', zIndex: 1 }}
                    />
                  </div>
                ))}
              </div>
            )}
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
              width: '280px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{ color: '#fff', fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
                ACTION QUEUE
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    padding: '6px',
                    marginBottom: '4px',
                    backgroundColor: i <= 2 ? 'rgba(74, 158, 255, 0.3)' : 'rgba(100, 100, 100, 0.2)',
                    border: '1px solid #555',
                    borderRadius: '2px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                >
                  {i <= 2 ? `Isaac → Attack Golem` : 'Empty'}
                </div>
              ))}
            </div>

            {/* Mana Circles Bar */}
            <div style={{
              position: 'absolute',
              bottom: '60px',
              left: '20px',
              width: '300px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '8px',
              zIndex: 10,
            }}>
              <div style={{ color: '#fff', fontSize: '11px', marginBottom: '4px' }}>MANA CIRCLES</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: i <= 4 ? '#4a9eff' : '#333',
                      border: '2px solid #666',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '10px',
                    }}
                  >
                    {i <= 4 ? '●' : '○'}
                  </div>
                ))}
              </div>
            </div>

            {/* Djinn Bar */}
            <div style={{
              position: 'absolute',
              bottom: '60px',
              right: '20px',
              width: '200px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '8px',
              zIndex: 10,
            }}>
              <div style={{ color: '#fff', fontSize: '11px', marginBottom: '4px' }}>DJINN</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['Venus', 'Mars', 'Mercury', 'Jupiter'].map((elem) => (
                  <div
                    key={elem}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#444',
                      border: '1px solid #666',
                      borderRadius: '2px',
                      fontSize: '10px',
                      color: '#fff',
                    }}
                  >
                    {elem}
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
              width: '400px',
              maxHeight: '200px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '12px',
              zIndex: 10,
              overflowY: 'auto',
            }}>
              <div style={{ color: '#fff', fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
                BATTLE LOG
              </div>
              {[
                'Isaac attacks Golem!',
                'Damage: 45',
                'Golem attacks Isaac!',
                'Damage: 28',
                'Garet attacks Golem!',
                'Damage: 52',
              ].map((log, i) => (
                <div
                  key={i}
                  style={{
                    padding: '4px 0',
                    fontSize: '11px',
                    color: '#ccc',
                    borderBottom: i < 5 ? '1px solid #444' : 'none',
                  }}
                >
                  {log}
                </div>
              ))}
            </div>

            {/* Turn Order Indicator */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '200px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{ color: '#fff', fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
                TURN ORDER
              </div>
              {['Isaac', 'Golem', 'Garet', 'Winged Enemy'].map((name, i) => (
                <div
                  key={i}
                  style={{
                    padding: '4px 0',
                    fontSize: '11px',
                    color: i === 0 ? '#4a9eff' : '#ccc',
                    fontWeight: i === 0 ? 'bold' : 'normal',
                  }}
                >
                  {i + 1}. {name}
                </div>
              ))}
            </div>
          </>
        )}

        {phase === 'victory' && (
          <>
            {/* Victory Overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '4px solid #FFD700',
              borderRadius: '8px',
              padding: '40px',
              zIndex: 20,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '48px',
                color: '#FFD700',
                fontWeight: 'bold',
                marginBottom: '20px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              }}>
                VICTORY!
              </div>
              <div style={{
                fontSize: '18px',
                color: '#fff',
                marginBottom: '20px',
              }}>
                You have defeated the enemy!
              </div>
              <div style={{
                fontSize: '14px',
                color: '#aaa',
              }}>
                Transitioning to rewards screen...
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
        }}>
          {['Fight', 'Psynergy', 'Djimi', 'Item', 'Run'].map((option) => (
            <button
              key={option}
              style={{
                color: phase === 'planning' ? '#FFFFFF' : '#666',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '16px',
                fontFamily: 'monospace',
                cursor: phase === 'planning' ? 'pointer' : 'default',
                padding: '0',
                flex: '1',
                textAlign: 'center',
                opacity: phase === 'planning' ? 1 : 0.5,
              }}
            >
              {option}
            </button>
          ))}
        </div>
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
          <li>Party members aligned horizontally on left side</li>
          <li>Enemies positioned on right with shadows for depth</li>
          <li>Action queue shows planned actions (planning phase)</li>
          <li>Battle log displays events (execution phase)</li>
          <li>Mana circles and Djinn bars show resource management</li>
          <li>Menu bar at bottom for battle actions</li>
        </ul>
      </div>
    </div>
  );
}
