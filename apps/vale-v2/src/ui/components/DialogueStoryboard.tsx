/**
 * Dialogue Storyboard Component
 * Shows NPC conversations with sprites and dialogue boxes
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite } from '../sprites';

type DialogueScene = 'tavern' | 'castle' | 'forest' | 'shop';

const SCENE_NAMES: Record<DialogueScene, string> = {
  tavern: 'Tavern Conversation',
  castle: 'Castle Dialogue',
  forest: 'Forest Encounter',
  shop: 'Shop Interaction',
};

const SCENE_DESCRIPTIONS: Record<DialogueScene, string> = {
  tavern: 'NPC dialogue in tavern setting with background music',
  castle: 'Royal conversation with guards and nobles',
  forest: 'Mysterious encounter with hidden characters',
  shop: 'Merchant dialogue with purchase options',
};

export function DialogueStoryboard() {
  const [currentScene, setCurrentScene] = useState<DialogueScene>('tavern');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#000',
      imageRendering: 'pixelated',
    }}>
      {/* Scene Selector */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        gap: '8px',
      }}>
        {(Object.keys(SCENE_NAMES) as DialogueScene[]).map((scene) => (
          <button
            key={scene}
            onClick={() => setCurrentScene(scene)}
            style={{
              padding: '8px 16px',
              backgroundColor: currentScene === scene ? '#ffd700' : 'rgba(0,0,0,0.8)',
              color: currentScene === scene ? '#000' : '#fff',
              border: currentScene === scene ? '2px solid #fff' : '2px solid #666',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}
          >
            {SCENE_NAMES[scene]}
          </button>
        ))}
      </div>

      {/* Scene Description */}
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
          {SCENE_NAMES[currentScene]}
        </div>
        <div style={{ color: '#ccc' }}>
          {SCENE_DESCRIPTIONS[currentScene]}
        </div>
      </div>

      {/* Scene Content */}
      {currentScene === 'tavern' && <TavernDialogueScene />}
      {currentScene === 'castle' && <CastleDialogueScene />}
      {currentScene === 'forest' && <ForestDialogueScene />}
      {currentScene === 'shop' && <ShopDialogueScene />}
    </div>
  );
}

function TavernDialogueScene() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Tavern Background */}
      <BackgroundSprite
        id="tavern-interior"
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

      {/* Tavern Interior Elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        zIndex: 2,
        backgroundColor: 'rgba(139, 69, 19, 0.8)',
        border: '2px solid #8B4513',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '12px',
        fontFamily: 'monospace',
        color: '#fff',
      }}>
        🏠 Tavern Interior
      </div>

      {/* NPC Sprite (Bartender) */}
      <div style={{
        position: 'absolute',
        bottom: '200px',
        left: '20%',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <SimpleSprite
          id="npc-bartender"
          width={64}
          height={64}
          imageRendering="pixelated"
        />
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '4px',
          fontFamily: 'monospace',
        }}>
          Barkeep
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
          Tavern Barkeep
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
          "Ah, travelers from afar! You look like you've seen some battles.
          Word has it there's trouble brewing in the northern mountains.
          Strange creatures have been spotted near the old ruins..."
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
            Tell me more
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
            Any quests?
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
            Rest here
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
    </div>
  );
}

function CastleDialogueScene() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Castle Background */}
      <BackgroundSprite
        id="castle-throne-room"
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

      {/* Castle Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        zIndex: 2,
        backgroundColor: 'rgba(192, 192, 192, 0.8)',
        border: '2px solid #C0C0C0',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '12px',
        fontFamily: 'monospace',
        color: '#000',
      }}>
        🏰 Castle Throne Room
      </div>

      {/* King Sprite */}
      <div style={{
        position: 'absolute',
        bottom: '200px',
        right: '25%',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <SimpleSprite
          id="npc-king"
          width={64}
          height={64}
          imageRendering="pixelated"
        />
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#ffd700',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '4px',
          fontFamily: 'monospace',
          border: '1px solid #ffd700',
        }}>
          King
        </div>
      </div>

      {/* Guard Sprites */}
      <div style={{
        position: 'absolute',
        bottom: '180px',
        left: '15%',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <SimpleSprite
          id="npc-guard"
          width: 48,
          height: 48,
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
        border: '3px solid #ffd700',
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
          King of Vale
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
          "Brave adventurers! The realm faces its darkest hour. Ancient evils stir
          in the depths, and only those with pure hearts and unyielding courage
          can hope to prevail. Will you accept this sacred quest?"
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
            Accept Quest
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
            Ask about reward
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
            Decline politely
          </button>
        </div>
      </div>
    </div>
  );
}

function ForestDialogueScene() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Forest Background */}
      <BackgroundSprite
        id="forest-mysterious"
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

      {/* Mysterious NPC Sprite */}
      <div style={{
        position: 'absolute',
        bottom: '200px',
        left: '30%',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Mysterious glow effect */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '84px',
          height: '84px',
          backgroundColor: 'rgba(138, 43, 226, 0.3)',
          borderRadius: '50%',
          zIndex: 1,
        }} />
        <SimpleSprite
          id="npc-mysterious"
          width={64}
          height={64}
          imageRendering="pixelated"
          style={{ position: 'relative', zIndex: 2 }}
        />
        <div style={{
          backgroundColor: 'rgba(138, 43, 226, 0.8)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '4px',
          fontFamily: 'monospace',
          border: '1px solid #8A2BE2',
        }}>
          ???
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
        border: '3px solid #8A2BE2',
        borderRadius: '12px',
        padding: '20px',
      }}>
        {/* NPC Name */}
        <div style={{
          color: '#8A2BE2',
          fontSize: '18px',
          fontFamily: 'monospace',
          marginBottom: '12px',
          fontWeight: 'bold',
        }}>
          Mysterious Stranger
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
          "The shadows whisper of your destiny, young one. The four elements call to you,
          but beware - not all who seek power are worthy of it. The Djinn watch your every step..."
        </div>

        {/* Dialogue Options */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
          <button style={{
            backgroundColor: '#8A2BE2',
            color: '#fff',
            border: '2px solid #666',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}>
            What Djinn?
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
            My destiny?
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
            Leave
          </button>
        </div>
      </div>

      {/* Forest Elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        zIndex: 2,
        backgroundColor: 'rgba(34, 139, 34, 0.8)',
        border: '2px solid #228B22',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '12px',
        fontFamily: 'monospace',
        color: '#fff',
      }}>
        🌲 Ancient Forest
      </div>
    </div>
  );
}

function ShopDialogueScene() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Shop Background */}
      <BackgroundSprite
        id="shop-interior"
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

      {/* Shop Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        zIndex: 2,
        backgroundColor: 'rgba(160, 82, 45, 0.8)',
        border: '2px solid #A0522D',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '12px',
        fontFamily: 'monospace',
        color: '#fff',
      }}>
        🏪 Equipment Shop
      </div>

      {/* Merchant Sprite */}
      <div style={{
        position: 'absolute',
        bottom: '200px',
        left: '25%',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <SimpleSprite
          id="npc-merchant"
          width={64}
          height={64}
          imageRendering="pixelated"
        />
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '4px',
          fontFamily: 'monospace',
        }}>
          Merchant
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
          Traveling Merchant
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
          "Welcome to my humble shop, adventurers! I've got the finest equipment
          this side of the mountains. That steel sword over there? Crafted by
          dwarven smiths in the northern mines. Interested?"
        </div>

        {/* Dialogue Options */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
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
            Show me weapons
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
            Armor please
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
            Accessories
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
            How much gold?
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
    </div>
  );
}