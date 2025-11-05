/**
 * HealNumber: Animated healing value display
 *
 * Ported from NextEraGame with Vale Village adaptations.
 *
 * Shows healing numbers that float upward and fade out.
 * Green color to indicate positive healing effect.
 *
 * Features:
 * - Floats upward with CSS animation
 * - Fades out smoothly
 * - Green color for healing
 * - Auto-cleanup after animation
 * - Positioned absolutely at target
 */

import React, { useEffect } from 'react';

// ============================================
// Component Interface
// ============================================

export interface HealNumberProps {
  /** Healing amount to display */
  amount: number;
  /** Screen position where heal number should appear */
  position: { x: number; y: number };
  /** Callback when animation completes */
  onComplete: () => void;
  /** Duration of the animation in milliseconds */
  duration?: number;
}

// ============================================
// Main Component
// ============================================

/**
 * HealNumber displays a floating, fading healing value
 *
 * The number:
 * 1. Starts at the target position
 * 2. Floats upward with animation
 * 3. Fades out
 * 4. Calls onComplete after duration
 * 5. Removes itself
 *
 * @example
 * ```tsx
 * <HealNumber
 *   amount={68}
 *   position={{ x: 200, y: 400 }}
 *   onComplete={() => removeHealNumber(id)}
 * />
 * ```
 */
export function HealNumber({
  amount,
  position,
  onComplete,
  duration = 1500,
}: HealNumberProps): React.ReactElement {
  /**
   * Auto-cleanup after animation completes
   */
  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div
      className="absolute pointer-events-none z-[998] animate-float-up"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        color: '#22c55e', // Green for healing
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        fontFamily: 'monospace',
        animation: `float-up ${duration}ms ease-out, fade-out ${duration}ms ease-out`,
      }}
      role="presentation"
      aria-hidden="true"
      data-testid="heal-number"
    >
      +{amount}
    </div>
  );
}
