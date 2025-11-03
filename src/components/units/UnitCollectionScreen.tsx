import React, { useState } from 'react';
import { Button, ElementIcon, StatBar } from '../shared';
import './UnitCollectionScreen.css';

type Element = 'venus' | 'mars' | 'mercury' | 'jupiter' | 'neutral';

interface Unit {
  id: string;
  name: string;
  level: number;
  element: Element;
  class: string;
  isActive: boolean;
  stats: {
    hp: number;
    pp: number;
    atk: number;
    def: number;
    mag: number;
    spd: number;
  };
  role: string;
}

interface UnitCollectionScreenProps {
  units: Unit[];
  onToggleActive?: (unitId: string) => void;
  onViewEquipment?: (unitId: string) => void;
  onReturn?: () => void;
}

export const UnitCollectionScreen: React.FC<UnitCollectionScreenProps> = ({
  units,
  onToggleActive,
  onViewEquipment,
  onReturn
}) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(units[0] || null);

  const activeCount = units.filter(u => u.isActive).length;
  const totalCount = units.length;

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
              className={`unit-card ${unit.isActive ? 'active' : ''} ${selectedUnit?.id === unit.id ? 'selected' : ''}`}
              tabIndex={0}
              role="button"
              aria-pressed={selectedUnit?.id === unit.id}
              aria-label={`${unit.name}, Level ${unit.level}, ${unit.element} element, ${unit.isActive ? 'Active party member' : 'Bench'}`}
              onClick={() => setSelectedUnit(unit)}
            >
              <div className="unit-sprite">
                <ElementIcon element={unit.element} size="small" className="element-badge-positioned" />
                {unit.name.charAt(0)}
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

        {selectedUnit && (
          <>
            {/* Selected Unit Preview */}
            <div className="selected-unit-preview">
              <div className="preview-sprite">
                <ElementIcon element={selectedUnit.element} size="small" className="element-badge-positioned" />
                {selectedUnit.name.charAt(0)}
              </div>
              <div className="preview-name">{selectedUnit.name}</div>
              <div className="preview-class">{selectedUnit.class}</div>
              <div className={`preview-element element-${selectedUnit.element}`}>
                {selectedUnit.element.toUpperCase()}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <StatBar label="HP" value={selectedUnit.stats.hp} />
              <StatBar label="PP" value={selectedUnit.stats.pp} />
              <StatBar label="ATK" value={selectedUnit.stats.atk} />
              <StatBar label="DEF" value={selectedUnit.stats.def} />
              <StatBar label="MAG" value={selectedUnit.stats.mag} />
              <StatBar label="SPD" value={selectedUnit.stats.spd} />
            </div>

            {/* Role Description */}
            <div className="unit-role">
              <strong>Role:</strong> {selectedUnit.role}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Button
                variant="primary"
                onClick={() => onToggleActive?.(selectedUnit.id)}
                ariaLabel={selectedUnit.isActive ? `Remove ${selectedUnit.name} from active party` : `Add ${selectedUnit.name} to active party`}
              >
                {selectedUnit.isActive ? 'REMOVE FROM PARTY' : 'ADD TO PARTY'}
              </Button>
              <Button
                onClick={() => onViewEquipment?.(selectedUnit.id)}
                ariaLabel={`View ${selectedUnit.name}'s equipment`}
              >
                VIEW EQUIPMENT
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};
