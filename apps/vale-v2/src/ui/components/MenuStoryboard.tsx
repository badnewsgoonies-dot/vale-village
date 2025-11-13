/**
 * Menu Storyboard Component
 * Shows save/load menus and main menu screens
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite } from '../sprites';

type MenuScreen = 'main' | 'save' | 'load';

const SCREEN_NAMES: Record<MenuScreen, string> = {
  main: 'Main Menu',
  save: 'Save Menu',
  load: 'Load Menu',
};

const SCREEN_DESCRIPTIONS: Record<MenuScreen, string> = {
  main: 'Game title screen with menu options',
  save: 'Save game interface with slot management',
  load: 'Load game interface with saved games',
};

export function MenuStoryboard() {
  const [currentScreen, setCurrentScreen] = useState<MenuScreen>('main');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a2e',
      imageRendering: 'pixelated',
    }}>
      {/* Screen Selector */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        gap: '8px',
      }}>
        {(Object.keys(SCREEN_NAMES) as MenuScreen[]).map((screen) => (
          <button
            key={screen}
            onClick={() => setCurrentScreen(screen)}
            style={{
              padding: '8px 16px',
              backgroundColor: currentScreen === screen ? '#ffd700' : 'rgba(0,0,0,0.8)',
              color: currentScreen === screen ? '#000' : '#fff',
              border: currentScreen === screen ? '2px solid #fff' : '2px solid #666',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}
          >
            {SCREEN_NAMES[screen]}
          </button>
        ))}
      </div>

      {/* Screen Description */}
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
          {SCREEN_NAMES[currentScreen]}
        </div>
        <div style={{ color: '#ccc' }}>
          {SCREEN_DESCRIPTIONS[currentScreen]}
        </div>
      </div>

      {/* Screen Content */}
      {currentScreen === 'main' && <MainMenuStoryboard />}
      {currentScreen === 'save' && <SaveMenuStoryboard />}
      {currentScreen === 'load' && <LoadMenuStoryboard />}
    </div>
  );
}

