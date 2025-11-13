/**
 * Menu Storyboard Component
 * 
 * Shows menu screen mockups including save menu and main menu.
 */

import { useState } from 'react';
import { BackgroundSprite } from '../../sprites';

type MenuType = 'save' | 'main';

export function MenuStoryboard() {
  const [menuType, setMenuType] = useState<MenuType>('save');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [action, setAction] = useState<'save' | 'load' | null>(null);

  const saveSlots = [
    { exists: true, chapter: 'Chapter 1', playtime: 3600, timestamp: Date.now() - 86400000 },
    { exists: true, chapter: 'Chapter 1', playtime: 1800, timestamp: Date.now() - 3600000 },
    { exists: false, chapter: null, playtime: null, timestamp: null },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000',
    }}>
      {/* Menu Type Selector */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Menu Type:</div>
        {(['save', 'main'] as MenuType[]).map((type) => (
          <button
            key={type}
            onClick={() => setMenuType(type)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: menuType === type ? '#4CAF50' : '#444',
              color: '#fff',
              border: '1px solid #666',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
            }}
          >
            {type === 'save' ? 'Save Menu' : 'Main Menu'}
          </button>
        ))}
      </div>

      {/* Menu Canvas */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        imageRendering: 'pixelated',
      }}>
        {/* Background */}
        <BackgroundSprite
          id="/sprites/backgrounds/gs1/Vale_Forest.gif"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 0,
            opacity: 0.3,
          }}
          sizeMode="cover"
        />

        {/* Save Menu */}
        {menuType === 'save' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '700px',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '4px solid #4CAF50',
            borderRadius: '16px',
            padding: '2rem',
            zIndex: 10,
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#4CAF50',
              marginTop: 0,
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}>
              Save / Load Game
            </h1>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginBottom: '2rem',
            }}>
              <button
                onClick={() => {
                  setAction('save');
                  setSelectedSlot(null);
                }}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: action === 'save' ? '#4CAF50' : '#444',
                  color: '#fff',
                  border: '2px solid #4CAF50',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setAction('load');
                  setSelectedSlot(null);
                }}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: action === 'load' ? '#4CAF50' : '#444',
                  color: '#fff',
                  border: '2px solid #4CAF50',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                }}
              >
                Load
              </button>
            </div>

            {/* Save Slots */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {saveSlots.map((slot, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (action) {
                      setSelectedSlot(idx);
                    }
                  }}
                  style={{
                    backgroundColor: selectedSlot === idx
                      ? 'rgba(76, 175, 80, 0.3)'
                      : slot.exists
                      ? 'rgba(42, 42, 42, 0.9)'
                      : 'rgba(20, 20, 20, 0.9)',
                    border: selectedSlot === idx
                      ? '3px solid #4CAF50'
                      : '2px solid #666',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: action ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (action) {
                      e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSlot !== idx) {
                      e.currentTarget.style.backgroundColor = slot.exists
                        ? 'rgba(42, 42, 42, 0.9)'
                        : 'rgba(20, 20, 20, 0.9)';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: slot.exists ? '#fff' : '#666',
                        marginBottom: '0.5rem',
                      }}>
                        Slot {idx + 1}
                      </div>
                      {slot.exists ? (
                        <>
                          <div style={{ fontSize: '14px', color: '#4CAF50', marginBottom: '0.25rem' }}>
                            {slot.chapter}
                          </div>
                          <div style={{ fontSize: '12px', color: '#aaa' }}>
                            Playtime: {slot.playtime ? `${Math.floor(slot.playtime / 60)}:${String(slot.playtime % 60).padStart(2, '0')}` : '0:00'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '0.25rem' }}>
                            {slot.timestamp ? new Date(slot.timestamp).toLocaleString() : 'No save'}
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                          Empty Slot
                        </div>
                      )}
                    </div>
                    {selectedSlot === idx && action && (
                      <div style={{
                        fontSize: '14px',
                        color: '#4CAF50',
                        fontWeight: 'bold',
                      }}>
                        {action === 'save' ? '→ Save Here' : '→ Load This'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '2rem',
            }}>
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
                Close [ESC]
              </button>
            </div>
          </div>
        )}

        {/* Main Menu */}
        {menuType === 'main' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '4px solid #FFD700',
            borderRadius: '16px',
            padding: '3rem',
            zIndex: 10,
            textAlign: 'center',
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#FFD700',
              marginTop: 0,
              marginBottom: '3rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}>
              VALE CHRONICLES
            </h1>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {['New Game', 'Continue', 'Options', 'Credits'].map((option, idx) => (
                <button
                  key={idx}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    border: '2px solid #FFD700',
                    borderRadius: '8px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3a3a3a';
                    e.currentTarget.style.borderColor = '#FFA500';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                    e.currentTarget.style.borderColor = '#FFD700';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
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
          {menuType === 'save' ? (
            <>
              <li>Save/Load action buttons at top</li>
              <li>3-5 save slots displayed as cards</li>
              <li>Each slot shows chapter, playtime, and timestamp</li>
              <li>Empty slots shown as grayed out</li>
              <li>Selected slot highlighted with green border</li>
              <li>Close button at bottom</li>
            </>
          ) : (
            <>
              <li>Game title prominently displayed at top</li>
              <li>Menu options: New Game, Continue, Options, Credits</li>
              <li>Golden border and text for main menu aesthetic</li>
              <li>Hover effects on menu buttons</li>
              <li>Centered layout with dark background</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
