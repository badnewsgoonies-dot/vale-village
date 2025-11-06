import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { getDialogueTree } from '@/data/dialogues';
import type { DialogueChoice, DialogueAction } from '@/types/Dialogue';
import { DialogueBox } from './DialogueBox';
import './DialogueScreen.css';

export const DialogueScreen: React.FC = () => {
  const { state, actions } = useGame();
  const screen = state.currentScreen;

  // Get npcId from screen state
  const npcId = screen.type === 'DIALOGUE' ? screen.npcId : '';
  const initialDialogueKey = screen.type === 'DIALOGUE' ? screen.dialogueKey : undefined;

  // Load dialogue tree
  const dialogueTree = getDialogueTree(npcId);

  // Current dialogue state
  const [currentNodeId, setCurrentNodeId] = useState<string>(
    initialDialogueKey || dialogueTree?.startNode || 'greeting'
  );
  const [showingChoices, setShowingChoices] = useState(false);

  // Handle missing dialogue tree
  if (!dialogueTree) {
    return (
      <div className="dialogue-screen-error">
        <h2>Error: No dialogue found for NPC "{npcId}"</h2>
        <button onClick={() => actions.goBack()}>Go Back</button>
      </div>
    );
  }

  // Get current node
  const currentNode = dialogueTree.nodes[currentNodeId];

  // Handle missing node
  if (!currentNode) {
    return (
      <div className="dialogue-screen-error">
        <h2>Error: Dialogue node "{currentNodeId}" not found</h2>
        <button onClick={() => actions.goBack()}>Go Back</button>
      </div>
    );
  }

  // Check if node condition is met
  const nodeConditionMet = !currentNode.condition || currentNode.condition(state.storyFlags);

  // Execute action when node changes
  useEffect(() => {
    if (currentNode.action && nodeConditionMet) {
      executeAction(currentNode.action);
    }
  }, [currentNodeId, nodeConditionMet]);

  // Execute a dialogue action
  const executeAction = useCallback((action: DialogueAction) => {
    switch (action.type) {
    case 'START_BATTLE': {
      // Start battle with specified enemy units
      const enemyUnits = action.enemyUnitIds;
      // Store the victory node for after battle
      if (action.onVictory) {
        // We'll need to navigate back to dialogue after battle
        // For now, we'll start the battle and handle victory in the battle flow
      }
      actions.startBattle(enemyUnits);
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
  }, [actions, state.storyFlags]);

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
  const availableChoices = currentNode.choices?.filter(choice =>
    !choice.condition || choice.condition(state.storyFlags)
  ) || [];

  // If node condition not met, skip to next node or end
  if (!nodeConditionMet) {
    if (currentNode.nextNode) {
      setCurrentNodeId(currentNode.nextNode);
    } else {
      actions.goBack();
    }
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
                    e.currentTarget.parentElement!.style.display = 'none';
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
