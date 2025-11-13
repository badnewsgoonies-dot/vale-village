/**
 * Rewards Screen Storyboard
 * Shows post-battle rewards: XP, gold, equipment, level-ups
 */

import { useState } from 'react';
import { SimpleSprite, getSpriteById, getSpritesByCategory } from '../../sprites';
import { EquipmentIcon } from '../EquipmentIcon';
import { EQUIPMENT } from '../../../data/definitions/equipment';

export function RewardsStoryboard() {
  const [showChoice, setShowChoice] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  // Find party sprites for level-up display
  const partySprites = [
    getSpriteById('isaac-front') || getSpritesByCategory('battle-party')[0],
    getSpriteById('garet-front') || getSpritesByCategory('battle-party')[1],
    getSpriteById('ivan-front') || getSpritesByCategory('battle-party')[2],
    getSpriteById('mia-front') || getSpritesByCategory('battle-party')[3],
  ];

  // Equipment for choice picker
  const choiceOptions = ['steel-sword', 'steel-armor', 'steel-helm']
    .map(id => EQUIPMENT[id])
    .filter((eq): eq is NonNullable<typeof eq> => eq !== undefined);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a1a',
      overflow: 'auto',
      padding: '2rem',
    }}>
      {/* Controls */}
      <div style={{
        marginBottom: '1rem',
        display: 'flex',
        gap: '0.5rem',
      }}>
        <button
          onClick={() => setShowChoice(!showChoice)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showChoice ? '#4CAF50' : '#3a3a3a',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showChoice ? 'Hide' : 'Show'} Equipment Choice
        </button>
      </div>

      {/* Victory Banner */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#FFD700',
          textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
          margin: 0,
        }}>
          VICTORY!
        </h1>
      </div>

      {/* Rewards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* XP Card */}
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          padding: '1.5rem',
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '0.5rem',
          }}>
            ✦
          </div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#4CAF50',
            marginBottom: '0.5rem',
          }}>
            Experience
          </div>
          <div style={{
            fontSize: '1.5rem',
            color: '#fff',
            marginBottom: '1rem',
          }}>
            +300 XP
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#999',
          }}>
            Split among 4 survivors
          </div>
        </div>

        {/* Gold Card */}
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #FFD700',
          borderRadius: '8px',
          padding: '1.5rem',
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '0.5rem',
          }}>
            ◉
          </div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#FFD700',
            marginBottom: '0.5rem',
          }}>
            Gold
          </div>
          <div style={{
            fontSize: '1.5rem',
            color: '#fff',
          }}>
            +150 G
          </div>
        </div>
      </div>

      {/* Equipment Choice Picker */}
      {showChoice && (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '2rem',
          borderRadius: '8px',
          border: '2px solid #FFD700',
          marginBottom: '2rem',
        }}>
          <h3 style={{
            color: '#FFD700',
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
          }}>
            🏆 Choose Your Reward! 🏆
          </h3>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {choiceOptions.map((equipment) => (
              <button
                key={equipment.id}
                onClick={() => setSelectedEquipment(equipment.id)}
                style={{
                  padding: '1rem',
                  backgroundColor: selectedEquipment === equipment.id ? '#3c3c3c' : '#2c2c2c',
                  border: `2px solid ${selectedEquipment === equipment.id ? '#FFA500' : '#FFD700'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '200px',
                  maxWidth: '250px',
                }}
                onMouseEnter={(e) => {
                  if (selectedEquipment !== equipment.id) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor = '#3c3c3c';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedEquipment !== equipment.id) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#2c2c2c';
                  }
                }}
              >
                <EquipmentIcon equipment={equipment} size="medium" />
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    color: '#FFD700',
                  }}>
                    {equipment.name}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#ccc',
                    marginTop: '0.25rem',
                  }}>
                    {equipment.slot.toUpperCase()}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: '#999',
          }}>
            Click to select your reward
          </p>
        </div>
      )}

      {/* Equipment Obtained */}
      {selectedEquipment && EQUIPMENT[selectedEquipment] && (
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h3 style={{
            color: '#4CAF50',
            marginBottom: '1rem',
          }}>
            EQUIPMENT OBTAINED
          </h3>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}>
            <EquipmentIcon equipment={EQUIPMENT[selectedEquipment]!} size="medium" />
            <div>
              <div style={{
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: '#fff',
              }}>
                {EQUIPMENT[selectedEquipment]!.name}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#999',
              }}>
                x1
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Panel */}
      <div style={{
        backgroundColor: '#2a2a2a',
        border: '2px solid #9370DB',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <h2 style={{
          color: '#9370DB',
          marginBottom: '1rem',
        }}>
          LEVEL UP!
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {partySprites.slice(0, 2).map((sprite, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: '#1a1a1a',
              borderRadius: '4px',
            }}>
              <SimpleSprite
                id={sprite?.path || '/sprites/battle/party/isaac/Isaac_lBlade_Front.gif'}
                width={64}
                height={64}
                imageRendering="pixelated"
              />
              <div style={{
                marginTop: '0.5rem',
                color: '#9370DB',
                fontWeight: 'bold',
              }}>
                Unit {idx + 1}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#fff',
                marginTop: '0.25rem',
              }}>
                Lv 5 → Lv 6
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#999',
                marginTop: '0.5rem',
              }}>
                +12 HP, +3 ATK, +2 DEF
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div style={{
        textAlign: 'center',
      }}>
        <button
          disabled={showChoice && !selectedEquipment}
          style={{
            padding: '1rem 3rem',
            backgroundColor: showChoice && !selectedEquipment ? '#555' : '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: showChoice && !selectedEquipment ? 'not-allowed' : 'pointer',
            opacity: showChoice && !selectedEquipment ? 0.5 : 1,
          }}
        >
          {showChoice && !selectedEquipment ? 'SELECT EQUIPMENT FIRST' : 'CONTINUE'}
        </button>
      </div>
    </div>
  );
}

