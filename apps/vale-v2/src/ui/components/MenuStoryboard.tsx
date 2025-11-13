/**
 * Menu Storyboard Component
 * Mockups for save/load menus and main menu screens
 */

import { useState } from 'react';

type MenuPhase = 'main-menu' | 'save-menu' | 'load-menu';

export function MenuStoryboard() {
  const [menuPhase, setMenuPhase] = useState<MenuPhase>('main-menu');

  // Mock save data
  const mockSaveSlots = [
    {
      id: 1,
      chapter: 'Chapter 1: The Awakening',
      playtime: '2:34:12',
      timestamp: '2025-11-13 14:30',
      level: 'Lv. 5',
      location: 'Vale Village',
      gold: 1250,
    },
    {
      id: 2,
      chapter: 'Chapter 2: The First Trial',
      playtime: '5:12:48',
      timestamp: '2025-11-12 18:45',
      level: 'Lv. 12',
      location: 'Goma Cave',
      gold: 3200,
    },
    {
      id: 3,
      chapter: 'Chapter 3: Elemental Powers',
      playtime: '8:45:33',
      timestamp: '2025-11-11 21:15',
      level: 'Lv. 18',
      location: 'Sol Sanctum',
      gold: 5800,
    },
  ];

  const renderMainMenu = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
    }}>
      {/* Game Title */}
      <div style={{
        marginBottom: '60px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: '#FFD700',
          margin: 0,
          textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
          letterSpacing: '4px',
          animation: 'title-glow 3s infinite',
        }}>
          VALE CHRONICLES
        </h1>
        <div style={{
          fontSize: '18px',
          color: '#AAAAAA',
          marginTop: '10px',
          letterSpacing: '2px',
        }}>
          V2 • GOLDEN SUN INSPIRED • TACTICAL RPG
        </div>
      </div>

      {/* Menu Options */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
        minWidth: '400px',
      }}>
        {[
          { label: 'NEW GAME', description: 'Start your adventure', primary: true },
          { label: 'CONTINUE', description: 'Resume from save', primary: false },
          { label: 'LOAD GAME', description: 'Choose save file', primary: false },
          { label: 'OPTIONS', description: 'Settings & preferences', primary: false },
          { label: 'CREDITS', description: 'Development team', primary: false },
        ].map((option) => (
          <button
            key={option.label}
            style={{
              width: '100%',
              padding: '20px 30px',
              backgroundColor: option.primary ? '#27ae60' : '#34495e',
              color: '#fff',
              border: option.primary ? '3px solid #2ecc71' : '2px solid #7f8c8d',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '20px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = option.primary ? '#2ecc71' : '#4a5d6a';
              e.currentTarget.style.borderColor = option.primary ? '#FFD700' : '#95a5a6';
              e.currentTarget.style.transform = 'translateX(10px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = option.primary ? '#27ae60' : '#34495e';
              e.currentTarget.style.borderColor = option.primary ? '#2ecc71' : '#7f8c8d';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span>{option.label}</span>
            <span style={{
              fontSize: '14px',
              color: '#AAAAAA',
              fontWeight: 'normal',
            }}>
              {option.description}
            </span>
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: '#666',
        fontSize: '12px',
        fontFamily: 'monospace',
      }}>
        <div>Press ↑↓ to navigate • Press ENTER to select</div>
        <div style={{ marginTop: '5px' }}>
          Built with React • TypeScript • Zustand • Golden Sun Assets
        </div>
      </div>
    </div>
  );

  const renderSaveMenu = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#2c3e50',
      fontFamily: 'monospace',
      overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '30px',
        textAlign: 'center',
        backgroundColor: '#34495e',
        borderBottom: '4px solid #FFD700',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '36px',
          color: '#FFD700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        }}>
          💾 SAVE GAME
        </h1>
        <div style={{
          marginTop: '10px',
          color: '#AAAAAA',
          fontSize: '16px',
        }}>
          Choose a slot to save your progress
        </div>
      </div>

      {/* Save Slots */}
      <div style={{
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {mockSaveSlots.map((slot) => (
          <div key={slot.id} style={{
            backgroundColor: '#34495e',
            border: '3px solid #7f8c8d',
            borderRadius: '12px',
            padding: '25px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FFD700';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#7f8c8d';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            {/* Slot Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '10px',
              }}>
                <div style={{
                  fontSize: '24px',
                  color: '#FFD700',
                  fontWeight: 'bold',
                }}>
                  SLOT {slot.id}
                </div>
                <div style={{
                  backgroundColor: '#27ae60',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  {slot.level}
                </div>
              </div>

              <div style={{
                color: '#ecf0f1',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}>
                {slot.chapter}
              </div>

              <div style={{
                display: 'flex',
                gap: '20px',
                color: '#bdc3c7',
                fontSize: '14px',
              }}>
                <span>📍 {slot.location}</span>
                <span>🕐 {slot.playtime}</span>
                <span>💰 {slot.gold.toLocaleString()} G</span>
              </div>

              <div style={{
                color: '#95a5a6',
                fontSize: '12px',
                marginTop: '5px',
              }}>
                Saved: {slot.timestamp}
              </div>
            </div>

            {/* Save Button */}
            <button style={{
              backgroundColor: '#3498db',
              color: '#fff',
              border: '2px solid #2980b9',
              borderRadius: '8px',
              padding: '15px 25px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2980b9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3498db';
            }}>
              Save Here
            </button>
          </div>
        ))}

        {/* New Save Slot */}
        <div style={{
          backgroundColor: '#34495e',
          border: '3px dashed #7f8c8d',
          borderRadius: '12px',
          padding: '25px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#FFD700';
          e.currentTarget.style.backgroundColor = '#4a5d6a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#7f8c8d';
          e.currentTarget.style.backgroundColor = '#34495e';
        }}>
          <div style={{
            fontSize: '48px',
            color: '#7f8c8d',
            marginBottom: '10px',
          }}>
            ➕
          </div>
          <div style={{
            color: '#bdc3c7',
            fontSize: '18px',
            fontWeight: 'bold',
          }}>
            New Save File
          </div>
          <div style={{
            color: '#95a5a6',
            fontSize: '14px',
          }}>
            Create a new save slot
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
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
          Cancel
        </button>

        <div style={{
          color: '#AAAAAA',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}>
          Press ESC to cancel • Use ↑↓ to navigate slots
        </div>
      </div>
    </div>
  );

  const renderLoadMenu = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#2c3e50',
      fontFamily: 'monospace',
      overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '30px',
        textAlign: 'center',
        backgroundColor: '#34495e',
        borderBottom: '4px solid #FFD700',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '36px',
          color: '#FFD700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        }}>
          📂 LOAD GAME
        </h1>
        <div style={{
          marginTop: '10px',
          color: '#AAAAAA',
          fontSize: '16px',
        }}>
          Choose a save file to continue your adventure
        </div>
      </div>

      {/* Load Slots */}
      <div style={{
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {mockSaveSlots.map((slot) => (
          <div key={slot.id} style={{
            backgroundColor: '#34495e',
            border: '3px solid #7f8c8d',
            borderRadius: '12px',
            padding: '25px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FFD700';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#7f8c8d';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            {/* Preview Thumbnail */}
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              width: '80px',
              height: '60px',
              backgroundColor: '#2c3e50',
              border: '2px solid #7f8c8d',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>
              🖼️
            </div>

            {/* Slot Info */}
            <div style={{ flex: 1, marginRight: '100px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '10px',
              }}>
                <div style={{
                  fontSize: '24px',
                  color: '#FFD700',
                  fontWeight: 'bold',
                }}>
                  SLOT {slot.id}
                </div>
                <div style={{
                  backgroundColor: '#27ae60',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  {slot.level}
                </div>
              </div>

              <div style={{
                color: '#ecf0f1',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}>
                {slot.chapter}
              </div>

              <div style={{
                display: 'flex',
                gap: '20px',
                color: '#bdc3c7',
                fontSize: '14px',
              }}>
                <span>📍 {slot.location}</span>
                <span>🕐 {slot.playtime}</span>
                <span>💰 {slot.gold.toLocaleString()} G</span>
              </div>

              <div style={{
                color: '#95a5a6',
                fontSize: '12px',
                marginTop: '5px',
              }}>
                Saved: {slot.timestamp}
              </div>
            </div>

            {/* Load Button */}
            <button style={{
              backgroundColor: '#27ae60',
              color: '#fff',
              border: '2px solid #2ecc71',
              borderRadius: '8px',
              padding: '15px 25px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2ecc71';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#27ae60';
            }}>
              Load Game
            </button>
          </div>
        ))}

        {/* Empty Slots */}
        {[4, 5].map((slotId) => (
          <div key={slotId} style={{
            backgroundColor: '#2c3e50',
            border: '3px dashed #7f8c8d',
            borderRadius: '12px',
            padding: '25px',
            textAlign: 'center',
            opacity: 0.6,
          }}>
            <div style={{
              fontSize: '48px',
              color: '#7f8c8d',
              marginBottom: '10px',
            }}>
              📁
            </div>
            <div style={{
              color: '#95a5a6',
              fontSize: '18px',
              fontWeight: 'bold',
            }}>
              Slot {slotId} - Empty
            </div>
            <div style={{
              color: '#7f8c8d',
              fontSize: '14px',
              marginTop: '5px',
            }}>
              No save data found
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
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
          Back to Main Menu
        </button>

        <div style={{
          color: '#AAAAAA',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}>
          Press ESC to go back • Use ↑↓ to navigate slots
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Phase Selector */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 20,
        display: 'flex',
        gap: '10px',
      }}>
        {[
          { id: 'main-menu', label: 'Main Menu' },
          { id: 'save-menu', label: 'Save Menu' },
          { id: 'load-menu', label: 'Load Menu' },
        ].map(phase => (
          <button
            key={phase.id}
            onClick={() => setMenuPhase(phase.id as MenuPhase)}
            style={{
              padding: '8px 16px',
              backgroundColor: menuPhase === phase.id ? '#4CAF50' : 'rgba(0,0,0,0.8)',
              color: '#fff',
              border: menuPhase === phase.id ? '2px solid #FFD700' : '2px solid #fff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            {phase.label}
          </button>
        ))}
      </div>

      {/* Current Phase Content */}
      {menuPhase === 'main-menu' && renderMainMenu()}
      {menuPhase === 'save-menu' && renderSaveMenu()}
      {menuPhase === 'load-menu' && renderLoadMenu()}

      {/* CSS Animations */}
      <style>{`
        @keyframes title-glow {
          0%, 100% { text-shadow: 4px 4px 8px rgba(0,0,0,0.8); }
          50% { text-shadow: 0 0 20px #FFD700, 4px 4px 8px rgba(0,0,0,0.8); }
        }
      `}</style>
    </div>
  );
}