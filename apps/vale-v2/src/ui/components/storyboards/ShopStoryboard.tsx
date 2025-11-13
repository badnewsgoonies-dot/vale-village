/**
 * Shop Screen Storyboard
 * 
 * Shows equipment shop with shopkeeper NPC, equipment grid, and unlock system.
 */

import { useState } from 'react';
import { SimpleSprite, getSpriteById, searchSprites, getSpritesByCategory } from '../../sprites';

export function ShopStoryboard() {
  // Find shopkeeper/NPC sprite
  const shopkeeperSprite = getSpritesByCategory('overworld-protagonists')[0] || searchSprites('npc')[0];

  // Equipment categories
  const equipmentCategories = [
    { name: 'Weapons', items: ['Iron Sword', 'Steel Blade', 'Mythril Sword'] },
    { name: 'Armor', items: ['Leather Armor', 'Chain Mail', 'Plate Armor'] },
    { name: 'Helms', items: ['Leather Cap', 'Iron Helm', 'Steel Helm'] },
    { name: 'Boots', items: ['Leather Boots', 'Iron Greaves', 'Steel Boots'] },
    { name: 'Accessories', items: ['Power Ring', 'Defense Amulet', 'Speed Bracelet'] },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      overflow: 'auto',
    }}>
      {/* Shop Screen Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: '2rem',
        padding: '2rem',
      }}>
        {/* Left Side - Shopkeeper */}
        <div style={{
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}>
          {shopkeeperSprite && (
            <div style={{
              backgroundColor: '#2a2a2a',
              border: '2px solid #666',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <SimpleSprite
                id={shopkeeperSprite.path}
                width={128}
                height={128}
                imageRendering="pixelated"
                style={{ marginBottom: '12px' }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFD700' }}>
                Merchant
              </div>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                Vale Village Shop
              </div>
            </div>
          )}

          {/* Gold Display */}
          <div style={{
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '8px',
            padding: '16px',
            width: '100%',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>Your Gold</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>450 G</div>
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
            <h1 style={{ fontSize: '28px', color: '#FFD700', margin: 0 }}>Equipment Shop</h1>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              × Close
            </button>
          </div>

          {/* Equipment Categories */}
          {equipmentCategories.map((category, catIdx) => (
            <div key={catIdx} style={{
              backgroundColor: '#2a2a2a',
              border: '2px solid #666',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h2 style={{
                fontSize: '18px',
                color: '#FFD700',
                marginBottom: '16px',
                borderBottom: '1px solid #555',
                paddingBottom: '8px',
              }}>
                {category.name}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '12px',
              }}>
                {category.items.map((item, itemIdx) => {
                  const isUnlocked = itemIdx < 2; // First 2 items unlocked
                  return (
                    <div
                      key={itemIdx}
                      style={{
                        backgroundColor: isUnlocked ? '#1a3a1a' : '#1a1a1a',
                        border: `2px solid ${isUnlocked ? '#4CAF50' : '#555'}`,
                        borderRadius: '8px',
                        padding: '12px',
                        textAlign: 'center',
                        opacity: isUnlocked ? 1 : 0.6,
                        position: 'relative',
                      }}
                    >
                      {/* Equipment Icon */}
                      <div style={{
                        fontSize: '32px',
                        marginBottom: '8px',
                      }}>
                        {category.name === 'Weapons' ? '⚔️' :
                         category.name === 'Armor' ? '🛡️' :
                         category.name === 'Helms' ? '⛑️' :
                         category.name === 'Boots' ? '👢' : '💍'}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#fff',
                        marginBottom: '4px',
                        fontWeight: 'bold',
                      }}>
                        {item}
                      </div>
                      {isUnlocked ? (
                        <>
                          <div style={{
                            fontSize: '11px',
                            color: '#aaa',
                            marginBottom: '8px',
                          }}>
                            +5 ATK
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#FFD700',
                            fontWeight: 'bold',
                          }}>
                            120 G
                          </div>
                          <button
                            style={{
                              marginTop: '8px',
                              padding: '4px 12px',
                              backgroundColor: '#4CAF50',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              width: '100%',
                            }}
                          >
                            Unlock
                          </button>
                        </>
                      ) : (
                        <div style={{
                          fontSize: '10px',
                          color: '#888',
                          marginTop: '8px',
                        }}>
                          Locked
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Annotations */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        fontSize: '12px',
        color: '#aaa',
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#fff' }}>Layout Notes:</div>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Shopkeeper NPC displayed on left with portrait</li>
          <li>Gold display shows current player gold</li>
          <li>Equipment organized by category (Weapons, Armor, Helms, Boots, Accessories)</li>
          <li>Unlocked items shown with green border and "Unlock" button</li>
          <li>Locked items shown with gray border and reduced opacity</li>
          <li>Each item shows icon, name, stat bonus, and cost</li>
          <li>Close button in top-right to exit shop</li>
        </ul>
      </div>
    </div>
  );
}
