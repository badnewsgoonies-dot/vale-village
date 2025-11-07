import React, { useEffect, useState, useRef } from 'react';
import './DialogueBox.css';

export interface DialogueBoxProps {
  npcName?: string;
  dialogue: string;
  portrait?: string; // Optional NPC portrait sprite path
  onClose: () => void;
  typewriterSpeed?: number; // Characters per second (default: 40)
  enableTypewriter?: boolean; // Enable/disable typewriter effect (default: true)
}

/**
 * DialogueBox - GBA Golden Sun style dialogue component
 *
 * Features:
 * - Dark blue background with white shadowed text
 * - Character name at top
 * - Optional portrait on left side
 * - Typewriter text animation effect
 * - Hold Space/Enter to skip typewriter and show full text instantly
 * - Press Space/Enter when text is complete to advance
 * - Press Escape to close
 */
export const DialogueBox: React.FC<DialogueBoxProps> = ({
  npcName,
  dialogue,
  portrait,
  onClose,
  typewriterSpeed = 40, // 40 characters per second (Golden Sun speed)
  enableTypewriter = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(!enableTypewriter);
  const isSkipping = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Typewriter effect
  useEffect(() => {
    if (!enableTypewriter) {
      setDisplayedText(dialogue);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    isSkipping.current = false;

    let currentIndex = 0;
    const intervalMs = 1000 / typewriterSpeed;

    const typeNextChar = () => {
      if (currentIndex < dialogue.length) {
        setDisplayedText(dialogue.slice(0, currentIndex + 1));
        currentIndex++;

        // If skipping, show all text immediately
        if (isSkipping.current) {
          setDisplayedText(dialogue);
          setIsComplete(true);
          return;
        }

        timeoutRef.current = setTimeout(typeNextChar, intervalMs);
      } else {
        setIsComplete(true);
      }
    };

    typeNextChar();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dialogue, typewriterSpeed, enableTypewriter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();

        if (!isComplete) {
          // Skip typewriter effect - show all text
          isSkipping.current = true;
          setDisplayedText(dialogue);
          setIsComplete(true);
        } else {
          // Text is complete - advance to next dialogue
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isComplete, dialogue]);

  return (
    <div className="dialogue-overlay">
      <div className="dialogue-box-container">
        <div className="dialogue-box">
          {portrait && (
            <div className="dialogue-portrait">
              <img
                src={portrait}
                alt={npcName || 'NPC'}
                onError={(e) => {
                  // Hide portrait if image fails to load
                  e.currentTarget.parentElement!.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="dialogue-content-wrapper">
            {npcName && (
              <div className="dialogue-speaker">{npcName}</div>
            )}

            <div className="dialogue-text">
              {displayedText}
              {!isComplete && enableTypewriter && (
                <span className="typewriter-cursor">▊</span>
              )}
            </div>

            <div className="dialogue-prompt">
              <span className="prompt-arrow">▼</span>
              <span className="prompt-text">
                {!isComplete ? 'Hold to Skip' : 'Space/Enter'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
