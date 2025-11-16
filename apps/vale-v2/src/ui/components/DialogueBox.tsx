import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../state/store';
import { getCurrentNode, getAvailableChoices } from '@/core/services/DialogueService';
import './DialogueBox.css';

export function DialogueBox() {
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
      if (!hasChoices && (event.key === ' ' || event.key === 'Enter' || event.code === 'Space' || event.code === 'Enter')) {
        event.preventDefault();
        event.stopPropagation();
        advanceCurrentDialogue();
        return;
      }
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
  }, [currentDialogueTree, currentDialogueState, availableChoices, hasChoices, advanceCurrentDialogue, makeChoice, endDialogue]);

  if (!currentDialogueTree || !currentDialogueState) {
    return null;
  }

  if (!currentNode) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    // Don't advance if clicking on buttons or choices
    if (hasChoices || (e.target as HTMLElement).closest('.dialogue-choice')) {
      return;
    }
    advanceCurrentDialogue();
  };

  const dialogueContent = (
    <div 
      className="dialogue-overlay" 
      onClick={handleClick} 
      style={{ 
        cursor: hasChoices ? 'default' : 'pointer',
      }}
    >
      <div className="dialogue-box">
        {currentNode.speaker && (
          <div className="dialogue-header">
            <div className="dialogue-portrait">
              <div className="portrait-placeholder">{currentNode.speaker[0]}</div>
            </div>
            <div className="dialogue-speaker">{currentNode.speaker}</div>
          </div>
        )}

        <div className="dialogue-text">{currentNode.text}</div>

        {hasChoices ? (
          <div className="dialogue-choices">
            {availableChoices.map((choice, idx) => (
              <button 
                key={choice.id} 
                className="dialogue-choice" 
                onClick={(e) => {
                  e.stopPropagation();
                  makeChoice(choice.id);
                }}
              >
                <span className="choice-number">{idx + 1}</span>
                <span className="choice-text">{choice.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="dialogue-advance">Press SPACE or ENTER to continue (or click anywhere)</div>
        )}
      </div>
    </div>
  );

  // Use React portal to render at document.body level, bypassing any container constraints
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }
  
  return createPortal(dialogueContent, document.body);
}
