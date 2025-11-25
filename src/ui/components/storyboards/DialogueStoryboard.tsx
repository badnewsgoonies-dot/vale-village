/**
 * Dialogue Scene Storyboard
 * Shows NPC dialogue with character sprites and text box
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpritesByCategory } from '../../sprites';

export function DialogueStoryboard() {
  const [dialogueIndex, setDialogueIndex] = useState(0);

  // Find NPC sprites
  const npcSprites = getSpritesByCategory('overworld-majornpcs');

  const dialogues = [
    {
      speaker: 'Villager',
      text: 'Welcome to Vale Village! The ancient ruins to the north hold many secrets. Be careful on your journey!',
      sprite: npcSprites[0],
    },
    {
      speaker: 'Elder',
      text: 'The Elemental Guardians have awakened. You must gather your strength before facing them.',
      sprite: npcSprites[1] || npcSprites[0],
    },
    {
      speaker: 'Merchant',
      text: 'I have the finest equipment in all of Vale! Unlock new gear to prepare for the challenges ahead.',
      sprite: npcSprites[2] || npcSprites[0],
    },
  ];

  const currentDialogue = dialogues[dialogueIndex] ?? dialogues[0]!;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#1a1a1a',
    }}>
      {/* Background */}
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

      {/* Dialogue Scene */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        {/* NPC Sprite (Left Side) */}
        <div style={{
          flex: '0 0 300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
          <SimpleSprite
            id={currentDialogue.sprite?.path || '/sprites/overworld/majornpcs/Elder.gif'}
            width={128}
            height={128}
            imageRendering="pixelated"
          />
        </div>

        {/* Dialogue Box (Bottom) */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '10%',
          right: '10%',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: '3px solid #FFD700',
          borderRadius: '8px',
          padding: '1.5rem',
          zIndex: 10,
        }}>
          {/* Speaker Name */}
          <div style={{
            color: '#FFD700',
            fontWeight: 'bold',
            marginBottom: '0.75rem',
            fontSize: '1.1rem',
            borderBottom: '1px solid #444',
            paddingBottom: '0.5rem',
          }}>
            {currentDialogue.speaker}
          </div>

          {/* Dialogue Text */}
          <div style={{
            color: '#fff',
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '1rem',
            minHeight: '60px',
          }}>
            {currentDialogue.text}
          </div>

          {/* Continue Button */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
          }}>
            <button
              onClick={() => setDialogueIndex((dialogueIndex + 1) % dialogues.length)}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Dialogue Navigation */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 20,
      }}>
        {dialogues.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setDialogueIndex(idx)}
            style={{
              padding: '0.5rem',
              backgroundColor: dialogueIndex === idx ? '#4CAF50' : '#3a3a3a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              minWidth: '40px',
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

