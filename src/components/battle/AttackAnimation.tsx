/**
 * AttackAnimation: Visual effect overlay for physical attack actions
 *
 * Ported from NextEraGame with Vale Village adaptations.
 *
 * Displays element-based colored effects at target position during physical attacks.
 * Uses CSS animations for simple, performant visual feedback.
 *
 * Features:
 * - Element-specific colors (Venus=green, Mars=red, Mercury=blue, Jupiter=amber)
 * - Dual-layer animation (ping + pulse) for visual interest
 * - Automatic cleanup after duration
 * - Positioned absolutely at target coordinates
 * - Accessible (hidden from screen readers)
 */

import React, { useState, useEffect } from 'react';
import type { Element } from '@/types/Element';

// ============================================
// Element-Based Visual Configuration
// ============================================

/**
 * Attack effect colors mapped to elements
 * Matches Golden Sun elemental themes
 */
const ATTACK_COLORS: Record<Element, string> = {
  Venus: '#16a34a', // Green - earth, sturdy
  Mars: '#ef4444', // Red - fire, aggressive
  Mercury: '#3b82f6', // Blue - water/ice, cool
  Jupiter: '#f59e0b', // Amber - wind/lightning, energetic
};

// Default color for non-elemental attacks
const DEFAULT_COLOR = '#9ca3af'; // Gray

// ============================================
// Component Interface
// ============================================

export interface AttackAnimationProps {
  /** Element of the attack (determines effect color) */
  element?: Element;
  /** Screen position where the attack effect should appear */
  targetPosition: { x: number; y: number };
  /** Callback when animation completes (for cleanup) */
  onComplete: () => void;
  /** Duration of the animation in milliseconds */
  duration?: number;
}

// ============================================
// Main Component
// ============================================

/**
 * AttackAnimation renders a temporary visual effect at target position
 *
 * The effect consists of two overlapping circles:
 * 1. Outer ring with "ping" animation (expands and fades)
 * 2. Inner circle with "pulse" animation (scales up/down)
 *
 * Both circles use the element-specific color with glowing shadows.
 * After the specified duration, the component calls onComplete and hides itself.
 *
 * @example
 * ```tsx
 * <AttackAnimation
 *   element="Mars"
 *   targetPosition={{ x: 500, y: 300 }}
 *   onComplete={() => setShowAnim(false)}
 *   duration={800}
 * />
 * ```
 */
export function AttackAnimation({
  element,
  targetPosition,
  onComplete,
  duration = 1000,
}: AttackAnimationProps): React.ReactElement {
  const [visible, setVisible] = useState(true);

  /**
   * Auto-hide after duration and trigger completion callback
   * Cleanup timeout on unmount to prevent memory leaks
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, duration);

    // Important: clear timeout if component unmounts early
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // Don't render anything if animation is complete
  if (!visible) return <></>;

  const color = element ? ATTACK_COLORS[element] : DEFAULT_COLOR;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-50"
      role="presentation"
      aria-hidden="true"
    >
      {/* Outer expanding ring (ping animation) */}
      <div
        className="absolute rounded-full animate-ping opacity-75"
        style={{
          left: `${targetPosition.x}px`,
          top: `${targetPosition.y}px`,
          transform: 'translate(-50%, -50%)',
          width: '100px',
          height: '100px',
          backgroundColor: color,
          boxShadow: `0 0 40px ${color}, 0 0 80px ${color}`,
        }}
      />

      {/* Inner pulsing circle (pulse animation) */}
      <div
        className="absolute rounded-full animate-pulse"
        style={{
          left: `${targetPosition.x}px`,
          top: `${targetPosition.y}px`,
          transform: 'translate(-50%, -50%)',
          width: '60px',
          height: '60px',
          backgroundColor: color,
          boxShadow: `0 0 20px #fff`,
        }}
      />
    </div>
  );
}
