import { useEffect } from 'react';
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

  if (!currentDialogueTree || !currentDialogueState) return null;

  const currentNode = getCurrentNode(currentDialogueTree, currentDialogueState);
  if (!currentNode) return null;

  const availableChoices = getAvailableChoices(currentNode, {
    flags: (story.flags || {}) as Record<string, boolean>,
    inventory: {
      items: equipment.map((item) => item.id),
    },
    gold,
    level: team?.units?.[0]?.level || 1,
  });
  const hasChoices = availableChoices.length > 0;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        endDialogue();
        return;
      }
      if (!hasChoices && (event.key === ' ' || event.key === 'Enter')) {
        advanceCurrentDialogue();
        return;
      }
      const num = parseInt(event.key, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= availableChoices.length) {
        const selected = availableChoices[num - 1];
        if (selected) {
          makeChoice(selected.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [availableChoices, hasChoices, advanceCurrentDialogue, makeChoice, endDialogue]);

  return (
    <div className="dialogue-overlay">
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
              <button key={choice.id} className="dialogue-choice" onClick={() => makeChoice(choice.id)}>
                <span className="choice-number">{idx + 1}</span>
                <span className="choice-text">{choice.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="dialogue-advance">Press SPACE or ENTER to continue...</div>
        )}
      </div>
    </div>
  );
}
