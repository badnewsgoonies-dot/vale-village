/**
 * Dialogue Storyboard Component
 * Mockup for NPC dialogue system
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, searchSprites, getSpritesByCategory } from '../../sprites';

type DialogueScene = 'village-elder' | 'mysterious-stranger' | 'shopkeeper' | 'guard-encounter';

const SCENES: { value: DialogueScene; label: string; description: string }[] = [
  {
    value: 'village-elder',
    label: 'Village Elder',
    description: 'Wise NPC giving quest information'
  },
  {
    value: 'mysterious-stranger',
    label: 'Mysterious Stranger',
    description: 'Enigmatic figure with cryptic dialogue'
  },
  {
    value: 'shopkeeper',
    label: 'Shopkeeper',
    description: 'Merchant NPC with multiple dialogue options'
  },
  {
    value: 'guard-encounter',
    label: 'Guard Encounter',
    description: 'Hostile NPC with combat implications'
  }
];

export function DialogueStoryboard() {
  const [currentScene, setCurrentScene] = useState<DialogueScene>('village-elder');

  // Find dialogue sprites
  const elderSprite = searchSprites('elder')[0] || searchSprites('old man')[0] || getSpritesByCategory('overworld-protagonists')[2];
  const strangerSprite = searchSprites('mysterious')[0] || searchSprites(' hooded')[0] || getSpritesByCategory('overworld-protagonists')[3];
  const shopkeeperSprite = searchSprites('merchant')[0] || searchSprites('shopkeeper')[0] || getSpritesByCategory('overworld-protagonists')[1];
  const guardSprite = searchSprites('guard')[0] || searchSprites('soldier')[0] || getSpritesByCategory('overworld-protagonists')[4];

  const isaacSprite = searchSprites('isaac')[0] || getSpritesByCategory('battle-party')[0];

  const dialogueData = {
    'village-elder': {
      npcName: 'Village Elder',
      sprite: elderSprite,
      background: '/sprites/backgrounds/gs1/World_Map_Grasslands.gif',
      dialogue: [
        "Ah, young traveler! The winds of fate have brought you to our humble village. I sense great potential within you...",
        "Long ago, four great elemental lighthouses were built to maintain balance in our world. But darkness has begun to corrupt them.",
        "The legends speak of Warriors of Vale who can restore the light. You may be one of them. Will you help us?"
      ],
      choices: [
        { text: "I accept this quest!", next: "accepted" },
        { text: "Tell me more about the lighthouses.", next: "more_info" },
        { text: "I'm not ready yet.", next: "decline" }
      ]
    },
    'mysterious-stranger': {
      npcName: '???',
      sprite: strangerSprite,
      background: '/sprites/backgrounds/gs1/World_Map_Forest.gif',
      dialogue: [
        "...",
        "The stars align, and the forgotten ones awaken. You carry the burden of ages past.",
        "Three trials await: Fire's wrath, Water's depth, Earth's strength. Only the worthy shall pass.",
        "Beware the false prophets. Not all who offer guidance speak truth."
      ],
      choices: [
        { text: "Who are you?", next: "identity" },
        { text: "What do you mean by trials?", next: "trials" },
        { text: "I don't understand.", next: "confusion" }
      ]
    },
    'shopkeeper': {
      npcName: 'Shopkeeper',
      sprite: shopkeeperSprite,
      background: '/sprites/backgrounds/gs1/World_Map_Town.gif',
      dialogue: [
        "Welcome to my shop! Best prices in all of Vale Village. What can I get for ya?",
        "Ah, adventurers like you are always lookin' for gear. I've got weapons, armor, accessories - you name it!",
        "New shipment just came in. Rare items from distant lands. But they'll cost ya!"
      ],
      choices: [
        { text: "Show me your weapons.", next: "weapons" },
        { text: "I'm looking for armor.", next: "armor" },
        { text: "Just browsing, thanks.", next: "browse" }
      ]
    },
    'guard-encounter': {
      npcName: 'Town Guard',
      sprite: guardSprite,
      background: '/sprites/backgrounds/gs1/World_Map_Shore.gif',
      dialogue: [
        "Halt! This area is restricted. Only authorized personnel beyond this point.",
        "Strange creatures have been spotted near the ruins. Dangerous times we live in.",
        "Unless you're here on official business, I suggest you turn back. The wilderness isn't safe for inexperienced travelers."
      ],
      choices: [
        { text: "I need to pass. It's urgent!", next: "urgent" },
        { text: "What's beyond the ruins?", next: "curious" },
        { text: "Understood. I'll leave.", next: "leave" }
      ]
    }
  };

  const renderDialogueScene = (sceneKey: DialogueScene) => {
    const scene = dialogueData[sceneKey];
    const [dialogueIndex, setDialogueIndex] = useState(0);

    return (
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        imageRendering: 'pixelated',
      }}>
        {/* Background */}
        <BackgroundSprite
          id={scene.background}
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

        {/* NPC Sprite (Left Side) */}
        <div style={{
          position: 'absolute',
          bottom: '180px',
          left: '5%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
        }}>
          {/* NPC Shadow */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '48px',
            height: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '50%',
            zIndex: 1,
          }} />

          <SimpleSprite
            id={scene.sprite?.path || '/sprites/overworld/elder.gif'}
            width={64}
            height={64}
            imageRendering="pixelated"
            style={{ position: 'relative', zIndex: 2 }}
          />

          {/* Speaking indicator */}
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '-8px',
            color: '#FFD700',
            fontSize: '20px',
            zIndex: 3,
          }}>
            💬
          </div>
        </div>

        {/* Player Sprite (Right Side) */}
        <div style={{
          position: 'absolute',
          bottom: '180px',
          right: '5%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
        }}>
          {/* Player Shadow */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '48px',
            height: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '50%',
            zIndex: 1,
          }} />

          <SimpleSprite
            id={isaacSprite?.path || '/sprites/overworld/isaac/front.gif'}
            width={64}
            height={64}
            imageRendering="pixelated"
            style={{ position: 'relative', zIndex: 2 }}
          />

          <div style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#FFD700',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            marginTop: '4px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            Isaac
          </div>
        </div>

        {/* Dialogue Box */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          maxWidth: '700px',
          backgroundColor: '#000',
          border: '3px solid #FFD700',
          borderRadius: '12px',
          padding: '20px',
          zIndex: 10,
        }}>
          {/* Character Name */}
          <div style={{
            color: '#FFD700',
            fontSize: '18px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '12px',
          }}>
            {scene.npcName}
          </div>

          {/* Dialogue Text */}
          <div style={{
            color: '#fff',
            fontSize: '16px',
            fontFamily: 'monospace',
            lineHeight: '1.5',
            marginBottom: '20px',
            minHeight: '60px',
          }}>
            {scene.dialogue[dialogueIndex]}
          </div>

          {/* Dialogue Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{
              color: '#ccc',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}>
              {dialogueIndex < scene.dialogue.length - 1 ? (
                'Press SPACE to continue...'
              ) : (
                'Choose your response:'
              )}
            </div>

            {/* Dialogue Choices */}
            {dialogueIndex === scene.dialogue.length - 1 && (
              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                {scene.choices.map((choice, index) => (
                  <button
                    key={index}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: index === 0 ? '#4CAF50' : '#666',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFD700';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index === 0 ? '#4CAF50' : '#666';
                      e.currentTarget.style.color = '#fff';
                    }}
                  >
                    {index + 1}. {choice.text}
                  </button>
                ))}
              </div>
            )}

            {/* Continue Button */}
            {dialogueIndex < scene.dialogue.length - 1 && (
              <button
                onClick={() => setDialogueIndex(dialogueIndex + 1)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#FFD700',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Continue →
              </button>
            )}
          </div>
        </div>

        {/* Scene Label */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#FFD700',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}>
          DIALOGUE SCENE
        </div>

        {/* Dialogue Progress */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}>
          Dialogue {dialogueIndex + 1}/{scene.dialogue.length}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Scene Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        zIndex: 20,
      }}>
        {SCENES.map(scene => (
          <button
            key={scene.value}
            onClick={() => setCurrentScene(scene.value)}
            style={{
              padding: '6px 12px',
              backgroundColor: currentScene === scene.value ? '#FFD700' : '#333',
              color: currentScene === scene.value ? '#000' : '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
            title={scene.description}
          >
            {scene.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {renderDialogueScene(currentScene)}

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
          {SCENES.find(s => s.value === currentScene)?.label}
        </div>
        <div style={{ color: '#ccc' }}>
          {SCENES.find(s => s.value === currentScene)?.description}
        </div>
        <div style={{ color: '#888', marginTop: '8px', fontSize: '11px' }}>
          • Dynamic NPC dialogue with branching choices
          • Character sprites with speaking indicators
          • Contextual backgrounds for immersion
          • Progressive dialogue with continue/choice flow
        </div>
      </div>
    </div>
  );
}