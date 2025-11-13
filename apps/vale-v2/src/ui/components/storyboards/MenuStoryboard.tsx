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
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Menu Type:</span>
        {(['save', 'main'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setMenuType(type)}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: menuType === type ? '#4CAF50' : '#333',
              color: '#fff',
              border: `1px solid ${menuType === type ? '#6BCF7F' : '#555'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
            }}
          >
            {type === 'save' ? 'Save Menu' : 'Main Menu'}
          </button>
        ))}
      </div>

      {/* Menu Content */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'auto',
      }}>
        {menuType === 'save' ? <SaveMenuStoryboard /> : <MainMenuStoryboard />}
      </div>
    </div>
  );
}

function SaveMenuStoryboard() {
  const [action, setAction] = useState<'save' | 'load' | null>('save');

  const saveSlots = [
    { exists: true, chapter: 'Chapter 1', playtime: 3600, timestamp: Date.now() - 86400000 },
    { exists: true, chapter: 'Chapter 1', playtime: 1800, timestamp: Date.now() - 3600000 },
    { exists: false },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '2rem',
    }}>
      {/* Action Selector */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        {(['save', 'load'] as const).map((act) => (
          <button
            key={act}
            onClick={() => setAction(act)}
            style={{
              padding: '12px 24px',
              backgroundColor: action === act ? '#4CAF50' : '#333',
              color: '#fff',
              border: `2px solid ${action === act ? '#6BCF7F' : '#555'}`,
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
            }}
          >
            {act}
          </button>
        ))}
      </div>

      {/* Save Slots */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '600px',
      }}>
        {saveSlots.map((slot, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: slot.exists ? '#2a2a2a' : '#1a1a1a',
              border: `2px solid ${slot.exists ? '#666' : '#444'}`,
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (slot.exists) {
                e.currentTarget.style.borderColor = '#FFD700';
                e.currentTarget.style.backgroundColor = '#3a3a3a';
              }
            }}
            onMouseLeave={(e) => {
              if (slot.exists) {
                e.currentTarget.style.borderColor = '#666';
                e.currentTarget.style.backgroundColor = '#2a2a2a';
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
                  color: slot.exists ? '#FFD700' : '#666',
                  marginBottom: '8px',
                }}>
                  Save Slot {idx + 1}
                </div>
                {slot.exists ? (
                  <>
                    <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '4px' }}>
                      {slot.chapter}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      Playtime: {formatPlaytime(slot.playtime)} | {formatTimestamp(slot.timestamp)}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                    No save data
                  </div>
                )}
              </div>
              {slot.exists && action && (
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: action === 'save' ? '#4CAF50' : '#4A9EFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                  }}
                >
                  {action === 'save' ? 'Save' : 'Load'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button
        style={{
          padding: '10px 24px',
          backgroundColor: '#666',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        Close [Esc]
      </button>
    </div>
  );
}

function MainMenuStoryboard() {
  return (
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
          opacity: 0.5,
        }}
        sizeMode="cover"
      />

      {/* Overlay */}
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
        gap: '2rem',
      }}>
        {/* Title */}
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#FFD700',
          textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
          marginBottom: '2rem',
          fontFamily: 'monospace',
        }}>
          VALE CHRONICLES
        </div>

        {/* Menu Options */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          minWidth: '300px',
        }}>
          {['New Game', 'Continue', 'Options', 'Credits'].map((option, idx) => (
            <button
              key={option}
              style={{
                padding: '16px 32px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                border: '2px solid #666',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'monospace',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFD700';
                e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                e.currentTarget.style.color = '#FFD700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#666';
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                e.currentTarget.style.color = '#fff';
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatPlaytime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
