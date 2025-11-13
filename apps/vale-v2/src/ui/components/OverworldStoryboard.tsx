/**
 * Overworld Storyboard Component
 * Shows top-down exploration with NPC interactions and dialogue
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite } from '../sprites';

type OverworldState = 'exploring' | 'dialogue';

const STATE_NAMES: Record<OverworldState, string> = {
  exploring: 'Map Exploration',
  dialogue: 'NPC Dialogue',
};

const STATE_DESCRIPTIONS: Record<OverworldState, string> = {
  exploring: 'Top-down tile-based movement with scenery and NPCs',
  dialogue: 'Conversation interface with NPC sprites and text boxes',
};

export function OverworldStoryboard() {
  const [currentState, setCurrentState] = useState<OverworldState>('exploring');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#000',
      imageRendering: 'pixelated',
    }}>
      {/* State Selector */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        gap: '8px',
      }}>
        {(Object.keys(STATE_NAMES) as OverworldState[]).map((state) => (
          <button
            key={state}
            onClick={() => setCurrentState(state)}
            style={{
              padding: '8px 16px',
              backgroundColor: currentState === state ? '#ffd700' : 'rgba(0,0,0,0.8)',
              color: currentState === state ? '#000' : '#fff',
              border: currentState === state ? '2px solid #fff' : '2px solid #666',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}
          >
            {STATE_NAMES[state]}
          </button>
        ))}
      </div>

      {/* State Description */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '12px',
        borderRadius: '8px',
        maxWidth: '400px',
        fontSize: '14px',
        fontFamily: 'monospace',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {STATE_NAMES[currentState]}
        </div>
        <div style={{ color: '#ccc' }}>
          {STATE_DESCRIPTIONS[currentState]}
        </div>
      </div>

      {/* Overworld Content */}
      {currentState === 'exploring' && <ExplorationStoryboard />}
      {currentState === 'dialogue' && <DialogueOverlayStoryboard />}
    </div>
  );
}

function ExplorationStoryboard() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Overworld Background - Town/Village */}
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

      {/* Tile-based Map Grid (simulated) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '600px',
        zIndex: 1,
        border: '2px solid rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(0,0,0,0.1)',
      }}>
        {/* Buildings/Scenery */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          zIndex: 2,
        }}>
          <div style={{
            width: '120px',
            height: '80px',
            backgroundColor: 'rgba(139, 69, 19, 0.8)',
            border: '2px solid #8B4513',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}>
            🏠 House
          </div>
        </div>

        <div style={{
          position: 'absolute',
          top: '40%',
          right: '20%',
          zIndex: 2,
        }}>
          <div style={{
            width: '100px',
            height: '60px',
            backgroundColor: 'rgba(160, 82, 45, 0.8)',
            border: '2px solid #A0522D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}>
            🏪 Shop
          </div>
        </div>

        {/* Trees/Scenery */}
        <div style={{
          position: 'absolute',
          bottom: '30%',
          left: '10%',
          zIndex: 2,
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(34, 139, 34, 0.8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '16px',
          }}>
            🌳
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          zIndex: 2,
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(34, 139, 34, 0.8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '16px',
          }}>
            🌲
          </div>
        </div>

        {/* Player Character - Isaac (centered) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Player shadow */}
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '32px',
            height: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '50%',
            zIndex: 1,
          }} />
          <SimpleSprite
            id="isaac-overworld"
            width={48}
            height={48}
            imageRendering="pixelated"
            style={{ position: 'relative', zIndex: 2 }}
          />
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#ffd700',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            marginTop: '2px',
            fontFamily: 'monospace',
            border: '1px solid #ffd700',
          }}>
            Isaac
          </div>
        </div>

        {/* NPCs */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '60%',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id="npc-villager"
            width={40}
            height={40}
            imageRendering="pixelated"
          />
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            marginTop: '2px',
            fontFamily: 'monospace',
          }}>
            Villager
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '40%',
          left: '70%',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id="npc-guard"
            width={40}
            height={40}
            imageRendering="pixelated"
          />
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            marginTop: '2px',
            fontFamily: 'monospace',
          }}>
            Guard
          </div>
        </div>

        <div style={{
          position: 'absolute',
          top: '60%',
          left: '20%',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <SimpleSprite
            id="npc-merchant"
            width={40}
            height={40}
            imageRendering="pixelated"
          />
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            marginTop: '2px',
            fontFamily: 'monospace',
          }}>
            Merchant
          </div>
        </div>
      </div>

      {/* UI Elements */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        border: '2px solid #666',
        borderRadius: '8px',
        padding: '8px 16px',
      }}>
        <div style={{
          color: '#ffd700',
          fontSize: '16px',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}>
          Vale Village
        </div>
      </div>

      {/* Step Counter */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        border: '2px solid #666',
        borderRadius: '8px',
        padding: '8px 16px',
      }}>
        <div style={{
          color: '#fff',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}>
          Steps: 1,247
        </div>
        <div style={{
          color: '#4CAF50',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}>
          Random encounter soon...
        </div>
      </div>

      {/* Movement Hint */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        border: '2px solid #666',
        borderRadius: '8px',
        padding: '12px',
        maxWidth: '200px',
      }}>
        <div style={{
          color: '#ffd700',
          fontSize: '14px',
          marginBottom: '8px',
          fontFamily: 'monospace',
        }}>
          Movement
        </div>
        <div style={{
          color: '#ccc',
          fontSize: '12px',
          fontFamily: 'monospace',
          lineHeight: '1.4',
        }}>
          • WASD or Arrow Keys
          <br />
          • Space/Near NPC: Talk
          <br />
          • Enter: Menu
          <br />
          • Random encounters
        </div>
      </div>
    </div>
  );
}

