import React, { useEffect } from 'react';
import './DialogueBox.css';

export interface DialogueBoxProps {
  npcName?: string;
  dialogue: string;
  portrait?: string; // Optional NPC portrait sprite path
  onClose: () => void;
}

/**
 * DialogueBox - GBA Golden Sun style dialogue component
 * 
 * Features:
 * - Dark blue background with white shadowed text
 * - Character name at top
 * - Optional portrait on left side
 * - Arrow indicator at bottom right
 * - Press Space/Enter to advance or close
 * - Press Escape to close
 */
export const DialogueBox: React.FC<DialogueBoxProps> = ({
  npcName,
  dialogue,
  portrait,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

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
              {dialogue}
            </div>

            <div className="dialogue-prompt">
              <span className="prompt-arrow">▼</span>
              <span className="prompt-text">Space/Enter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
