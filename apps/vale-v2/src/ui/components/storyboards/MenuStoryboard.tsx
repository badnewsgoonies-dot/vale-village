/**
 * Menu Storyboard Component
 * Mockup for save menu and main menu interfaces
 */

import { useState } from 'react';
import { BackgroundSprite } from '../../sprites';

type MenuType = 'save-menu' | 'main-menu';

const MENUS: { value: MenuType; label: string; description: string }[] = [
  {
    value: 'save-menu',
    label: 'Save Menu',
    description: 'Save/load game interface'
  },
  {
    value: 'main-menu',
    label: 'Main Menu',
    description: 'Game title screen and options'
  }
];

export function MenuStoryboard() {
  const [currentMenu, setCurrentMenu] = useState<MenuType>('save-menu');

  const saveSlots = [
    {
      id: 1,
      chapter: 'Chapter 2: First Steps',
      playtime: '2:34:12',
      timestamp: '2025-11-13 14:30',
      location: 'Vale Village',
      party: ['Isaac', 'Garet', 'Ivan', 'Mia'],
      level: 'Lv.5-6'
    },
    {
      id: 2,
      chapter: 'Chapter 1: Awakening',
      playtime: '1:12:45',
      timestamp: '2025-11-12 09:15',
      location: 'Mt. Aleph',
      party: ['Isaac', 'Garet'],
      level: 'Lv.1-3'
    },
    {
      id: 3,
      chapter: 'New Game',
      playtime: '--:--:--',
      timestamp: 'Empty',
      location: '--',
      party: [],
      level: '--'
    }
  ];

  const renderSaveMenu = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    }}>
      {/* Save Menu Card */}
      <div style={{
        backgroundColor: '#000',
        border: '3px solid #FFD700',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '700px',
        width: '100%',
      }}>
        {/* Menu Title */}
        <div style={{
          color: '#FFD700',
          fontSize: '28px',
          fontFamily: 'serif',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          Save Game
        </div>

        {/* Save Slots */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {saveSlots.map(slot => (
            <div
              key={slot.id}
              style={{
                backgroundColor: slot.id === 1 ? '#333' : '#222',
                border: slot.id === 1 ? '2px solid #4CAF50' : '2px solid #444',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFD700';
                e.currentTarget.style.backgroundColor = '#444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = slot.id === 1 ? '#4CAF50' : '#444';
                e.currentTarget.style.backgroundColor = slot.id === 1 ? '#333' : '#222';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}>
                <div style={{
                  color: '#FFD700',
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                }}>
                  Slot {slot.id}
                  {slot.id === 1 && (
                    <span style={{ color: '#4CAF50', marginLeft: '8px' }}>
                      [Current]
                    </span>
                  )}
                </div>
                <div style={{
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}>
                  {slot.timestamp}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#ccc',
              }}>
                <div>
                  <div style={{ color: '#FFD700', marginBottom: '2px' }}>
                    Chapter:
                  </div>
                  <div>{slot.chapter}</div>
                </div>

                <div>
                  <div style={{ color: '#FFD700', marginBottom: '2px' }}>
                    Playtime:
                  </div>
                  <div>{slot.playtime}</div>
                </div>

                <div>
                  <div style={{ color: '#FFD700', marginBottom: '2px' }}>
                    Location:
                  </div>
                  <div>{slot.location}</div>
                </div>

                <div>
                  <div style={{ color: '#FFD700', marginBottom: '2px' }}>
                    Party Level:
                  </div>
                  <div>{slot.level}</div>
                </div>
              </div>

              {/* Party Preview */}
              {slot.party.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px',
                  backgroundColor: '#111',
                  borderRadius: '4px',
                }}>
                  <div style={{
                    color: '#FFD700',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '4px',
                  }}>
                    Party: {slot.party.join(', ')}
                  </div>
                </div>
              )}
            </div>
          ))}
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
            Save Game
          </button>
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#FF9800',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}>
            Load Game
          </button>
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderMainMenu = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      imageRendering: 'pixelated',
    }}>
      {/* Title Screen Background */}
      <BackgroundSprite
        id="/sprites/backgrounds/gs1/World_Map_Shore.gif"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 0,
          filter: 'brightness(0.6) blur(1px)',
        }}
        sizeMode="cover"
      />

      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1,
      }} />

      {/* Menu Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        {/* Game Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
        }}>
          <div style={{
            color: '#FFD700',
            fontSize: '48px',
            fontFamily: 'serif',
            fontWeight: 'bold',
            textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
            marginBottom: '8px',
          }}>
            VALE CHRONICLES
          </div>
          <div style={{
            color: '#fff',
            fontSize: '18px',
            fontFamily: 'monospace',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}>
            A Golden Sun-Inspired Tactical RPG
          </div>
        </div>

        {/* Menu Options */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          border: '2px solid #FFD700',
          borderRadius: '12px',
          padding: '32px',
          minWidth: '300px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {[
              { label: 'New Game', color: '#4CAF50', description: 'Start a new adventure' },
              { label: 'Continue', color: '#FFD700', description: 'Resume your journey' },
              { label: 'Options', color: '#2196F3', description: 'Game settings' },
              { label: 'Credits', color: '#9C27B0', description: 'Development team' },
            ].map(option => (
              <button
                key={option.label}
                style={{
                  padding: '16px 24px',
                  backgroundColor: option.color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 0 20px ${option.color}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>{option.label}</span>
                <span style={{
                  fontSize: '12px',
                  opacity: 0.8,
                  fontWeight: 'normal',
                }}>
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Version Info */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          color: '#666',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}>
          Version 2.0.0 • Built with React & TypeScript
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Menu Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        zIndex: 20,
      }}>
        {MENUS.map(menu => (
          <button
            key={menu.value}
            onClick={() => setCurrentMenu(menu.value)}
            style={{
              padding: '6px 12px',
              backgroundColor: currentMenu === menu.value ? '#FFD700' : '#333',
              color: currentMenu === menu.value ? '#000' : '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
            title={menu.description}
          >
            {menu.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {currentMenu === 'save-menu' ? renderSaveMenu() : renderMainMenu()}

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
          {MENUS.find(m => m.value === currentMenu)?.label}
        </div>
        <div style={{ color: '#ccc' }}>
          {MENUS.find(m => m.value === currentMenu)?.description}
        </div>
        <div style={{ color: '#888', marginTop: '8px', fontSize: '11px' }}>
          {currentMenu === 'save-menu' ? (
            <>
              • Multiple save slots with metadata
              • Chapter progress and playtime tracking
              • Party composition and location display
              • Timestamp-based save management
            </>
          ) : (
            <>
              • Golden Sun-inspired title screen
              • Progressive menu with descriptions
              • Background blur effect for focus
              • Version info and branding
            </>
          )}
        </div>
      </div>
    </div>
  );
}