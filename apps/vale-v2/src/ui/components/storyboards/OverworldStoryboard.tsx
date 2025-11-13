/**
 * Overworld Storyboard Component
 * Mockup for top-down exploration with NPCs and dialogue
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, searchSprites, getSpritesByCategory } from '../../sprites';

type OverworldMode = 'exploration' | 'dialogue' | 'menu';

const MODES: { value: OverworldMode; label: string; description: string }[] = [
  {
    value: 'exploration',
    label: 'Exploration',
    description: 'Free movement on tile-based map'
  },
  {
    value: 'dialogue',
    label: 'NPC Dialogue',
    description: 'Talking to villagers and characters'
  },
  {
    value: 'menu',
    label: 'Menu Overlay',
    description: 'Game menu with options'
  }
];

export function OverworldStoryboard() {
  const [currentMode, setCurrentMode] = useState<OverworldMode>('exploration');

  // Find overworld sprites
  const isaacOverworld = searchSprites('isaac overworld')[0] || searchSprites('isaac')[1] || getSpritesByCategory('overworld-protagonists')[0];
  const villagerSprites = getSpritesByCategory('overworld-protagonists').slice(1, 4);

  const renderExplorationMode = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#4CAF50', // Grass green fallback
      imageRendering: 'pixelated',
    }}>
      {/* Tile-based overworld background */}
      <BackgroundSprite
        id="/sprites/backgrounds/gs1/World_Map_Grasslands.gif"
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

      {/* Grid overlay for tile effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Buildings and scenery */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2,
      }}>
        {/* Village buildings */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {/* Large house */}
          <div style={{
            width: '120px',
            height: '80px',
            backgroundColor: '#8B4513',
            border: '2px solid #654321',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '10px',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}>
            Village House
          </div>
          {/* Small buildings */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              width: '60px',
              height: '50px',
              backgroundColor: '#D2691E',
              border: '2px solid #A0522D',
              borderRadius: '4px',
            }} />
            <div style={{
              width: '60px',
              height: '50px',
              backgroundColor: '#D2691E',
              border: '2px solid #A0522D',
              borderRadius: '4px',
            }} />
          </div>
        </div>

        {/* Trees and scenery */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          display: 'flex',
          gap: '16px',
        }}>
          <div style={{
            width: '40px',
            height: '60px',
            backgroundColor: '#228B22',
            borderRadius: '50% 50% 20px 20px',
            border: '2px solid #006400',
          }} />
          <div style={{
            width: '40px',
            height: '60px',
            backgroundColor: '#32CD32',
            borderRadius: '50% 50% 20px 20px',
            border: '2px solid #228B22',
          }} />
        </div>
      </div>

      {/* NPCs positioned on map */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 3,
      }}>
        {/* Villager 1 - Near house */}
        <div style={{
          position: 'absolute',
          top: '35%',
          right: '20%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id={villagerSprites[0]?.path || '/sprites/overworld/villager1.gif'}
            width={32}
            height={32}
            imageRendering="pixelated"
          />
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '1px 4px',
            borderRadius: '2px',
            fontSize: '10px',
            marginTop: '2px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}>
            Villager
          </div>
        </div>

        {/* Villager 2 - By trees */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '15%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id={villagerSprites[1]?.path || '/sprites/overworld/villager2.gif'}
            width={32}
            height={32}
            imageRendering="pixelated"
          />
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '1px 4px',
            borderRadius: '2px',
            fontSize: '10px',
            marginTop: '2px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}>
            Merchant
          </div>
        </div>

        {/* Guard - At entrance */}
        <div style={{
          position: 'absolute',
          top: '60%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id={villagerSprites[2]?.path || '/sprites/overworld/guard.gif'}
            width={32}
            height={32}
            imageRendering="pixelated"
          />
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '1px 4px',
            borderRadius: '2px',
            fontSize: '10px',
            marginTop: '2px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}>
            Guard
          </div>
        </div>
      </div>

      {/* Player character - centered */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 4,
      }}>
        {/* Player shadow */}
        <div style={{
          position: 'absolute',
          bottom: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '24px',
          height: '6px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '50%',
          zIndex: 0,
        }} />

        <SimpleSprite
          id={isaacOverworld?.path || '/sprites/overworld/isaac/front.gif'}
          width={32}
          height={32}
          imageRendering="pixelated"
          style={{ position: 'relative', zIndex: 1 }}
        />

        <div style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#FFD700',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '11px',
          marginTop: '4px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        }}>
          Isaac Lv.5
        </div>
      </div>

      {/* UI Elements */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 5,
      }}>
        Vale Village
      </div>

      {/* Step counter */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 5,
      }}>
        Steps: 1,247
      </div>

      {/* Movement hint */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#FFD700',
        padding: '6px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 5,
      }}>
        Use WASD or Arrow Keys to move
      </div>
    </div>
  );

  const renderDialogueMode = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#4CAF50',
      imageRendering: 'pixelated',
    }}>
      {/* Same overworld background */}
      <BackgroundSprite
        id="/sprites/backgrounds/gs1/World_Map_Grasslands.gif"
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

      {/* Grid overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Player character - facing NPC */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '45%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 3,
      }}>
        <SimpleSprite
          id={isaacOverworld?.path || '/sprites/overworld/isaac/right.gif'}
          width={32}
          height={32}
          imageRendering="pixelated"
        />
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#FFD700',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '11px',
          marginTop: '4px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}>
          Isaac
        </div>
      </div>

      {/* NPC being talked to */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '55%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 3,
      }}>
        <SimpleSprite
          id={villagerSprites[0]?.path || '/sprites/overworld/villager1.gif'}
          width={32}
          height={32}
          imageRendering="pixelated"
        />
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#FFD700',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '11px',
          marginTop: '4px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}>
          Villager
        </div>
        {/* Speaking indicator */}
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#FFD700',
          fontSize: '16px',
          zIndex: 4,
        }}>
          💬
        </div>
      </div>

      {/* Dialogue Box Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: '600px',
        backgroundColor: '#000',
        border: '2px solid #FFD700',
        borderRadius: '8px',
        padding: '16px',
        zIndex: 10,
      }}>
        {/* Character Name */}
        <div style={{
          color: '#FFD700',
          fontSize: '16px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          marginBottom: '8px',
        }}>
          Village Elder
        </div>

        {/* Dialogue Text */}
        <div style={{
          color: '#fff',
          fontSize: '14px',
          fontFamily: 'monospace',
          lineHeight: '1.4',
          marginBottom: '16px',
          minHeight: '40px',
        }}>
          Welcome to Vale Village, young traveler! The ancient ruins to the north hold great power, but beware the monsters that guard them. Have you heard about the Elemental Stars?
        </div>

        {/* Continue/Choice Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            color: '#FFD700',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}>
            Press SPACE to continue...
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
          }}>
            <button style={{
              padding: '4px 12px',
              backgroundColor: '#FFD700',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}>
              Yes
            </button>
            <button style={{
              padding: '4px 12px',
              backgroundColor: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}>
              No
            </button>
          </div>
        </div>
      </div>

      {/* UI Elements */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 5,
      }}>
        Vale Village
      </div>
    </div>
  );

  const renderMenuMode = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#4CAF50',
      imageRendering: 'pixelated',
    }}>
      {/* Overworld background with blur effect */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        filter: 'blur(2px) brightness(0.6)',
        zIndex: 0,
      }}>
        <BackgroundSprite
          id="/sprites/backgrounds/gs1/World_Map_Grasslands.gif"
          style={{
            width: '100%',
            height: '100%',
          }}
          sizeMode="cover"
        />
      </div>

      {/* Menu Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}>
        <div style={{
          backgroundColor: '#000',
          border: '2px solid #FFD700',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '300px',
          textAlign: 'center',
        }}>
          {/* Menu Title */}
          <div style={{
            color: '#FFD700',
            fontSize: '24px',
            fontFamily: 'serif',
            fontWeight: 'bold',
            marginBottom: '20px',
          }}>
            Menu
          </div>

          {/* Menu Options */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {[
              'Items',
              'Psynergy',
              'Djinn',
              'Status',
              'Save',
              'Options',
              'Quit'
            ].map(option => (
              <button
                key={option}
                style={{
                  padding: '8px 16px',
                  backgroundColor: option === 'Save' ? '#FFD700' : '#333',
                  color: option === 'Save' ? '#000' : '#fff',
                  border: '1px solid #666',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD700';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = option === 'Save' ? '#FFD700' : '#333';
                  e.currentTarget.style.color = option === 'Save' ? '#000' : '#fff';
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Close instruction */}
          <div style={{
            color: '#ccc',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}>
            Press ESC or click outside to close
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentMode = () => {
    switch (currentMode) {
      case 'exploration':
        return renderExplorationMode();
      case 'dialogue':
        return renderDialogueMode();
      case 'menu':
        return renderMenuMode();
      default:
        return renderExplorationMode();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Mode Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        zIndex: 20,
      }}>
        {MODES.map(mode => (
          <button
            key={mode.value}
            onClick={() => setCurrentMode(mode.value)}
            style={{
              padding: '6px 12px',
              backgroundColor: currentMode === mode.value ? '#4CAF50' : '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
            title={mode.description}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {renderCurrentMode()}

      {/* Description */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '400px',
        zIndex: 15,
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {MODES.find(m => m.value === currentMode)?.label}
        </div>
        <div style={{ color: '#ccc' }}>
          {MODES.find(m => m.value === currentMode)?.description}
        </div>
        <div style={{ color: '#888', marginTop: '8px', fontSize: '11px' }}>
          • Tile-based movement system
          • Random encounter mechanics
          • NPC interaction and quests
          • Save points and fast travel
        </div>
      </div>
    </div>
  );
}