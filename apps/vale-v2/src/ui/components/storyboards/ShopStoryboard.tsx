/**
 * Shop Storyboard Component
 * Mockup for equipment shop interface
 */

import { useState } from 'react';
import { SimpleSprite, searchSprites, getSpritesByCategory } from '../../sprites';

type ShopView = 'browse' | 'equipment-details' | 'unlock-confirm';

const VIEWS: { value: ShopView; label: string; description: string }[] = [
  {
    value: 'browse',
    label: 'Browse Shop',
    description: 'View available equipment for purchase'
  },
  {
    value: 'equipment-details',
    label: 'Equipment Details',
    description: 'Detailed view of selected equipment'
  },
  {
    value: 'unlock-confirm',
    label: 'Unlock Equipment',
    description: 'Special equipment unlock system'
  }
];

export function ShopStoryboard() {
  const [currentView, setCurrentView] = useState<ShopView>('browse');
  const [selectedEquipment, setSelectedEquipment] = useState<number | null>(null);

  // Find shop-related sprites
  const shopkeeperSprite = searchSprites('merchant')[0] || searchSprites('shopkeeper')[0] || getSpritesByCategory('overworld-protagonists')[1];
  const equipmentSprites = getSpritesByCategory('icons-items').slice(0, 12);

  const equipmentData = [
    { name: 'Iron Sword', type: 'Weapon', cost: 150, stats: '+8 Attack', unlocked: true },
    { name: 'Leather Armor', type: 'Armor', cost: 120, stats: '+6 Defense', unlocked: true },
    { name: 'Wooden Staff', type: 'Weapon', cost: 100, stats: '+5 Attack, +3 PP', unlocked: true },
    { name: 'Chain Mail', type: 'Armor', cost: 200, stats: '+10 Defense', unlocked: true },
    { name: 'Silver Ring', type: 'Accessory', cost: 300, stats: '+5 Luck', unlocked: true },
    { name: 'Steel Helm', type: 'Helm', cost: 180, stats: '+7 Defense', unlocked: false },
    { name: 'Power Gloves', type: 'Accessory', cost: 250, stats: '+6 Attack', unlocked: false },
    { name: 'Speed Boots', type: 'Boots', cost: 220, stats: '+4 Agility', unlocked: false },
    { name: 'Mystic Robe', type: 'Armor', cost: 350, stats: '+8 PP Max', unlocked: false },
    { name: 'Flame Sword', type: 'Weapon', cost: 400, stats: '+12 Attack, Fire Element', unlocked: false },
  ];

  const renderBrowseView = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#2a2a2a',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Shop Header */}
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderBottom: '2px solid #FFD700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          color: '#FFD700',
          fontSize: '24px',
          fontFamily: 'serif',
          fontWeight: 'bold',
        }}>
          Vale Village Armory
        </div>
        <div style={{
          color: '#fff',
          fontSize: '18px',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>💰</span>
          <span>2,450 Gold</span>
        </div>
      </div>

      {/* Shop Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        padding: '20px',
        gap: '20px',
      }}>
        {/* Shopkeeper */}
        <div style={{
          width: '200px',
          backgroundColor: '#333',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <SimpleSprite
            id={shopkeeperSprite?.path || '/sprites/overworld/merchant.gif'}
            width={64}
            height={64}
            imageRendering="pixelated"
            style={{ marginBottom: '12px' }}
          />
          <div style={{
            color: '#FFD700',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}>
            Shopkeeper
          </div>
          <div style={{
            color: '#fff',
            fontSize: '12px',
            fontFamily: 'monospace',
            lineHeight: '1.4',
          }}>
            "Welcome, adventurer! Fine equipment awaits those who can afford it. Take a look around!"
          </div>
        </div>

        {/* Equipment Grid */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
        }}>
          {equipmentData.map((equipment, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedEquipment(index);
                setCurrentView('equipment-details');
              }}
              style={{
                backgroundColor: equipment.unlocked ? '#444' : '#222',
                border: equipment.unlocked ? '2px solid #666' : '2px solid #FFD700',
                borderRadius: '8px',
                padding: '16px',
                cursor: equipment.unlocked ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                opacity: equipment.unlocked ? 1 : 0.6,
              }}
              onMouseEnter={(e) => {
                if (equipment.unlocked) {
                  e.currentTarget.style.borderColor = '#FFD700';
                  e.currentTarget.style.backgroundColor = '#555';
                }
              }}
              onMouseLeave={(e) => {
                if (equipment.unlocked) {
                  e.currentTarget.style.borderColor = '#666';
                  e.currentTarget.style.backgroundColor = '#444';
                }
              }}
            >
              <SimpleSprite
                id={equipmentSprites[index % equipmentSprites.length]?.path || '/sprites/icons/sword.gif'}
                width={40}
                height={40}
                imageRendering="pixelated"
                style={{ marginBottom: '8px' }}
              />
              <div style={{
                color: '#FFD700',
                fontSize: '14px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                marginBottom: '4px',
              }}>
                {equipment.name}
              </div>
              <div style={{
                color: '#fff',
                fontSize: '11px',
                fontFamily: 'monospace',
                marginBottom: '4px',
              }}>
                {equipment.type}
              </div>
              <div style={{
                color: '#4CAF50',
                fontSize: '12px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}>
                {equipment.stats}
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '14px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}>
                {equipment.cost}g
              </div>
              {!equipment.unlocked && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#FFD700',
                  color: '#000',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}>
                  LOCKED
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '16px 20px',
        borderTop: '2px solid #444',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
        }}>
          <button
            onClick={() => setCurrentView('unlock-confirm')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FFD700',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Unlock Equipment
          </button>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}>
            Sell Equipment
          </button>
        </div>
        <button style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'monospace',
          cursor: 'pointer',
        }}>
          Leave Shop
        </button>
      </div>
    </div>
  );

  const renderEquipmentDetails = () => {
    const equipmentIndex = selectedEquipment !== null ? selectedEquipment : 0;
    const equipment = equipmentData[equipmentIndex];

    return (
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#2a2a2a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        {/* Equipment Detail Card */}
        <div style={{
          backgroundColor: '#333',
          border: '3px solid #FFD700',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
        }}>
          {/* Equipment Icon */}
          <SimpleSprite
            id={equipmentSprites[equipmentIndex]?.path || '/sprites/icons/sword.gif'}
            width={80}
            height={80}
            imageRendering="pixelated"
            style={{ marginBottom: '16px' }}
          />

          {/* Equipment Name */}
          <div style={{
            color: '#FFD700',
            fontSize: '28px',
            fontFamily: 'serif',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}>
            {equipment?.name || 'Unknown Equipment'}
          </div>

          {/* Equipment Type */}
          <div style={{
            color: '#fff',
            fontSize: '16px',
            fontFamily: 'monospace',
            marginBottom: '16px',
          }}>
            {equipment?.type || 'Unknown Type'}
          </div>

          {/* Stats */}
          <div style={{
            backgroundColor: '#444',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{
              color: '#4CAF50',
              fontSize: '18px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              {equipment?.stats || 'Unknown Stats'}
            </div>
          </div>

          {/* Price */}
          <div style={{
            color: '#FFD700',
            fontSize: '24px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '24px',
          }}>
            Cost: {equipment?.cost || 0} Gold
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
          }}>
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}>
              Purchase
            </button>
            <button
              onClick={() => setCurrentView('browse')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontFamily: 'monospace',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUnlockConfirm = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#2a2a2a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    }}>
      {/* Unlock Equipment Card */}
      <div style={{
        backgroundColor: '#333',
        border: '3px solid #FFD700',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Unlock Icon */}
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
        }}>
          🔓
        </div>

        {/* Title */}
        <div style={{
          color: '#FFD700',
          fontSize: '28px',
          fontFamily: 'serif',
          fontWeight: 'bold',
          marginBottom: '16px',
        }}>
          Unlock Equipment
        </div>

        {/* Description */}
        <div style={{
          color: '#fff',
          fontSize: '16px',
          fontFamily: 'monospace',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}>
          By progressing through the story and completing quests, you can unlock new equipment that becomes available for purchase. This system ensures that powerful gear is earned through gameplay rather than bought immediately.
        </div>

        {/* Unlocked Equipment Preview */}
        <div style={{
          backgroundColor: '#444',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <div style={{
            color: '#FFD700',
            fontSize: '18px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '12px',
          }}>
            Recently Unlocked:
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            {equipmentData.filter(eq => !eq.unlocked).slice(0, 3).map((equipment, index) => (
              <div key={index} style={{
                backgroundColor: '#555',
                borderRadius: '6px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <SimpleSprite
                  id={equipmentSprites[(selectedEquipment || 0) + 5 + index]?.path || '/sprites/icons/sword.gif'}
                  width={32}
                  height={32}
                  imageRendering="pixelated"
                  style={{ marginBottom: '6px' }}
                />
                <div style={{
                  color: '#FFD700',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                  {equipment.name}
                </div>
                <div style={{
                  color: '#4CAF50',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                }}>
                  {equipment.cost}g
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => setCurrentView('browse')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Browse Shop
          </button>
          <button
            onClick={() => setCurrentView('browse')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'browse':
        return renderBrowseView();
      case 'equipment-details':
        return renderEquipmentDetails();
      case 'unlock-confirm':
        return renderUnlockConfirm();
      default:
        return renderBrowseView();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* View Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        zIndex: 20,
      }}>
        {VIEWS.map(view => (
          <button
            key={view.value}
            onClick={() => setCurrentView(view.value)}
            style={{
              padding: '6px 12px',
              backgroundColor: currentView === view.value ? '#FFD700' : '#333',
              color: currentView === view.value ? '#000' : '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
            title={view.description}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {renderCurrentView()}

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
          {VIEWS.find(v => v.value === currentView)?.label}
        </div>
        <div style={{ color: '#ccc' }}>
          {VIEWS.find(v => v.value === currentView)?.description}
        </div>
        <div style={{ color: '#888', marginTop: '8px', fontSize: '11px' }}>
          • Equipment shop with unlock progression
          • No selling system (story-driven acquisition)
          • Equipment becomes available through quests
          • Gold-based economy with meaningful prices
        </div>
      </div>
    </div>
  );
}