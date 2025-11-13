/**
 * Overworld Storyboard
 * 
 * Mockup for top-down tile-based exploration:
 * - Player character centered
 * - NPC sprites positioned on map
 * - Buildings/scenery sprites
 * - Dialogue box overlay
 * - Map name indicator
 * - Step counter
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, searchSprites } from '../../sprites';

type OverworldState = 'exploring' | 'dialogue';

export function OverworldStoryboard() {
  const [state, setState] = useState<OverworldState>('exploring');

  // Find player sprite
  const playerSprite = getSpriteById('isaac-overworld') || getSpriteById('isaac-front');
  
  // Find NPC sprites
  const npcSprites = searchSprites('npc').slice(0, 3).concat(
    searchSprites('villager').slice(0, 2)
  );

  // Mock tile grid (5x5 for visualization)
  const tileSize = 64;
  const gridSize = 5;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a2e',
    }}>
      {/* State Selector */}
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.9rem', color: '#aaa', marginRight: '1rem' }}>State:</span>
        {(['exploring', 'dialogue'] as OverworldState[]).map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: state === s ? '#4CAF50' : '#333',
              color: '#fff',
              border: `1px solid ${state === s ? '#66BB6A' : '#555'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Map Info Header */}
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: '#2c3e50',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #444',
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'monospace' }}>
            Vale Village
          </h2>
          <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.9 }}>
            Position: (2, 2) | Steps: 47
          </div>
        </div>
        <div style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#e74c3c',
          borderRadius: '4px',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          fontFamily: 'monospace',
        }}>
          Encounter Rate: 5%
        </div>
      </div>

      {/* Map Container */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
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
            opacity: 0.3,
          }}
          sizeMode="cover"
        />

        {/* Tile Grid */}
        <div style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${tileSize}px)`,
          gap: '2px',
          backgroundColor: '#2a2a2a',
          padding: '4px',
          zIndex: 1,
        }}>
          {/* Render tiles */}
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const x = idx % gridSize;
            const y = Math.floor(idx / gridSize);
            const isCenter = x === 2 && y === 2;
            const isGrass = (x + y) % 2 === 0;

            return (
              <div
                key={idx}
                style={{
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: isGrass ? '#4a7c59' : '#5a8a6a',
                  border: isCenter ? '2px solid #FFD700' : '1px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Player at center */}
                {isCenter && playerSprite && (
                  <SimpleSprite
                    id={playerSprite.path}
                    width={48}
                    height={48}
                    imageRendering="pixelated"
                    style={{ zIndex: 10 }}
                  />
                )}

                {/* NPCs at various positions */}
                {x === 1 && y === 1 && npcSprites[0] && (
                  <SimpleSprite
                    id={npcSprites[0].path}
                    width={48}
                    height={48}
                    imageRendering="pixelated"
                    style={{ zIndex: 5 }}
                  />
                )}
                {x === 3 && y === 1 && npcSprites[1] && (
                  <SimpleSprite
                    id={npcSprites[1].path}
                    width={48}
                    height={48}
                    imageRendering="pixelated"
                    style={{ zIndex: 5 }}
                  />
                )}
                {x === 1 && y === 3 && npcSprites[2] && (
                  <SimpleSprite
                    id={npcSprites[2].path}
                    width={48}
                    height={48}
                    imageRendering="pixelated"
                    style={{ zIndex: 5 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Dialogue Box Overlay */}
        {state === 'dialogue' && (
          <div style={{
            position: 'absolute',
            bottom: '40px',
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
            {/* NPC Sprite */}
            <div style={{
              position: 'absolute',
              left: '-60px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}>
              {npcSprites[0] && (
                <SimpleSprite
                  id={npcSprites[0].path}
                  width={64}
                  height={64}
                  imageRendering="pixelated"
                />
              )}
            </div>

            {/* Dialogue Content */}
            <div style={{
              marginLeft: '20px',
            }}>
              <div style={{
                fontSize: '14px',
                color: '#4CAF50',
                fontFamily: 'monospace',
                marginBottom: '12px',
                fontWeight: 'bold',
              }}>
                Villager
              </div>
              <div style={{
                fontSize: '16px',
                color: '#fff',
                fontFamily: 'monospace',
                lineHeight: '1.6',
                marginBottom: '16px',
              }}>
                Welcome to Vale Village! The ancient ruins to the east hold many secrets...
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
              }}>
                <button
                  onClick={() => setState('exploring')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
