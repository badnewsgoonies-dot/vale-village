/**
 * Shop Screen Storyboard
 * Shows equipment shop with unlock system
 */

import { SimpleSprite, getSpritesByCategory } from '../../sprites';
import { EquipmentIcon } from '../EquipmentIcon';
import { EQUIPMENT } from '../../../data/definitions/equipment';

export function ShopStoryboard() {
  // Find shopkeeper NPC sprite
  const shopkeeperSprite = getSpritesByCategory('overworld-majornpcs')[0];

  // Get sample equipment for display
  const sampleEquipment = Object.values(EQUIPMENT).slice(0, 9);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Shop Header */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '2px solid #FFD700',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{
          margin: 0,
          color: '#FFD700',
          fontSize: '2rem',
        }}>
          Equipment Shop
        </h1>
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '1.2rem',
            color: '#FFD700',
          }}>
            ◉ Gold: 500
          </div>
          <button style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}>
            Close
          </button>
        </div>
      </div>

      {/* Shop Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* Shopkeeper Panel (Left) */}
        <div style={{
          width: '300px',
          backgroundColor: '#2a2a2a',
          borderRight: '2px solid #444',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id={shopkeeperSprite?.path || '/sprites/overworld/majornpcs/Shopkeeper.gif'}
            width={96}
            height={96}
            imageRendering="pixelated"
          />
          <div style={{
            marginTop: '1rem',
            color: '#FFD700',
            fontWeight: 'bold',
            fontSize: '1.1rem',
          }}>
            Shopkeeper
          </div>
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            textAlign: 'center',
          }}>
            "Welcome! Unlock powerful equipment to strengthen your party!"
          </div>
        </div>

        {/* Equipment Grid (Right) */}
        <div style={{
          flex: 1,
          padding: '2rem',
          overflowY: 'auto',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {sampleEquipment.map((equipment) => (
              <div
                key={equipment.id}
                style={{
                  backgroundColor: '#2a2a2a',
                  border: '2px solid #555',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFD700';
                  e.currentTarget.style.backgroundColor = '#3a3a3a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#555';
                  e.currentTarget.style.backgroundColor = '#2a2a2a';
                }}
              >
                <EquipmentIcon equipment={equipment} size="medium" />
                <div style={{
                  marginTop: '0.5rem',
                  fontWeight: 'bold',
                  color: '#FFD700',
                  textAlign: 'center',
                }}>
                  {equipment.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#999',
                  marginTop: '0.25rem',
                }}>
                  {equipment.slot.toUpperCase()}
                </div>
                {equipment.statBonus && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#fff',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                  }}>
                    {equipment.statBonus.atk && `+${equipment.statBonus.atk} ATK `}
                    {equipment.statBonus.def && `+${equipment.statBonus.def} DEF `}
                    {equipment.statBonus.hp && `+${equipment.statBonus.hp} HP`}
                  </div>
                )}
                <button style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  width: '100%',
                }}>
                  Unlock (100G)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}










