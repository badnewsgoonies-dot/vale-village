/**
 * Battle Scene Storyboard Component
 * 
 * Shows battle scene mockups for planning, execution, and victory phases.
 * Uses actual sprites from the catalog to demonstrate pixel-perfect layouts.
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, searchSprites, getSpritesByCategory } from '../../sprites';

type BattlePhase = 'planning' | 'execution' | 'victory';

export function BattleSceneStoryboard() {
  const [phase, setPhase] = useState<BattlePhase>('planning');
  const [backgroundType, setBackgroundType] = useState<'beach' | 'forest' | 'cave'>('beach');

  // Find party sprites
  const isaacSprite = getSpriteById('isaac-lblade-front') || getSpriteById('isaac-front');
  const garetSprite = getSpriteById('garet-axe-front') || getSpriteById('garet-front');
  const ivanSprite = getSpriteById('ivan-staff-front') || getSpriteById('ivan-front');
  const miaSprite = getSpriteById('mia-staff-front') || getSpriteById('mia-front');

  // Find enemy sprites
  const enemySprites = getSpritesByCategory('battle-enemies').slice(0, 3);
  const golemSprite = searchSprites('golem')[0] || enemySprites[0];
  const wingedEnemySprite = searchSprites('winged')[0] || searchSprites('bat')[0] || enemySprites[1];

  // Background selection
  const backgroundPaths = {
    beach: '/sprites/backgrounds/gs1/World_Map_Shore.gif',
    forest: '/sprites/backgrounds/gs1/Vale_Forest.gif',
    cave: '/sprites/backgrounds/gs1/Cave.gif',
  };

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
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Phase:</div>
        {(['planning', 'execution', 'victory'] as BattlePhase[]).map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: phase === p ? '#4CAF50' : '#444',
              color: '#fff',
              border: '1px solid #666',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
            }}
          >
            {p}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ fontSize: '0.875rem' }}>Background:</div>
          {(['beach', 'forest', 'cave'] as const).map((bg) => (
            <button
              key={bg}
              onClick={() => setBackgroundType(bg)}
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: backgroundType === bg ? '#4CAF50' : '#444',
                color: '#fff',
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                textTransform: 'capitalize',
              }}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Battle Scene Canvas */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        imageRendering: 'pixelated',
      }}>
        {/* Background */}
        <BackgroundSprite
          id={backgroundPaths[backgroundType]}
          style={{
            position: 'absolute',
            width: '100%',
            height: 'calc(100% - 60px)',
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
          height: 'calc(100% - 60px)',
          bottom: '60px',
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
                {/* Unit Card Overlay (execution phase) */}
                {phase === 'execution' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '70px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '2px solid #4CAF50',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                  }}>
                    <div>{char.name}</div>
                    <div style={{ color: '#ff4444' }}>HP: 120/150</div>
                    <div style={{ color: '#4444ff' }}>PP: 45/60</div>
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
            position: 'relative',
          }}>
            {/* Large Golem */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
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
                id={golemSprite?.path || enemySprites[0]?.path || '/sprites/battle/enemies/golem.gif'}
                width={96}
                height={96}
                imageRendering="pixelated"
                style={{ position: 'relative', zIndex: 1 }}
              />
            </div>

            {/* Winged Enemies */}
            <div style={{
              display: 'flex',
              gap: '12px',
              position: 'absolute',
              right: '-40px',
              top: '20%',
            }}>
              {[0, 1].map((idx) => (
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
                    id={wingedEnemySprite?.path || enemySprites[1]?.path || '/sprites/battle/enemies/winged.gif'}
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
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #4CAF50',
              borderRadius: '8px',
              padding: '12px',
              zIndex: 10,
              minWidth: '200px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' }}>
                Action Queue
              </div>
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '4px 8px',
                    marginBottom: '4px',
                    backgroundColor: idx < 2 ? '#2a4a2a' : '#2a2a2a',
                    border: '1px solid #4CAF50',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  {idx === 0 && 'Isaac → Attack'}
                  {idx === 1 && 'Garet → Fireball'}
                  {idx >= 2 && 'Empty'}
                </div>
              ))}
            </div>

            {/* Mana Circles Bar */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #4CAF50',
              borderRadius: '8px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: '#4CAF50' }}>Mana Circles</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: idx < 3 ? '#4CAF50' : '#444',
                      border: '2px solid #666',
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
              border: '2px solid #FFD700',
              borderRadius: '8px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: '#FFD700' }}>Djinn</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '120px' }}>
                {['Venus', 'Mars', 'Mercury'].map((elem) => (
                  <div
                    key={elem}
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #FFD700',
                      borderRadius: '4px',
                      fontSize: '10px',
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
              bottom: '70px',
              left: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #4CAF50',
              borderRadius: '8px',
              padding: '12px',
              zIndex: 10,
              maxWidth: '400px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' }}>
                Battle Log
              </div>
              <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
                <div>Isaac attacks Golem for 45 damage!</div>
                <div>Garet casts Fireball for 78 damage!</div>
                <div>Golem attacks Isaac for 32 damage!</div>
                <div style={{ color: '#ff4444' }}>Isaac is KO'd!</div>
              </div>
            </div>

            {/* Turn Order Indicator */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #4CAF50',
              borderRadius: '8px',
              padding: '12px',
              zIndex: 10,
            }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' }}>
                Turn Order
              </div>
              <div style={{ fontSize: '11px' }}>
                <div style={{ color: '#4CAF50' }}>→ Isaac</div>
                <div>Garet</div>
                <div>Ivan</div>
                <div>Mia</div>
                <div>Golem</div>
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
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#FFD700',
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
                All enemies defeated!
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
          height: '60px',
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 10,
          borderTop: '2px solid #4CAF50',
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
                height: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFD700';
                e.currentTarget.style.backgroundColor = '#2a2a2a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.backgroundColor = 'transparent';
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
        fontSize: '0.875rem',
        color: '#aaa',
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>
          Layout Notes:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
          <li>Party members aligned horizontally on left side, bottom-aligned</li>
          <li>Enemies positioned on right with shadows for depth</li>
          <li>Action queue panel shows planned actions (top-right)</li>
          <li>Mana circles and Djinn bars visible during planning phase</li>
          <li>Battle log and turn order shown during execution phase</li>
          <li>Victory overlay appears when battle ends</li>
          <li>Menu bar always visible at bottom with action options</li>
        </ul>
      </div>
    </div>
  );
}
