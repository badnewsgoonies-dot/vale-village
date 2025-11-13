/**
 * Dialogue Storyboard Component
 * 
 * Shows dialogue scene mockup with NPC sprite, dialogue box,
 * character name, text content, and choice buttons.
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, searchSprites } from '../../sprites';

export function DialogueStoryboard() {
  const [showChoices, setShowChoices] = useState(false);
  const [npcPosition, setNpcPosition] = useState<'left' | 'right'>('left');

  // Find NPC sprite
  const npcSprite = searchSprites('npc')[0] || getSpriteById('isaac-front');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000',
    }}>
      {/* Controls */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setShowChoices(!showChoices)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showChoices ? '#4CAF50' : '#444',
            color: '#fff',
            border: '1px solid #666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          {showChoices ? 'Hide' : 'Show'} Choices
        </button>
        <button
          onClick={() => setNpcPosition(npcPosition === 'left' ? 'right' : 'left')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#444',
            color: '#fff',
            border: '1px solid #666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          NPC Position: {npcPosition}
        </button>
      </div>

      {/* Dialogue Scene Canvas */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        imageRendering: 'pixelated',
      }}>
        {/* Background (overworld or interior) */}
        <BackgroundSprite
          id="/sprites/backgrounds/gs1/Vale_Forest.gif"
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
        <div style={{
          position: 'absolute',
          [npcPosition]: '10%',
          bottom: '25%',
          zIndex: 1,
        }}>
          <SimpleSprite
            id={npcSprite?.path || '/sprites/overworld/npc.gif'}
            width={128}
            height={128}
            imageRendering="pixelated"
          />
        </div>

        {/* Dialogue Box */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '800px',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: '4px solid #4CAF50',
          borderRadius: '16px',
          padding: '24px',
          zIndex: 10,
        }}>
          {/* Character Name Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#2a2a2a',
              border: '2px solid #4CAF50',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}>
              👤
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#4CAF50',
            }}>
              Village Elder
            </div>
          </div>

          {/* Dialogue Text */}
          <div style={{
            fontSize: '16px',
            color: '#fff',
            lineHeight: '1.8',
            marginBottom: '16px',
            minHeight: '60px',
          }}>
            Welcome to Vale Village, traveler! The ancient ruins to the east hold many secrets
            that have been sealed away for centuries. Only those with the power of Psynergy
            can hope to unlock their mysteries...
          </div>

          {/* Choices or Continue Button */}
          {showChoices ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {[
                'Tell me more about the ruins.',
                'What is Psynergy?',
                'Where can I find supplies?',
                'Goodbye.',
              ].map((choice, idx) => (
                <button
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    border: '2px solid #4CAF50',
                    borderRadius: '8px',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3a3a3a';
                    e.currentTarget.style.borderColor = '#5CBF60';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                    e.currentTarget.style.borderColor = '#4CAF50';
                  }}
                >
                  <span style={{ color: '#4CAF50', marginRight: '8px' }}>
                    {idx + 1}.
                  </span>
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <button
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5CBF60';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4CAF50';
                }}
              >
                Continue [Space]
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Annotations */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        fontSize: '0.875rem',
        color: '#aaa',
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>
          Layout Notes:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
          <li>NPC sprite positioned on left or right side of screen</li>
          <li>Dialogue box anchored at bottom center</li>
          <li>Character portrait and name displayed in header</li>
          <li>Text content area with readable line height</li>
          <li>Continue button for simple dialogue</li>
          <li>Choice buttons numbered 1-4 for branching dialogue</li>
          <li>Background shows overworld or interior scene</li>
          <li>Golden Sun aesthetic with green borders and dark backgrounds</li>
        </ul>
      </div>
    </div>
  );
}
