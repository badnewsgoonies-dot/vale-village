/**
 * Battle Scene Storyboard
 * Shows battle screen mockups for planning, execution, and victory phases
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, searchSprites, getSpritesByCategory } from '../../sprites';

type BattlePhase = 'planning' | 'execution' | 'victory';

export function BattleSceneStoryboard() {
  const [phase, setPhase] = useState<BattlePhase>('planning');

  // Find party sprites
  const isaacSprite = getSpriteById('isaac-lblade-front') || getSpriteById('isaac-front');
  const garetSprite = getSpriteById('garet-axe-front') || getSpriteById('garet-front');
  const ivanSprite = getSpriteById('ivan-staff-front') || getSpriteById('ivan-lblade-front') || getSpriteById('ivan-front');
  const miaSprite = getSpriteById('mia-staff-front') || getSpriteById('mia-mace-front') || getSpriteById('mia-front');

  // Find enemy sprites
  const golemSprite = searchSprites('golem')[0] || searchSprites('armor')[0] || getSpritesByCategory('battle-enemies')[0];
  const wingedEnemySprite = searchSprites('winged')[0] || searchSprites('bat')[0] || getSpritesByCategory('battle-enemies')[1];

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
      }}>
        <div style={{ fontWeight: 'bold', marginRight: '1rem' }}>Battle Phase:</div>
        {(['planning', 'execution', 'victory'] as BattlePhase[]).map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: phase === p ? '#4CAF50' : '#3a3a3a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
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

        {/* Battle UI Overlay */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}>
          {/* Top UI Bar (Mana/Djinn) */}
          {phase === 'planning' && (
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: '#FFD700' }}>⚡ Mana: ●●●○○ (3/5)</div>
                <div style={{ color: '#87CEEB' }}>✦ Djinn: Venus(2) Mars(1) Mercury(1) Jupiter(0)</div>
              </div>
            </div>
          )}

          {/* Action Queue Panel (Planning Phase) */}
          {phase === 'planning' && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderBottom: '2px solid #FFD700',
            }}>
              <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '0.5rem' }}>Action Queue:</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4].map((slot) => (
                  <div
                    key={slot}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      backgroundColor: '#2a2a2a',
                      border: '2px dashed #555',
                      borderRadius: '4px',
                      textAlign: 'center',
                      color: '#999',
                      minHeight: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Slot {slot}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Battle Scene Container */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '20px 40px',
            paddingBottom: phase === 'planning' ? '100px' : '80px',
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
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <SimpleSprite
                    id={char.sprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
                    width={64}
                    height={64}
                    imageRendering="pixelated"
                  />
                  {phase === 'planning' && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: '#fff',
                    }}>
                      {char.name}
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
              gap: '20px',
            }}>
              {/* Large Golem */}
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
                  id={golemSprite?.path || getSpritesByCategory('battle-enemies')[0]?.path || '/sprites/battle/enemies/golem.gif'}
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
                marginTop: '-20px',
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
                      id={wingedEnemySprite?.path || getSpritesByCategory('battle-enemies')[idx]?.path || '/sprites/battle/enemies/winged.gif'}
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

          {/* Battle Log (Execution Phase) */}
          {phase === 'execution' && (
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '1rem',
              right: '1rem',
              maxHeight: '150px',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #FFD700',
              borderRadius: '4px',
              padding: '0.5rem',
              overflowY: 'auto',
            }}>
              <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '0.5rem' }}>Battle Log:</div>
              <div style={{ color: '#fff', fontSize: '0.875rem', lineHeight: '1.5' }}>
                <div>⚡ Isaac generated +1 mana! (4 total)</div>
                <div>Isaac used Strike</div>
                <div>Golem took 45 damage</div>
                <div>Garet used Fireball</div>
                <div>Winged Enemy took 32 [Fire]</div>
              </div>
            </div>
          )}

          {/* Victory Overlay */}
          {phase === 'victory' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#FFD700',
                textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
                marginBottom: '2rem',
              }}>
                VICTORY!
              </div>
              <div style={{
                fontSize: '1.2rem',
                color: '#fff',
                marginBottom: '1rem',
              }}>
                All enemies defeated
              </div>
              <div style={{
                padding: '1rem 2rem',
                backgroundColor: '#4CAF50',
                color: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
              }}>
                Continue to Rewards →
              </div>
            </div>
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
    </div>
  );
}






