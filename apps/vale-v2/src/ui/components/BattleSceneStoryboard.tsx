/**
 * Battle Scene Storyboard Component
 * Shows battle planning phase, execution phase, and victory transitions
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite } from '../sprites';

type BattlePhase = 'planning' | 'execution' | 'victory';

const PHASE_NAMES: Record<BattlePhase, string> = {
  planning: 'Planning Phase',
  execution: 'Execution Phase',
  victory: 'Victory Scene',
};

const PHASE_DESCRIPTIONS: Record<BattlePhase, string> = {
  planning: 'Queue-based action planning with party members, enemies, and UI panels',
  execution: 'Battle execution with animations and battle log',
  victory: 'Victory overlay and transition to rewards screen',
};

export function BattleSceneStoryboard() {
  const [currentPhase, setCurrentPhase] = useState<BattlePhase>('planning');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#000',
      imageRendering: 'pixelated',
    }}>
      {/* Phase Selector */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        gap: '8px',
      }}>
        {(Object.keys(PHASE_NAMES) as BattlePhase[]).map((phase) => (
          <button
            key={phase}
            onClick={() => setCurrentPhase(phase)}
            style={{
              padding: '8px 16px',
              backgroundColor: currentPhase === phase ? '#ffd700' : 'rgba(0,0,0,0.8)',
              color: currentPhase === phase ? '#000' : '#fff',
              border: currentPhase === phase ? '2px solid #fff' : '2px solid #666',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}
          >
            {PHASE_NAMES[phase]}
          </button>
        ))}
      </div>

      {/* Phase Description */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '12px',
        borderRadius: '8px',
        maxWidth: '400px',
        fontSize: '14px',
        fontFamily: 'monospace',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {PHASE_NAMES[currentPhase]}
        </div>
        <div style={{ color: '#ccc' }}>
          {PHASE_DESCRIPTIONS[currentPhase]}
        </div>
      </div>

      {/* Battle Scene Content */}
      {currentPhase === 'planning' && <PlanningPhaseStoryboard />}
      {currentPhase === 'execution' && <ExecutionPhaseStoryboard />}
      {currentPhase === 'victory' && <VictoryPhaseStoryboard />}
    </div>
  );
}

function PlanningPhaseStoryboard() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <BackgroundSprite
        id="/sprites/backgrounds/gs1/World_Map_Shore.gif"
        style={{
          position: 'absolute',
          width: '100%',
          height: 'calc(100% - 80px)',
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
        height: 'calc(100% - 80px)',
        bottom: '80px',
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
          {/* Isaac */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite
              id="isaac-lblade-front"
              width={64}
              height={64}
              imageRendering="pixelated"
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Isaac
            </div>
          </div>

          {/* Garet */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite
              id="garet-axe-front"
              width={64}
              height={64}
              imageRendering="pixelated"
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Garet
            </div>
          </div>

          {/* Ivan */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite
              id="ivan-staff-front"
              width={64}
              height={64}
              imageRendering="pixelated"
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Ivan
            </div>
          </div>

          {/* Mia */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite
              id="mia-staff-front"
              width={64}
              height={64}
              imageRendering="pixelated"
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Mia
            </div>
          </div>
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
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
              id="golem"
              width={96}
              height={96}
              imageRendering="pixelated"
              style={{ position: 'relative', zIndex: 1 }}
            />
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}>
              Stone Golem
            </div>
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
            <div style={{ position: 'relative' }}>
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
                id="winged-enemy"
                width={48}
                height={48}
                imageRendering="pixelated"
                style={{ position: 'relative', zIndex: 1 }}
              />
            </div>
            <div style={{ position: 'relative' }}>
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
                id="winged-enemy"
                width={48}
                height={48}
                imageRendering="pixelated"
                style={{ position: 'relative', zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* UI Panels */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 50,
        display: 'flex',
        gap: '20px',
      }}>
        {/* Action Queue Panel */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '12px',
          minWidth: '200px',
        }}>
          <div style={{ color: '#ffd700', fontSize: '16px', marginBottom: '8px', fontFamily: 'monospace' }}>
            ACTION QUEUE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[1, 2, 3, 4].map((slot) => (
              <div key={slot} style={{
                backgroundColor: slot <= 2 ? '#4CAF50' : '#333',
                border: '1px solid #666',
                padding: '8px',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}>
                Slot {slot}: {slot <= 2 ? 'Queued' : 'Empty'}
              </div>
            ))}
          </div>
        </div>

        {/* Mana Circles */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '12px',
          minWidth: '150px',
        }}>
          <div style={{ color: '#ffd700', fontSize: '16px', marginBottom: '8px', fontFamily: 'monospace' }}>
            MANA
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            {[1, 2, 3, 4].map((circle) => (
              <div key={circle} style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: circle <= 3 ? '#4169E1' : '#333',
                border: '2px solid #666',
              }} />
            ))}
          </div>
        </div>

        {/* Djinn Bar */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '12px',
          minWidth: '120px',
        }}>
          <div style={{ color: '#ffd700', fontSize: '16px', marginBottom: '8px', fontFamily: 'monospace' }}>
            DJINN
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3].map((djinn) => (
              <div key={djinn} style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#8B4513',
                border: '2px solid #666',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#fff',
              }}>
                D{djinn}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Battle Menu Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '80px',
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
              fontWeight: 'normal',
              flex: '1',
              textAlign: 'center',
              paddingTop: '20px',
              paddingBottom: '20px',
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
}

