/**
 * Menu Storyboard
 * 
 * Mockups for menu screens:
 * - Save Menu: Save slot list with info
 * - Main Menu: Title screen with options
 */

import { useState } from 'react';
import { BackgroundSprite } from '../../sprites';

type MenuType = 'save' | 'main';

export function MenuStoryboard() {
  const [menuType, setMenuType] = useState<MenuType>('save');

  // Mock save slots
  const saveSlots = [
    {
      id: 1,
      chapter: 'Chapter 1',
      playtime: '2h 15m',
      timestamp: '2025-01-15 14:30',
      hasData: true,
    },
    {
      id: 2,
      chapter: 'Chapter 1',
      playtime: '1h 45m',
      timestamp: '2025-01-14 20:15',
      hasData: true,
    },
    {
      id: 3,
      chapter: null,
      playtime: null,
      timestamp: null,
      hasData: false,
    },
    {
      id: 4,
      chapter: null,
      playtime: null,
      timestamp: null,
      hasData: false,
    },
    {
      id: 5,
      chapter: null,
      playtime: null,
      timestamp: null,
      hasData: false,
    },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Menu Type Selector */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 30,
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '0.5rem',
        borderRadius: '4px',
      }}>
        {(['save', 'main'] as MenuType[]).map((m) => (
          <button
            key={m}
            onClick={() => setMenuType(m)}
            style={{
              padding: '0.3rem 0.6rem',
              backgroundColor: menuType === m ? '#4CAF50' : '#333',
              color: '#fff',
              border: `1px solid ${menuType === m ? '#66BB6A' : '#555'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
            }}
          >
            {m === 'save' ? 'Save Menu' : 'Main Menu'}
          </button>
        ))}
      </div>

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

      {/* Save Menu */}
      {menuType === 'save' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: '3px solid #666',
          borderRadius: '8px',
          padding: '24px',
          zIndex: 10,
        }}>
          <h1 style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}>
            SAVE / LOAD
          </h1>

          {/* Save Slots */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {saveSlots.map((slot) => (
              <div
                key={slot.id}
                style={{
                  backgroundColor: slot.hasData ? '#2a2a2a' : '#1a1a1a',
                  border: `2px solid ${slot.hasData ? '#666' : '#444'}`,
                  borderRadius: '4px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4CAF50';
                  e.currentTarget.style.backgroundColor = slot.hasData ? '#333' : '#2a2a2a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = slot.hasData ? '#666' : '#444';
                  e.currentTarget.style.backgroundColor = slot.hasData ? '#2a2a2a' : '#1a1a1a';
                }}
              >
                {slot.hasData ? (
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}>
                      <div style={{
                        fontSize: '16px',
                        color: '#fff',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                      }}>
                        Save Slot {slot.id}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#666',
                        fontFamily: 'monospace',
                      }}>
                        {slot.timestamp}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#4CAF50',
                      fontFamily: 'monospace',
                    }}>
                      {slot.chapter} • {slot.playtime}
                    </div>
                  </>
                ) : (
                  <div style={{
                    fontSize: '16px',
                    color: '#666',
                    fontFamily: 'monospace',
                    textAlign: 'center',
                  }}>
                    Empty Slot {slot.id}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
          }}>
            <button
              style={{
                padding: '10px 24px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#66BB6A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4CAF50';
              }}
            >
              Save
            </button>
            <button
              style={{
                padding: '10px 24px',
                backgroundColor: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#42A5F5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2196F3';
              }}
            >
              Load
            </button>
            <button
              style={{
                padding: '10px 24px',
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'monospace',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#777';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#666';
              }}
            >
              Close
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
          maxWidth: '500px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '3px solid #4CAF50',
          borderRadius: '8px',
          padding: '40px',
          zIndex: 10,
          textAlign: 'center',
        }}>
          {/* Game Title */}
          <h1 style={{
            margin: '0 0 40px 0',
            fontSize: '48px',
            color: '#4CAF50',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}>
            VALE CHRONICLES
          </h1>
          <div style={{
            fontSize: '18px',
            color: '#aaa',
            fontFamily: 'monospace',
            marginBottom: '40px',
          }}>
            V2
          </div>

          {/* Menu Options */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {['New Game', 'Continue', 'Options', 'Credits'].map((option) => (
              <button
                key={option}
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  border: '2px solid #666',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4CAF50';
                  e.currentTarget.style.backgroundColor = '#333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#666';
                  e.currentTarget.style.backgroundColor = '#2a2a2a';
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
