import { useEffect, useState, useRef, useCallback } from 'react';
import type { Unit } from '@/types/Unit';

/**
 * Auto-select first unit when list changes
 * Used across Abilities, Equipment, Djinn, and Party screens
 */
export function useAutoSelectUnit(
  units: Unit[],
  initialSelected: Unit | null = null
): [Unit | null, (unit: Unit | null) => void] {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(initialSelected);

  useEffect(() => {
    if (!selectedUnit && units.length > 0) {
      setSelectedUnit(units[0]);
    }
  }, [units, selectedUnit]);

  return [selectedUnit, setSelectedUnit];
}

/**
 * Touch gesture detection for swipe navigation
 * Returns swipe direction: 'left', 'right', 'up', 'down', or null
 */
export function useSwipeGesture(
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void,
  threshold = 50
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Horizontal swipe
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      const direction = deltaX > 0 ? 'right' : 'left';
      onSwipe?.(direction);
    }
    // Vertical swipe
    else if (absDeltaY > threshold) {
      const direction = deltaY > 0 ? 'down' : 'up';
      onSwipe?.(direction);
    }

    touchStart.current = null;
    touchEnd.current = null;
  }, [onSwipe, threshold]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}

/**
 * Keyboard navigation handler
 * Supports Enter, Space, Escape keys
 */
export function useKeyboardNav(
  onEnter?: () => void,
  onEscape?: () => void
) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEnter?.();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onEscape?.();
    }
  }, [onEnter, onEscape]);

  return { onKeyDown: handleKeyDown };
}

/**
 * Detect if device is touch-enabled (mobile/tablet)
 */
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  return isTouch;
}

/**
 * Long press detection for touch devices
 * Useful for showing tooltips or context menus
 */
export function useLongPress(
  onLongPress: () => void,
  delay = 500
) {
  const timeout = useRef<NodeJS.Timeout>();

  const start = useCallback(() => {
    timeout.current = setTimeout(onLongPress, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
  };
}