function ExecutionPhaseStoryboard() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <BackgroundSprite
        id="/sprites/backgrounds/gs1/World_Map_Shore.gif"
        style={{
          position: 'absolute',
          width: '100%',
          height: 'calc(100% - 80px)',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        sizeMode="cover"
      />

      {/* Battle Scene - Simpler layout during execution */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: 'calc(100% - 80px)',
        bottom: '80px',
        left: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingBottom: '8%',
        zIndex: 1,
      }}>
        {/* Player Party */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <SimpleSprite id="isaac-lblade-front" width={64} height={64} imageRendering="pixelated" />
          <SimpleSprite id="garet-axe-front" width={64} height={64} imageRendering="pixelated" />
          <SimpleSprite id="ivan-staff-front" width={64} height={64} imageRendering="pixelated" />
          <SimpleSprite id="mia-staff-front" width={64} height={64} imageRendering="pixelated" />
        </div>

        {/* Enemies */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <SimpleSprite id="golem" width={96} height={96} imageRendering="pixelated" />
        </div>
      </div>

      {/* Battle Log */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '20px',
        right: '20px',
        backgroundColor: 'rgba(0,0,0,0.9)',
        border: '2px solid #666',
        borderRadius: '8px',
        padding: '16px',
        maxHeight: '200px',
        zIndex: 40,
      }}>
        <div style={{ color: '#ffd700', fontSize: '16px', marginBottom: '8px', fontFamily: 'monospace' }}>
          BATTLE LOG
        </div>
        <div style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace', lineHeight: '1.4' }}>
          <div>• Isaac attacks Stone Golem for 45 damage!</div>
          <div>• Stone Golem counterattacks Isaac for 23 damage!</div>
          <div>• Garet uses Psynergy: Flare on Stone Golem for 67 damage!</div>
          <div>• Ivan casts Psynergy: Ply on Stone Golem!</div>
          <div style={{ color: '#ff6b6b' }}>• Stone Golem is defeated!</div>
        </div>
      </div>

      {/* Turn Order Indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.9)',
        border: '2px solid #666',
        borderRadius: '8px',
        padding: '12px',
        zIndex: 50,
      }}>
        <div style={{ color: '#ffd700', fontSize: '16px', marginBottom: '8px', textAlign: 'center', fontFamily: 'monospace' }}>
          TURN ORDER
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            width: '32px', height: '32px', backgroundColor: '#4CAF50',
            border: '2px solid #fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', color: '#fff'
          }}>I</div>
          <div style={{
            width: '32px', height: '32px', backgroundColor: '#666',
            border: '2px solid #999', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', color: '#fff'
          }}>G</div>
          <div style={{
            width: '32px', height: '32px', backgroundColor: '#666',
            border: '2px solid #999', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', color: '#fff'
          }}>V</div>
          <div style={{
            width: '32px', height: '32px', backgroundColor: '#666',
            border: '2px solid #999', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', color: '#fff'
          }}>M</div>
        </div>
      </div>

      {/* Unit Cards */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {/* Isaac Card */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          padding: '8px',
          minWidth: '150px',
        }}>
          <div style={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}>
            <div>Isaac</div>
            <div style={{ color: '#4CAF50' }}>HP: 145/180</div>
            <div style={{ color: '#4169E1' }}>PP: 45/60</div>
          </div>
        </div>

        {/* Golem Card */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          padding: '8px',
          minWidth: '150px',
        }}>
          <div style={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}>
            <div>Stone Golem</div>
            <div style={{ color: '#ff6b6b' }}>HP: 0/320</div>
            <div style={{ color: '#666' }}>DEFEATED</div>
          </div>
        </div>
      </div>

      {/* Battle Menu Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '80px',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        borderTop: 'none',
      }}>
        <div style={{
          color: '#ffd700',
          fontSize: '18px',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}>
          EXECUTING ACTIONS...
        </div>
      </div>
    </div>
  );
}

function VictoryPhaseStoryboard() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
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
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
      }}>
        {/* Victory Banner */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '4px solid #ffd700',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          <div style={{
            color: '#ffd700',
            fontSize: '48px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '16px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}>
            VICTORY!
          </div>
          <div style={{
            color: '#fff',
            fontSize: '20px',
            fontFamily: 'monospace',
          }}>
            Battle Completed Successfully
          </div>
        </div>

        {/* Party Members Celebration */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '40px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite id="isaac-lblade-front" width={80} height={80} imageRendering="pixelated" />
            <div style={{ color: '#fff', fontSize: '14px', marginTop: '8px', fontFamily: 'monospace' }}>Isaac</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite id="garet-axe-front" width={80} height={80} imageRendering="pixelated" />
            <div style={{ color: '#fff', fontSize: '14px', marginTop: '8px', fontFamily: 'monospace' }}>Garet</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite id="ivan-staff-front" width={80} height={80} imageRendering="pixelated" />
            <div style={{ color: '#fff', fontSize: '14px', marginTop: '8px', fontFamily: 'monospace' }}>Ivan</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SimpleSprite id="mia-staff-front" width={80} height={80} imageRendering="pixelated" />
            <div style={{ color: '#fff', fontSize: '14px', marginTop: '8px', fontFamily: 'monospace' }}>Mia</div>
          </div>
        </div>

        {/* Transition Message */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '16px 32px',
          textAlign: 'center',
        }}>
          <div style={{
            color: '#fff',
            fontSize: '16px',
            fontFamily: 'monospace',
            marginBottom: '8px',
          }}>
            Calculating rewards...
          </div>
          <div style={{
            color: '#ffd700',
            fontSize: '18px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            → Continue to Rewards Screen
          </div>
        </div>
      </div>
    </div>
  );
}