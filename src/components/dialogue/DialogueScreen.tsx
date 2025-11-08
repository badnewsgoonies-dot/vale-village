import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { useCamera, CameraProvider } from '@/context/CameraContext';
import { getDialogueTree } from '@/data/dialogues';
import type { DialogueChoice, DialogueAction } from '@/types/Dialogue';
import { DialogueBox } from './DialogueBox';
import './DialogueScreen.css';

const DialogueScreenContent: React.FC = () => {
  const { state, actions } = useGame();
  const { controls: cameraControls } = useCamera();
  const screen = state.currentScreen;

  // Get npcId from screen state
  const npcId = screen.type === 'DIALOGUE' ? screen.npcId : '';
  const initialDialogueKey = screen.type === 'DIALOGUE' ? screen.dialogueKey : undefined;

  // Load dialogue tree BEFORE any hooks
  const dialogueTree = getDialogueTree(npcId);

  // Early returns MUST be before any hooks to avoid "Rendered fewer hooks than expected" error
  if (!dialogueTree) {
    return (
      <div className="dialogue-screen-error">
        <h2>Error: No dialogue found for NPC "{npcId}"</h2>
        <button onClick={() => actions.goBack()}>Go Back</button>
      </div>
    );
  }

  // Current dialogue state - NOW it's safe to use hooks
  const [currentNodeId, setCurrentNodeId] = useState<string>(
    initialDialogueKey || dialogueTree.startNode || 'greeting'
  );
  const [showingChoices, setShowingChoices] = useState(false);

  // Get current node
  const currentNode = dialogueTree.nodes[currentNodeId];

  // Handle missing node - but can't early return here because we already called hooks above
  // So we'll handle this in the render logic instead

  // Check if node condition is met
  const nodeConditionMet = currentNode && (!currentNode.condition || currentNode.condition(state.storyFlags));

  // Camera work: Zoom on dialogue start and important moments
  useEffect(() => {
    if (!currentNode) return;

    const text = currentNode.text.toLowerCase();
    const speaker = currentNode.speaker.toLowerCase();

    // Check if this is a Djinn revelation moment
    const isDjinnSpeaker = speaker.includes('djinn') || speaker.includes('spirit') || speaker.includes('elemental');
    const revelationKeywords = ['truth', 'reveal', 'injustice', 'enslaved', 'see now', 'witness'];
    const isRevelation = revelationKeywords.some(keyword => text.includes(keyword));

    if (isDjinnSpeaker || isRevelation) {
      // Djinn revelation - dramatic mystical moment
      cameraControls.shake('medium', 500); // Shake when Djinn appears
      setTimeout(() => {
        cameraControls.zoomTo(2.0, 1000); // Extreme close-up for revelation
      }, 500);
    } else {
      // Normal dialogue: Zoom in slightly when entering
      cameraControls.zoomTo(1.2, 600);

      // Check for dramatic keywords in text to trigger closer zoom
      const dramaticKeywords = [
        'never', 'must', 'free', 'monsters', 'justice', 'truth',
        'join', 'wrong', 'understand', 'fight', 'freedom'
      ];

      const isDramatic = dramaticKeywords.some(keyword => text.includes(keyword));

      if (isDramatic) {
        // Dramatic line - zoom closer
        setTimeout(() => {
          cameraControls.zoomTo(1.5, 600);
        }, 300);
      }
    }

    // Cleanup: Reset camera when leaving dialogue
    return () => {
      cameraControls.reset(600);
    };
  }, [currentNodeId, cameraControls]);

  // Execute action when node changes
  useEffect(() => {
    if (!currentNode) return;

    if (currentNode.action && nodeConditionMet) {
      executeAction(currentNode.action);
    }
  }, [currentNodeId, nodeConditionMet, currentNode, executeAction]);

  // Handle node condition not met - skip to next node or go back
  // MUST be in useEffect to avoid infinite setState loop
  useEffect(() => {
    if (!currentNode) {
      // Node doesn't exist - go back
      actions.goBack();
      return;
    }

    if (!nodeConditionMet) {
      // Condition not met - skip to next node or go back
      if (currentNode.nextNode) {
        setCurrentNodeId(currentNode.nextNode);
      } else {
        actions.goBack();
      }
    }
  }, [currentNodeId, nodeConditionMet, currentNode, actions]);

  // Execute a dialogue action
  const executeAction = useCallback((action: DialogueAction) => {
    switch (action.type) {
    case 'START_BATTLE': {
      // Start battle flow (Team Selection → Djinn Selection → Battle)
      const enemyUnits = action.enemyUnitIds;
      // Navigate to battle flow controller instead of direct battle
      actions.navigate({
        type: 'BATTLE_FLOW',
        enemyUnitIds: enemyUnits,
        npcId: npcId, // Pass NPC ID for post-battle cutscene
      });
      break;
    }

    case 'RECRUIT_UNIT': {
      // Recruit unit to player's party
      actions.recruitUnit(action.unitId);
      break;
    }

    case 'SET_FLAG': {
      // Set story flag
      actions.setStoryFlag(action.flag, action.value);
      break;
    }

    case 'GIVE_ITEM': {
      // Give item to player
      // TODO: Implement item giving system
      console.log(`Giving item: ${action.itemId} x${action.quantity}`);
      break;
    }

    case 'GIVE_GOLD': {
      // Give gold to player
      actions.addGold(action.amount);
      break;
    }

    case 'GIVE_DJINN': {
      // Give Djinn to player
      actions.giveDjinn(action.djinnId);
      break;
    }

    case 'OPEN_SHOP': {
      // Open shop screen
      actions.navigate({ type: 'SHOP', shopType: action.shopType });
      break;
    }

    case 'NAVIGATE': {
      // Navigate to different screen
      actions.navigate({ type: action.screen });
      break;
    }

    case 'END_DIALOGUE': {
      // Close dialogue and return to overworld
      actions.goBack();
      break;
    }

    default:
      console.warn('Unknown dialogue action:', action);
    }
  }, [actions, npcId]);

  // Handle choice selection
  const handleChoiceSelect = useCallback((choice: DialogueChoice) => {
    // Execute choice action if present
    if (choice.action) {
      executeAction(choice.action);
      // If action ends dialogue, don't navigate to next node
      if (choice.action.type === 'END_DIALOGUE') {
        return;
      }
    }

    // Navigate to next node
    setCurrentNodeId(choice.nextNode);
    setShowingChoices(false);
  }, [executeAction]);

  // Handle advancing dialogue (Space/Enter when no choices)
  const handleAdvance = useCallback(() => {
    if (!currentNode) return;

    if (currentNode.choices && currentNode.choices.length > 0) {
      // Show choices
      setShowingChoices(true);
    } else if (currentNode.nextNode) {
      // Auto-advance to next node
      setCurrentNodeId(currentNode.nextNode);
    } else {
      // End dialogue
      actions.goBack();
    }
  }, [currentNode, actions]);

  // Filter choices based on conditions
  const availableChoices = currentNode?.choices?.filter(choice =>
    !choice.condition || choice.condition(state.storyFlags)
  ) || [];

  // Don't render if node doesn't exist or condition not met
  // (useEffect above will handle navigation)
  if (!currentNode || !nodeConditionMet) {
    return null;
  }

  return (
    <div className="dialogue-screen">
      {/* Background (can be customized per NPC or location) */}
      <div className="dialogue-background">
        {/* Could show location background or NPC portrait background */}
      </div>

      {/* Dialogue content */}
      {!showingChoices ? (
        <DialogueBox
          npcName={currentNode.speaker}
          dialogue={currentNode.text}
          portrait={currentNode.portrait}
          onClose={handleAdvance}
        />
      ) : (
        <div className="dialogue-choices-container">
          <div className="dialogue-box dialogue-with-choices">
            {currentNode.portrait && (
              <div className="dialogue-portrait">
                <img
                  src={currentNode.portrait}
                  alt={currentNode.speaker}
                  onError={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.style.display = 'none';
                    }
                  }}
                />
              </div>
            )}

            <div className="dialogue-content-wrapper">
              <div className="dialogue-speaker">{currentNode.speaker}</div>
              <div className="dialogue-text">{currentNode.text}</div>

              <div className="dialogue-choices">
                {availableChoices.map((choice, index) => (
                  <button
                    key={index}
                    className="dialogue-choice-button"
                    onClick={() => handleChoiceSelect(choice)}
                  >
                    <span className="choice-arrow">►</span>
                    <span className="choice-text">{choice.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const DialogueScreen: React.FC = () => {
  return (
    <CameraProvider>
      <DialogueScreenContent />
    </CameraProvider>
  );
};
