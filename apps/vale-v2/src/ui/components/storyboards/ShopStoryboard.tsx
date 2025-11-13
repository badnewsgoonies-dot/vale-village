/**
 * Shop Screen Storyboard
 * 
 * Mockup for equipment shop:
 * - Shopkeeper NPC sprite
 * - Equipment grid (weapons, armor, accessories)
 * - Equipment icons with stat bonuses
 * - Gold display
 * - Unlock equipment button
 */

import { SimpleSprite, getSpriteById, searchSprites } from '../../sprites';

export function ShopStoryboard() {
  // Find shopkeeper sprite
  const shopkeeperSprite = searchSprites('shopkeeper')[0] || 
                          searchSprites('merchant')[0] || 
                          searchSprites('npc')[0];

  // Mock equipment items
  const equipmentItems = [
    { name: 'Iron Sword', slot: 'weapon', cost: 150, icon: '⚔️', stats: '+15 ATK' },
    { name: 'Steel Blade', slot: 'weapon', cost: 300, icon: '⚔️', stats: '+25 ATK' },
    { name: 'Leather Armor', slot: 'armor', cost: 120, icon: '🛡️', stats: '+10 DEF' },
    { name: 'Chain Mail', slot: 'armor', cost: 250, icon: '🛡️', stats: '+20 DEF' },
    { name: 'Iron Helm', slot: 'helm', cost: 100, icon: '⛑️', stats: '+8 DEF' },
    { name: 'Leather Boots', slot: 'boots', cost: 80, icon: '👢', stats: '+5 SPD' },
    { name: 'Power Ring', slot: 'accessory', cost: 200, icon: '💍', stats: '+10 ATK' },
    { name: 'Defense Amulet', slot: 'accessory', cost: 180, icon: '💍', stats: '+15 DEF' },
  ];

  const playerGold = 450;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      overflow: 'auto',
    }}>
      {/* Shop Container */}
      <div style={{
        flex: 1,
        padding: '2rem',
        display: 'flex',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Left Side - Shopkeeper */}
        <div style={{
          width: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}>
          {shopkeeperSprite && (
            <SimpleSprite
              id={shopkeeperSprite.path}
              width={128}
              height={128}
              imageRendering="pixelated"
            />
          )}
          <div style={{
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
            width: '100%',
          }}>
            <div style={{
              fontSize: '16px',
              color: '#fff',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}>
              Vale Shop
            </div>
            <div style={{
              fontSize: '12px',
              color: '#aaa',
              fontFamily: 'monospace',
            }}>
              Equipment Merchant
            </div>
          </div>
        </div>

        {/* Right Side - Equipment Grid */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1rem',
            borderBottom: '2px solid #444',
          }}>
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              color: '#fff',
              fontFamily: 'monospace',
            }}>
              Equipment Shop
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#2a2a2a',
              border: '2px solid #666',
              borderRadius: '4px',
              padding: '8px 16px',
            }}>
              <span style={{
                fontSize: '14px',
                color: '#aaa',
                fontFamily: 'monospace',
              }}>
                Gold:
              </span>
              <span style={{
                fontSize: '18px',
                color: '#FFD700',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}>
                {playerGold}g
              </span>
            </div>
          </div>

          {/* Equipment Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
          }}>
            {equipmentItems.map((item) => {
              const canAfford = playerGold >= item.cost;
              return (
                <div
                  key={item.name}
                  style={{
                    backgroundColor: canAfford ? '#2a2a2a' : '#1a1a1a',
                    border: `2px solid ${canAfford ? '#666' : '#444'}`,
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: canAfford ? 1 : 0.6,
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (canAfford) {
                      e.currentTarget.style.borderColor = '#4CAF50';
                      e.currentTarget.style.backgroundColor = '#333';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canAfford) {
                      e.currentTarget.style.borderColor = '#666';
                      e.currentTarget.style.backgroundColor = '#2a2a2a';
                    }
                  }}
                >
                  {/* Equipment Icon */}
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '4px',
                  }}>
                    {item.icon}
                  </div>

                  {/* Equipment Name */}
                  <div style={{
                    fontSize: '14px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                    {item.name}
                  </div>

                  {/* Slot Type */}
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                  }}>
                    {item.slot}
                  </div>

                  {/* Stats */}
                  <div style={{
                    fontSize: '12px',
                    color: '#4CAF50',
                    fontFamily: 'monospace',
                    textAlign: 'center',
                  }}>
                    {item.stats}
                  </div>

                  {/* Cost */}
                  <div style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid #444',
                    width: '100%',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: '16px',
                      color: canAfford ? '#FFD700' : '#666',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                    }}>
                      {item.cost}g
                    </div>
                  </div>

                  {/* Unlock Button */}
                  {canAfford && (
                    <button
                      style={{
                        width: '100%',
                        padding: '6px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        marginTop: '4px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#66BB6A';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#4CAF50';
                      }}
                    >
                      Unlock
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div style={{
        padding: '1rem 2rem',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <button
          style={{
            padding: '10px 24px',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#777';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#666';
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
