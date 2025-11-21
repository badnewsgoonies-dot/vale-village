/**
 * Title Screen Component
 * Entry screen showing game title
 */

import { useEffect, type MouseEvent } from 'react';
import { useStore } from '../state/store';
import { DIALOGUES } from '@/data/definitions/dialogues';
import { VS1_SCENE_PRE } from '@/story/vs1Constants';
import './TitleScreen.css';

export function TitleScreen() {
  const setMode = useStore((s) => s.setMode);
  const startDialogueTree = useStore((s) => s.startDialogueTree);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Any key press advances to main menu
      event.preventDefault();
      event.stopPropagation();
      setMode('main-menu');
    };

    const handleClick = () => {
      // Click anywhere also advances
      setMode('main-menu');
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [setMode]);

  const handleVs1DemoClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const preScene = DIALOGUES[VS1_SCENE_PRE];
    if (preScene) {
      startDialogueTree(preScene);
    }
  };

  return (
    <div className="title-screen" onClick={() => setMode('main-menu')}>
      <div className="title-screen-content">
        <h1 className="title-screen-logo">Vale Chronicles</h1>
        <p className="title-screen-subtitle">Press any key to continue</p>
        <button
          type="button"
          className="title-screen-vs1-btn"
          onClick={handleVs1DemoClick}
        >
          🎮 Play VS1 Demo
        </button>
      </div>
    </div>
  );
}
