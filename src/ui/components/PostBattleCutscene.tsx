/**
 * PostBattleCutscene Component
 * Simplified version - shows generic victory/defeat message
 * Future: Add NPC-specific dialogue when NPC system exists
 */

import { useEffect, useState } from 'react';
import './PostBattleCutscene.css';

interface PostBattleCutsceneProps {
  victory: boolean;
  onComplete: () => void;
}

export function PostBattleCutscene({ victory, onComplete }: PostBattleCutsceneProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Generic messages (no NPC system yet)
  const messages = victory
    ? [
        'You are victorious!',
        'The enemies have been defeated!',
        'Your skills have improved from this battle.',
      ]
    : [
        'Your party has been defeated...',
        'You must retreat and recover.',
      ];

  const currentMessage = messages[currentMessageIndex];
  const isLastMessage = currentMessageIndex === messages.length - 1;

  // Auto-advance after delay or wait for player input
  const handleAdvance = () => {
    if (isLastMessage) {
      onComplete();
    } else {
      setCurrentMessageIndex(prev => prev + 1);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        handleAdvance();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentMessageIndex, isLastMessage, onComplete]);

  return (
    <div className={`post-battle-cutscene ${victory ? 'victory' : 'defeat'}`}>
      <div className="cutscene-container">
        {/* Background effect */}
        <div className="cutscene-background">
          {victory && (
            <div className="victory-particles"></div>
          )}
        </div>

        {/* Message Box */}
        <div className="cutscene-message-box">
          <div className="cutscene-header">
            <h2>{victory ? '⚔️ VICTORY' : '💀 DEFEAT'}</h2>
          </div>

          <div className="cutscene-content">
            <p className="cutscene-text">{currentMessage}</p>
          </div>

          <div className="cutscene-footer">
            <div className="progress-indicator">
              {messages.map((_, index) => (
                <span
                  key={index}
                  className={`progress-dot ${index === currentMessageIndex ? 'active' : ''} ${index < currentMessageIndex ? 'completed' : ''}`}
                />
              ))}
            </div>

            <button
              onClick={handleAdvance}
              className="cutscene-button"
              aria-label={isLastMessage ? 'Continue to rewards' : 'Next message'}
            >
              {isLastMessage ? (victory ? 'CLAIM REWARDS' : 'RETURN') : 'CONTINUE'}
            </button>
          </div>

          <div className="cutscene-hint">
            Press [ENTER] or [SPACE] to continue
          </div>
        </div>
      </div>
    </div>
  );
}

