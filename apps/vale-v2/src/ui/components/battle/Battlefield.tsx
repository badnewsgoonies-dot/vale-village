/**
 * Battlefield Component
 *
 * Visual representation of the battle space with unit sprites.
 * Handles target selection during planning phase.
 */

import React from 'react';
import type { BattlefieldProps } from './types';

export function Battlefield({
  playerUnits,
  enemyUnits,
  targetingMode,
  onSelectTarget,
}: BattlefieldProps): JSX.Element {
  return (
    <div className="battlefield">
      <div className="battlefield-inner">
        {/* Player column (left side) */}
        <div className="battlefield-column">
          {playerUnits.map((unit) => {
            const classes = [
              'battlefield-unit',
              unit.isSelected ? 'battlefield-unit--current' : '',
              targetingMode && !unit.isKo ? 'targetable' : '',
            ].filter(Boolean).join(' ');

            return (
              <div
                key={unit.id}
                className={classes}
                onClick={() => targetingMode && onSelectTarget?.(unit.id)}
                style={{ opacity: unit.isKo ? 0.4 : 1 }}
              >
                {unit.name.slice(0, 1)}
              </div>
            );
          })}
        </div>

        {/* Enemy column (right side) */}
        <div className="battlefield-column">
          {enemyUnits.map((enemy) => {
            const classes = [
              'battlefield-unit',
              targetingMode && !enemy.isKo ? 'targetable' : '',
            ].filter(Boolean).join(' ');

            return (
              <div
                key={enemy.id}
                className={classes}
                onClick={() => targetingMode && onSelectTarget?.(enemy.id)}
                style={{ opacity: enemy.isKo ? 0.4 : 1 }}
              >
                {enemy.name.slice(0, 1)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
