/**
 * Dialogue Scene Storyboard
 * 
 * Shows dialogue system with NPC sprites, dialogue box, and choice options.
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpriteById, getSpritesByCategory } from '../../sprites';

export function DialogueStoryboard() {
  const [hasChoices, setHasChoices] = useState(false);

  // Find NPC sprites
  const npcSprites = getSpritesByCategory('overworld-protagonists');
  const npcSprite = npcSprites[1] || npcSprites[0] || getSpriteById('isaac-front');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
    }}>
      {/* State Toggle */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #444',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <span style={{ color: '#aaa', marginRight: '0.5rem' }}>Dialogue Type:</span>
        <button
          onClick={() => setHasChoices(false)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: !hasChoices ? '#4a9eff' : '#333',
            color: '#fff',
            border: `1px solid ${!hasChoices ? '#6bb6ff' : '#555'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
          }}
        >
          Simple Text
        </button>
        <button
          onClick={() => setHasChoices(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: hasChoices ? '#4a9eff' : '#333',
            color: '#fff',
            border: `1px solid ${hasChoices ? '#6bb6ff' : '#555'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
          }}
        >
          With Choices
        </button>
      </div>

      {/* Dialogue Scene */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#5a8a5a',
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
            bottom: '200px',
            left: '10%',
            zIndex: 5,
          }}>
            <SimpleSprite
              id={npcSprite.path}
              width={96}
              height={96}
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
          maxWidth: '700px',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: '3px solid #666',
          borderRadius: '8px',
          padding: '20px',
          zIndex: 10,
        }}>
          {/* Speaker Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#444',
              border: '2px solid #666',
              borderRadius: '4px',
              marginRight: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '28px',
              fontFamily: 'monospace',
            }}>
              {npcSprite ? 'N' : '?'}
            </div>
            <div style={{
              color: '#4a9eff',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
            }}>
              Village Elder
            </div>
          </div>

          {/* Dialogue Text */}
          <div style={{
            color: '#fff',
            fontSize: '16px',
            lineHeight: '1.8',
            fontFamily: 'monospace',
            marginBottom: hasChoices ? '16px' : '0',
            minHeight: '60px',
          }}>
            {hasChoices
              ? 'The ancient ruins hold many secrets. What would you like to know?'
              : 'Welcome, young adventurer! The path ahead is dangerous, but I believe you have the strength to overcome any challenge.'}
          </div>

          {/* Choices or Continue Prompt */}
          {hasChoices ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {[
                'Tell me about the ruins',
                'What dangers await?',
                'I\'m ready to begin',
              ].map((choice, i) => (
                <button
                  key={i}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#2a2a2a',
                    border: '2px solid #666',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#333';
                    e.currentTarget.style.borderColor = '#4a9eff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                    e.currentTarget.style.borderColor = '#666';
                  }}
                >
                  <span style={{
                    color: '#4a9eff',
                    fontWeight: 'bold',
                    minWidth: '24px',
                  }}>
                    {i + 1}.
                  </span>
                  <span>{choice}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{
              color: '#aaa',
              fontSize: '12px',
              fontFamily: 'monospace',
              textAlign: 'right',
              marginTop: '12px',
            }}>
              Press SPACE or ENTER to continue...
            </div>
          )}
        </div>
      </div>

      {/* Annotations */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        fontSize: '12px',
        color: '#aaa',
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#fff' }}>Layout Notes:</strong>
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>NPC sprite positioned on left or right side</li>
          <li>Dialogue box at bottom with speaker portrait</li>
          <li>Character name displayed in header</li>
          <li>Text content area with readable font</li>
          <li>Choice buttons numbered for keyboard navigation</li>
          <li>Continue prompt for simple dialogue</li>
        </ul>
      </div>
    </div>
  );
}
