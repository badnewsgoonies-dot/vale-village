/**
 * Title Screen Component
 * Entry screen showing game title
 */

import { useEffect } from 'react';
import { useStore } from '../state/store';
import './TitleScreen.css';

export function TitleScreen() {
  const setMode = useStore((s) => s.setMode);

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

  return (
    <div className="title-screen" onClick={() => setMode('main-menu')}>
      <div className="title-screen-content">
        <h1 className="title-screen-logo">Vale Chronicles</h1>
        <p className="title-screen-subtitle">Press any key to continue</p>
      </div>
    </div>
  );
}