function MainMenuStoryboard() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Animated Background */}
      <BackgroundSprite
        id="random"
        category="backgrounds-gs1"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        sizeMode="cover"
      />

      {/* Game Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        zIndex: 10,
      }}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          border: '4px solid #ffd700',
          borderRadius: '16px',
          padding: '32px',
          display: 'inline-block',
        }}>
          <div style={{
            color: '#ffd700',
            fontSize: '64px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
            marginBottom: '16px',
          }}>
            VALE CHRONICLES
          </div>
          <div style={{
            color: '#fff',
            fontSize: '24px',
            fontFamily: 'monospace',
            fontStyle: 'italic',
          }}>
            A Golden Sun Inspired RPG
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        zIndex: 10,
        minWidth: '300px',
      }}>
        {/* New Game */}
        <button style={{
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: '3px solid #666',
          borderRadius: '8px',
          padding: '16px 32px',
          fontSize: '20px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '400px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#45a049';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#4CAF50';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        >
          🗡️ NEW GAME
        </button>

        {/* Continue */}
        <button style={{
          backgroundColor: '#2196F3',
          color: '#fff',
          border: '3px solid #666',
          borderRadius: '8px',
          padding: '16px 32px',
          fontSize: '20px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '400px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1976D2';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2196F3';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        >
          📖 CONTINUE
        </button>

        {/* Options */}
        <button style={{
          backgroundColor: '#666',
          color: '#fff',
          border: '3px solid #999',
          borderRadius: '8px',
          padding: '16px 32px',
          fontSize: '20px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '400px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#555';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#666';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        >
          ⚙️ OPTIONS
        </button>

        {/* Credits */}
        <button style={{
          backgroundColor: '#666',
          color: '#fff',
          border: '3px solid #999',
          borderRadius: '8px',
          padding: '16px 32px',
          fontSize: '20px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '400px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#555';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#666';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        >
          📜 CREDITS
        </button>
      </div>

      {/* Character Showcase */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '32px',
        zIndex: 10,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id="isaac-lblade-front"
            width={64}
            height={64}
            imageRendering="pixelated"
          />
          <div style={{
            color: '#fff',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginTop: '8px',
            textAlign: 'center',
          }}>
            Isaac
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id="garet-axe-front"
            width={64}
            height={64}
            imageRendering="pixelated"
          />
          <div style={{
            color: '#fff',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginTop: '8px',
            textAlign: 'center',
          }}>
            Garet
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id="ivan-staff-front"
            width={64}
            height={64}
            imageRendering="pixelated"
          />
          <div style={{
            color: '#fff',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginTop: '8px',
            textAlign: 'center',
          }}>
            Ivan
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id="mia-staff-front"
            width={64}
            height={64}
            imageRendering="pixelated"
          />
          <div style={{
            color: '#fff',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginTop: '8px',
            textAlign: 'center',
          }}>
            Mia
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#666',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
      }}>
        Version 2.0.0
      </div>
    </div>
  );
}

function SaveMenuStoryboard() {
  const saveSlots = [
    {
      id: 1,
      chapter: 'Chapter 2: The Ancient Temple',
      playtime: '12:34:56',
      timestamp: '2025-01-15 14:30',
      level: 'Lv. 8',
      location: 'Vale Temple Ruins',
    },
    {
      id: 2,
      chapter: 'Chapter 1: The Journey Begins',
      playtime: '05:12:33',
      timestamp: '2025-01-10 09:15',
      level: 'Lv. 3',
      location: 'Vale Village',
    },
    {
      id: 3,
      chapter: 'New Game',
      playtime: '--:--:--',
      timestamp: 'Empty Slot',
      level: 'Lv. 1',
      location: '---',
    },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        <div style={{
          color: '#ffd700',
          fontSize: '48px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          marginBottom: '16px',
        }}>
          💾 SAVE GAME
        </div>
        <div style={{
          color: '#fff',
          fontSize: '18px',
          fontFamily: 'monospace',
        }}>
          Choose a slot to save your progress
        </div>
      </div>

      {/* Save Slots */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '800px',
      }}>
        {saveSlots.map((slot) => (
          <div key={slot.id} style={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            border: slot.chapter !== 'New Game' ? '3px solid #4CAF50' : '3px solid #666',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ffd700';
            e.currentTarget.style.transform = 'scale(1.01)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = slot.chapter !== 'New Game' ? '#4CAF50' : '#666';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          >
            {/* Slot Number */}
            <div style={{
              backgroundColor: '#666',
              color: '#fff',
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              {slot.id}
            </div>

            {/* Save Info */}
            <div style={{
              flex: 1,
              color: '#fff',
              fontFamily: 'monospace',
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}>
                {slot.chapter}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '14px',
                color: '#ccc',
              }}>
                <div>📍 {slot.location}</div>
                <div>⭐ {slot.level}</div>
                <div>⏱️ {slot.playtime}</div>
                <div>📅 {slot.timestamp}</div>
              </div>
            </div>

            {/* Save Button */}
            <button style={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: '2px solid #666',
              borderRadius: '6px',
              padding: '12px 24px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
              minWidth: '100px',
            }}>
              {slot.chapter === 'New Game' ? 'Save' : 'Overwrite'}
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{
        marginTop: '40px',
        display: 'flex',
        gap: '20px',
      }}>
        <button style={{
          backgroundColor: '#666',
          color: '#fff',
          border: '2px solid #999',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontFamily: 'monospace',
          cursor: 'pointer',
        }}>
          Back to Game
        </button>
        <button style={{
          backgroundColor: '#666',
          color: '#fff',
          border: '2px solid #999',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontFamily: 'monospace',
          cursor: 'pointer',
        }}>
          Load Game
        </button>
      </div>
    </div>
  );
}

function LoadMenuStoryboard() {
  const saveSlots = [
    {
      id: 1,
      chapter: 'Chapter 2: The Ancient Temple',
      playtime: '12:34:56',
      timestamp: '2025-01-15 14:30',
      level: 'Lv. 8',
      location: 'Vale Temple Ruins',
      party: ['Isaac', 'Garet', 'Ivan', 'Mia'],
    },
    {
      id: 2,
      chapter: 'Chapter 1: The Journey Begins',
      playtime: '05:12:33',
      timestamp: '2025-01-10 09:15',
      level: 'Lv. 3',
      location: 'Vale Village',
      party: ['Isaac', 'Garet'],
    },
    {
      id: 3,
      chapter: 'New Game',
      playtime: '--:--:--',
      timestamp: 'Empty Slot',
      level: 'Lv. 1',
      location: '---',
      party: [],
    },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        <div style={{
          color: '#ffd700',
          fontSize: '48px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          marginBottom: '16px',
        }}>
          📖 LOAD GAME
        </div>
        <div style={{
          color: '#fff',
          fontSize: '18px',
          fontFamily: 'monospace',
        }}>
          Choose a saved game to continue
        </div>
      </div>

      {/* Load Slots */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '900px',
      }}>
        {saveSlots.map((slot) => (
          <div key={slot.id} style={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            border: slot.chapter !== 'New Game' ? '3px solid #2196F3' : '3px solid #666',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            cursor: slot.chapter !== 'New Game' ? 'pointer' : 'not-allowed',
            opacity: slot.chapter !== 'New Game' ? 1 : 0.6,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (slot.chapter !== 'New Game') {
              e.currentTarget.style.borderColor = '#ffd700';
              e.currentTarget.style.transform = 'scale(1.01)';
            }
          }}
          onMouseLeave={(e) => {
            if (slot.chapter !== 'New Game') {
              e.currentTarget.style.borderColor = '#2196F3';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
          >
            {/* Slot Number */}
            <div style={{
              backgroundColor: slot.chapter !== 'New Game' ? '#2196F3' : '#666',
              color: '#fff',
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}>
              {slot.id}
            </div>

            {/* Save Info */}
            <div style={{
              flex: 1,
              color: '#fff',
              fontFamily: 'monospace',
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}>
                {slot.chapter}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '14px',
                color: '#ccc',
                marginBottom: '12px',
              }}>
                <div>📍 {slot.location}</div>
                <div>⭐ {slot.level}</div>
                <div>⏱️ {slot.playtime}</div>
                <div>📅 {slot.timestamp}</div>
              </div>

              {/* Party Preview */}
              {slot.party.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '14px', color: '#ccc' }}>Party:</span>
                  {slot.party.map((member) => (
                    <div key={member} style={{
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      border: '1px solid #4CAF50',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      color: '#4CAF50',
                    }}>
                      {member}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Load Button */}
            <button
              disabled={slot.chapter === 'New Game'}
              style={{
                backgroundColor: slot.chapter !== 'New Game' ? '#2196F3' : '#666',
                color: '#fff',
                border: '2px solid #666',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '16px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: slot.chapter !== 'New Game' ? 'pointer' : 'not-allowed',
                minWidth: '100px',
              }}
            >
              Load
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{
        marginTop: '40px',
        display: 'flex',
        gap: '20px',
      }}>
        <button style={{
          backgroundColor: '#666',
          color: '#fff',
          border: '2px solid #999',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontFamily: 'monospace',
          cursor: 'pointer',
        }}>
          Back to Menu
        </button>
        <button style={{
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontFamily: 'monospace',
          cursor: 'pointer',
        }}>
          New Game
        </button>
      </div>
    </div>
  );
}