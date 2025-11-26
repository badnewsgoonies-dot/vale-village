import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../state/store';
import { getCurrentNode, getAvailableChoices } from '@/core/services/DialogueService';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPortraitSprite } from '../sprites/mappings';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';
import './DialogueBoxV2.css';

export function DialogueBoxV2() {
  const {
    currentDialogueTree,
    currentDialogueState,
    makeChoice,
    advanceCurrentDialogue,
    endDialogue,
    story,
    gold,
    equipment,
    team,
  } = useStore((state) => ({
    currentDialogueTree: state.currentDialogueTree,
    currentDialogueState: state.currentDialogueState,
    makeChoice: state.makeChoice,
    advanceCurrentDialogue: state.advanceCurrentDialogue,
    endDialogue: state.endDialogue,
    story: state.story,
    gold: state.gold,
    equipment: state.equipment,
    team: state.team,
  }));

  const currentNode =
    currentDialogueTree && currentDialogueState
      ? getCurrentNode(currentDialogueTree, currentDialogueState)
      : null;

  const availableChoices = currentNode
    ? getAvailableChoices(currentNode, {
        flags: (story.flags || {}) as Record<string, boolean>,
        inventory: {
          items: equipment.map((item) => item.id),
        },
        gold,
        level: team?.units?.[0]?.level || 1,
      })
    : [];
  const hasChoices = availableChoices.length > 0;

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typewriterInterval = useRef<NodeJS.Timeout | null>(null);
  const currentTextRef = useRef('');

  // Typewriter effect
  useEffect(() => {
    if (!currentNode?.text) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    // Check if text has changed
    if (currentTextRef.current !== currentNode.text) {
      currentTextRef.current = currentNode.text;
      setDisplayedText('');
      setIsTyping(true);

      // Clear any existing interval
      if (typewriterInterval.current) {
        clearInterval(typewriterInterval.current);
      }

      let index = 0;
      const typewriterSpeed = 30; // milliseconds per character

      typewriterInterval.current = setInterval(() => {
        if (index < currentNode.text.length) {
          setDisplayedText(currentNode.text.substring(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          if (typewriterInterval.current) {
            clearInterval(typewriterInterval.current);
            typewriterInterval.current = null;
          }
        }
      }, typewriterSpeed);
    }

    return () => {
      if (typewriterInterval.current) {
        clearInterval(typewriterInterval.current);
        typewriterInterval.current = null;
      }
    };
  }, [currentNode?.text]);

  const skipTypewriter = () => {
    if (isTyping && currentNode?.text) {
      if (typewriterInterval.current) {
        clearInterval(typewriterInterval.current);
        typewriterInterval.current = null;
      }
      setDisplayedText(currentNode.text);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle if dialogue is active
      if (!currentDialogueTree || !currentDialogueState) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        endDialogue();
        return;
      }

      // Space or Enter: skip typewriter if typing, otherwise advance
      if (!hasChoices && (event.key === ' ' || event.key === 'Enter' || event.code === 'Space' || event.code === 'Enter')) {
        event.preventDefault();
        event.stopPropagation();

        if (isTyping) {
          skipTypewriter();
        } else {
          advanceCurrentDialogue();
        }
        return;
      }

      // Number keys for choices
      const num = parseInt(event.key, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= availableChoices.length) {
        event.preventDefault();
        event.stopPropagation();
        const selected = availableChoices[num - 1];
        if (selected) {
          makeChoice(selected.id);
        }
      }
    };

    // Use capture phase to get events before other handlers
    window.addEventListener('keydown', handleKeyPress, true);
    return () => window.removeEventListener('keydown', handleKeyPress, true);
  }, [currentDialogueTree, currentDialogueState, availableChoices, hasChoices, advanceCurrentDialogue, makeChoice, endDialogue, isTyping]);

  if (!currentDialogueTree || !currentDialogueState) {
    return null;
  }

  if (!currentNode) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    // Don't advance if clicking on buttons or choices
    if (hasChoices || (e.target as HTMLElement).closest('.dialogue-choice-v2')) {
      return;
    }

    // If typing, skip to end
    if (isTyping) {
      skipTypewriter();
    } else {
      advanceCurrentDialogue();
    }
  };

  const dialogueContent = (
    <div
      className="dialogue-overlay-v2"
      onClick={handleClick}
      style={{
        cursor: hasChoices ? 'default' : 'pointer',
      }}
    >
      <div className="dialogue-box-v2">
        <div className="dialogue-panel-v2">
          {/* Corner ornaments */}
          <div className="corner-ornament-v2 top-left"></div>
          <div className="corner-ornament-v2 top-right"></div>
          <div className="corner-ornament-v2 bottom-left"></div>
          <div className="corner-ornament-v2 bottom-right"></div>

          {/* Portrait section */}
          {currentNode.speaker && (
            <div className="portrait-section-v2">
              <div className="speaker-name-v2">{currentNode.speaker}</div>
              <div className="portrait-frame-v2">
                <div className="portrait-inner-v2">
                  {(() => {
                    const portraitId = getPortraitSprite(currentNode.speaker);
                    warnIfPlaceholderSprite('DialogueBoxV2', portraitId);
                    return (
                      <SimpleSprite
                        id={portraitId}
                        width={84}
                        height={84}
                        style={{ borderRadius: '50%', imageRendering: 'pixelated' }}
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Text content area */}
          <div className="dialogue-content-v2">
            <div className="dialogue-text-v2">
              {displayedText}
              {isTyping && <span className="cursor-v2"></span>}
            </div>

            {/* Choices */}
            {hasChoices && (
              <div className="dialogue-choices-v2">
                {availableChoices.map((choice, idx) => (
                  <button
                    key={choice.id}
                    className="choice-button-v2"
                    data-number={idx + 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      makeChoice(choice.id);
                    }}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Continue indicator (only show when not typing and no choices) */}
          {!hasChoices && !isTyping && (
            <div className="continue-indicator-v2">
              <span>PRESS SPACE</span>
              <div className="arrow-sprite-v2"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Use React portal to render at document.body level
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  return createPortal(dialogueContent, document.body);
}
