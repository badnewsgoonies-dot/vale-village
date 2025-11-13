/**
 * Rewards Storyboard Component
 * Mockup for post-battle rewards screen
 */

import { useState } from 'react';
import { SimpleSprite, searchSprites, getSpritesByCategory } from '../../sprites';

type RewardsPhase = 'xp-distribution' | 'level-ups' | 'equipment-choice' | 'summary';

const PHASES: { value: RewardsPhase; label: string; description: string }[] = [
  {
    value: 'xp-distribution',
    label: 'XP Distribution',
    description: 'Experience points awarded to party'
  },
  {
    value: 'level-ups',
    label: 'Level Up!',
    description: 'Characters gain levels and stats'
  },
  {
    value: 'equipment-choice',
    label: 'Equipment Choice',
    description: 'Choose from boss battle rewards'
  },
  {
    value: 'summary',
    label: 'Battle Summary',
    description: 'Final rewards and continue'
  }
];

export function RewardsStoryboard() {
  const [currentPhase, setCurrentPhase] = useState<RewardsPhase>('xp-distribution');

  // Find sprites for rewards display
  const isaacSprite = searchSprites('isaac')[0] || getSpritesByCategory('battle-party')[0];
  const garetSprite = searchSprites('garet')[0] || getSpritesByCategory('battle-party')[1];
  const ivanSprite = searchSprites('ivan')[0] || getSpritesByCategory('battle-party')[2];
  const miaSprite = searchSprites('mia')[0] || getSpritesByCategory('battle-party')[3];

  const equipmentSprites = getSpritesByCategory('icons-items').slice(0, 6);

  const renderXpDistribution = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
    }}>
      {/* Victory Banner */}
      <div style={{
        backgroundColor: '#FFD700',
        color: '#000',
        padding: '16px 32px',
        borderRadius: '8px',
        fontSize: '28px',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '40px',
        border: '4px solid #FFA000',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
      }}>
        VICTORY!
      </div>

      {/* XP Distribution Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        maxWidth: '800px',
        width: '100%',
        marginBottom: '40px',
      }}>
        {/* Isaac */}
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <SimpleSprite
            id={isaacSprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
            width={48}
            height={48}
            imageRendering="pixelated"
          />
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#FFD700',
              fontSize: '18px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}>
              Isaac
            </div>
            <div style={{
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'monospace',
              marginBottom: '4px',
            }}>
              Level 5 → 6
            </div>
            <div style={{
              backgroundColor: '#333',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '8px',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#4CAF50',
                borderRadius: '4px',
              }} />
            </div>
            <div style={{
              color: '#FFD700',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              +245 XP
            </div>
          </div>
        </div>

        {/* Garet */}
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <SimpleSprite
            id={garetSprite?.path || '/sprites/battle/party/garet/Garet_Axe_Front.gif'}
            width={48}
            height={48}
            imageRendering="pixelated"
          />
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#FFD700',
              fontSize: '18px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}>
              Garet
            </div>
            <div style={{
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'monospace',
              marginBottom: '4px',
            }}>
              Level 4 → 4
            </div>
            <div style={{
              backgroundColor: '#333',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '8px',
            }}>
              <div style={{
                width: '75%',
                height: '100%',
                backgroundColor: '#4CAF50',
                borderRadius: '4px',
              }} />
            </div>
            <div style={{
              color: '#FFD700',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              +189 XP
            </div>
          </div>
        </div>

        {/* Ivan */}
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <SimpleSprite
            id={ivanSprite?.path || '/sprites/battle/party/ivan/Ivan_Staff_Front.gif'}
            width={48}
            height={48}
            imageRendering="pixelated"
          />
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#FFD700',
              fontSize: '18px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}>
              Ivan
            </div>
            <div style={{
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'monospace',
              marginBottom: '4px',
            }}>
              Level 5 → 5
            </div>
            <div style={{
              backgroundColor: '#333',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '8px',
            }}>
              <div style={{
                width: '60%',
                height: '100%',
                backgroundColor: '#4CAF50',
                borderRadius: '4px',
              }} />
            </div>
            <div style={{
              color: '#FFD700',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              +201 XP
            </div>
          </div>
        </div>

        {/* Mia */}
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <SimpleSprite
            id={miaSprite?.path || '/sprites/battle/party/mia/Mia_Staff_Front.gif'}
            width={48}
            height={48}
            imageRendering="pixelated"
          />
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#FFD700',
              fontSize: '18px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}>
              Mia
            </div>
            <div style={{
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'monospace',
              marginBottom: '4px',
            }}>
              Level 4 → 4
            </div>
            <div style={{
              backgroundColor: '#333',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '8px',
            }}>
              <div style={{
                width: '85%',
                height: '100%',
                backgroundColor: '#4CAF50',
                borderRadius: '4px',
              }} />
            </div>
            <div style={{
              color: '#FFD700',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              +167 XP
            </div>
          </div>
        </div>
      </div>

      {/* Total XP and Gold */}
      <div style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        gap: '40px',
        marginBottom: '40px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: '#FFD700',
            fontSize: '18px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}>
            Total XP Gained
          </div>
          <div style={{
            color: '#4CAF50',
            fontSize: '24px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            802
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: '#FFD700',
            fontSize: '18px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}>
            Gold Earned
          </div>
          <div style={{
            color: '#FFD700',
            fontSize: '24px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            125
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button style={{
        padding: '12px 24px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontFamily: 'monospace',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}>
        Continue →
      </button>
    </div>
  );

  const renderLevelUps = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
    }}>
      {/* Level Up Banner */}
      <div style={{
        backgroundColor: '#FFD700',
        color: '#000',
        padding: '16px 32px',
        borderRadius: '8px',
        fontSize: '28px',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '40px',
        border: '4px solid #FFA000',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
      }}>
        LEVEL UP!
      </div>

      {/* Isaac Level Up Card */}
      <div style={{
        backgroundColor: '#2a2a2a',
        border: '3px solid #FFD700',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        marginBottom: '40px',
      }}>
        {/* Character Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px',
        }}>
          <SimpleSprite
            id={isaacSprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
            width={64}
            height={64}
            imageRendering="pixelated"
          />
          <div>
            <div style={{
              color: '#FFD700',
              fontSize: '24px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              Isaac
            </div>
            <div style={{
              color: '#fff',
              fontSize: '18px',
              fontFamily: 'monospace',
            }}>
              Level 5 → 6
            </div>
          </div>
        </div>

        {/* Stat Gains */}
        <div style={{
          backgroundColor: '#333',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{
            color: '#FFD700',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '12px',
          }}>
            Stat Increases:
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}>
            {[
              { stat: 'HP', gain: '+15', old: '120', new: '135' },
              { stat: 'PP', gain: '+8', old: '45', new: '53' },
              { stat: 'Attack', gain: '+3', old: '18', new: '21' },
              { stat: 'Defense', gain: '+2', old: '12', new: '14' },
              { stat: 'Agility', gain: '+4', old: '10', new: '14' },
              { stat: 'Luck', gain: '+1', old: '8', new: '9' },
            ].map(({ stat, gain, old, new: newVal }) => (
              <div key={stat} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 8px',
                backgroundColor: '#444',
                borderRadius: '4px',
              }}>
                <span style={{ color: '#fff', fontFamily: 'monospace' }}>
                  {stat}:
                </span>
                <span style={{ color: '#4CAF50', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {old} → {newVal} ({gain})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* New Ability */}
        <div style={{
          backgroundColor: '#4CAF50',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{
            color: '#fff',
            fontSize: '18px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}>
            New Ability Unlocked!
          </div>
          <div style={{
            color: '#FFD700',
            fontSize: '20px',
            fontFamily: 'serif',
            fontWeight: 'bold',
          }}>
            "Flare" - Fire Psynergy
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button style={{
        padding: '12px 24px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontFamily: 'monospace',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}>
        Continue →
      </button>
    </div>
  );

  const renderEquipmentChoice = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
    }}>
      {/* Equipment Choice Banner */}
      <div style={{
        backgroundColor: '#FFD700',
        color: '#000',
        padding: '16px 32px',
        borderRadius: '8px',
        fontSize: '24px',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px',
        border: '4px solid #FFA000',
      }}>
        Choose Your Reward!
      </div>

      <div style={{
        color: '#fff',
        fontSize: '16px',
        fontFamily: 'monospace',
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        Defeating the boss grants you a choice of equipment. Select one:
      </div>

      {/* Equipment Choice Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        maxWidth: '800px',
        width: '100%',
        marginBottom: '40px',
      }}>
        {/* Equipment Option 1 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #FFD700',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#FFA000';
          e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#FFD700';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <SimpleSprite
            id={equipmentSprites[0]?.path || '/sprites/icons/sword.gif'}
            width={48}
            height={48}
            imageRendering="pixelated"
            style={{ marginBottom: '12px' }}
          />
          <div style={{
            color: '#FFD700',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            Silver Sword
          </div>
          <div style={{
            color: '#fff',
            fontSize: '12px',
            fontFamily: 'monospace',
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            Weapon
          </div>
          <div style={{
            color: '#4CAF50',
            fontSize: '14px',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}>
            +15 Attack
          </div>
        </div>

        {/* Equipment Option 2 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #FFD700',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#FFA000';
          e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#FFD700';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <SimpleSprite
            id={equipmentSprites[1]?.path || '/sprites/icons/shield.gif'}
            width={48}
            height={48}
            imageRendering="pixelated"
            style={{ marginBottom: '12px' }}
          />
          <div style={{
            color: '#FFD700',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            Iron Shield
          </div>
          <div style={{
            color: '#fff',
            fontSize: '12px',
            fontFamily: 'monospace',
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            Armor
          </div>
          <div style={{
            color: '#4CAF50',
            fontSize: '14px',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}>
            +12 Defense
          </div>
        </div>

        {/* Equipment Option 3 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #FFD700',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#FFA000';
          e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#FFD700';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <SimpleSprite
            id={equipmentSprites[2]?.path || '/sprites/icons/ring.gif'}
            width={48}
            height={48}
            imageRendering="pixelated"
            style={{ marginBottom: '12px' }}
          />
          <div style={{
            color: '#FFD700',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            Power Ring
          </div>
          <div style={{
            color: '#fff',
            fontSize: '12px',
            fontFamily: 'monospace',
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            Accessory
          </div>
          <div style={{
            color: '#4CAF50',
            fontSize: '14px',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}>
            +8 Attack<br/>+5 Luck
          </div>
        </div>
      </div>

      {/* Selection Hint */}
      <div style={{
        color: '#ccc',
        fontSize: '14px',
        fontFamily: 'monospace',
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        Click on an equipment piece to select it, or press the corresponding number key (1-3)
      </div>

      {/* Confirm Button */}
      <button style={{
        padding: '12px 24px',
        backgroundColor: '#666',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontFamily: 'monospace',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}>
        Confirm Selection
      </button>
    </div>
  );

  const renderSummary = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      {/* Battle Summary Card */}
      <div style={{
        backgroundColor: '#2a2a2a',
        border: '2px solid #FFD700',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Victory Icon */}
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
        }}>
          🏆
        </div>

        {/* Summary Title */}
        <div style={{
          color: '#FFD700',
          fontSize: '24px',
          fontFamily: 'serif',
          fontWeight: 'bold',
          marginBottom: '24px',
        }}>
          Battle Complete!
        </div>

        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '24px',
        }}>
          <div style={{
            backgroundColor: '#333',
            padding: '16px',
            borderRadius: '8px',
          }}>
            <div style={{
              color: '#4CAF50',
              fontSize: '18px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '4px',
            }}>
              802 XP
            </div>
            <div style={{
              color: '#fff',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}>
              Experience Gained
            </div>
          </div>

          <div style={{
            backgroundColor: '#333',
            padding: '16px',
            borderRadius: '8px',
          }}>
            <div style={{
              color: '#FFD700',
              fontSize: '18px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '4px',
            }}>
              125 Gold
            </div>
            <div style={{
              color: '#fff',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}>
              Coins Earned
            </div>
          </div>
        </div>

        {/* Equipment Reward */}
        <div style={{
          backgroundColor: '#4CAF50',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}>
          <div style={{
            color: '#fff',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}>
            Equipment Acquired:
          </div>
          <div style={{
            color: '#FFD700',
            fontSize: '18px',
            fontFamily: 'serif',
            fontWeight: 'bold',
          }}>
            Silver Sword
          </div>
        </div>

        {/* Continue Button */}
        <button style={{
          padding: '16px 32px',
          backgroundColor: '#FFD700',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}>
          Return to Overworld
        </button>
      </div>
    </div>
  );

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'xp-distribution':
        return renderXpDistribution();
      case 'level-ups':
        return renderLevelUps();
      case 'equipment-choice':
        return renderEquipmentChoice();
      case 'summary':
        return renderSummary();
      default:
        return renderXpDistribution();
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
              backgroundColor: currentPhase === phase.value ? '#FFD700' : '#333',
              color: currentPhase === phase.value ? '#000' : '#fff',
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
        bottom: '20px',
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
          • Progressive reward revelation
          • XP distribution and level-ups
          • Equipment choice for boss battles
          • Summary with total gains
        </div>
      </div>
    </div>
  );
}