import { useCallback, useRef } from 'react';

/**
 * Hook for managing game input from both keyboard and touch controls
 * Provides a unified interface for directional input and button presses
 */
export const useGameInput = () => {
  const currentDirectionRef = useRef({ x: 0, y: 0 });
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handle directional input (from joystick or keyboard)
   * Triggers movement repeatedly while direction is held
   */
  const handleDirectionInput = useCallback(
    (direction: { x: number; y: number }, onMove: (dx: number, dy: number) => void) => {
      currentDirectionRef.current = direction;

      // Clear any existing interval
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }

      // If direction is neutral, stop
      if (direction.x === 0 && direction.y === 0) {
        return;
      }

      // Immediate first move
      onMove(direction.x, direction.y);

      // Set up repeated movement (slower than keyboard for better control)
      moveIntervalRef.current = setInterval(() => {
        if (currentDirectionRef.current.x !== 0 || currentDirectionRef.current.y !== 0) {
          onMove(currentDirectionRef.current.x, currentDirectionRef.current.y);
        }
      }, 200); // 200ms between moves for touch joystick
    },
    []
  );

  /**
   * Stop directional input
   */
  const stopDirectionInput = useCallback(() => {
    currentDirectionRef.current = { x: 0, y: 0 };
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }, []);

  /**
   * Map button presses to game actions
   */
  const mapButtonToAction = useCallback((button: 'A' | 'B' | 'X' | 'Y' | 'START' | 'SELECT') => {
    const buttonMap = {
      A: 'interact', // Primary action (talk, open chest, confirm)
      B: 'cancel', // Cancel/back
      X: 'menu', // Open menu
      Y: 'special', // Special action (context-dependent)
      START: 'pause', // Pause menu
      SELECT: 'map', // Map or secondary menu
    };
    return buttonMap[button];
  }, []);

  return {
    handleDirectionInput,
    stopDirectionInput,
    mapButtonToAction,
  };
};
