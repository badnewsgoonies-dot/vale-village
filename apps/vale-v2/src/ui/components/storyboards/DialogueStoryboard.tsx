/**
 * Dialogue Scene Storyboard
 * 
 * Shows NPC dialogue system with character portraits, text boxes, and choices.
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, searchSprites, getSpritesByCategory } from '../../sprites';

export function DialogueStoryboard() {
  const [showChoices, setShowChoices] = useState(false);

  // Find NPC sprites
  const npcSprites = getSpritesByCategory('overworld-protagonists');
  const npcSprite = npcSprites[0] || searchSprites('npc')[0];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
    }}>
      {/* Controls */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <button
          onClick={() => setShowChoices(!showChoices)}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: showChoices ? '#4CAF50' : '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
          }}
        >
          {showChoices ? 'Hide' : 'Show'} Choices
        </button>
      </div>

      {/* Dialogue Scene Container */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        imageRendering: 'pixelated',
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
          }}
          sizeMode="cover"
        />

        {/* NPC Sprite (Left Side) */}
        {npcSprite && (
          <div style={{
            position: 'absolute',
            left: '10%',
            bottom: '200px',
            zIndex: 1,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
          }}>
            <SimpleSprite
              id={npcSprite.path}
              width={128}
              height={128}
              imageRendering="pixelated"
            />
          </div>
        )}

        {/* Dialogue Box */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '85%',
          maxWidth: '800px',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: '4px solid #666',
          borderRadius: '16px',
          padding: '24px',
          zIndex: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        }}>
          {/* Header with Portrait */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '2px solid #555',
          }}>
            {/* Portrait */}
            {npcSprite && (
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#2a2a2a',
                border: '2px solid #666',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <SimpleSprite
                  id={npcSprite.path}
                  width={64}
                  height={64}
                  imageRendering="pixelated"
                />
              </div>
            )}
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#FFD700',
              }}>
                Village Elder
              </div>
              <div style={{
                fontSize: '12px',
                color: '#aaa',
                marginTop: '2px',
              }}>
                Vale Village
              </div>
            </div>
          </div>

          {/* Dialogue Text */}
          <div style={{
            fontSize: '16px',
            color: '#fff',
            lineHeight: '1.8',
            marginBottom: showChoices ? '20px' : '0',
            minHeight: '60px',
          }}>
            Welcome, young adventurer! I've been waiting for you. The ancient ruins to the east hold great power, but they are also very dangerous. Are you prepared for what lies ahead?
          </div>

          {/* Choices */}
          {showChoices && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: '16px',
            }}>
              {[
                { id: 1, text: "Yes, I'm ready to face any challenge!" },
                { id: 2, text: 'Tell me more about the ruins.' },
                { id: 3, text: 'I need to prepare first. Where can I buy equipment?' },
              ].map((choice) => (
                <button
                  key={choice.id}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    border: '2px solid #666',
                    borderRadius: '8px',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3a3a3a';
                    e.currentTarget.style.borderColor = '#FFD700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                    e.currentTarget.style.borderColor = '#666';
                  }}
                >
                  <span style={{ color: '#FFD700', marginRight: '8px' }}>{choice.id}.</span>
                  {choice.text}
                </button>
              ))}
            </div>
          )}

          {/* Continue Button (when no choices) */}
          {!showChoices && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '16px',
            }}>
              <button
                style={{
                  padding: '8px 24px',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5CBF6F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4CAF50';
                }}
              >
                Continue [Space]
              </button>
            </div>
          )}

          {/* Instructions */}
          <div style={{
            fontSize: '10px',
            color: '#666',
            marginTop: '12px',
            textAlign: 'right',
            fontStyle: 'italic',
          }}>
            {showChoices ? 'Press 1-3 to select choice' : 'Press Space or Enter to continue'}
          </div>
        </div>
      </div>

      {/* Annotations */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        fontSize: '12px',
        color: '#aaa',
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#fff' }}>Layout Notes:</div>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>NPC sprite displayed on left side of screen</li>
          <li>Dialogue box at bottom with dark background and border</li>
          <li>Character portrait and name in dialogue header</li>
          <li>Dialogue text displayed in readable font size</li>
          <li>Choices appear as numbered buttons when available</li>
          <li>Continue button shown when no choices available</li>
          <li>Keyboard shortcuts displayed (Space/Enter, 1-3 for choices)</li>
          <li>Background shows overworld/interior scene</li>
        </ul>
      </div>
    </div>
  );
}
