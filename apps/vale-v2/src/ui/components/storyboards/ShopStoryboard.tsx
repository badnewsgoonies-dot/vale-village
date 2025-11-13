/**
 * Shop Screen Storyboard
 * 
 * Shows equipment shop with shopkeeper NPC, equipment grid, and unlock system.
 */

import { SimpleSprite, getSpriteById, getSpritesByCategory } from '../../sprites';

export function ShopStoryboard() {
  // Find shopkeeper/NPC sprite
  const shopkeeperSprite = getSpritesByCategory('overworld-protagonists')[0] || getSpriteById('isaac-front');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      overflow: 'auto',
    }}>
      {/* Shop Screen */}
      <div style={{
        flex: 1,
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative',
      }}>
        {/* Shop Header */}
        <div style={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '32px',
            color: '#fff',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            Vale Village Shop
          </h1>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#666',
              color: '#fff',
              border: '2px solid #888',
              borderRadius: '4px',
              fontSize: '16px',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            × Close
          </button>
        </div>

        {/* Gold Display */}
        <div style={{
          width: '100%',
          maxWidth: '900px',
          padding: '12px 20px',
          backgroundColor: '#2a2a2a',
          border: '2px solid #666',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            color: '#aaa',
            fontSize: '14px',
          }}>
            Gold:
          </span>
          <span style={{
            color: '#FFD700',
            fontSize: '20px',
            fontWeight: 'bold',
          }}>
            1,250g
          </span>
        </div>

        {/* Shopkeeper */}
        {shopkeeperSprite && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '900px',
            padding: '1rem',
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '8px',
          }}>
            <div>
              <SimpleSprite
                id={shopkeeperSprite.path}
                width={80}
                height={80}
                imageRendering="pixelated"
              />
            </div>
            <div style={{
              flex: 1,
            }}>
              <div style={{
                color: '#4a9eff',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}>
                Shopkeeper
              </div>
              <div style={{
                color: '#ccc',
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                Welcome! Browse our selection of fine equipment. Unlock items to add them to your inventory.
              </div>
            </div>
          </div>
        )}

        {/* Equipment Grid */}
        <div style={{
          width: '100%',
          maxWidth: '900px',
        }}>
          <h2 style={{
            margin: '0 0 1rem 0',
            color: '#fff',
            fontSize: '20px',
            fontFamily: 'monospace',
          }}>
            Available Equipment
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { name: 'Iron Sword', cost: 150, stats: '+5 ATK' },
              { name: 'Steel Blade', cost: 300, stats: '+8 ATK' },
              { name: 'Leather Armor', cost: 120, stats: '+3 DEF' },
              { name: 'Chain Mail', cost: 250, stats: '+6 DEF' },
              { name: 'Iron Helm', cost: 100, stats: '+2 DEF' },
              { name: 'Power Ring', cost: 400, stats: '+3 ATK, +2 DEF' },
            ].map((item, i) => {
              const affordable = item.cost <= 1250;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: affordable ? '#2a2a2a' : '#1a1a1a',
                    border: `2px solid ${affordable ? '#666' : '#444'}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    opacity: affordable ? 1 : 0.6,
                  }}
                >
                  {/* Equipment Icon */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#333',
                    border: '2px solid #555',
                    borderRadius: '4px',
                    margin: '0 auto 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '32px',
                  }}>
                    ⚔️
                  </div>

                  {/* Item Name */}
                  <div style={{
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    textAlign: 'center',
                  }}>
                    {item.name}
                  </div>

                  {/* Stats */}
                  <div style={{
                    color: '#4a9eff',
                    fontSize: '12px',
                    marginBottom: '8px',
                    textAlign: 'center',
                  }}>
                    {item.stats}
                  </div>

                  {/* Price */}
                  <div style={{
                    color: '#FFD700',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    textAlign: 'center',
                  }}>
                    {item.cost}g
                  </div>

                  {/* Unlock Button */}
                  <button
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: affordable ? '#4a9eff' : '#444',
                      color: '#fff',
                      border: `2px solid ${affordable ? '#6bb6ff' : '#666'}`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      cursor: affordable ? 'pointer' : 'not-allowed',
                      opacity: affordable ? 1 : 0.5,
                    }}
                    disabled={!affordable}
                  >
                    Unlock Equipment
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Annotations */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        fontSize: '12px',
        color: '#aaa',
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#fff' }}>Layout Notes:</strong>
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Shopkeeper NPC sprite on left side with dialogue</li>
          <li>Gold display shows current player funds</li>
          <li>Equipment grid shows available items with icons</li>
          <li>Each item displays stats and cost</li>
          <li>Unlock button adds equipment to inventory (no selling)</li>
          <li>Unaffordable items are dimmed</li>
        </ul>
      </div>
    </div>
  );
}
