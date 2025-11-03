import React, { useState } from 'react';
import { Button, ElementIcon } from '../shared';
import './EquipmentScreen.css';

type Element = 'venus' | 'mars' | 'mercury' | 'jupiter' | 'neutral';

type EquipmentSlot = 'weapon' | 'armor' | 'helm' | 'boots';

interface Unit {
  id: string;
  name: string;
  level: number;
  element: Element;
}

interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  icon: string;
  stats: {
    atk?: number;
    def?: number;
    spd?: number;
  };
}

interface EquippedItems {
  weapon?: EquipmentItem;
  armor?: EquipmentItem;
  helm?: EquipmentItem;
  boots?: EquipmentItem;
}

interface UnitEquipment {
  [unitId: string]: EquippedItems;
}

interface EquipmentScreenProps {
  units: Unit[];
  equipment: UnitEquipment;
  inventory: EquipmentItem[];
  onEquipItem?: (unitId: string, slot: EquipmentSlot, itemId: string) => void;
  onUnequipItem?: (unitId: string, slot: EquipmentSlot) => void;
  onReturn?: () => void;
}

export const EquipmentScreen: React.FC<EquipmentScreenProps> = ({
  units,
  equipment,
  inventory,
  onEquipItem,
  onUnequipItem,
  onReturn
}) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit>(units[0] || null);
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);

  const currentEquipment = selectedUnit ? equipment[selectedUnit.id] || {} : {};

  // Calculate stat changes when hovering over an item
  const calculateStatChange = (item: EquipmentItem | null): { atk: number; def: number; spd: number } => {
    if (!item || !selectedUnit) {
      return { atk: 0, def: 0, spd: 0 };
    }

    const currentItem = currentEquipment[item.slot];
    const currentStats = currentItem?.stats || { atk: 0, def: 0, spd: 0 };
    const newStats = item.stats || { atk: 0, def: 0, spd: 0 };

    return {
      atk: (newStats.atk || 0) - (currentStats.atk || 0),
      def: (newStats.def || 0) - (currentStats.def || 0),
      spd: (newStats.spd || 0) - (currentStats.spd || 0)
    };
  };

  const statChanges = calculateStatChange(selectedItem);

  // Calculate current total stats
  const getCurrentStats = () => {
    let totalAtk = 45; // Base stats
    let totalDef = 32;
    let totalSpd = 28;

    Object.values(currentEquipment).forEach(item => {
      if (item) {
        totalAtk += item.stats.atk || 0;
        totalDef += item.stats.def || 0;
        totalSpd += item.stats.spd || 0;
      }
    });

    return { atk: totalAtk, def: totalDef, spd: totalSpd };
  };

  const currentStats = getCurrentStats();

  const handleEquipItem = (item: EquipmentItem) => {
    if (selectedUnit) {
      onEquipItem?.(selectedUnit.id, item.slot, item.id);
      setSelectedItem(null);
    }
  };

  const handleUnequipItem = (slot: EquipmentSlot) => {
    if (selectedUnit) {
      onUnequipItem?.(selectedUnit.id, slot);
    }
  };

  const renderSlot = (slot: EquipmentSlot, label: string) => {
    const item = currentEquipment[slot];

    return (
      <div
        className="equipment-slot"
        tabIndex={0}
        role="button"
        aria-label={item ? `${label} slot: ${item.name} equipped` : `${label} slot: Empty`}
        onClick={() => item && handleUnequipItem(slot)}
      >
        <div className="slot-label">{label}</div>
        <div className="slot-item">
          <div className="item-icon" aria-hidden="true">
            {item ? item.icon : '-'}
          </div>
          <div className={`item-name ${!item ? 'empty-slot' : ''}`}>
            {item ? item.name : 'Empty'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="equipment-container">
      {/* Unit Selector Panel */}
      <aside className="unit-selector" role="navigation" aria-label="Unit selection">
        <h2>PARTY</h2>
        <div className="unit-list">
          {units.map(unit => (
            <div
              key={unit.id}
              className={`unit-card ${selectedUnit?.id === unit.id ? 'selected' : ''}`}
              tabIndex={0}
              role="button"
              aria-pressed={selectedUnit?.id === unit.id}
              aria-label={`${unit.name}, Level ${unit.level}, ${unit.element} element`}
              onClick={() => {
                setSelectedUnit(unit);
                setSelectedItem(null);
              }}
            >
              <div className="unit-sprite" aria-hidden="true">
                {unit.name.charAt(0)}
              </div>
              <div className="unit-info">
                <div className="unit-name">
                  {unit.name}
                  <span className="unit-element">
                    <ElementIcon element={unit.element} size="tiny" />
                  </span>
                </div>
                <div className="unit-level">Lv {unit.level}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Header Panel */}
      <header className="header-panel">
        <h1>EQUIPMENT</h1>
        <Button onClick={onReturn} ariaLabel="Return to previous menu">
          RETURN
        </Button>
      </header>

      {/* Equipped Items Panel */}
      {selectedUnit && (
        <section className="equipped-panel" aria-label="Currently equipped items">
          <div className="equipped-header">
            <h2>EQUIPPED: {selectedUnit.name}</h2>
          </div>

          {/* Equipment Slots */}
          <div className="equipped-grid">
            {renderSlot('weapon', 'Weapon')}
            {renderSlot('armor', 'Armor')}
            {renderSlot('helm', 'Helm')}
            {renderSlot('boots', 'Boots')}
          </div>

          {/* Stat Comparison */}
          <div className="stat-comparison">
            <h3>STATS {selectedItem ? '(Current → With Selection)' : '(Current)'}</h3>
            <div className="stats-grid">
              {/* ATK Row */}
              <div className="stat-row">
                <span className="stat-label">ATK:</span>
                <span className="stat-value">{currentStats.atk}</span>
              </div>
              <div className="stat-row stat-arrow">→</div>
              <div className="stat-row">
                <span className={`stat-value ${statChanges.atk > 0 ? 'stat-increase' : statChanges.atk < 0 ? 'stat-decrease' : ''}`}>
                  {selectedItem ? `${currentStats.atk + statChanges.atk} (${statChanges.atk >= 0 ? '+' : ''}${statChanges.atk})` : '--'}
                </span>
              </div>

              {/* DEF Row */}
              <div className="stat-row">
                <span className="stat-label">DEF:</span>
                <span className="stat-value">{currentStats.def}</span>
              </div>
              <div className="stat-row stat-arrow">→</div>
              <div className="stat-row">
                <span className={`stat-value ${statChanges.def > 0 ? 'stat-increase' : statChanges.def < 0 ? 'stat-decrease' : ''}`}>
                  {selectedItem ? `${currentStats.def + statChanges.def} (${statChanges.def >= 0 ? '+' : ''}${statChanges.def})` : '--'}
                </span>
              </div>

              {/* SPD Row */}
              <div className="stat-row">
                <span className="stat-label">SPD:</span>
                <span className="stat-value">{currentStats.spd}</span>
              </div>
              <div className="stat-row stat-arrow">→</div>
              <div className="stat-row">
                <span className={`stat-value ${statChanges.spd > 0 ? 'stat-increase' : statChanges.spd < 0 ? 'stat-decrease' : ''}`}>
                  {selectedItem ? `${currentStats.spd + statChanges.spd} (${statChanges.spd >= 0 ? '+' : ''}${statChanges.spd})` : '--'}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Inventory Panel */}
      <section className="inventory-panel" aria-label="Equipment inventory">
        <h2>INVENTORY</h2>
        <div className="inventory-grid">
          {inventory.map(item => (
            <div
              key={item.id}
              className={`inventory-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
              tabIndex={0}
              role="button"
              aria-label={item.name}
              onClick={() => setSelectedItem(item)}
              onDoubleClick={() => handleEquipItem(item)}
            >
              <div className="item-icon" aria-hidden="true">
                {item.icon}
              </div>
              <div className="item-name">{item.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
