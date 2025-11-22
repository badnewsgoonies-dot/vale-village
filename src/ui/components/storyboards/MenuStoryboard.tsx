/**
 * Menu Screens Storyboard
 * Shows save menu and main menu mockups
 */

import { useState } from 'react';
import { BackgroundSprite } from '../../sprites';

type MenuType = 'save' | 'main';

export function MenuStoryboard() {
  const [menuType, setMenuType] = useState<MenuType>('save');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Menu Type Selector */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
      }}>
        <div style={{ fontWeight: 'bold', marginRight: '1rem' }}>Menu Type:</div>
        {(['save', 'main'] as MenuType[]).map((type) => (
          <button
            key={type}
            onClick={() => setMenuType(type)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: menuType === type ? '#4CAF50' : '#3a3a3a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Save Menu */}
      {menuType === 'save' && (
        <div style={{
          flex: 1,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <h1 style={{
            color: '#FFD700',
            marginBottom: '2rem',
            fontSize: '2rem',
          }}>
            Save / Load Game
          </h1>

          <div style={{
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {[1, 2, 3].map((slot) => (
              <div
                key={slot}
                style={{
                  backgroundColor: '#2a2a2a',
                  border: '2px solid #555',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFD700';
                  e.currentTarget.style.backgroundColor = '#3a3a3a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#555';
                  e.currentTarget.style.backgroundColor = '#2a2a2a';
                }}
              >
                <div>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#FFD700',
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem',
                  }}>
                    Save Slot {slot}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#999',
                  }}>
                    Chapter 1 • Playtime: 2h 15m
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    marginTop: '0.25rem',
                  }}>
                    Last saved: 2 hours ago
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                }}>
                  <button style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}>
                    Save
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#2196F3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}>
                    Load
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button style={{
            marginTop: '2rem',
            padding: '0.75rem 2rem',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}>
            Close
          </button>
        </div>
      )}

      {/* Main Menu */}
      {menuType === 'main' && (
        <div style={{
          flex: 1,
          position: 'relative',
        }}>
          {/* Background */}
          <BackgroundSprite
            id="/sprites/backgrounds/gs1/Vale.gif"
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

          {/* Menu Overlay */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1,
          }}>
            {/* Game Title */}
            <h1 style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: '#FFD700',
              textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
              marginBottom: '4rem',
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
                    padding: '1rem 2rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '2px solid #FFD700',
                    borderRadius: '8px',
                    color: '#FFD700',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    e.currentTarget.style.transform = 'scale(1)';
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
  );
}











