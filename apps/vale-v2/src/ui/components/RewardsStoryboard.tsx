/**
 * Rewards Storyboard Component
 * Shows post-battle rewards: XP, gold, equipment, level-ups
 */

import { useState } from 'react';
import { SimpleSprite } from '../sprites';
import { EquipmentIcon } from './EquipmentIcon';

type RewardsState = 'summary' | 'levelup' | 'equipment';

const STATE_NAMES: Record<RewardsState, string> = {
  summary: 'Rewards Summary',
  levelup: 'Level Up Details',
  equipment: 'Equipment Selection',
};

const STATE_DESCRIPTIONS: Record<RewardsState, string> = {
  summary: 'XP, gold, and equipment rewards overview',
  levelup: 'Character progression and stat gains',
  equipment: 'New equipment selection (boss battles)',
};

export function RewardsStoryboard() {
  const [currentState, setCurrentState] = useState<RewardsState>('summary');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a2e',
      imageRendering: 'pixelated',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
    }}>
      {/* State Selector */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        gap: '8px',
      }}>
        {(Object.keys(STATE_NAMES) as RewardsState[]).map((state) => (
          <button
            key={state}
            onClick={() => setCurrentState(state)}
            style={{
              padding: '8px 16px',
              backgroundColor: currentState === state ? '#ffd700' : 'rgba(0,0,0,0.8)',
              color: currentState === state ? '#000' : '#fff',
              border: currentState === state ? '2px solid #fff' : '2px solid #666',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}
          >
            {STATE_NAMES[state]}
          </button>
        ))}
      </div>

      {/* State Description */}
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
          {STATE_NAMES[currentState]}
        </div>
        <div style={{ color: '#ccc' }}>
          {STATE_DESCRIPTIONS[currentState]}
        </div>
      </div>

      {/* Victory Banner */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        marginTop: '60px',
      }}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '4px solid #ffd700',
          borderRadius: '16px',
          padding: '24px 48px',
          display: 'inline-block',
        }}>
          <div style={{
            color: '#ffd700',
            fontSize: '48px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}>
            VICTORY!
          </div>
          <div style={{
            color: '#fff',
            fontSize: '18px',
            fontFamily: 'monospace',
            marginTop: '8px',
          }}>
            Battle Completed Successfully
          </div>
        </div>
      </div>

      {/* Rewards Content */}
      {currentState === 'summary' && <RewardsSummaryStoryboard />}
      {currentState === 'levelup' && <LevelUpStoryboard />}
      {currentState === 'equipment' && <EquipmentSelectionStoryboard />}
    </div>
  );
}

