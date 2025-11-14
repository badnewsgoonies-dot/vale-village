/**
 * Turn Order Strip Component
 *
 * Displays the turn order sequence showing which units act when.
 * Shows current acting unit with highlight.
 */

import React from 'react';
import type { TurnOrderStripProps } from './types';

export function TurnOrderStrip({ units }: TurnOrderStripProps): JSX.Element {
  return (
    <div className="turn-order-strip">
      {units.map((unit) => {
        const classes = [
          'turn-order-unit',
          unit.side === 'player' ? 'turn-order-unit--player' : 'turn-order-unit--enemy',
          unit.isCurrent ? 'turn-order-unit--current' : '',
        ].filter(Boolean).join(' ');

        return (
          <div key={unit.id} className={classes} title={unit.name}>
            {unit.name.slice(0, 5)}
          </div>
        );
      })}
    </div>
  );
}
