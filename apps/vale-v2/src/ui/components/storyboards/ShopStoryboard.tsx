/**
 * Shop Storyboard Component
 * 
 * Shows shop screen mockup with shopkeeper NPC, equipment grid,
 * gold display, and unlock system.
 */

import { useState } from 'react';
import { SimpleSprite, getSpriteById, searchSprites } from '../../sprites';

export function ShopStoryboard() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // Find shopkeeper sprite
  const shopkeeperSprite = searchSprites('shopkeeper')[0] || searchSprites('npc')[0];

  const equipmentItems = [
    { id: 1, name: 'Iron Sword', icon: '⚔️', cost: 150, stats: '+12 ATK', unlocked: true },
    { id: 2, name: 'Steel Blade', icon: '⚔️', cost: 300, stats: '+20 ATK', unlocked: true },
    { id: 3, name: 'Leather Armor', icon: '🛡️', cost: 120, stats: '+8 DEF', unlocked: true },
    { id: 4, name: 'Chain Mail', icon: '🛡️', stats: '+15 DEF', cost: 250, unlocked: true },
    { id: 5, name: 'Magic Ring', icon: '💍', cost: 200, stats: '+10 PP', unlocked: false },
    { id: 6, name: 'Power Band', icon: '💪', cost: 180, stats: '+5 ATK', unlocked: false },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a2e',
      backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      overflow: 'auto',
    }}>
      {/* Shop Screen Container */}
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          minWidth: '200px',
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '3px solid #FFD700',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}>
            <SimpleSprite
              id={shopkeeperSprite?.path || '/sprites/overworld/npc.gif'}
              width={96}
              height={96}
              imageRendering="pixelated"
            />
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#FFD700',
            textAlign: 'center',
          }}>
            Merchant
          </div>
          <div style={{
            fontSize: '14px',
            color: '#aaa',
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            "Welcome! Browse my wares!"
          </div>
        </div>

        {/* Right Side - Equipment Grid */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#FFD700',
              margin: 0,
            }}>
              Equipment Shop
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '2px solid #FFD700',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
            }}>
              <span style={{ fontSize: '16px', color: '#aaa' }}>Gold:</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFD700' }}>
                450 G
              </span>
            </div>
          </div>

          {/* Equipment Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
          }}>
            {equipmentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
                style={{
                  backgroundColor: item.unlocked
                    ? selectedItem === item.id
                      ? 'rgba(76, 175, 80, 0.3)'
                      : 'rgba(0, 0, 0, 0.8)'
                    : 'rgba(0, 0, 0, 0.4)',
                  border: selectedItem === item.id
                    ? '3px solid #4CAF50'
                    : item.unlocked
                    ? '2px solid #666'
                    : '2px solid #444',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: item.unlocked ? 'pointer' : 'not-allowed',
                  opacity: item.unlocked ? 1 : 0.5,
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  if (item.unlocked) {
                    e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.unlocked) {
                    e.currentTarget.style.backgroundColor = selectedItem === item.id
                      ? 'rgba(76, 175, 80, 0.3)'
                      : 'rgba(0, 0, 0, 0.8)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <div style={{ fontSize: '48px' }}>{item.icon}</div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: item.unlocked ? '#fff' : '#666',
                  textAlign: 'center',
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#4CAF50',
                }}>
                  {item.stats}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#FFD700',
                }}>
                  {item.cost} G
                </div>
                {!item.unlocked && (
                  <div style={{
                    fontSize: '10px',
                    color: '#ff4444',
                    textAlign: 'center',
                    marginTop: '4px',
                  }}>
                    🔒 Locked
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: 'auto',
            paddingTop: '1rem',
          }}>
            {selectedItem && equipmentItems.find(i => i.id === selectedItem)?.unlocked && (
              <button
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5CBF60';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4CAF50';
                }}
              >
                Unlock Equipment
              </button>
            )}
            <button
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'monospace',
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
      </div>

      {/* Annotations */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        fontSize: '0.875rem',
        color: '#aaa',
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>
          Layout Notes:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
          <li>Shopkeeper NPC sprite on left side</li>
          <li>Equipment grid shows available items with icons and stats</li>
          <li>Gold display in header shows current player gold</li>
          <li>Locked items are grayed out and cannot be purchased</li>
          <li>Selected item highlighted with green border</li>
          <li>"Unlock Equipment" button appears when item selected (no selling)</li>
          <li>Dark gradient background maintains Golden Sun aesthetic</li>
        </ul>
      </div>
    </div>
  );
}
