/**
 * Battle Scene Storyboard Component
 * Mockups for battle planning, execution, and victory phases
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, getSpritesByCategory } from '../sprites';

type BattlePhase = 'planning' | 'execution' | 'victory';

export function BattleSceneStoryboard() {
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('planning');

  // Get sprites for the battle scene
  const isaacSprite = getSpriteById('isaac-lblade-front') || getSpritesByCategory('battle-party').find(s => s.name.toLowerCase().includes('isaac'));
  const garetSprite = getSpriteById('garet-axe-front') || getSpritesByCategory('battle-party').find(s => s.name.toLowerCase().includes('garet'));
  const ivanSprite = getSpriteById('ivan-staff-front') || getSpritesByCategory('battle-party').find(s => s.name.toLowerCase().includes('ivan'));
  const miaSprite = getSpriteById('mia-staff-front') || getSpritesByCategory('battle-party').find(s => s.name.toLowerCase().includes('mia'));

  // Get enemy sprites
  const enemySprites = getSpritesByCategory('battle-enemies').slice(0, 3);

  // Mock battle data
  const mockBattleData = {
    playerTeam: [
      { id: 'isaac', name: 'Isaac', hp: 120, maxHp: 120, pp: 45, maxPp: 45 },
      { id: 'garet', name: 'Garet', hp: 115, maxHp: 115, pp: 40, maxPp: 40 },
      { id: 'ivan', name: 'Ivan', hp: 95, maxHp: 95, pp: 55, maxPp: 55 },
      { id: 'mia', name: 'Mia', hp: 100, maxHp: 100, pp: 50, maxPp: 50 },
    ],
    enemyTeam: [
      { id: 'golem', name: 'Stone Golem', hp: 200, maxHp: 250 },
      { id: 'bat1', name: 'Vampire Bat', hp: 45, maxHp: 45 },
      { id: 'bat2', name: 'Vampire Bat', hp: 35, maxHp: 45 },
    ],
    queuedActions: [
      'Isaac: Attack Stone Golem',
      'Garet: Attack Stone Golem',
      'Ivan: Ply Well',
      'Mia: Cure Isaac',
    ],
    battleLog: [
      'Isaac attacks Stone Golem for 35 damage!',
      'Stone Golem counterattacks Isaac for 15 damage!',
      'Garet attacks Stone Golem for 42 damage!',
      'Ivan casts Ply Well! Party PP +10',
    ],
  };

  const renderPlanningPhase = () => (
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
          height: 'calc(100% - 120px)',
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
        height: 'calc(100% - 120px)',
        bottom: '120px',
        left: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingBottom: '5%',
        zIndex: 1,
      }}>
        {/* Player Party (Left Side) */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-end',
          height: '100%',
        }}>
          {[isaacSprite, garetSprite, ivanSprite, miaSprite].map((sprite, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}>
              <SimpleSprite
                id={sprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
                width={64}
                height={64}
                imageRendering="pixelated"
              />
              <div style={{
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
              }}>
                {mockBattleData.playerTeam[index]?.name}
              </div>
            </div>
          ))}
        </div>

        {/* Enemy Party (Right Side) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          gap: '10px',
          height: '100%',
          position: 'relative',
        }}>
          {/* Large Enemy (Bottom) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
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
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}>
              Stone Golem
            </div>
          </div>

          {/* Small Enemies (Top) */}
          <div style={{
            display: 'flex',
            gap: '16px',
            position: 'absolute',
            right: '-20px',
            top: '15%',
            alignItems: 'flex-start',
          }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '36px',
                  height: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '50%',
                  zIndex: 0,
                }} />
                <SimpleSprite
                  id={enemySprites[i]?.path}
                  width={48}
                  height={48}
                  imageRendering="pixelated"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Queue Panel (Top-Right) */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '300px',
        backgroundColor: 'rgba(0,0,0,0.9)',
        border: '2px solid #FFD700',
        borderRadius: '8px',
        padding: '15px',
        zIndex: 10,
      }}>
        <h3 style={{
          margin: '0 0 10px 0',
          color: '#FFD700',
          fontSize: '16px',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}>
          ACTION QUEUE
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mockBattleData.queuedActions.map((action, index) => (
            <div key={index} style={{
              backgroundColor: index < 2 ? '#4CAF50' : '#333',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace',
              border: index < 2 ? '2px solid #FFD700' : 'none',
            }}>
              {index + 1}. {action}
            </div>
          ))}
        </div>
        <div style={{
          marginTop: '10px',
          textAlign: 'center',
          color: '#FFD700',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}>
          Queue 3/4 Complete
        </div>
      </div>

      {/* Mana Circles Bar (Top-Left) */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.9)',
        border: '2px solid #FFD700',
        borderRadius: '8px',
        padding: '15px',
        zIndex: 10,
      }}>
        <h3 style={{
          margin: '0 0 10px 0',
          color: '#FFD700',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}>
          MANA CIRCLES
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4].map((circle) => (
            <div key={circle} style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: circle <= 3 ? '#4169E1' : '#666',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontFamily: 'monospace',
              color: '#fff',
            }}>
              {circle <= 3 ? '●' : '○'}
            </div>
          ))}
        </div>
      </div>

      {/* Battle Menu Bar (Bottom) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '120px',
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
              fontSize: '18px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              padding: '0',
              textTransform: 'none',
              letterSpacing: '0px',
              transition: 'none',
              flex: '1',
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
      {/* Background */}
      <BackgroundSprite
        id="/sprites/backgrounds/gs1/World_Map_Shore.gif"
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

      {/* Battle Scene - Same as planning but with action indicators */}
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
        paddingBottom: '5%',
        zIndex: 1,
      }}>
        {/* Player Party */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-end',
          height: '100%',
        }}>
          {[isaacSprite, garetSprite, ivanSprite, miaSprite].map((sprite, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}>
              <SimpleSprite
                id={sprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
                width={64}
                height={64}
                imageRendering="pixelated"
              />
              {/* Action indicator for current unit */}
              {index === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#FFD700',
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  animation: 'pulse 1s infinite',
                }}>
                  ATTACKING
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enemy Party */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          gap: '10px',
          height: '100%',
          position: 'relative',
        }}>
          {/* Large Enemy */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '50%',
              zIndex: 0,
            }} />
            {/* Damage indicator */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#FF4444',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              zIndex: 15,
              animation: 'damage-flash 0.5s ease-out',
            }}>
              -35 HP
            </div>
            <SimpleSprite
              id={enemySprites[0]?.path || '/sprites/battle/enemies/golem.gif'}
              width={96}
              height={96}
              imageRendering="pixelated"
              style={{
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
        </div>
      </div>

      {/* Battle Log (Bottom-Right) */}
      <div style={{
        position: 'absolute',
        bottom: '130px',
        right: '20px',
        width: '400px',
        maxHeight: '200px',
        backgroundColor: 'rgba(0,0,0,0.9)',
        border: '2px solid #FFD700',
        borderRadius: '8px',
        padding: '15px',
        zIndex: 10,
        overflow: 'hidden',
      }}>
        <h3 style={{
          margin: '0 0 10px 0',
          color: '#FFD700',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}>
          BATTLE LOG
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {mockBattleData.battleLog.map((log, index) => (
            <div key={index} style={{
              color: '#fff',
              fontSize: '11px',
              fontFamily: 'monospace',
              lineHeight: '1.3',
            }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Turn Order Indicator (Top) */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.9)',
        border: '2px solid #FFD700',
        borderRadius: '8px',
        padding: '10px',
        zIndex: 10,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            color: '#FFD700',
            fontSize: '12px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            NEXT:
          </div>
          {['Isaac', 'Garet', 'Ivan', 'Mia'].map((name, index) => (
            <div key={index} style={{
              backgroundColor: index === 0 ? '#FFD700' : '#666',
              color: index === 0 ? '#000' : '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Battle Menu Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '120px',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        borderTop: 'none',
      }}>
        <div style={{
          color: '#FFD700',
          fontSize: '16px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}>
          EXECUTING BATTLE ROUND...
        </div>
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}>
        {/* Victory Text */}
        <div style={{
          fontSize: '48px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          color: '#FFD700',
          textAlign: 'center',
          marginBottom: '40px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          animation: 'victory-glow 2s infinite',
        }}>
          VICTORY!
        </div>

        {/* Party Celebration */}
        <div style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'flex-end',
          marginBottom: '60px',
        }}>
          {[isaacSprite, garetSprite, ivanSprite, miaSprite].map((sprite, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}>
              {/* Victory particles */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '24px',
                animation: 'victory-sparkle 1.5s infinite',
              }}>
                ✨
              </div>
              <SimpleSprite
                id={sprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
                width={80}
                height={80}
                imageRendering="pixelated"
              />
            </div>
          ))}
        </div>

        {/* Continue Prompt */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '2px solid #FFD700',
          borderRadius: '8px',
          padding: '20px 40px',
          color: '#fff',
          fontSize: '16px',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}>
          Press any key to continue to rewards...
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Phase Selector */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 20,
        display: 'flex',
        gap: '10px',
      }}>
        {[
          { id: 'planning', label: 'Planning Phase' },
          { id: 'execution', label: 'Execution Phase' },
          { id: 'victory', label: 'Victory Scene' },
        ].map(phase => (
          <button
            key={phase.id}
            onClick={() => setBattlePhase(phase.id as BattlePhase)}
            style={{
              padding: '8px 16px',
              backgroundColor: battlePhase === phase.id ? '#4CAF50' : 'rgba(0,0,0,0.8)',
              color: '#fff',
              border: battlePhase === phase.id ? '2px solid #FFD700' : '2px solid #fff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            {phase.label}
          </button>
        ))}
      </div>

      {/* Current Phase Content */}
      {battlePhase === 'planning' && renderPlanningPhase()}
      {battlePhase === 'execution' && renderExecutionPhase()}
      {battlePhase === 'victory' && renderVictoryPhase()}

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes damage-flash {
          0% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
          100% { opacity: 0; transform: translateX(-50%) scale(1); }
        }
        @keyframes victory-glow {
          0%, 100% { text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
          50% { text-shadow: 0 0 20px #FFD700, 2px 2px 4px rgba(0,0,0,0.8); }
        }
        @keyframes victory-sparkle {
          0%, 100% { opacity: 1; transform: translateX(-50%) rotate(0deg); }
          25% { opacity: 0.8; transform: translateX(-50%) rotate(90deg); }
          50% { opacity: 1; transform: translateX(-50%) rotate(180deg); }
          75% { opacity: 0.8; transform: translateX(-50%) rotate(270deg); }
        }
      `}</style>
    </div>
  );
}