/**
 * Overworld Storyboard
 * 
 * Shows overworld exploration mockup with tile-based map, player character,
 * NPCs, and dialogue overlay.
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, searchSprites, getSpritesByCategory } from '../../sprites';

export function OverworldStoryboard() {
  const [showDialogue, setShowDialogue] = useState(false);

  // Find player sprite
  const playerSprite = getSpriteById('isaac-overworld') || searchSprites('isaac')[0] || getSpritesByCategory('overworld-protagonists')[0];

  // Find NPC sprites
  const npcSprites = getSpritesByCategory('overworld-protagonists');
  const npcSprite1 = npcSprites[1] || npcSprites[0];
  const npcSprite2 = npcSprites[2] || npcSprites[0];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
    }}>
      {/* Controls */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <button
          onClick={() => setShowDialogue(!showDialogue)}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: showDialogue ? '#4CAF50' : '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
          }}
        >
          {showDialogue ? 'Hide' : 'Show'} Dialogue
        </button>
      </div>

      {/* Overworld Map Container */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        imageRendering: 'pixelated',
      }}>
        {/* Background - Overworld style */}
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

        {/* Map Grid Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
          gap: '2px',
          padding: '20px',
          zIndex: 1,
          opacity: 0.3,
        }}>
          {Array.from({ length: 96 }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
          ))}
        </div>

        {/* Map Content */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          zIndex: 2,
        }}>
          {/* Player Character (Centered) */}
          {playerSprite && (
            <div style={{
              position: 'relative',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
            }}>
              <SimpleSprite
                id={playerSprite.path}
                width={48}
                height={48}
                imageRendering="pixelated"
              />
              {/* Player indicator */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#4CAF50',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                whiteSpace: 'nowrap',
              }}>
                Player
              </div>
            </div>
          )}

          {/* NPCs */}
          <div style={{
            display: 'flex',
            gap: '40px',
            marginTop: '40px',
          }}>
            {npcSprite1 && (
              <div
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                }}
                onClick={() => setShowDialogue(true)}
              >
                <SimpleSprite
                  id={npcSprite1.path}
                  width={48}
                  height={48}
                  imageRendering="pixelated"
                />
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#FF6B6B',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                }}>
                  NPC
                </div>
              </div>
            )}

            {npcSprite2 && (
              <div
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                }}
                onClick={() => setShowDialogue(true)}
              >
                <SimpleSprite
                  id={npcSprite2.path}
                  width={48}
                  height={48}
                  imageRendering="pixelated"
                />
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#FF6B6B',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                }}>
                  NPC
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Name Indicator */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '12px 20px',
          zIndex: 10,
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFD700' }}>Vale Village</div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
            Position: (5, 3) | Steps: 127
          </div>
        </div>

        {/* Step Counter / Encounter Rate */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #666',
          borderRadius: '8px',
          padding: '12px 20px',
          zIndex: 10,
        }}>
          <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>Encounter Rate</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF6B6B' }}>15%</div>
        </div>

        {/* Dialogue Overlay */}
        {showDialogue && (
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            maxWidth: '600px',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '3px solid #666',
            borderRadius: '12px',
            padding: '20px',
            zIndex: 20,
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}>
              {/* NPC Portrait */}
              {npcSprite1 && (
                <SimpleSprite
                  id={npcSprite1.path}
                  width={64}
                  height={64}
                  imageRendering="pixelated"
                />
              )}
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFD700' }}>Villager</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>Vale Village Resident</div>
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#fff',
              lineHeight: '1.6',
              marginBottom: '16px',
            }}>
              Welcome to Vale Village! This is a peaceful town where adventurers rest before their journey.
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
            }}>
              <button
                onClick={() => setShowDialogue(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              >
                Continue
              </button>
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
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#fff' }}>Layout Notes:</div>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Top-down tile-based map view with grid overlay (for reference)</li>
          <li>Player character centered, NPCs positioned around map</li>
          <li>Map name and position info displayed in top-left</li>
          <li>Encounter rate indicator in top-right</li>
          <li>Dialogue box appears at bottom when talking to NPCs</li>
          <li>NPCs are clickable/interactable (shown with cursor pointer)</li>
          <li>Sprites use drop shadows for depth perception</li>
        </ul>
      </div>
    </div>
  );
}
