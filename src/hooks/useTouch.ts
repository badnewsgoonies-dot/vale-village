import { useCallback, useEffect, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

/**
 * Hook for handling touch swipe gestures on mobile devices.
 * Returns touch event handlers to attach to elements.
 */
export function useSwipeGesture(handlers: SwipeHandlers, minSwipeDistance = 50) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine primary swipe direction
    if (Math.max(absX, absY) < minSwipeDistance) {
      touchStartRef.current = null;
      return;
    }

    if (absX > absY) {
      // Horizontal swipe
      if (deltaX > 0) {
        handlers.onSwipeRight?.();
      } else {
        handlers.onSwipeLeft?.();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        handlers.onSwipeDown?.();
      } else {
        handlers.onSwipeUp?.();
      }
    }

    touchStartRef.current = null;
  }, [handlers, minSwipeDistance]);

  return { onTouchStart, onTouchEnd };
}

/**
 * Hook for handling keyboard navigation (Arrow keys, Enter, Escape).
 */
export function useKeyboardNavigation(handlers: {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handlers.onArrowUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handlers.onArrowDown?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlers.onArrowLeft?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlers.onArrowRight?.();
          break;
        case 'Enter':
          e.preventDefault();
          handlers.onEnter?.();
          break;
        case 'Escape':
          e.preventDefault();
          handlers.onEscape?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

/**
 * Detect if the current device is a touch device
 */
export function useIsTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
