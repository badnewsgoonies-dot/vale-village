import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import './IntroScreen.css';

const INTRO_MESSAGES = [
  'Vale Village has been peaceful for years...',
  'But lately, monsters have been spotted near the forest...',
  'The Elder has called for brave warriors to investigate.',
];

export const IntroScreen: React.FC = () => {
  const { actions } = useGame();
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (currentMessage < INTRO_MESSAGES.length - 1) {
          setCurrentMessage(currentMessage + 1);
        } else {
          // Start game
          actions.navigate({ type: 'OVERWORLD' });
          actions.setStoryFlag('intro_seen', true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentMessage, actions]);

  return (
    <div className="intro-screen">
      <div className="intro-content">
        <p className="intro-text">{INTRO_MESSAGES[currentMessage]}</p>
        <p className="intro-prompt">Press Space to continue...</p>
      </div>
    </div>
  );
};
