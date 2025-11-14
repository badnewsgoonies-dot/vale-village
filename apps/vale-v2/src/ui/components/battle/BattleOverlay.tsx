/**
 * Battle Overlay Component
 *
 * Displays victory or defeat overlays with rewards and action buttons.
 */

import React from 'react';
import type { BattleOverlayProps } from './types';

export function BattleOverlay({
  status,
  rewards,
  onContinue,
  onReturnToVillage,
  onRetry,
  onReturnToTitle,
}: BattleOverlayProps): JSX.Element | null {
  if (status === 'ongoing') {
    return null;
  }

  const isVictory = status === 'victory';
  const overlayClass = isVictory ? 'battle-overlay--victory' : 'battle-overlay--defeat';

  return (
    <div className={`battle-overlay ${overlayClass}`}>
      <div className="battle-overlay-title">
        {isVictory ? 'Victory!' : 'Defeat'}
      </div>

      {isVictory && rewards && (
        <div className="battle-overlay-subtitle">
          XP: +{rewards.xp} · Gold: +{rewards.gold}
        </div>
      )}

      {!isVictory && (
        <div className="battle-overlay-subtitle">
          Your party has fallen.
        </div>
      )}

      <div className="battle-overlay-actions">
        {isVictory ? (
          <>
            <button className="overlay-button" onClick={onContinue}>
              Continue (Rewards)
            </button>
            <button className="overlay-button" onClick={onReturnToVillage}>
              Return to Village
            </button>
          </>
        ) : (
          <>
            <button className="overlay-button" onClick={onRetry}>
              Retry Battle
            </button>
            <button className="overlay-button" onClick={onReturnToTitle}>
              Return to Title
            </button>
          </>
        )}
      </div>
    </div>
  );
}
