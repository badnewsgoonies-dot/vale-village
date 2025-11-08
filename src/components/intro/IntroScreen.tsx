import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { useCamera, CameraProvider } from '@/context/CameraContext';
import './IntroScreen.css';

const INTRO_MESSAGES = [
  'Vale Village has been peaceful for years...',
  'But lately, monsters have been spotted near the forest...',
  'The Elder has called for brave warriors to investigate.',
];

const IntroScreenContent: React.FC = () => {
  const { actions } = useGame();
  const { controls: cameraControls } = useCamera();
  const [currentMessage, setCurrentMessage] = useState(0);

  // Camera work for intro sequence
  useEffect(() => {
    // Opening shot: Wide view of the world
    if (currentMessage === 0) {
      cameraControls.zoomTo(0.7, 2000); // Slow zoom out to show village
    }
    // Second message: Zoom in slightly - tension building
    else if (currentMessage === 1) {
      cameraControls.zoomTo(0.9, 1500); // Zoom in as danger approaches
    }
    // Final message: Normal view ready for gameplay
    else if (currentMessage === 2) {
      cameraControls.zoomTo(1.0, 1200); // Return to normal view
    }

    // Cleanup: Reset camera when leaving intro
    return () => {
      cameraControls.reset(600);
    };
  }, [currentMessage, cameraControls]);

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

export const IntroScreen: React.FC = () => {
  return (
    <CameraProvider>
      <IntroScreenContent />
    </CameraProvider>
  );
};
