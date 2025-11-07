/**
 * PsynergyAnimation: Golden Sun psynergy sprite display component
 *
 * Ported from NextEraGame with Vale Village adaptations.
 *
 * Features:
 * - Displays actual Golden Sun psynergy GIF sprites
 * - Positioned absolutely at target location
 * - Preserves pixel art aesthetic with image-rendering: pixelated
 * - Auto-cleanup after GIF animation duration
 * - Error handling for missing sprites
 *
 * Design:
 * - Uses actual sprite assets from /public/sprites/psynergy/
 * - Sprite mapping via psynergySprites.ts
 * - Typical GIF duration: 1-2 seconds
 * - Larger size for AoE spells (192px vs 128px)
 */

import React, { useEffect } from 'react';
import { getPsynergySprite } from '@/data/psynergySprites';

// ============================================
// Component Interface
// ============================================

export interface PsynergyAnimationProps {
  /** Ability ID to determine which psynergy sprite to show */
  abilityId: string;
  /** Screen position where sprite should appear (pixels) */
  position: { x: number; y: number };
  /** Size of the sprite in pixels (default: 128) */
  size?: number;
  /** Callback when animation completes (for cleanup) */
  onComplete: () => void;
  /** Duration override in milliseconds (default: 2000) */
  duration?: number;
}

// ============================================
// Main Component
// ============================================

/**
 * PsynergyAnimation renders Golden Sun psynergy sprite GIFs
 *
 * The component:
 * 1. Loads the appropriate GIF sprite for the ability
 * 2. Positions it at the target location
 * 3. Plays the GIF animation (browser handles playback)
 * 4. Calls onComplete after duration
 * 5. Cleans up automatically
 *
 * @example
 * ```tsx
 * <PsynergyAnimation
 *   abilityId="pyroclasm"
 *   position={{ x: 400, y: 300 }}
 *   size={192}
 *   onComplete={() => setShowAnimation(false)}
 * />
 * ```
 */
export function PsynergyAnimation({
  abilityId,
  position,
  size = 128,
  onComplete,
  duration = 2000,
}: PsynergyAnimationProps): React.ReactElement {
  // ============================================
  // Get Sprite for Ability
  // ============================================

  const spriteUrl = getPsynergySprite(abilityId);

  // If no sprite (physical attack), don't render
  if (!spriteUrl) {
    // Call onComplete immediately for physical attacks
    useEffect(() => {
      onComplete();
    }, [onComplete]);
    return <></>;
  }

  // ============================================
  // Auto-cleanup After Duration
  // ============================================

  useEffect(() => {
    // Golden Sun psynergy GIFs typically play for 1-2 seconds
    // Add buffer for load time
    const timer = setTimeout(onComplete, duration);

    // Important: clear timeout if component unmounts early
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // ============================================
  // Render
  // ============================================

  return (
    <div
      className="absolute pointer-events-none z-[999]"
      style={{
        left: position.x - size / 2, // Center horizontally
        top: position.y - size / 2, // Center vertically
        width: size,
        height: size,
      }}
      role="presentation"
      aria-hidden="true"
      data-testid="psynergy-animation"
    >
      <img
        src={spriteUrl}
        alt={`psynergy-${abilityId}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          imageRendering: 'pixelated', // Preserve pixel art
        }}
        onError={(e) => {
          console.error('Failed to load psynergy sprite:', spriteUrl);
          // Hide the image on error
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}
