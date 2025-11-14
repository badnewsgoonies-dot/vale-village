/**
 * Player Side Panel Component
 *
 * Displays all player units with full HP and status information.
 */

import React from 'react';
import { UnitCard } from './UnitCard';
import type { SidePanelPlayerProps } from './types';

export function SidePanelPlayer({ units, onSelectUnit }: SidePanelPlayerProps): JSX.Element {
  return (
    <div className="player-side">
      <div className="side-title">Player Party</div>
      <div className="unit-list">
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onClick={() => onSelectUnit(unit.id)}
          />
        ))}
      </div>
    </div>
  );
}