function DialogueOverlayStoryboard() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background (same as exploration but slightly dimmed) */}
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
          filter: 'brightness(0.6)',
        }}
        sizeMode="cover"
      />

      {/* Map Grid (dimmed) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '600px',
        zIndex: 1,
        border: '2px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        filter: 'brightness(0.4)',
      }}>
        {/* Player Character */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: 0.6,
        }}>
          <SimpleSprite
            id="isaac-overworld"
            width={48}
            height={48}
            imageRendering="pixelated"
          />
        </div>

        {/* Talking NPC (highlighted) */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '60%',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Highlight effect */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 215, 0, 0.3)',
            borderRadius: '50%',
            zIndex: 1,
          }} />
          <SimpleSprite
            id="npc-villager"
            width={40}
            height={40}
            imageRendering="pixelated"
            style={{ position: 'relative', zIndex: 2 }}
          />
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#ffd700',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            marginTop: '2px',
            fontFamily: 'monospace',
            border: '1px solid #ffd700',
          }}>
            Villager
          </div>
        </div>
      </div>

      {/* Dialogue Box */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '700px',
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.95)',
        border: '3px solid #666',
        borderRadius: '12px',
        padding: '20px',
      }}>
        {/* NPC Name */}
        <div style={{
          color: '#ffd700',
          fontSize: '18px',
          fontFamily: 'monospace',
          marginBottom: '12px',
          fontWeight: 'bold',
        }}>
          Village Elder
        </div>

        {/* Dialogue Text */}
        <div style={{
          color: '#fff',
          fontSize: '16px',
          fontFamily: 'monospace',
          lineHeight: '1.6',
          marginBottom: '20px',
          minHeight: '60px',
        }}>
          "Ah, young travelers! I see you've come from afar. The road ahead is dangerous,
          filled with fierce monsters and ancient mysteries. Take this wisdom with you:
          courage and friendship will light your path."
        </div>

        {/* Dialogue Options */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
          <button style={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: '2px solid #666',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}>
            Continue
          </button>
          <button style={{
            backgroundColor: '#666',
            color: '#fff',
            border: '2px solid #666',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}>
            Ask about town
          </button>
          <button style={{
            backgroundColor: '#666',
            color: '#fff',
            border: '2px solid #666',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}>
            Goodbye
          </button>
        </div>
      </div>

      {/* NPC Portrait (optional side panel) */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '20px',
        zIndex: 40,
        backgroundColor: 'rgba(0,0,0,0.9)',
        border: '2px solid #666',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <SimpleSprite
          id="npc-villager-portrait"
          width={64}
          height={64}
          imageRendering="pixelated"
        />
        <div style={{
          color: '#fff',
          fontSize: '12px',
          fontFamily: 'monospace',
          marginTop: '8px',
          textAlign: 'center',
        }}>
          Village Elder
        </div>
      </div>
    </div>
  );
}