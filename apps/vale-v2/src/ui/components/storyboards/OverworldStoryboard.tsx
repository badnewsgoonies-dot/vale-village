/**
 * Overworld Storyboard Component
 * 
 * Shows overworld exploration mockup with top-down tile-based map view,
 * player character, NPCs, and dialogue overlay.
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, searchSprites } from '../../sprites';

export function OverworldStoryboard() {
  const [showDialogue, setShowDialogue] = useState(false);
  const [showMapInfo, setShowMapInfo] = useState(true);

  // Find player sprite (Isaac overworld)
  const playerSprite = getSpriteById('isaac-overworld') || searchSprites('isaac')[0];
  const npcSprites = searchSprites('npc').slice(0, 3);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000',
    }}>
      {/* Controls */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setShowDialogue(!showDialogue)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showDialogue ? '#4CAF50' : '#444',
            color: '#fff',
            border: '1px solid #666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          {showDialogue ? 'Hide' : 'Show'} Dialogue
        </button>
        <button
          onClick={() => setShowMapInfo(!showMapInfo)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showMapInfo ? '#4CAF50' : '#444',
            color: '#fff',
            border: '1px solid #666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          {showMapInfo ? 'Hide' : 'Show'} Map Info
        </button>
      </div>

      {/* Overworld Canvas */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        imageRendering: 'pixelated',
      }}>
        {/* Background (overworld map) */}
        <BackgroundSprite
          id="/sprites/backgrounds/gs1/Vale_Forest.gif"
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

        {/* Grid-based Map Tiles (simplified representation) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 48px)',
          gridTemplateRows: 'repeat(8, 48px)',
          gap: '2px',
          zIndex: 1,
        }}>
          {Array.from({ length: 80 }).map((_, idx) => {
            const x = idx % 10;
            const y = Math.floor(idx / 10);
            const isPlayerPos = x === 5 && y === 4;
            const isNPCPos = (x === 3 && y === 3) || (x === 7 && y === 3) || (x === 5 && y === 6);
            const isBuilding = (x === 2 && y === 2) || (x === 8 && y === 2);

            if (isPlayerPos) {
              return (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(100, 150, 200, 0.3)',
                    border: '2px solid #4CAF50',
                    borderRadius: '4px',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}>
                    <SimpleSprite
                      id={playerSprite?.path || '/sprites/overworld/protagonists/isaac.gif'}
                      width={32}
                      height={32}
                      imageRendering="pixelated"
                    />
                  </div>
                </div>
              );
            }

            if (isNPCPos) {
              return (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(150, 100, 200, 0.3)',
                    border: '1px solid #666',
                    borderRadius: '4px',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}>
                    <SimpleSprite
                      id={npcSprites[0]?.path || '/sprites/overworld/npc.gif'}
                      width={24}
                      height={24}
                      imageRendering="pixelated"
                    />
                  </div>
                </div>
              );
            }

            if (isBuilding) {
              return (
                <div key={idx} style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(139, 69, 19, 0.6)',
                  border: '2px solid #8B4513',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  🏠
                </div>
              );
            }

            return (
              <div
                key={idx}
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(34, 139, 34, 0.4)',
                  border: '1px solid rgba(34, 139, 34, 0.6)',
                  borderRadius: '2px',
                }}
              />
            );
          })}
        </div>

        {/* Map Info Header */}
        {showMapInfo && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #4CAF50',
            borderRadius: '8px',
            padding: '12px',
            zIndex: 10,
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', color: '#4CAF50' }}>
              Vale Forest
            </div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>
              Position: (5, 4)
            </div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>
              Steps: 127
            </div>
            <div style={{ fontSize: '12px', color: '#ff4444', marginTop: '4px' }}>
              Encounter Rate: 5%
            </div>
          </div>
        )}

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
            border: '3px solid #4CAF50',
            borderRadius: '12px',
            padding: '20px',
            zIndex: 20,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#2a2a2a',
                border: '2px solid #4CAF50',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}>
                👤
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#4CAF50',
              }}>
                Village Elder
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#fff',
              lineHeight: '1.6',
              marginBottom: '12px',
            }}>
              Welcome to Vale Village, traveler! The ancient ruins to the east hold many secrets...
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end',
            }}>
              <button style={{
                padding: '6px 16px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}>
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
        fontSize: '0.875rem',
        color: '#aaa',
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>
          Layout Notes:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
          <li>Top-down tile-based map view (10x8 grid shown)</li>
          <li>Player character (Isaac) centered and highlighted</li>
          <li>NPCs positioned on map tiles (purple highlight)</li>
          <li>Buildings represented as brown tiles</li>
          <li>Map info panel shows current location and step counter</li>
          <li>Dialogue box appears at bottom when talking to NPCs</li>
          <li>Encounter rate displayed for random battle triggers</li>
        </ul>
      </div>
    </div>
  );
}
