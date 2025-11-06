import React from 'react';
import { BattleUnit } from '@/sprites/components/BattleUnit';
import { ElementIcon, StatBar, Button } from '../shared';
import type { Unit } from '@/types/Unit';
import './PartyManagement.css';

interface PartyMemberCardProps {
  unit: Unit;
  isActive: boolean;
  onSwap: (unit: Unit) => void;
  onSelect: (unit: Unit) => void;
  isSelected: boolean;
  size?: 'large' | 'small';
}

export const PartyMemberCard: React.FC<PartyMemberCardProps> = ({
  unit,
  isActive,
  onSwap,
  onSelect,
  isSelected,
  size = 'large'
}) => {
  const stats = unit.calculateStats();

  return (
    <div
      className={`party-member-card ${size} ${isSelected ? 'selected' : ''} ${isActive ? 'active-member' : 'bench-member'}`}
      onClick={() => onSelect(unit)}
      role="button"
      tabIndex={0}
      aria-label={`${unit.name}, Level ${unit.level}, ${unit.element} element, ${isActive ? 'Active party' : 'Bench'}`}
    >
      <div className="card-header">
        <ElementIcon element={unit.element} size="small" className="element-badge" />
        <div className="unit-info">
          <div className="unit-name">{unit.name}</div>
          <div className="unit-level">Lv {unit.level}</div>
        </div>
      </div>

      <div className="card-sprite">
        <BattleUnit unit={unit} animation="Front" />
      </div>

      <div className="card-stats">
        <StatBar
          label="HP"
          value={unit.currentHp}
          maxValue={stats.hp}
        />
        <StatBar
          label="PP"
          value={unit.currentPp}
          maxValue={stats.pp}
        />
      </div>

      <Button
        onClick={(e?: React.MouseEvent) => {
          e?.stopPropagation();
          onSwap(unit);
        }}
        variant={isActive ? 'secondary' : 'primary'}
        className="swap-button"
        ariaLabel={isActive ? `Move ${unit.name} to bench` : `Move ${unit.name} to active party`}
      >
        {isActive ? '→ Bench' : '→ Active'}
      </Button>
    </div>
  );
};
