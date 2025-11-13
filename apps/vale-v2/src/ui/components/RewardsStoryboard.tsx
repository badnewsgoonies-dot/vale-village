/**
 * Rewards Storyboard Component
 * Mockup for post-battle rewards screen with XP, gold, equipment, and level-ups
 */

import { SimpleSprite, getSpriteById, getSpritesByCategory } from '../sprites';

export function RewardsStoryboard() {
  // Get party sprites
  const isaacSprite = getSpriteById('isaac-battle-idle') || getSpritesByCategory('battle-party').find(s => s.name.toLowerCase().includes('isaac'));
  const garetSprite = getSpriteById('garet-battle-idle') || getSpritesByCategory('battle-party').find(s => s.name.toLowerCase().includes('garet'));
  const ivanSprite = getSpriteById('ivan-battle-idle') || getSpritesByCategory('battle-party').find(s => s.name.toLowerCase().includes('ivan'));
  const miaSprite = getSpriteById('mia-battle-idle') || getSpritesByCategory('battle-party').find(s => s.name.toLowerCase().includes('mia'));

  // Mock rewards data
  const mockRewardsData = {
    totalXp: 2850,
    goldEarned: 450,
    equipmentDrops: [
      { id: 'long-sword', name: 'Long Sword', type: 'weapon', stats: '+15 ATK' },
      { id: 'leather-armor', name: 'Leather Armor', type: 'armor', stats: '+8 DEF' },
    ],
    levelUps: [
      {
        unitId: 'isaac',
        unitName: 'Isaac',
        oldLevel: 4,
        newLevel: 5,
        xpGained: 950,
        statGains: { hp: 12, pp: 5, attack: 3, defense: 2 },
        newAbilities: ['Ragnarok Blast'],
      },
      {
        unitId: 'garet',
        unitName: 'Garet',
        oldLevel: 3,
        newLevel: 4,
        xpGained: 950,
        statGains: { hp: 15, pp: 3, attack: 4, defense: 3 },
        newAbilities: [],
      },
    ],
    survivorCount: 4,
  };

  const partySprites = [
    { sprite: isaacSprite, name: 'Isaac', levelUp: true },
    { sprite: garetSprite, name: 'Garet', levelUp: true },
    { sprite: ivanSprite, name: 'Ivan', levelUp: false },
    { sprite: miaSprite, name: 'Mia', levelUp: false },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontFamily: 'monospace',
      overflow: 'auto',
    }}>
      {/* Victory Banner */}
      <div style={{
        width: '100%',
        height: '120px',
        backgroundColor: '#2c3e50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '4px solid #FFD700',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#FFD700',
          textAlign: 'center',
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          animation: 'victory-pulse 2s infinite',
        }}>
          VICTORY!
        </h1>
      </div>

      {/* Main Content Container */}
      <div style={{
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* XP and Gold Rewards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '40px',
        }}>
          {/* Experience Points */}
          <div style={{
            backgroundColor: '#34495e',
            border: '3px solid #3498db',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '64px',
              color: '#3498db',
              marginBottom: '10px',
            }}>
              ✦
            </div>
            <h2 style={{
              color: '#3498db',
              margin: '0 0 15px 0',
              fontSize: '24px',
            }}>
              Experience Gained
            </h2>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#FFD700',
              marginBottom: '10px',
            }}>
              +{mockRewardsData.totalXp.toLocaleString()} XP
            </div>
            <div style={{
              color: '#bdc3c7',
              fontSize: '14px',
            }}>
              Split among {mockRewardsData.survivorCount} survivors
            </div>
          </div>

          {/* Gold Earned */}
          <div style={{
            backgroundColor: '#34495e',
            border: '3px solid #f1c40f',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '64px',
              color: '#f1c40f',
              marginBottom: '10px',
            }}>
              ◉
            </div>
            <h2 style={{
              color: '#f1c40f',
              margin: '0 0 15px 0',
              fontSize: '24px',
            }}>
              Gold Earned
            </h2>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#FFD700',
              marginBottom: '10px',
            }}>
              +{mockRewardsData.goldEarned.toLocaleString()} G
            </div>
            <div style={{
              color: '#bdc3c7',
              fontSize: '14px',
            }}>
              Added to party funds
            </div>
          </div>
        </div>

        {/* Equipment Drops */}
        {mockRewardsData.equipmentDrops.length > 0 && (
          <section style={{
            marginBottom: '40px',
            backgroundColor: '#2c3e50',
            borderRadius: '12px',
            padding: '30px',
            border: '3px solid #e74c3c',
          }}>
            <h2 style={{
              color: '#e74c3c',
              margin: '0 0 20px 0',
              fontSize: '28px',
              textAlign: 'center',
            }}>
              ITEMS OBTAINED
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}>
              {mockRewardsData.equipmentDrops.map((item) => (
                <div key={item.id} style={{
                  backgroundColor: '#34495e',
                  border: '2px solid #7f8c8d',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  {/* Equipment Icon Placeholder */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#7f8c8d',
                    border: '2px solid #95a5a6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                  }}>
                    {item.type === 'weapon' ? '⚔️' : '🛡️'}
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#ecf0f1',
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    color: '#f39c12',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}>
                    {item.stats}
                  </div>
                  <div style={{
                    color: '#bdc3c7',
                    fontSize: '12px',
                  }}>
                    x1
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Level Up Celebrations */}
        {mockRewardsData.levelUps.length > 0 && (
          <section style={{
            backgroundColor: '#2c3e50',
            borderRadius: '12px',
            padding: '30px',
            border: '3px solid #FFD700',
            animation: 'level-up-celebration 1s ease-out',
          }}>
            <h2 style={{
              color: '#FFD700',
              margin: '0 0 30px 0',
              fontSize: '32px',
              textAlign: 'center',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            }}>
              🎉 LEVEL UP! 🎉
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
            }}>
              {mockRewardsData.levelUps.map((levelUp, index) => {
                const sprite = partySprites.find(p => p.name === levelUp.unitName)?.sprite;

                return (
                  <div key={levelUp.unitId} style={{
                    backgroundColor: '#34495e',
                    border: '3px solid #FFD700',
                    borderRadius: '12px',
                    padding: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    animation: `level-up-bounce 0.8s ease-out ${index * 0.2}s`,
                  }}>
                    {/* Character Sprite */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '80px',
                    }}>
                      {sprite && (
                        <SimpleSprite
                          id={sprite.path}
                          width={64}
                          height={64}
                          imageRendering="pixelated"
                        />
                      )}
                      <div style={{
                        color: '#FFD700',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginTop: '5px',
                      }}>
                        {levelUp.unitName}
                      </div>
                    </div>

                    {/* Level Up Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#FFD700',
                        marginBottom: '10px',
                      }}>
                        Level {levelUp.oldLevel} → Level {levelUp.newLevel}
                      </div>

                      {/* Stat Gains */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '8px',
                        marginBottom: '15px',
                      }}>
                        {Object.entries(levelUp.statGains).map(([stat, value]) => (
                          <div key={stat} style={{
                            backgroundColor: '#7f8c8d',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            textAlign: 'center',
                          }}>
                            +{value} {stat.toUpperCase()}
                          </div>
                        ))}
                      </div>

                      {/* New Abilities */}
                      {levelUp.newAbilities.length > 0 && (
                        <div>
                          <div style={{
                            color: '#e74c3c',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '5px',
                          }}>
                            New Ability Learned:
                          </div>
                          {levelUp.newAbilities.map((ability) => (
                            <div key={ability} style={{
                              color: '#FFD700',
                              fontSize: '16px',
                              fontWeight: 'bold',
                            }}>
                              {ability}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Continue Button */}
        <div style={{
          textAlign: 'center',
          marginTop: '50px',
        }}>
          <button style={{
            backgroundColor: '#27ae60',
            color: '#fff',
            border: '3px solid #2ecc71',
            borderRadius: '12px',
            padding: '20px 40px',
            fontSize: '24px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2ecc71';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#27ae60';
            e.currentTarget.style.transform = 'scale(1)';
          }}>
            Continue Adventure
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes victory-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes level-up-celebration {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes level-up-bounce {
          0% { opacity: 0; transform: translateY(30px) scale(0.8); }
          50% { opacity: 1; transform: translateY(-10px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}