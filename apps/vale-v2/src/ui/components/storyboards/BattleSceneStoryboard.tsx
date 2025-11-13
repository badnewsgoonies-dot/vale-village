/**
 * Battle Scene Storyboard Component
 * Mockups for queue-based battle system phases
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpritesByCategory, searchSprites } from '../../sprites';

type BattlePhase = 'planning' | 'execution' | 'victory';

const PHASES: { value: BattlePhase; label: string; description: string }[] = [
  {
    value: 'planning',
    label: 'Planning Phase',
    description: 'Queue actions for party members'
  },
  {
    value: 'execution',
    label: 'Execution Phase',
    description: 'Watch battle unfold with animations'
  },
  {
    value: 'victory',
    label: 'Victory Scene',
    description: 'Post-battle victory overlay and rewards'
  }
];

export function BattleSceneStoryboard() {
  const [currentPhase, setCurrentPhase] = useState<BattlePhase>('planning');

  // Find battle sprites
  const isaacSprite = searchSprites('isaac')[0] || getSpritesByCategory('battle-party')[0];
  const garetSprite = searchSprites('garet')[0] || getSpritesByCategory('battle-party')[1];
  const ivanSprite = searchSprites('ivan')[0] || getSpritesByCategory('battle-party')[2];
  const miaSprite = searchSprites('mia')[0] || getSpritesByCategory('battle-party')[3];

  const enemySprites = getSpritesByCategory('battle-enemies').slice(0, 3);

  const renderPlanningPhase = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#87CEEB',
      imageRendering: 'pixelated',
    }}>
      {/* Beach Background */}
      <BackgroundSprite
        id="/sprites/backgrounds/gs1/World_Map_Shore.gif"
        style={{
          position: 'absolute',
          width: '100%',
          height: 'calc(100% - 140px)', // Leave room for UI
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        sizeMode="cover"
      />

      {/* Battle Scene */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: 'calc(100% - 140px)',
        bottom: '140px',
        left: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingLeft: '8%',
        paddingRight: '8%',
        paddingBottom: '6%',
        zIndex: 1,
      }}>
        {/* Player Party (Left) */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-end',
          height: '100%',
        }}>
          {/* Isaac */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite
              id={isaacSprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
              width={72}
              height={72}
              imageRendering="pixelated"
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Isaac Lv.5
            </div>
          </div>

          {/* Garet */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite
              id={garetSprite?.path || '/sprites/battle/party/garet/Garet_Axe_Front.gif'}
              width={72}
              height={72}
              imageRendering="pixelated"
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Garet Lv.4
            </div>
          </div>

          {/* Ivan */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite
              id={ivanSprite?.path || '/sprites/battle/party/ivan/Ivan_Staff_Front.gif'}
              width={72}
              height={72}
              imageRendering="pixelated"
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Ivan Lv.5
            </div>
          </div>

          {/* Mia */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite
              id={miaSprite?.path || '/sprites/battle/party/mia/Mia_Staff_Front.gif'}
              width={72}
              height={72}
              imageRendering="pixelated"
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Mia Lv.4
            </div>
          </div>
        </div>

        {/* Enemy Party (Right) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          gap: '8px',
          height: '100%',
          position: 'relative',
        }}>
          {/* Golem Boss */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Shadow */}
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '16px',
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
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Golem Lv.7
            </div>
          </div>

          {/* Minions */}
          <div style={{
            display: 'flex',
            gap: '16px',
            position: 'absolute',
            right: '-20px',
            top: '25%',
            alignItems: 'flex-start',
          }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Shadow */}
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '50%',
                  zIndex: 0,
                }} />
                <SimpleSprite
                  id={enemySprites[i]?.path || '/sprites/battle/enemies/goblin.gif'}
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
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '140px',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
      }}>
        {/* Action Queue Panel */}
        <div style={{
          flex: 1,
          backgroundColor: '#111',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
        }}>
          <div style={{
            color: '#fff',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginRight: '20px',
          }}>
            Queue:
          </div>
          {[1, 2, 3, 4].map(slot => (
            <div key={slot} style={{
              width: '60px',
              height: '40px',
              backgroundColor: '#222',
              border: '2px solid #444',
              borderRadius: '4px',
              margin: '0 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}>
              {slot <= 2 ? `Action ${slot}` : 'Empty'}
            </div>
          ))}
        </div>

        {/* Bottom Menu Bar */}
        <div style={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
          {['Fight', 'Psynergy', 'Djinn', 'Item', 'Run'].map(option => (
            <button
              key={option}
              style={{
                color: '#fff',
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
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Phase Label */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#4CAF50',
        padding: '8px 16px',
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
      }}>
        PLANNING PHASE
      </div>
    </div>
  );

  const renderExecutionPhase = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#87CEEB',
      imageRendering: 'pixelated',
    }}>
      {/* Same background and sprites as planning, but with battle effects */}
      <BackgroundSprite
        id="/sprites/backgrounds/gs1/World_Map_Shore.gif"
        style={{
          position: 'absolute',
          width: '100%',
          height: 'calc(100% - 140px)',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        sizeMode="cover"
      />

      {/* Battle Scene with action effects */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: 'calc(100% - 140px)',
        bottom: '140px',
        left: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingLeft: '8%',
        paddingRight: '8%',
        paddingBottom: '6%',
        zIndex: 1,
      }}>
        {/* Player Party */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-end',
          height: '100%',
        }}>
          {/* Isaac - Attacking */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Attack effect */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#FFD700',
              fontSize: '20px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              zIndex: 2,
            }}>
              ⚔️
            </div>
            <SimpleSprite
              id={isaacSprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
              width={72}
              height={72}
              imageRendering="pixelated"
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Isaac Lv.5
            </div>
            {/* HP Bar */}
            <div style={{
              width: '60px',
              height: '6px',
              backgroundColor: '#333',
              border: '1px solid #666',
              borderRadius: '3px',
              marginTop: '2px',
            }}>
              <div style={{
                width: '80%',
                height: '100%',
                backgroundColor: '#4CAF50',
                borderRadius: '2px',
              }} />
            </div>
          </div>

          {/* Other party members */}
          {[garetSprite, ivanSprite, miaSprite].map((sprite, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SimpleSprite
                id={sprite?.path || `/sprites/battle/party/${['garet', 'ivan', 'mia'][i]}/${['Garet', 'Ivan', 'Mia'][i]}_Staff_Front.gif`}
                width={72}
                height={72}
                imageRendering="pixelated"
              />
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                marginTop: '4px',
                fontFamily: 'monospace',
              }}>
                {['Garet', 'Ivan', 'Mia'][i]} Lv.{[4, 5, 4][i]}
              </div>
              {/* HP Bar */}
              <div style={{
                width: '60px',
                height: '6px',
                backgroundColor: '#333',
                border: '1px solid #666',
                borderRadius: '3px',
                marginTop: '2px',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#4CAF50',
                  borderRadius: '2px',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Enemy Party - Damaged */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          gap: '8px',
          height: '100%',
          position: 'relative',
        }}>
          {/* Golem Boss - Damaged */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Damage effect */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#FF4444',
              fontSize: '24px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              zIndex: 2,
            }}>
              -85
            </div>
            {/* Shadow */}
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '50%',
              zIndex: 0,
            }} />
            <SimpleSprite
              id={enemySprites[0]?.path || '/sprites/battle/enemies/golem.gif'}
              width={96}
              height={96}
              imageRendering="pixelated"
              style={{
                position: 'relative',
                zIndex: 1,
                filter: 'brightness(0.7)', // Damage effect
              }}
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Golem Lv.7
            </div>
            {/* HP Bar */}
            <div style={{
              width: '80px',
              height: '8px',
              backgroundColor: '#333',
              border: '1px solid #666',
              borderRadius: '4px',
              marginTop: '2px',
            }}>
              <div style={{
                width: '30%',
                height: '100%',
                backgroundColor: '#FF4444',
                borderRadius: '3px',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* UI Overlays */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '140px',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
      }}>
        {/* Battle Log */}
        <div style={{
          flex: 1,
          backgroundColor: '#111',
          borderBottom: '1px solid #333',
          padding: '8px 20px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#ccc',
          overflow: 'hidden',
        }}>
          <div>Isaac attacks Golem for 85 damage!</div>
          <div>Golem counterattacks Isaac for 45 damage!</div>
          <div>Garet uses Psynergy: Flare!</div>
          <div>→ Golem takes 120 damage!</div>
        </div>

        {/* Bottom Menu Bar */}
        <div style={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            color: '#FFD700',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            EXECUTING ROUND...
          </div>
        </div>
      </div>

      {/* Phase Label */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#FF9800',
        padding: '8px 16px',
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
      }}>
        EXECUTION PHASE
      </div>
    </div>
  );

  const renderVictoryPhase = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#87CEEB',
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

      {/* Victory Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}>
        <div style={{
          backgroundColor: '#FFD700',
          color: '#000',
          padding: '20px 40px',
          borderRadius: '8px',
          fontSize: '32px',
          fontFamily: 'serif',
          fontWeight: 'bold',
          textAlign: 'center',
          border: '4px solid #FFA000',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
        }}>
          VICTORY!
        </div>
      </div>

      {/* Party sprites in victory poses */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '32px',
        zIndex: 4,
      }}>
        {[isaacSprite, garetSprite, ivanSprite, miaSprite].map((sprite, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite
              id={sprite?.path || `/sprites/battle/party/${['isaac', 'garet', 'ivan', 'mia'][i]}/${['Isaac', 'Garet', 'Ivan', 'Mia'][i]}_Staff_Front.gif`}
              width={80}
              height={80}
              imageRendering="pixelated"
              style={{ filter: 'brightness(1.2)' }}
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#FFD700',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              marginTop: '8px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              {['Isaac', 'Garet', 'Ivan', 'Mia'][i]} Lv.{[5, 4, 5, 4][i]}
            </div>
          </div>
        ))}
      </div>

      {/* Continue prompt */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '4px',
        fontSize: '16px',
        fontFamily: 'monospace',
        textAlign: 'center',
        zIndex: 6,
      }}>
        Press SPACE to continue...
      </div>

      {/* Phase Label */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#4CAF50',
        padding: '8px 16px',
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
      }}>
        VICTORY PHASE
      </div>
    </div>
  );

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'planning':
        return renderPlanningPhase();
      case 'execution':
        return renderExecutionPhase();
      case 'victory':
        return renderVictoryPhase();
      default:
        return renderPlanningPhase();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Phase Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        zIndex: 20,
      }}>
        {PHASES.map(phase => (
          <button
            key={phase.value}
            onClick={() => setCurrentPhase(phase.value)}
            style={{
              padding: '6px 12px',
              backgroundColor: currentPhase === phase.value ? '#4CAF50' : '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
            title={phase.description}
          >
            {phase.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {renderCurrentPhase()}

      {/* Description */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '400px',
        zIndex: 15,
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {PHASES.find(p => p.value === currentPhase)?.label}
        </div>
        <div style={{ color: '#ccc' }}>
          {PHASES.find(p => p.value === currentPhase)?.description}
        </div>
        <div style={{ color: '#888', marginTop: '8px', fontSize: '11px' }}>
          • Pixel-perfect Golden Sun sprites
          • Queue-based battle system
          • Elemental advantages & mana costs
          • Djinn activation mechanics
        </div>
      </div>
    </div>
  );
}