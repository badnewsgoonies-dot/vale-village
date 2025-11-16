/**
 * Overworld Exploration Storyboard
 * Shows top-down exploration view with player, NPCs, and buildings
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, getSpritesByCategory } from '../../sprites';

export function OverworldStoryboard() {
  const [showDialogue, setShowDialogue] = useState(false);

  // Find player sprite (Isaac overworld)
  const playerSprite = getSpriteById('isaac-overworld') || getSpritesByCategory('overworld-protagonists')[0];

  // Find NPC sprites
  const npcSprites = getSpritesByCategory('overworld-majornpcs').slice(0, 3);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Controls */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
      }}>
        <button
          onClick={() => setShowDialogue(!showDialogue)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showDialogue ? '#4CAF50' : '#3a3a3a',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showDialogue ? 'Hide' : 'Show'} Dialogue
        </button>
      </div>

      {/* Overworld Map */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#87CEEB',
      }}>
        {/* Background (overworld style) */}
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

        {/* Map Content */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}>
          {/* Tile Grid (simplified) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 64px)',
            gridTemplateRows: 'repeat(8, 64px)',
            gap: '0',
            backgroundColor: 'rgba(139, 195, 74, 0.3)',
            border: '2px solid rgba(0, 0, 0, 0.3)',
            padding: '1rem',
          }}>
            {/* Player Character (centered) */}
            <div style={{
              gridColumn: '5',
              gridRow: '4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}>
              <SimpleSprite
                id={playerSprite?.path || '/sprites/overworld/protagonists/Isaac.gif'}
                width={48}
                height={48}
                imageRendering="pixelated"
              />
            </div>

            {/* NPCs */}
            {npcSprites.map((npc, idx) => (
              <div
                key={idx}
                style={{
                  gridColumn: idx === 0 ? '3' : idx === 1 ? '7' : '5',
                  gridRow: idx === 0 ? '2' : idx === 1 ? '6' : '2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 5,
                }}
              >
                <SimpleSprite
                  id={npc.path}
                  width={48}
                  height={48}
                  imageRendering="pixelated"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Map Name Indicator */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '4px',
          color: '#FFD700',
          fontWeight: 'bold',
          zIndex: 20,
        }}>
          Vale Village
        </div>

        {/* Step Counter */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '4px',
          color: '#fff',
          fontSize: '0.875rem',
          zIndex: 20,
        }}>
          Steps: 42
        </div>

        {/* Dialogue Box Overlay */}
        {showDialogue && (
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '10%',
            right: '10%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '3px solid #FFD700',
            borderRadius: '8px',
            padding: '1.5rem',
            zIndex: 30,
          }}>
            <div style={{
              color: '#FFD700',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              fontSize: '1.1rem',
            }}>
              Villager
            </div>
            <div style={{
              color: '#fff',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1rem',
            }}>
              Welcome to Vale Village! The ancient ruins to the north hold many secrets...
            </div>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
            }}>
              <button style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}










