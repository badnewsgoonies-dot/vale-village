/**
 * Enemy Side Panel Component
 *
 * Displays all enemy units (HP hidden via CSS).
 */

import { UnitCard } from './UnitCard';
import type { SidePanelEnemyProps } from './types';

export function SidePanelEnemy({ units, onSelectUnit }: SidePanelEnemyProps): JSX.Element {
  return (
    <div className="enemy-side">
      <div className="side-title">Enemies</div>
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
