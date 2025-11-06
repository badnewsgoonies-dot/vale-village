import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Button, ElementIcon } from '../shared';
import { BattleUnit } from '@/sprites/components/BattleUnit';
import { EquipmentIcon } from '@/sprites/components/EquipmentIcon';
import type { Unit } from '@/types/Unit';
import type { Equipment, EquipmentSlot } from '@/types/Equipment';
import './EquipmentScreen.css';

export const EquipmentScreen: React.FC = () => {
  const { state, actions } = useGame();
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [showAllUnits, setShowAllUnits] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allUnits = state.playerData.unitsCollected;
  const activePartyIds = state.playerData.activePartyIds;
  const inventory = state.playerData.inventory;

  // Split units into active and bench
  const activeUnits = allUnits.filter(u => activePartyIds.includes(u.id));
  const benchUnits = allUnits.filter(u => !activePartyIds.includes(u.id));

  // Auto-select first active unit if none selected
  React.useEffect(() => {
    if (!selectedUnit && activeUnits.length > 0) {
      setSelectedUnit(activeUnits[0]);
    }
  }, [activeUnits, selectedUnit]);

  if (!selectedUnit) {
    return <div className="equipment-screen">Loading...</div>;
  }

  const currentEquipment = selectedUnit.equipment;

  // Calculate stat changes when hovering over an item
  const calculateStatChange = (item: Equipment | null): { atk: number; def: number; spd: number } => {
    if (!item) {
      return { atk: 0, def: 0, spd: 0 };
    }

    const currentItem = currentEquipment[item.slot];
    const currentBonus = currentItem?.statBonus || {};
    const newBonus = item.statBonus || {};

    return {
      atk: (newBonus.atk || 0) - (currentBonus.atk || 0),
      def: (newBonus.def || 0) - (currentBonus.def || 0),
      spd: (newBonus.spd || 0) - (currentBonus.spd || 0)
    };
  };

  const statChanges = calculateStatChange(selectedItem);

  // Use Unit's calculateStats method
  const currentStats = selectedUnit.calculateStats();

  const handleEquipItem = (item: Equipment) => {
    actions.equipItem(selectedUnit.id, item.slot, item);
    setSelectedItem(null);
    setErrorMessage(null);
  };

  const handleUnequipItem = (slot: EquipmentSlot) => {
    actions.unequipItem(selectedUnit.id, slot);
    setErrorMessage(null);
  };

  const handleReturn = () => {
    actions.goBack();
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
          {item ? (
            <EquipmentIcon equipment={item} size="medium" className="item-icon" />
          ) : (
            <div className="item-icon empty" aria-hidden="true">-</div>
          )}
          <div className={`item-name ${!item ? 'empty-slot' : ''}`}>
            {item ? item.name : 'Empty'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="equipment-screen">
      <div className="equipment-container">
        {/* Header */}
        <header className="equipment-header">
          <div className="header-content">
            <h1>EQUIPMENT</h1>
            <div className="unit-summary">
              <span className="active-count">Active: {activeUnits.length} / 4</span>
              <span className="divider">•</span>
              <span className="total-count">Total: {allUnits.length} / 10</span>
            </div>
          </div>
          <Button onClick={handleReturn} ariaLabel="Return to previous menu">
            RETURN
          </Button>
        </header>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Main Content - Unit selector and selected unit details */}
        <div className="equipment-content">
          {/* Unit Selector Panel */}
          <aside className="unit-selector" role="navigation" aria-label="Unit selection">
            <h2>PARTY</h2>
            <div className="unit-list">
              {activeUnits.map(unit => (
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
                  <BattleUnit unit={unit} animation="Front" className="unit-sprite" />
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

            {benchUnits.length > 0 && (
              <>
                <h3 className="bench-header">BENCH</h3>
                <div className="unit-list bench-list">
                  {benchUnits.map(unit => (
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
                      <BattleUnit unit={unit} animation="Front" className="unit-sprite" />
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
              </>
            )}

            <div className="toggle-all-units">
              <Button
                onClick={() => setShowAllUnits(!showAllUnits)}
                ariaLabel={showAllUnits ? "Hide full roster" : "Show full roster"}
              >
                {showAllUnits ? "▲ HIDE FULL ROSTER" : "▼ SHOW FULL ROSTER"}
              </Button>
            </div>
          </aside>

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
              <EquipmentIcon equipment={item} size="medium" className="item-icon" />
              <div className="item-name">{item.name}</div>
            </div>
          ))}
        </div>
      </section>
        </div>
      </div>
    </div>
  );
};
