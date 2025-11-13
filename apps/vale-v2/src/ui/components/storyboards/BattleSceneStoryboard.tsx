/**
 * Battle Scene Storyboard
 * 
 * Shows battle scene mockups for planning, execution, and victory phases.
 * Uses actual sprites from the catalog to demonstrate realistic layouts.
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, searchSprites, getSpritesByCategory } from '../../sprites';

export function BattleSceneStoryboard() {
  const [phase, setPhase] = useState<'planning' | 'execution' | 'victory'>('planning');

  // Find party sprites
  const isaacSprite = getSpriteById('isaac-lblade-front') || getSpriteById('isaac-front') || searchSprites('isaac')[0];
  const garetSprite = getSpriteById('garet-axe-front') || getSpriteById('garet-front') || searchSprites('garet')[0];
  const ivanSprite = getSpriteById('ivan-staff-front') || getSpriteById('ivan-lblade-front') || getSpriteById('ivan-front') || searchSprites('ivan')[0];
  const miaSprite = getSpriteById('mia-staff-front') || getSpriteById('mia-mace-front') || getSpriteById('mia-front') || searchSprites('mia')[0];

  // Find enemy sprites
  const enemySprites = getSpritesByCategory('battle-enemies');
  const golemSprite = searchSprites('golem')[0] || searchSprites('armor')[0] || enemySprites[0];
  const wingedEnemySprite = searchSprites('winged')[0] || searchSprites('bat')[0] || enemySprites[1] || enemySprites[0];

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
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Phase:</span>
        {(['planning', 'execution', 'victory'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: phase === p ? '#4CAF50' : '#333',
              color: '#fff',
              border: `1px solid ${phase === p ? '#6BCF7F' : '#555'}`,
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

      {/* Battle Scene Container */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        imageRendering: 'pixelated',
      }}>
        {/* Background */}
        <BackgroundSprite
          id="random"
          category="backgrounds-gs1"
          style={{
            position: 'absolute',
            width: '100%',
            height: 'calc(100% - 120px)',
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
          height: 'calc(100% - 120px)',
          bottom: '120px',
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
            {[
              { sprite: isaacSprite, name: 'Isaac' },
              { sprite: garetSprite, name: 'Garet' },
              { sprite: ivanSprite, name: 'Ivan' },
              { sprite: miaSprite, name: 'Mia' },
            ].map((member, idx) => (
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
                  id={member.sprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
                  width={64}
                  height={64}
                  imageRendering="pixelated"
                />
                {/* Unit Card Overlay (execution phase) */}
                {phase === 'execution' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '70px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    border: '1px solid #666',
                  }}>
                    <div>{member.name}</div>
                    <div style={{ fontSize: '9px', opacity: 0.8 }}>HP: 85/100</div>
                    <div style={{ fontSize: '9px', opacity: 0.8 }}>PP: 45/50</div>
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
            gap: '8px',
            position: 'relative',
          }}>
            {/* Large Golem */}
            {golemSprite && (
              <div style={{ position: 'relative' }}>
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
              </div>
            )}

            {/* Winged Enemies */}
            {wingedEnemySprite && (
              <div style={{
                display: 'flex',
                gap: '12px',
                position: 'absolute',
                right: '-40px',
                top: '20%',
              }}>
                {[0, 1].map((i) => (
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
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #666',
              borderRadius: '8px',
              padding: '12px',
              zIndex: 10,
              minWidth: '200px',
            }}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: '#FFD700' }}>ACTION QUEUE</div>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    padding: '6px',
                    marginBottom: '4px',
                    backgroundColor: i < 2 ? '#2a5a2a' : '#2a2a2a',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                >
                  {i === 0 ? 'Isaac → Attack' : i === 1 ? 'Garet → Attack' : 'Empty'}
                </div>
              ))}
            </div>

            {/* Mana Circles Bar */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #666',
              borderRadius: '8px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: '#4A9EFF' }}>MANA</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: i < 5 ? '#4A9EFF' : '#333',
                      border: '1px solid #666',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Djinn Bar */}
            <div style={{
              position: 'absolute',
              top: '100px',
              left: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #666',
              borderRadius: '8px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: '#FF6B6B' }}>DJINN</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Venus', 'Mars', 'Mercury', 'Jupiter'].map((elem, i) => (
                  <div
                    key={elem}
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: i < 2 ? '#FF6B6B' : '#333',
                      border: '1px solid #666',
                      borderRadius: '4px',
                      fontSize: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {elem[0]}
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
              borderRadius: '8px',
              padding: '12px',
              zIndex: 10,
              maxWidth: '400px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: '#FFD700' }}>BATTLE LOG</div>
              <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
                <div>Isaac attacks Golem!</div>
                <div style={{ color: '#FF6B6B' }}>Golem takes 45 damage</div>
                <div>Garet attacks Winged Enemy!</div>
                <div style={{ color: '#FF6B6B' }}>Winged Enemy takes 32 damage</div>
                <div>Ivan uses Cure!</div>
                <div style={{ color: '#4AFF4A' }}>Isaac recovers 25 HP</div>
              </div>
            </div>

            {/* Turn Order Indicator */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #666',
              borderRadius: '8px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: '#FFD700' }}>TURN ORDER</div>
              <div style={{ fontSize: '11px' }}>
                <div style={{ color: '#4AFF4A' }}>→ Isaac</div>
                <div>Garet</div>
                <div>Ivan</div>
                <div>Mia</div>
              </div>
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
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '4px solid #FFD700',
              borderRadius: '16px',
              padding: '40px',
              zIndex: 20,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', color: '#FFD700', marginBottom: '20px' }}>VICTORY!</div>
              <div style={{ fontSize: '18px', color: '#fff', marginBottom: '30px' }}>
                You have defeated all enemies!
              </div>
              <div style={{
                fontSize: '14px',
                color: '#aaa',
                marginTop: '20px',
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
          height: '120px',
          backgroundColor: '#000000',
          borderTop: '2px solid #666',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Menu Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '12px',
            borderBottom: '1px solid #333',
          }}>
            {['Fight', 'Psynergy', 'Djinn', 'Item', 'Run'].map((option) => (
              <button
                key={option}
                style={{
                  color: '#FFFFFF',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333';
                  e.currentTarget.style.color = '#FFD700';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Status Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: '8px',
            fontSize: '12px',
            color: '#aaa',
          }}>
            <div>Phase: {phase.toUpperCase()}</div>
            <div>Enemies: 3</div>
            <div>Turn: 2</div>
          </div>
        </div>
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
          <li>Party members aligned horizontally on left side, all at same baseline</li>
          <li>Enemies positioned on right with proper shadows for depth</li>
          <li>Action queue panel shows planned actions (top-right in planning phase)</li>
          <li>Mana circles and Djinn bars visible during planning</li>
          <li>Battle log and turn order shown during execution phase</li>
          <li>Victory overlay appears centered when battle ends</li>
          <li>Menu bar at bottom with action buttons and status info</li>
        </ul>
      </div>
    </div>
  );
}
