/**
 * Shop Storyboard Component
 * Shows equipment shop with shopkeeper and equipment grid
 */

import { useState } from 'react';
import { SimpleSprite } from '../sprites';
import { EquipmentIcon } from './EquipmentIcon';

type ShopState = 'browsing' | 'purchase';

const STATE_NAMES: Record<ShopState, string> = {
  browsing: 'Equipment Browser',
  purchase: 'Purchase Interface',
};

const STATE_DESCRIPTIONS: Record<ShopState, string> = {
  browsing: 'Browse available equipment by category',
  purchase: 'Purchase confirmation and gold management',
};

export function ShopStoryboard() {
  const [currentState, setCurrentState] = useState<ShopState>('browsing');
  const [selectedCategory, setSelectedCategory] = useState<'weapons' | 'armor' | 'accessories'>('weapons');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#2a1810',
      imageRendering: 'pixelated',
      display: 'flex',
      flexDirection: 'column',
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
        {(Object.keys(STATE_NAMES) as ShopState[]).map((state) => (
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

      {/* Shop Header */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderBottom: '3px solid #8B4513',
        padding: '20px',
        textAlign: 'center',
      }}>
        <div style={{
          color: '#ffd700',
          fontSize: '32px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          marginBottom: '8px',
        }}>
          ⚔️ VALE ARMORY ⚔️
        </div>
        <div style={{
          color: '#fff',
          fontSize: '16px',
          fontFamily: 'monospace',
        }}>
          Finest Equipment for Adventurers
        </div>
      </div>

      {/* Shop Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        position: 'relative',
      }}>
        {/* Shopkeeper NPC */}
        <div style={{
          position: 'absolute',
          left: '40px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '3px solid #8B4513',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <SimpleSprite
            id="npc-shopkeeper"
            width={80}
            height={80}
            imageRendering="pixelated"
          />
          <div style={{
            color: '#fff',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            Master Smith
          </div>
          <div style={{
            color: '#ccc',
            fontSize: '14px',
            fontFamily: 'monospace',
            textAlign: 'center',
            lineHeight: '1.4',
            maxWidth: '150px',
          }}>
            "Welcome, traveler!
            My wares are the finest
            in all the land."
          </div>
        </div>

        {/* Gold Display */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '2px solid #ffd700',
          borderRadius: '8px',
          padding: '12px 20px',
        }}>
          <div style={{
            color: '#ffd700',
            fontSize: '18px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            ◉ 1,250 G
          </div>
        </div>

        {/* Equipment Categories */}
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {[
            { key: 'weapons', label: 'Weapons', icon: '⚔️' },
            { key: 'armor', label: 'Armor', icon: '🛡️' },
            { key: 'accessories', label: 'Accessories', icon: '💍' },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as typeof selectedCategory)}
              style={{
                backgroundColor: selectedCategory === key ? '#8B4513' : 'rgba(0,0,0,0.8)',
                color: '#fff',
                border: selectedCategory === key ? '2px solid #ffd700' : '2px solid #666',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '14px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '120px',
                transition: 'all 0.2s',
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div style={{
          flex: 1,
          padding: '100px 200px 40px 200px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          alignContent: 'start',
        }}>
          {getEquipmentForCategory(selectedCategory).map((equipment) => (
            <div key={equipment.id} style={{
              backgroundColor: 'rgba(0,0,0,0.9)',
              border: '2px solid #666',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
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
                fontSize: '16px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                {equipment.name}
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {Object.entries(equipment.statBonus).map(([stat, value]) => (
                  <div key={stat} style={{
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    border: '1px solid #4CAF50',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#4CAF50',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                  }}>
                    +{value} {stat.toUpperCase()}
                  </div>
                ))}
              </div>

              {/* Price */}
              <div style={{
                color: '#ffd700',
                fontSize: '18px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}>
                ◉ {equipment.price} G
              </div>

              {/* Purchase Button */}
              <button style={{
                backgroundColor: equipment.price <= 1250 ? '#4CAF50' : '#666',
                color: '#fff',
                border: '2px solid #666',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                fontFamily: 'monospace',
                cursor: equipment.price <= 1250 ? 'pointer' : 'not-allowed',
                opacity: equipment.price <= 1250 ? 1 : 0.6,
              }}>
                {equipment.price <= 1250 ? 'Buy' : 'Too Expensive'}
              </button>
            </div>
          ))}
        </div>

        {/* Unlock Equipment Button */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}>
          <button style={{
            backgroundColor: '#8B4513',
            color: '#fff',
            border: '3px solid #ffd700',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#A0522D';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#8B4513';
          }}
          >
            🔓 Unlock New Equipment
          </button>
        </div>

        {/* Close Button */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 10,
        }}>
          <button style={{
            backgroundColor: '#666',
            color: '#fff',
            border: '2px solid #999',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}>
            Close Shop
          </button>
        </div>
      </div>
    </div>
  );
}

function getEquipmentForCategory(category: 'weapons' | 'armor' | 'accessories') {
  const equipmentData = {
    weapons: [
      {
        id: 'iron-sword',
        name: 'Iron Sword',
        slot: 'weapon' as const,
        tier: 'iron' as const,
        statBonus: { attack: 20 },
        price: 300,
      },
      {
        id: 'steel-blade',
        name: 'Steel Blade',
        slot: 'weapon' as const,
        tier: 'steel' as const,
        statBonus: { attack: 28 },
        price: 650,
      },
      {
        id: 'mythril-sword',
        name: 'Mythril Sword',
        slot: 'weapon' as const,
        tier: 'mythril' as const,
        statBonus: { attack: 38 },
        price: 1200,
      },
      {
        id: 'flame-brand',
        name: 'Flame Brand',
        slot: 'weapon' as const,
        tier: 'legendary' as const,
        statBonus: { attack: 50 },
        price: 2500,
      },
    ],
    armor: [
      {
        id: 'chain-mail',
        name: 'Chain Mail',
        slot: 'armor' as const,
        tier: 'iron' as const,
        statBonus: { defense: 18 },
        price: 400,
      },
      {
        id: 'plate-armor',
        name: 'Plate Armor',
        slot: 'armor' as const,
        tier: 'steel' as const,
        statBonus: { defense: 26 },
        price: 800,
      },
      {
        id: 'mythril-mail',
        name: 'Mythril Mail',
        slot: 'armor' as const,
        tier: 'mythril' as const,
        statBonus: { defense: 35 },
        price: 1500,
      },
      {
        id: 'dragon-scale',
        name: 'Dragon Scale',
        slot: 'armor' as const,
        tier: 'legendary' as const,
        statBonus: { defense: 45 },
        price: 3000,
      },
    ],
    accessories: [
      {
        id: 'power-bracelet',
        name: 'Power Bracelet',
        slot: 'accessory' as const,
        tier: 'bronze' as const,
        statBonus: { attack: 8 },
        price: 200,
      },
      {
        id: 'guardian-ring',
        name: 'Guardian Ring',
        slot: 'accessory' as const,
        tier: 'iron' as const,
        statBonus: { defense: 12 },
        price: 350,
      },
      {
        id: 'mysterious-card',
        name: 'Mysterious Card',
        slot: 'accessory' as const,
        tier: 'mythril' as const,
        statBonus: { maxPp: 15 },
        price: 600,
      },
      {
        id: 'sol-blade-summon',
        name: 'Sol Blade Summon',
        slot: 'accessory' as const,
        tier: 'legendary' as const,
        statBonus: { luck: 10 },
        price: 1800,
      },
    ],
  };

  return equipmentData[category];
}