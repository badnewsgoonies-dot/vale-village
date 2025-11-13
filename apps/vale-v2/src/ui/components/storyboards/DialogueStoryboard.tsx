/**
 * Dialogue Storyboard
 * 
 * Mockup for NPC dialogue system:
 * - NPC sprite (left or right side)
 * - Dialogue box at bottom
 * - Character name label
 * - Text content area
 * - Continue/choice buttons
 * - Background (overworld or interior)
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, searchSprites } from '../../sprites';

type DialogueState = 'simple' | 'choices' | 'multi-page';

export function DialogueStoryboard() {
  const [state, setState] = useState<DialogueState>('simple');
  const [currentPage, setCurrentPage] = useState(0);

  // Find NPC sprites
  const npcSprites = searchSprites('npc').slice(0, 2).concat(
    searchSprites('villager').slice(0, 1)
  );

  const dialoguePages = [
    {
      speaker: 'Villager',
      text: 'Welcome to Vale Village! The ancient ruins to the east hold many secrets...',
      sprite: npcSprites[0],
      position: 'left' as const,
    },
    {
      speaker: 'Villager',
      text: 'Be careful out there! The monsters have been more aggressive lately.',
      sprite: npcSprites[0],
      position: 'left' as const,
    },
  ];

  const currentDialogue = dialoguePages[currentPage] || dialoguePages[0];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* State Selector */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 30,
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '0.5rem',
        borderRadius: '4px',
      }}>
        {(['simple', 'choices', 'multi-page'] as DialogueState[]).map((s) => (
          <button
            key={s}
            onClick={() => {
              setState(s);
              setCurrentPage(0);
            }}
            style={{
              padding: '0.3rem 0.6rem',
              backgroundColor: state === s ? '#4CAF50' : '#333',
              color: '#fff',
              border: `1px solid ${state === s ? '#66BB6A' : '#555'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              textTransform: 'capitalize',
            }}
          >
            {s.replace('-', ' ')}
          </button>
        ))}
      </div>

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

      {/* NPC Sprite */}
      {currentDialogue.sprite && (
        <div style={{
          position: 'absolute',
          [currentDialogue.position]: '10%',
          bottom: '200px',
          zIndex: 10,
        }}>
          <SimpleSprite
            id={currentDialogue.sprite.path}
            width={128}
            height={128}
            imageRendering="pixelated"
          />
        </div>
      )}

      {/* Dialogue Box */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '800px',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        border: '3px solid #666',
        borderRadius: '8px',
        padding: '24px',
        zIndex: 20,
      }}>
        {/* Speaker Name */}
        <div style={{
          fontSize: '16px',
          color: '#4CAF50',
          fontFamily: 'monospace',
          marginBottom: '12px',
          fontWeight: 'bold',
        }}>
          {currentDialogue.speaker}
        </div>

        {/* Dialogue Text */}
        <div style={{
          fontSize: '18px',
          color: '#fff',
          fontFamily: 'monospace',
          lineHeight: '1.6',
          marginBottom: '20px',
          minHeight: '60px',
        }}>
          {currentDialogue.text}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
        }}>
          {state === 'multi-page' && currentPage < dialoguePages.length - 1 && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#66BB6A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4CAF50';
              }}
            >
              Next
            </button>
          )}

          {state === 'choices' && (
            <>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #666',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#333';
                }}
              >
                Ask about ruins
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #666',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#333';
                }}
              >
                Ask about monsters
              </button>
            </>
          )}

          {(state === 'simple' || (state === 'multi-page' && currentPage === dialoguePages.length - 1)) && (
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#66BB6A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4CAF50';
              }}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
