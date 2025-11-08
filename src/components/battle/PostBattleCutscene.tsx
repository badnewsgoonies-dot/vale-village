import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '../shared';
import './PostBattleCutscene.css';

/**
 * PostBattleCutscene
 *
 * Shown after battle completion before rewards screen.
 * Displays NPC reaction to victory/defeat and handles any post-battle events
 * (recruitment, story progression, etc.)
 */

interface PostBattleCutsceneProps {
  npcId?: string;
  victory: boolean;
}

export const PostBattleCutscene: React.FC<PostBattleCutsceneProps> = ({
  npcId,
  victory,
}) => {
  console.log('[POST_BATTLE_CUTSCENE] Rendering with:', { npcId, victory });
  const { actions } = useGame();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Define cutscene messages based on NPC and outcome
  const getCutsceneMessages = (): string[] => {
    if (!npcId) {
      // Generic messages if no NPC
      if (victory) {
        return [
          'The enemies have been defeated!',
          'Victory is yours!',
        ];
      } else {
        return [
          'Your party has been defeated...',
          'You must retreat and recover.',
        ];
      }
    }

    // NPC-specific messages
    // TODO: Load from dialogue data based on npcId
    if (victory) {
      return [
        `You've proven your strength!`,
        `${npcId} acknowledges your victory.`,
        'Your skills have improved from this battle.',
      ];
    } else {
      return [
        `The battle was too much...`,
        `${npcId} watches as you retreat.`,
        'Perhaps you need more training.',
      ];
    }
  };

  const messages = getCutsceneMessages();
  const currentMessage = messages[currentMessageIndex];
  const isLastMessage = currentMessageIndex === messages.length - 1;

  // Auto-advance after delay or wait for player input
  const handleAdvance = () => {
    if (isLastMessage) {
      // Move to rewards screen
      if (victory) {
        actions.navigate({ type: 'REWARDS' });
      } else {
        // On defeat, return to overworld
        actions.navigate({ type: 'OVERWORLD' });
      }
    } else {
      setCurrentMessageIndex(prev => prev + 1);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAdvance();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentMessageIndex, isLastMessage]);

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

            <Button
              onClick={handleAdvance}
              ariaLabel={isLastMessage ? 'Continue to rewards' : 'Next message'}
              variant="primary"
            >
              {isLastMessage ? (victory ? 'CLAIM REWARDS' : 'RETURN') : 'CONTINUE'}
            </Button>
          </div>

          <div className="cutscene-hint">
            Press [ENTER] or [SPACE] to continue
          </div>
        </div>
      </div>
    </div>
  );
};
