/**
 * Overworld Storyboard Component
 * Mockups for overworld exploration and NPC dialogue scenes
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpritesByCategory } from '../sprites';

type OverworldPhase = 'exploration' | 'dialogue';

export function OverworldStoryboard() {
  const [overworldPhase, setOverworldPhase] = useState<OverworldPhase>('exploration');

  // Get sprites
  const isaacSprite = getSpritesByCategory('overworld-protagonists').find(s => s.name.toLowerCase().includes('isaac'));

  // Mock overworld data
  const mockOverworldData = {
    playerPosition: { x: 8, y: 6 },
    mapName: 'Vale Village',
    stepCount: 1247,
    encounterRate: 15, // percent
    npcs: [
      { id: 'villager1', name: 'Villager', position: { x: 12, y: 8 }, dialogue: 'Welcome to Vale Village!' },
      { id: 'merchant', name: 'Merchant', position: { x: 15, y: 10 }, dialogue: 'Looking for equipment?' },
    ],
  };

  const renderExplorationPhase = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#4CAF50', // Grass green fallback
      imageRendering: 'pixelated',
    }}>
      {/* Overworld Background - Try to find a village/town background */}
      <BackgroundSprite
        id="/sprites/backgrounds/gs1/World_Map_Plains.gif"
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

      {/* Tile-based Map Grid (Simplified representation) */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: 'calc(100% - 80px)',
        top: '40px',
        left: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(20, 1fr)',
        gridTemplateRows: 'repeat(12, 1fr)',
        gap: '0',
        zIndex: 1,
      }}>
        {/* Render a simple tile grid representing the overworld map */}
        {Array.from({ length: 240 }, (_, index) => {
          const x = index % 20;
          const y = Math.floor(index / 20);
          const isPlayerPosition = x === mockOverworldData.playerPosition.x && y === mockOverworldData.playerPosition.y;
          const hasNpc = mockOverworldData.npcs.some(npc => npc.position.x === x && npc.position.y === y);

          return (
            <div
              key={index}
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: hasNpc ? '#8B4513' : '#4CAF50', // Brown for buildings, green for grass
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {isPlayerPosition && (
                <div style={{
                  position: 'absolute',
                  zIndex: 5,
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                  left: '50%',
                }}>
                  <SimpleSprite
                    id={isaacSprite?.path || '/sprites/overworld/protagonists/isaac_overworld.gif'}
                    width={32}
                    height={32}
                    imageRendering="pixelated"
                  />
                </div>
              )}
              {hasNpc && !isPlayerPosition && (
                <div style={{
                  position: 'absolute',
                  zIndex: 4,
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                  left: '50%',
                  fontSize: '16px',
                }}>
                  🧑
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map Info Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '40px',
        backgroundColor: '#2c3e50',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 10,
        fontFamily: 'monospace',
        fontSize: '14px',
      }}>
        <div>
          <strong>{mockOverworldData.mapName}</strong>
          <span style={{ marginLeft: '20px', opacity: 0.8 }}>
            Position: ({mockOverworldData.playerPosition.x}, {mockOverworldData.playerPosition.y})
          </span>
        </div>
        <div style={{
          padding: '4px 12px',
          backgroundColor: '#e74c3c',
          borderRadius: '4px',
          fontWeight: 'bold',
        }}>
          Encounter Rate: {mockOverworldData.encounterRate}%
        </div>
      </div>

      {/* Step Counter */}
      <div style={{
        position: 'absolute',
        top: '50px',
        right: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 10,
      }}>
        Steps: {mockOverworldData.stepCount.toLocaleString()}
      </div>

      {/* Movement Controls Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '12px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 10,
        textAlign: 'center',
      }}>
        Use Arrow Keys to Move<br/>
        Press SPACE near NPCs to Talk
      </div>

      {/* Menu Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '80px',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 10,
      }}>
        {[
          { label: 'Party', description: 'View/Edit Party' },
          { label: 'Items', description: 'Inventory' },
          { label: 'Psynergy', description: 'Magic/Abilities' },
          { label: 'Status', description: 'Character Stats' },
          { label: 'Save', description: 'Save Game' },
          { label: 'Menu', description: 'Main Menu' },
        ].map((menu) => (
          <div key={menu.label} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}>
            <div style={{
              color: '#FFFFFF',
              fontSize: '14px',
              fontFamily: 'monospace',
              marginBottom: '2px',
            }}>
              {menu.label}
            </div>
            <div style={{
              color: '#AAAAAA',
              fontSize: '10px',
              fontFamily: 'monospace',
              textAlign: 'center',
            }}>
              {menu.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDialoguePhase = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#4CAF50',
      imageRendering: 'pixelated',
    }}>
      {/* Overworld Background */}
      <BackgroundSprite
        id="/sprites/backgrounds/gs1/World_Map_Plains.gif"
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

      {/* Simplified Map View with Player and NPC */}
      <div style={{
        position: 'absolute',
        width: '60%',
        height: 'calc(100% - 200px)',
        top: '40px',
        left: '20%',
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        border: '4px solid #2E7D32',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        {/* Player Character */}
        <div style={{
          position: 'absolute',
          left: '30%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id={isaacSprite?.path || '/sprites/overworld/protagonists/isaac_overworld.gif'}
            width={48}
            height={48}
            imageRendering="pixelated"
          />
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            marginTop: '4px',
          }}>
            Isaac
          </div>
        </div>

        {/* NPC Character */}
        <div style={{
          position: 'absolute',
          right: '30%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#8B4513',
            border: '2px solid #654321',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
          }}>
            🧑
          </div>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            marginTop: '4px',
          }}>
            Villager
          </div>
        </div>

        {/* Dialogue indicator */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#FFD700',
          color: '#000',
          padding: '4px 12px',
          borderRadius: '16px',
          fontSize: '12px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}>
          💬 DIALOGUE ACTIVE
        </div>
      </div>

      {/* Dialogue Box */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '200px',
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderTop: '4px solid #FFD700',
        display: 'flex',
        zIndex: 10,
      }}>
        {/* NPC Portrait */}
        <div style={{
          width: '150px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '2px solid #FFD700',
          backgroundColor: 'rgba(139, 69, 19, 0.3)',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#8B4513',
            border: '3px solid #654321',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
          }}>
            🧑
          </div>
        </div>

        {/* Dialogue Content */}
        <div style={{
          flex: 1,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Character Name */}
          <div style={{
            color: '#FFD700',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '10px',
          }}>
            Villager
          </div>

          {/* Dialogue Text */}
          <div style={{
            color: '#FFFFFF',
            fontSize: '14px',
            fontFamily: 'monospace',
            lineHeight: '1.4',
            marginBottom: '20px',
          }}>
            "Welcome to Vale Village, young adventurer! Our village has been peaceful for many years, but strange things have been happening lately. Monsters have appeared in the forests nearby, and some villagers have gone missing."
            <br/><br/>
            "Please, if you have the strength, help us investigate what might be causing this disturbance. The elders may have more information for you."
          </div>

          {/* Continue Prompt */}
          <div style={{
            color: '#AAAAAA',
            fontSize: '12px',
            fontFamily: 'monospace',
            textAlign: 'right',
          }}>
            Press SPACE to continue...
          </div>
        </div>
      </div>

      {/* Map Name Indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#FFD700',
        padding: '8px 16px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: 10,
      }}>
        {mockOverworldData.mapName}
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Phase Selector */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 20,
        display: 'flex',
        gap: '10px',
      }}>
        {[
          { id: 'exploration', label: 'Exploration' },
          { id: 'dialogue', label: 'Dialogue' },
        ].map(phase => (
          <button
            key={phase.id}
            onClick={() => setOverworldPhase(phase.id as OverworldPhase)}
            style={{
              padding: '8px 16px',
              backgroundColor: overworldPhase === phase.id ? '#4CAF50' : 'rgba(0,0,0,0.8)',
              color: '#fff',
              border: overworldPhase === phase.id ? '2px solid #FFD700' : '2px solid #fff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            {phase.label}
          </button>
        ))}
      </div>

      {/* Current Phase Content */}
      {overworldPhase === 'exploration' && renderExplorationPhase()}
      {overworldPhase === 'dialogue' && renderDialoguePhase()}
    </div>
  );
}