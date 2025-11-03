import React, { useState } from 'react';
import { Button, ElementIcon, StatBar } from '../shared';
import { BattleUnit } from '@/sprites/components/BattleUnit';
import type { Unit } from '@/types/Unit';
import './UnitCollectionScreen.css';

interface UnitCollectionScreenProps {
  units: Unit[];
  activeParty: Unit[];
  onSetActiveParty: (unitIds: string[]) => void;
  onViewEquipment: (unit: Unit) => void;
  onReturn: () => void;
}

export const UnitCollectionScreen: React.FC<UnitCollectionScreenProps> = ({
  units,
  activeParty,
  onSetActiveParty,
  onViewEquipment,
  onReturn
}) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(units[0] || null);

  const activeCount = activeParty.length;
  const totalCount = units.length;

  const isUnitActive = (unit: Unit) => activeParty.some(u => u.id === unit.id);

  const handleToggleActive = (unit: Unit) => {
    const isActive = isUnitActive(unit);
    if (isActive) {
      // Remove from active party
      onSetActiveParty(activeParty.filter(u => u.id !== unit.id).map(u => u.id));
    } else {
      // Add to active party (max 4)
      if (activeParty.length < 4) {
        onSetActiveParty([...activeParty.map(u => u.id), unit.id]);
      }
    }
  };

  return (
    <div className="collection-container">
      {/* Header Panel */}
      <header className="header-panel">
        <div className="header-content">
          <h1>PARTY MANAGEMENT</h1>
          <div className="party-indicator">
            Active Party: <span className="party-count">{activeCount} / {totalCount} units</span>
          </div>
        </div>
        <Button onClick={onReturn} ariaLabel="Return to previous menu">
          RETURN
        </Button>
      </header>

      {/* Units Grid Panel */}
      <section className="units-panel" aria-label="Unit collection grid">
        <div className="units-grid-header">
          <h2>COLLECTED UNITS</h2>
          <div className="units-count">{totalCount} / 10</div>
        </div>

        {/* Legend */}
        <div className="legend">
          <div className="legend-item">
            <div className="legend-badge active"></div>
            <span>Active Party</span>
          </div>
          <div className="legend-item">
            <div className="legend-badge bench"></div>
            <span>Bench</span>
          </div>
        </div>

        {/* Units Grid */}
        <div className="units-grid">
          {units.map((unit) => (
            <div
              key={unit.id}
              className={`unit-card ${isUnitActive(unit) ? 'active' : ''} ${selectedUnit?.id === unit.id ? 'selected' : ''}`}
              tabIndex={0}
              role="button"
              aria-pressed={selectedUnit?.id === unit.id}
              aria-label={`${unit.name}, Level ${unit.level}, ${unit.element} element, ${isUnitActive(unit) ? 'Active party member' : 'Bench'}`}
              onClick={() => setSelectedUnit(unit)}
            >
              <div className="unit-sprite">
                <ElementIcon element={unit.element} size="small" className="element-badge-positioned" />
                <BattleUnit unit={unit} animation="Front" />
              </div>
              <div className="unit-name">{unit.name}</div>
              <div className="unit-level">Lv {unit.level}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Panel */}
      <aside className="stats-panel" aria-label="Selected unit details">
        <h2>UNIT DETAILS</h2>

        {selectedUnit && (() => {
          const stats = selectedUnit.calculateStats();
          const isActive = isUnitActive(selectedUnit);

          return (
            <>
              {/* Selected Unit Preview */}
              <div className="selected-unit-preview">
                <div className="preview-sprite">
                  <ElementIcon element={selectedUnit.element} size="small" className="element-badge-positioned" />
                  <BattleUnit unit={selectedUnit} animation="Front" />
                </div>
                <div className="preview-name">{selectedUnit.name}</div>
                <div className="preview-class">{selectedUnit.role}</div>
                <div className={`preview-element element-${selectedUnit.element.toLowerCase()}`}>
                  {selectedUnit.element.toUpperCase()}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <StatBar label="HP" value={stats.hp} />
                <StatBar label="PP" value={stats.pp} />
                <StatBar label="ATK" value={stats.atk} />
                <StatBar label="DEF" value={stats.def} />
                <StatBar label="MAG" value={stats.mag} />
                <StatBar label="SPD" value={stats.spd} />
              </div>

              {/* Role Description */}
              <div className="unit-role">
                <strong>Role:</strong> {selectedUnit.role}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <Button
                  variant="primary"
                  onClick={() => handleToggleActive(selectedUnit)}
                  ariaLabel={isActive ? `Remove ${selectedUnit.name} from active party` : `Add ${selectedUnit.name} to active party`}
                >
                  {isActive ? 'REMOVE FROM PARTY' : 'ADD TO PARTY'}
                </Button>
                <Button
                  onClick={() => onViewEquipment(selectedUnit)}
                  ariaLabel={`View ${selectedUnit.name}'s equipment`}
                >
                  VIEW EQUIPMENT
                </Button>
              </div>
            </>
          );
        })()}
      </aside>
    </div>
  );
};
