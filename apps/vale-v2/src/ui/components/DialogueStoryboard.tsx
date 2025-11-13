/**
 * Dialogue Storyboard Component
 * Mockups for NPC dialogue scenes with different layouts and states
 */

import { useState } from 'react';
import { SimpleSprite, BackgroundSprite, getSpritesByCategory } from '../sprites';

type DialoguePhase = 'basic' | 'choice' | 'cutscene';

export function DialogueStoryboard() {
  const [dialoguePhase, setDialoguePhase] = useState<DialoguePhase>('basic');

  // Get sprites
  const isaacSprite = getSpritesByCategory('battle-party').find(s => s.name.toLowerCase().includes('isaac'));

  // Mock dialogue data
  const dialogueScenarios = {
    basic: {
      npcName: 'Village Elder',
      npcPortrait: '👴',
      background: '/sprites/backgrounds/gs1/World_Map_Plains.gif',
      dialogue: "Young warrior, the darkness grows stronger each day. The ancient seal that once protected our lands is weakening. You must find the four Elemental Stars to restore balance to the world.",
      location: 'Village Elder\'s Hut',
    },
    choice: {
      npcName: 'Mysterious Merchant',
      npcPortrait: '🧙',
      background: '/sprites/backgrounds/gs1/World_Map_Cave.gif',
      dialogue: "I have a proposition for you, adventurer. I can offer you great power, but it comes at a cost. What do you choose?",
      choices: [
        "Accept the power, no matter the cost",
        "Ask about the consequences first",
        "Decline the offer politely",
        "Threaten the merchant"
      ],
      location: 'Hidden Cave Shop',
    },
    cutscene: {
      npcName: 'Ancient Guardian',
      npcPortrait: '🗿',
      background: '/sprites/backgrounds/gs1/World_Map_Shore.gif',
      dialogue: "The prophecy has begun. Four heroes shall rise, each wielding the power of an element. Fire, water, wind, and earth - united they shall face the coming darkness.",
      dramatic: true,
      location: 'Ancient Temple Ruins',
    },
  };

  const currentScenario = dialogueScenarios[dialoguePhase];

  const renderBasicDialogue = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#4CAF50',
      imageRendering: 'pixelated',
    }}>
      {/* Background */}
      <BackgroundSprite
        id={currentScenario.background}
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

      {/* Location Indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#FFD700',
        padding: '8px 16px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 10,
      }}>
        {currentScenario.location}
      </div>

      {/* Dialogue Scene Layout */}
      <div style={{
        position: 'absolute',
        width: '80%',
        height: 'calc(100% - 250px)',
        top: '60px',
        left: '10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1,
      }}>
        {/* Left Character (NPC) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#8B4513',
            border: '4px solid #654321',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            marginBottom: '10px',
          }}>
            {currentScenario.npcPortrait}
          </div>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#FFD700',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            {currentScenario.npcName}
          </div>
          {/* Dialogue pointer */}
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '-20px',
            width: 0,
            height: 0,
            borderLeft: '20px solid rgba(0,0,0,0.8)',
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
          }} />
        </div>

        {/* Center Space */}
        <div style={{
          width: '200px',
          textAlign: 'center',
        }}>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontFamily: 'monospace',
            display: 'inline-block',
          }}>
            💬 DIALOGUE ACTIVE
          </div>
        </div>

        {/* Right Character (Player) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          {isaacSprite && (
            <SimpleSprite
              id={isaacSprite.path}
              width={80}
              height={80}
              imageRendering="pixelated"
              style={{ marginBottom: '10px' }}
            />
          )}
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#FFD700',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            Isaac
          </div>
        </div>
      </div>

      {/* Dialogue Box */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '250px',
        backgroundColor: 'rgba(0,0,0,0.95)',
        borderTop: '4px solid #FFD700',
        display: 'flex',
        zIndex: 10,
      }}>
        {/* NPC Portrait in Dialogue Box */}
        <div style={{
          width: '180px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '3px solid #FFD700',
          backgroundColor: 'rgba(139, 69, 19, 0.3)',
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            backgroundColor: '#8B4513',
            border: '4px solid #654321',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
          }}>
            {currentScenario.npcPortrait}
          </div>
        </div>

        {/* Dialogue Content */}
        <div style={{
          flex: 1,
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Character Name */}
          <div style={{
            color: '#FFD700',
            fontSize: '18px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '15px',
          }}>
            {currentScenario.npcName}
          </div>

          {/* Dialogue Text */}
          <div style={{
            color: '#FFFFFF',
            fontSize: '16px',
            fontFamily: 'monospace',
            lineHeight: '1.5',
            marginBottom: '20px',
            flex: 1,
          }}>
            {currentScenario.dialogue}
          </div>

          {/* Continue Prompt */}
          <div style={{
            color: '#AAAAAA',
            fontSize: '14px',
            fontFamily: 'monospace',
            textAlign: 'right',
          }}>
            Press SPACE to continue...
          </div>
        </div>
      </div>
    </div>
  );

  const renderChoiceDialogue = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#2c3e50',
      imageRendering: 'pixelated',
    }}>
      {/* Background */}
      <BackgroundSprite
        id={currentScenario.background}
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

      {/* Location */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#FFD700',
        padding: '8px 16px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 10,
      }}>
        {currentScenario.location}
      </div>

      {/* Characters */}
      <div style={{
        position: 'absolute',
        width: '60%',
        height: 'calc(100% - 350px)',
        top: '60px',
        left: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1,
      }}>
        {/* NPC */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#8B4513',
            border: '4px solid #654321',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            marginBottom: '10px',
          }}>
            {currentScenario.npcPortrait}
          </div>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#FFD700',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            {currentScenario.npcName}
          </div>
        </div>

        {/* Player */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {isaacSprite && (
            <SimpleSprite
              id={isaacSprite.path}
              width={80}
              height={80}
              imageRendering="pixelated"
              style={{ marginBottom: '10px' }}
            />
          )}
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#FFD700',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}>
            Isaac
          </div>
        </div>
      </div>

      {/* Dialogue Box with Choices */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '350px',
        backgroundColor: 'rgba(0,0,0,0.95)',
        borderTop: '4px solid #FFD700',
        zIndex: 10,
      }}>
        {/* NPC Portrait */}
        <div style={{
          position: 'absolute',
          left: '20px',
          top: '-40px',
          width: '120px',
          height: '120px',
          backgroundColor: '#8B4513',
          border: '4px solid #654321',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '80px',
          zIndex: 15,
        }}>
          {currentScenario.npcPortrait}
        </div>

        {/* Dialogue Content */}
        <div style={{
          marginLeft: '160px',
          padding: '25px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Character Name */}
          <div style={{
            color: '#FFD700',
            fontSize: '18px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '15px',
          }}>
            {currentScenario.npcName}
          </div>

          {/* Dialogue Text */}
          <div style={{
            color: '#FFFFFF',
            fontSize: '16px',
            fontFamily: 'monospace',
            lineHeight: '1.5',
            marginBottom: '25px',
          }}>
            {currentScenario.dialogue}
          </div>

          {/* Choice Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            flex: 1,
          }}>
            {dialogueScenarios.choice.choices.map((choice, index) => (
              <button
                key={index}
                style={{
                  backgroundColor: '#34495e',
                  color: '#fff',
                  border: '2px solid #7f8c8d',
                  borderRadius: '8px',
                  padding: '15px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4a5d6a';
                  e.currentTarget.style.borderColor = '#FFD700';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#34495e';
                  e.currentTarget.style.borderColor = '#7f8c8d';
                }}
              >
                <span style={{
                  color: '#FFD700',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}>
                  {index + 1}.
                </span>
                <span>{choice}</span>
              </button>
            ))}
          </div>

          {/* Navigation Hint */}
          <div style={{
            color: '#AAAAAA',
            fontSize: '12px',
            fontFamily: 'monospace',
            textAlign: 'center',
            marginTop: '10px',
          }}>
            Use ↑↓ arrows to navigate • Press ENTER to select
          </div>
        </div>
      </div>
    </div>
  );

  const renderCutsceneDialogue = () => (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a',
      imageRendering: 'pixelated',
    }}>
      {/* Dramatic Background */}
      <BackgroundSprite
        id={currentScenario.background}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 0,
          filter: 'brightness(0.4) contrast(1.2)',
        }}
        sizeMode="cover"
      />

      {/* Dramatic Lighting Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
        zIndex: 1,
      }} />

      {/* Location */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#FFD700',
        padding: '8px 16px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 10,
      }}>
        {currentScenario.location}
      </div>

      {/* Ancient Guardian Statue */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -30%)',
        zIndex: 2,
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#666',
          border: '6px solid #444',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '140px',
          animation: 'guardian-glow 3s infinite',
        }}>
          {currentScenario.npcPortrait}
        </div>
      </div>

      {/* Dramatic Dialogue Box */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '280px',
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderTop: '6px solid #FFD700',
        zIndex: 10,
      }}>
        {/* Guardian Name with Dramatic Styling */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.9)',
          border: '3px solid #FFD700',
          borderRadius: '20px',
          padding: '10px 20px',
          zIndex: 15,
        }}>
          <div style={{
            color: '#FFD700',
            fontSize: '20px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '0 0 10px rgba(255,215,0,0.5)',
            animation: 'text-glow 2s infinite',
          }}>
            {currentScenario.npcName}
          </div>
        </div>

        {/* Dialogue Content */}
        <div style={{
          padding: '40px 30px 30px 30px',
          textAlign: 'center',
        }}>
          {/* Dramatic Dialogue Text */}
          <div style={{
            color: '#FFFFFF',
            fontSize: '18px',
            fontFamily: 'monospace',
            lineHeight: '1.6',
            marginBottom: '30px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            animation: 'text-appear 1s ease-out',
          }}>
            {currentScenario.dialogue}
          </div>

          {/* Continue Prompt with Dramatic Styling */}
          <div style={{
            color: '#FFD700',
            fontSize: '16px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textAlign: 'center',
            animation: 'prompt-pulse 2s infinite',
          }}>
            ▶ Press SPACE to continue the prophecy...
          </div>
        </div>
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
          { id: 'basic', label: 'Basic Dialogue' },
          { id: 'choice', label: 'Choice Dialogue' },
          { id: 'cutscene', label: 'Cutscene Dialogue' },
        ].map(phase => (
          <button
            key={phase.id}
            onClick={() => setDialoguePhase(phase.id as DialoguePhase)}
            style={{
              padding: '8px 16px',
              backgroundColor: dialoguePhase === phase.id ? '#4CAF50' : 'rgba(0,0,0,0.8)',
              color: '#fff',
              border: dialoguePhase === phase.id ? '2px solid #FFD700' : '2px solid #fff',
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
      {dialoguePhase === 'basic' && renderBasicDialogue()}
      {dialoguePhase === 'choice' && renderChoiceDialogue()}
      {dialoguePhase === 'cutscene' && renderCutsceneDialogue()}

      {/* CSS Animations */}
      <style>{`
        @keyframes guardian-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
          50% { box-shadow: 0 0 40px rgba(255,215,0,0.6); }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(255,215,0,0.5); }
          50% { text-shadow: 0 0 20px rgba(255,215,0,0.8), 0 0 30px rgba(255,215,0,0.4); }
        }

        @keyframes text-appear {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes prompt-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}