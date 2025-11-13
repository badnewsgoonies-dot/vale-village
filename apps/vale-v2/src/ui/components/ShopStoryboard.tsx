/**
 * Shop Storyboard Component
 * Mockup for equipment shop interface
 */

import { useState } from 'react';

export function ShopStoryboard() {
  const [selectedCategory, setSelectedCategory] = useState<'weapons' | 'armor' | 'accessories'>('weapons');


  // Mock shop inventory
  const shopInventory = {
    weapons: [
      { id: 'wooden-sword', name: 'Wooden Sword', price: 100, stats: '+8 ATK', description: 'Basic training weapon' },
      { id: 'iron-sword', name: 'Iron Sword', price: 350, stats: '+15 ATK', description: 'Reliable steel blade' },
      { id: 'long-sword', name: 'Long Sword', price: 650, stats: '+22 ATK', description: 'Extended reach weapon' },
      { id: 'broad-sword', name: 'Broad Sword', price: 1200, stats: '+30 ATK', description: 'Heavy two-handed blade' },
      { id: 'silver-sword', name: 'Silver Sword', price: 2000, stats: '+38 ATK', description: 'Blessed with holy power' },
      { id: 'excalibur', name: 'Excalibur', price: 5000, stats: '+50 ATK', description: 'Legendary sword of kings' },
    ],
    armor: [
      { id: 'cloth-shirt', name: 'Cloth Shirt', price: 80, stats: '+3 DEF', description: 'Basic cloth protection' },
      { id: 'leather-armor', name: 'Leather Armor', price: 300, stats: '+10 DEF', description: 'Tough leather hide' },
      { id: 'chain-mail', name: 'Chain Mail', price: 800, stats: '+18 DEF', description: 'Interlocking metal rings' },
      { id: 'plate-armor', name: 'Plate Armor', price: 1500, stats: '+25 DEF', description: 'Full metal protection' },
      { id: 'knight-armor', name: 'Knight Armor', price: 2800, stats: '+35 DEF', description: 'Heavy knight\'s plate' },
      { id: 'dragon-mail', name: 'Dragon Mail', price: 4500, stats: '+45 DEF', description: 'Scales from ancient dragon' },
    ],
    accessories: [
      { id: 'leather-bracelet', name: 'Leather Bracelet', price: 150, stats: '+5 HP', description: 'Simple leather band' },
      { id: 'silver-ring', name: 'Silver Ring', price: 400, stats: '+10 PP', description: 'Mana-conducting silver' },
      { id: 'power-belt', name: 'Power Belt', price: 750, stats: '+8 ATK', description: 'Strength-enhancing belt' },
      { id: 'guard-ring', name: 'Guard Ring', price: 900, stats: '+12 DEF', description: 'Defensive energy ring' },
      { id: 'lucky-medallion', name: 'Lucky Medallion', price: 1200, stats: '+15% Critical', description: 'Increases critical hits' },
      { id: 'cursed-ring', name: 'Cursed Ring', price: 3000, stats: '+25 ATK, -10 HP', description: 'Power at a terrible cost' },
    ],
  };

  const currentInventory = shopInventory[selectedCategory];
  const playerGold = 2450;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#2c3e50',
      color: '#fff',
      fontFamily: 'monospace',
      overflow: 'hidden',
    }}>
      {/* Shop Interior Background */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#8B4513',
        opacity: 0.3,
        zIndex: 0,
      }} />

      {/* Shop Layout */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        zIndex: 1,
      }}>
        {/* Left Side - Shopkeeper */}
        <div style={{
          width: '30%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          borderRight: '4px solid #FFD700',
        }}>
          {/* Shopkeeper Sprite */}
          <div style={{
            width: '120px',
            height: '120px',
            backgroundColor: '#8B4513',
            border: '4px solid #654321',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
            marginBottom: '20px',
          }}>
            🧔
          </div>

          {/* Shopkeeper Dialogue */}
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            border: '2px solid #FFD700',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            maxWidth: '250px',
          }}>
            <div style={{
              color: '#FFD700',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}>
              Shopkeeper
            </div>
            <div style={{
              color: '#fff',
              fontSize: '14px',
              lineHeight: '1.4',
            }}>
              "Welcome to my shop, adventurer! Take a look at my finest wares. Everything here is of the highest quality!"
            </div>
          </div>

          {/* Player Gold Display */}
          <div style={{
            marginTop: '30px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            border: '2px solid #f1c40f',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center',
          }}>
            <div style={{
              color: '#f1c40f',
              fontSize: '18px',
              fontWeight: 'bold',
            }}>
              Your Gold: {playerGold.toLocaleString()} G
            </div>
          </div>
        </div>

        {/* Right Side - Shop Inventory */}
        <div style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '30px',
        }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '30px',
          }}>
            {[
              { id: 'weapons', label: 'Weapons', icon: '⚔️' },
              { id: 'armor', label: 'Armor', icon: '🛡️' },
              { id: 'accessories', label: 'Accessories', icon: '💍' },
            ].map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as typeof selectedCategory)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: selectedCategory === category.id ? '#3498db' : '#34495e',
                  color: '#fff',
                  border: selectedCategory === category.id ? '3px solid #FFD700' : '2px solid #7f8c8d',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.backgroundColor = '#4a5d6a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.backgroundColor = '#34495e';
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Equipment Grid */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            overflow: 'auto',
            padding: '10px',
          }}>
            {currentInventory.map((item) => {
              const canAfford = playerGold >= item.price;

              return (
                <div key={item.id} style={{
                  backgroundColor: '#34495e',
                  border: '3px solid #7f8c8d',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  transition: 'all 0.2s',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  opacity: canAfford ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (canAfford) {
                    e.currentTarget.style.borderColor = '#FFD700';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#7f8c8d';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  {/* Item Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                  }}>
                    {/* Item Icon */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#7f8c8d',
                      border: '2px solid #95a5a6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                    }}>
                      {selectedCategory === 'weapons' ? '⚔️' :
                       selectedCategory === 'armor' ? '🛡️' : '💍'}
                    </div>

                    {/* Item Name and Price */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#ecf0f1',
                        marginBottom: '5px',
                      }}>
                        {item.name}
                      </div>
                      <div style={{
                        fontSize: '16px',
                        color: '#f39c12',
                        fontWeight: 'bold',
                      }}>
                        {item.price.toLocaleString()} G
                      </div>
                    </div>
                  </div>

                  {/* Item Stats */}
                  <div style={{
                    fontSize: '16px',
                    color: '#1abc9c',
                    fontWeight: 'bold',
                  }}>
                    {item.stats}
                  </div>

                  {/* Item Description */}
                  <div style={{
                    color: '#bdc3c7',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    flex: 1,
                  }}>
                    {item.description}
                  </div>

                  {/* Buy Button */}
                  <button style={{
                    backgroundColor: canAfford ? '#27ae60' : '#7f8c8d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    textTransform: 'uppercase',
                  }}
                  disabled={!canAfford}>
                    {canAfford ? 'Buy Item' : 'Cannot Afford'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            padding: '20px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '8px',
          }}>
            <div style={{
              color: '#bdc3c7',
              fontSize: '14px',
            }}>
              Click on items to purchase • Equipment becomes available as you progress
            </div>

            <button style={{
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: '2px solid #c0392b',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c0392b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e74c3c';
            }}>
              Close Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}