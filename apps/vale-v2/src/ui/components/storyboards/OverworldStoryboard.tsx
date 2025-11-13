/**
 * Overworld Storyboard
 * 
 * Shows overworld exploration mockups with player character, NPCs, and dialogue.
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, getSpritesByCategory } from '../../sprites';

export function OverworldStoryboard() {
  const [showDialogue, setShowDialogue] = useState(false);

  // Find overworld sprites
  const isaacOverworld = getSpriteById('isaac-overworld') || getSpritesByCategory('overworld-protagonists')[0];
  const npcSprites = getSpritesByCategory('overworld-protagonists').slice(1, 3);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
    }}>
      {/* State Toggle */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <span style={{ color: '#aaa', marginRight: '0.5rem' }}>State:</span>
        <button
          onClick={() => setShowDialogue(false)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: !showDialogue ? '#4a9eff' : '#333',
            color: '#fff',
            border: `1px solid ${!showDialogue ? '#6bb6ff' : '#555'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
          }}
        >
          Exploration
        </button>
        <button
          onClick={() => setShowDialogue(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showDialogue ? '#4a9eff' : '#333',
            color: '#fff',
            border: `1px solid ${showDialogue ? '#6bb6ff' : '#555'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
          }}
        >
          Dialogue
        </button>
      </div>

      {/* Overworld Scene */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#5a8a5a',
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
          }}
          sizeMode="cover"
        />

        {/* Map Grid (Tile-based) */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(20, 1fr)',
          gridTemplateRows: 'repeat(15, 1fr)',
          zIndex: 1,
        }}>
          {Array.from({ length: 300 }).map((_, i) => (
            <div
              key={i}
              style={{
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: i % 3 === 0 ? 'rgba(100, 150, 100, 0.3)' : 'rgba(120, 180, 120, 0.2)',
              }}
            />
          ))}
        </div>

        {/* Map Name Indicator */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          border: '2px solid #666',
          borderRadius: '4px',
          color: '#fff',
          fontSize: '14px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          zIndex: 10,
        }}>
          Vale Village
        </div>

        {/* Step Counter */}
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '20px',
          padding: '6px 12px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          border: '2px solid #666',
          borderRadius: '4px',
          color: '#fff',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 10,
        }}>
          Steps: 127
        </div>

        {/* Player Character (Centered) */}
        {isaacOverworld && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          }}>
            <SimpleSprite
              id={isaacOverworld.path}
              width={48}
              height={48}
              imageRendering="pixelated"
            />
            {!showDialogue && (
              <div style={{
                marginTop: '4px',
                padding: '2px 6px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fontSize: '10px',
                borderRadius: '2px',
                textAlign: 'center',
              }}>
                Player
              </div>
            )}
          </div>
        )}

        {/* NPCs */}
        {npcSprites[0] && (
          <div style={{
            position: 'absolute',
            top: '35%',
            left: '30%',
            zIndex: 5,
          }}>
            <SimpleSprite
              id={npcSprites[0].path}
              width={48}
              height={48}
              imageRendering="pixelated"
            />
            {!showDialogue && (
              <div style={{
                marginTop: '4px',
                padding: '2px 6px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fontSize: '10px',
                borderRadius: '2px',
                textAlign: 'center',
              }}>
                NPC
              </div>
            )}
          </div>
        )}

        {npcSprites[1] && (
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '25%',
            zIndex: 5,
          }}>
            <SimpleSprite
              id={npcSprites[1].path}
              width={48}
              height={48}
              imageRendering="pixelated"
            />
            {!showDialogue && (
              <div style={{
                marginTop: '4px',
                padding: '2px 6px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fontSize: '10px',
                borderRadius: '2px',
                textAlign: 'center',
              }}>
                NPC
              </div>
            )}
          </div>
        )}

        {/* Buildings/Scenery (Placeholder) */}
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(139, 69, 19, 0.8)',
          border: '2px solid #8B4513',
          borderRadius: '4px',
          zIndex: 3,
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontSize: '10px',
            textAlign: 'center',
          }}>
            Building
          </div>
        </div>

        {/* Dialogue Box Overlay */}
        {showDialogue && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            maxWidth: '600px',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '3px solid #666',
            borderRadius: '8px',
            padding: '20px',
            zIndex: 20,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#444',
                border: '2px solid #666',
                borderRadius: '4px',
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '24px',
              }}>
                N
              </div>
              <div style={{
                color: '#4a9eff',
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
              }}>
                Villager
              </div>
            </div>
            <div style={{
              color: '#fff',
              fontSize: '14px',
              lineHeight: '1.6',
              fontFamily: 'monospace',
              marginBottom: '12px',
            }}>
              Welcome to Vale Village! This is a peaceful town where adventurers gather before their journey.
            </div>
            <div style={{
              color: '#aaa',
              fontSize: '12px',
              fontFamily: 'monospace',
              textAlign: 'right',
            }}>
              Press SPACE to continue...
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
          <li>Tile-based grid system for map navigation</li>
          <li>Player character centered, moves with arrow keys</li>
          <li>NPCs positioned at specific map coordinates</li>
          <li>Buildings and scenery provide visual landmarks</li>
          <li>Map name and step counter for navigation context</li>
          <li>Dialogue box appears when interacting with NPCs</li>
        </ul>
      </div>
    </div>
  );
}
