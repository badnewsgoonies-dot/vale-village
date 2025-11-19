/**
 * useDevMode Hook
 * Listens for Ctrl+D (or Cmd+D on Mac) to toggle dev mode overlay
 */

import { useEffect } from 'react';
import { useStore } from '../state/store';

export function useDevMode() {
  const toggleDevMode = useStore((state) => state.toggleDevMode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Listen for Ctrl+D or Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault(); // Prevent browser bookmark dialog
        toggleDevMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDevMode]);
}
