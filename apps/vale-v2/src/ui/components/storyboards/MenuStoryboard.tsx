/**
 * Menu Screens Storyboard
 * 
 * Shows save menu and main menu mockups.
 */

import { useState } from 'react';
import { BackgroundSprite } from '../../sprites';

export function MenuStoryboard() {
  const [menuType, setMenuType] = useState<'save' | 'main'>('save');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
    }}>
      {/* Menu Type Selector */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <span style={{ color: '#aaa', marginRight: '0.5rem' }}>Menu:</span>
        <button
          onClick={() => setMenuType('save')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: menuType === 'save' ? '#4a9eff' : '#333',
            color: '#fff',
            border: `1px solid ${menuType === 'save' ? '#6bb6ff' : '#555'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
          }}
        >
          Save Menu
        </button>
        <button
          onClick={() => setMenuType('main')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: menuType === 'main' ? '#4a9eff' : '#333',
            color: '#fff',
            border: `1px solid ${menuType === 'main' ? '#6bb6ff' : '#555'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
          }}
        >
          Main Menu
        </button>
      </div>

      {/* Menu Content */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        {menuType === 'save' ? (
          /* Save Menu */
          <div style={{
            width: '100%',
            maxWidth: '800px',
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '8px',
            padding: '2rem',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
            }}>
              <h1 style={{
                margin: 0,
                fontSize: '28px',
                color: '#fff',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}>
                Save / Load Game
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

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4a9eff',
                  color: '#fff',
                  border: '2px solid #6bb6ff',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                New Save
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '2px solid #555',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
              >
                Load Save
              </button>
            </div>

            {/* Save Slots */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {[
                { exists: true, chapter: 'Chapter 1', playtime: '2:34', level: 5, gold: 1250, date: 'Nov 12, 2025 3:45 PM' },
                { exists: true, chapter: 'Prologue', playtime: '0:12', level: 2, gold: 50, date: 'Nov 11, 2025 1:20 PM' },
                { exists: false },
              ].map((slot, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: slot.exists ? '#333' : '#222',
                    border: `2px solid ${slot.exists ? '#666' : '#444'}`,
                    borderRadius: '4px',
                    padding: '1.5rem',
                    opacity: slot.exists ? 1 : 0.6,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: slot.exists ? '1rem' : '0',
                  }}>
                    <h2 style={{
                      margin: 0,
                      fontSize: '20px',
                      color: '#fff',
                      fontFamily: 'monospace',
                    }}>
                      Slot {i + 1}
                    </h2>
                    {slot.exists && (
                      <span style={{
                        color: '#4a9eff',
                        fontSize: '12px',
                      }}>
                        Click to save/load
                      </span>
                    )}
                  </div>
                  {slot.exists ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.75rem',
                      fontSize: '14px',
                    }}>
                      <div>
                        <span style={{ color: '#aaa' }}>Date: </span>
                        <span style={{ color: '#fff' }}>{slot.date}</span>
                      </div>
                      <div>
                        <span style={{ color: '#aaa' }}>Playtime: </span>
                        <span style={{ color: '#fff' }}>{slot.playtime}</span>
                      </div>
                      <div>
                        <span style={{ color: '#aaa' }}>Team Level: </span>
                        <span style={{ color: '#fff' }}>Lv. {slot.level}</span>
                      </div>
                      <div>
                        <span style={{ color: '#aaa' }}>Gold: </span>
                        <span style={{ color: '#FFD700' }}>{slot.gold}g</span>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ color: '#aaa' }}>Chapter: </span>
                        <span style={{ color: '#4a9eff' }}>{slot.chapter}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      color: '#666',
                      fontSize: '14px',
                      textAlign: 'center',
                      padding: '1rem',
                    }}>
                      Empty Slot
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Main Menu */
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}>
            {/* Background */}
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
                opacity: 0.6,
              }}
              sizeMode="cover"
            />

            {/* Overlay */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1,
            }} />

            {/* Menu Content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '2rem',
            }}>
              {/* Game Title */}
              <h1 style={{
                fontSize: '64px',
                color: '#FFD700',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
                margin: 0,
              }}>
                VALE CHRONICLES
              </h1>

              {/* Menu Options */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minWidth: '300px',
              }}>
                {['New Game', 'Continue', 'Options', 'Credits'].map((option) => (
                  <button
                    key={option}
                    style={{
                      padding: '16px 32px',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '3px solid #666',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '20px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4a9eff';
                      e.currentTarget.style.backgroundColor = 'rgba(74, 158, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#666';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
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
          {menuType === 'save' ? (
            <>
              <li>Save slot list with 3-5 slots</li>
              <li>Each slot shows metadata: date, playtime, level, gold, chapter</li>
              <li>Empty slots clearly marked</li>
              <li>Save/Load action buttons</li>
              <li>Close button to exit menu</li>
            </>
          ) : (
            <>
              <li>Game title prominently displayed</li>
              <li>Background image with overlay for readability</li>
              <li>Menu options: New Game, Continue, Options, Credits</li>
              <li>Hover effects highlight selected option</li>
              <li>Full-screen layout for immersive experience</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
