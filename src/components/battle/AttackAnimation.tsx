/**
 * AttackAnimation: Visual effect overlay for physical attack actions
 *
 * Ported from NextEraGame with Vale Village adaptations.
 *
 * Displays element-based colored effects at target position during physical attacks.
 * Uses CSS animations for simple, performant visual feedback.
 */

import React, { useState, useEffect } from 'react';
import type { Element } from '@/types/Element';

// Element color mapping
const ATTACK_COLORS: Record<Element, string> = {
  Venus: '#16a34a',
  Mars: '#ef4444',
  Mercury: '#3b82f6',
  Jupiter: '#f59e0b',
  Neutral: '#9ca3af',
};

const DEFAULT_COLOR = '#9ca3af';

export interface AttackAnimationProps {
  element?: Element;
  targetPosition: { x: number; y: number };
  onComplete: () => void;
  duration?: number;
}

export function AttackAnimation({
  element,
  targetPosition,
  onComplete,
  duration = 1000,
}: AttackAnimationProps): React.ReactElement {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!visible) return <></>;

  const color = element ? ATTACK_COLORS[element] : DEFAULT_COLOR;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-50"
      role="presentation"
      aria-hidden="true"
    >
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