function RewardsSummaryStoryboard() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '32px',
      width: '100%',
      maxWidth: '800px',
    }}>
      {/* XP and Gold Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        width: '100%',
      }}>
        {/* XP Gained */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '2px solid #4CAF50',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '48px',
            color: '#4CAF50',
            marginBottom: '8px',
          }}>
            ✦
          </div>
          <div style={{
            color: '#fff',
            fontSize: '20px',
            fontFamily: 'monospace',
            marginBottom: '8px',
          }}>
            Experience Points
          </div>
          <div style={{
            color: '#4CAF50',
            fontSize: '32px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            +850 XP
          </div>
          <div style={{
            color: '#ccc',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginTop: '8px',
          }}>
            Split among 4 survivors
          </div>
        </div>

        {/* Gold Gained */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '2px solid #ffd700',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '48px',
            color: '#ffd700',
            marginBottom: '8px',
          }}>
            ◉
          </div>
          <div style={{
            color: '#fff',
            fontSize: '20px',
            fontFamily: 'monospace',
            marginBottom: '8px',
          }}>
            Gold Coins
          </div>
          <div style={{
            color: '#ffd700',
            fontSize: '32px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            +125 G
          </div>
        </div>
      </div>

      {/* Items Obtained */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.9)',
        border: '2px solid #666',
        borderRadius: '12px',
        padding: '24px',
        width: '100%',
      }}>
        <div style={{
          color: '#ffd700',
          fontSize: '24px',
          fontFamily: 'monospace',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          ITEMS OBTAINED
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px',
        }}>
          {/* Equipment Items */}
          <div style={{
            backgroundColor: 'rgba(50,50,50,0.8)',
            border: '2px solid #cd7f32',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}>
            <EquipmentIcon
              equipment={{
                id: 'bronze-sword',
                name: 'Bronze Sword',
                slot: 'weapon',
                tier: 'bronze',
                statBonus: { attack: 15 },
              }}
              size="large"
            />
            <div style={{
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'monospace',
              textAlign: 'center',
            }}>
              Bronze Sword
            </div>
            <div style={{
              color: '#cd7f32',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}>
              +15 ATK
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(50,50,50,0.8)',
            border: '2px solid #cd7f32',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}>
            <EquipmentIcon
              equipment={{
                id: 'leather-armor',
                name: 'Leather Armor',
                slot: 'armor',
                tier: 'bronze',
                statBonus: { defense: 12 },
              }}
              size="large"
            />
            <div style={{
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'monospace',
              textAlign: 'center',
            }}>
              Leather Armor
            </div>
            <div style={{
              color: '#cd7f32',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}>
              +12 DEF
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(50,50,50,0.8)',
            border: '2px solid #9ca3af',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}>
            <EquipmentIcon
              equipment={{
                id: 'healing-potion',
                name: 'Healing Potion',
                slot: 'accessory',
                tier: 'basic',
                statBonus: {},
              }}
              size="large"
            />
            <div style={{
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'monospace',
              textAlign: 'center',
            }}>
              Healing Potion
            </div>
            <div style={{
              color: '#4CAF50',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}>
              Consumable
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div style={{
        marginTop: '32px',
      }}>
        <button style={{
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: '3px solid #666',
          borderRadius: '8px',
          padding: '16px 32px',
          fontSize: '18px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#45a049';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#4CAF50';
        }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

function LevelUpStoryboard() {
  const levelUps = [
    {
      unit: 'Isaac',
      oldLevel: 4,
      newLevel: 5,
      sprite: 'isaac-lblade-front',
      statGains: { hp: 8, pp: 3, attack: 2, defense: 1 },
      newAbilities: ['Ragnarok'],
    },
    {
      unit: 'Garet',
      oldLevel: 4,
      newLevel: 5,
      sprite: 'garet-axe-front',
      statGains: { hp: 10, pp: 2, attack: 3, defense: 1 },
      newAbilities: [],
    },
    {
      unit: 'Mia',
      oldLevel: 4,
      newLevel: 5,
      sprite: 'mia-staff-front',
      statGains: { hp: 6, pp: 5, attack: 1, defense: 1 },
      newAbilities: ['Wish'],
    },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      width: '100%',
      maxWidth: '900px',
    }}>
      <div style={{
        color: '#ffd700',
        fontSize: '32px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '16px',
      }}>
        LEVEL UP!
      </div>

      {levelUps.map((levelUp, index) => (
        <div key={levelUp.unit} style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '3px solid #ffd700',
          borderRadius: '16px',
          padding: '24px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          animationDelay: `${index * 0.2}s`,
        }}>
          {/* Character Sprite */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '120px',
          }}>
            <SimpleSprite
              id={levelUp.sprite}
              width={80}
              height={80}
              imageRendering="pixelated"
            />
            <div style={{
              color: '#fff',
              fontSize: '16px',
              fontFamily: 'monospace',
              marginTop: '8px',
            }}>
              {levelUp.unit}
            </div>
          </div>

          {/* Level Info */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
          }}>
            <div style={{
              color: '#ffd700',
              fontSize: '24px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              Level {levelUp.oldLevel} → Level {levelUp.newLevel}
            </div>

            {/* Stat Gains */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '8px',
            }}>
              {Object.entries(levelUp.statGains).map(([stat, gain]) => (
                <div key={stat} style={{
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  border: '1px solid #4CAF50',
                  borderRadius: '6px',
                  padding: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    color: '#4CAF50',
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                  }}>
                    +{gain}
                  </div>
                  <div style={{
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                  }}>
                    {stat}
                  </div>
                </div>
              ))}
            </div>

            {/* New Abilities */}
            {levelUp.newAbilities.length > 0 && (
              <div style={{
                marginTop: '12px',
              }}>
                <div style={{
                  color: '#fff',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  marginBottom: '8px',
                }}>
                  New Ability Unlocked:
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}>
                  {levelUp.newAbilities.map((ability) => (
                    <div key={ability} style={{
                      backgroundColor: 'rgba(255, 215, 0, 0.2)',
                      border: '1px solid #ffd700',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      color: '#ffd700',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                    }}>
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EquipmentSelectionStoryboard() {
  const equipmentChoices = [
    {
      id: 'steel-sword',
      name: 'Steel Sword',
      slot: 'weapon',
      tier: 'iron',
      statBonus: { attack: 25 },
      description: 'A finely crafted sword with excellent balance.',
    },
    {
      id: 'mythril-blade',
      name: 'Mythril Blade',
      slot: 'weapon',
      tier: 'mythril',
      statBonus: { attack: 35 },
      description: 'A legendary blade forged from rare mythril ore.',
    },
    {
      id: 'flame-sword',
      name: 'Flame Sword',
      slot: 'weapon',
      tier: 'legendary',
      statBonus: { attack: 45 },
      description: 'A sword imbued with the power of eternal flame.',
    },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '32px',
      width: '100%',
      maxWidth: '1000px',
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '16px',
      }}>
        <div style={{
          color: '#ffd700',
          fontSize: '28px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          marginBottom: '8px',
        }}>
          EQUIPMENT SELECTION
        </div>
        <div style={{
          color: '#ccc',
          fontSize: '16px',
          fontFamily: 'monospace',
        }}>
          Choose one piece of equipment from the defeated boss
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        width: '100%',
      }}>
        {equipmentChoices.map((equipment) => (
          <div key={equipment.id} style={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            border: '3px solid #666',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ffd700';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#666';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          >
            {/* Equipment Icon */}
            <EquipmentIcon
              equipment={equipment}
              size="large"
            />

            {/* Equipment Name */}
            <div style={{
              color: '#fff',
              fontSize: '20px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              {equipment.name}
            </div>

            {/* Stats */}
            <div style={{
              color: '#4CAF50',
              fontSize: '16px',
              fontFamily: 'monospace',
            }}>
              +{Object.values(equipment.statBonus)[0]} {Object.keys(equipment.statBonus)[0].toUpperCase()}
            </div>

            {/* Description */}
            <div style={{
              color: '#ccc',
              fontSize: '14px',
              fontFamily: 'monospace',
              textAlign: 'center',
              lineHeight: '1.4',
            }}>
              {equipment.description}
            </div>

            {/* Select Button */}
            <button style={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: '2px solid #666',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              marginTop: '8px',
            }}>
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}