/**
 * Unit Card Component
 *
 * Displays a single unit's status including HP, element, and status effects.
 * Used in both player and enemy side panels.
 */

import { SimpleSprite } from '../../sprites/SimpleSprite';
import { StatusIcon } from './StatusIcon';
import type { UnitCardProps} from './types';

export function UnitCard({ unit, onClick }: UnitCardProps): JSX.Element {
  const classes = [
    'unit-card',
    unit.isSelected ? 'unit-card--selected' : '',
    unit.isKo ? 'unit-card--ko' : '',
  ].filter(Boolean).join(' ');

  const hpPercentage = unit.hp && unit.maxHp ? (unit.hp / unit.maxHp) * 100 : 0;

  return (
    <div className={classes} onClick={onClick}>
      {/* Sprite */}
      <div className="unit-sprite">
        <SimpleSprite
          id={unit.id}
          width={32}
          height={32}
          style={{ borderRadius: '4px' }}
        />
      </div>

      {/* Header: Name + Element */}
      <div className="unit-header">
        <div className="unit-name">{unit.name}</div>
        <div className="unit-element">{unit.element}</div>
      </div>

      {/* HP Row (hidden for enemies via CSS) */}
      {unit.hp !== undefined && unit.maxHp !== undefined && (
        <div className="unit-hp-row">
          <div className="hp-bar">
            <div
              className={`hp-fill ${unit.isKo ? 'hp-fill--empty' : ''}`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
          <div className="hp-text">{unit.hp} / {unit.maxHp}</div>
        </div>
      )}

      {/* Status Row */}
      <div className="unit-status-row">
        {unit.isKo && <div className="unit-status-label">KO</div>}
        <div className="status-icons">
          {unit.statuses.map((status) => (
            <StatusIcon
              key={status.id}
              statusType={status.id}
              title={status.title}
              size={20}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
