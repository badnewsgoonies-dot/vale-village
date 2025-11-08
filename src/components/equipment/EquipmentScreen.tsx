import React, { useState, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { Button, ElementIcon } from '../shared';
import { BattleUnit } from '@/sprites/components/BattleUnit';
import { EquipmentIcon } from '@/sprites/components/EquipmentIcon';
import { ABILITIES } from '@/data/abilities';
import type { Equipment, EquipmentSlot } from '@/types/Equipment';
import type { Ability } from '@/types/Ability';
import './EquipmentScreen.css';

type InventoryFilter = 'all' | 'weapon' | 'armor' | 'helm' | 'boots' | 'accessory';

export const EquipmentScreen: React.FC = () => {
  const { state, actions } = useGame();
  const [selectedUnit, setSelectedUnit] = useState<Equipment['slot'] extends string ? any : null>(null);
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  // const [showAllUnits, setShowAllUnits] = useState(false); // Unused - reserved for future feature
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inventoryFilter, setInventoryFilter] = useState<InventoryFilter>('all');

  const allUnits = state.playerData.unitsCollected;
  const activePartyIds = state.playerData.activePartyIds;
  const inventory = state.playerData.inventory;

  // Filter inventory based on selected tab
  const filteredInventory = useMemo(() => {
    if (inventoryFilter === 'all') return inventory;
    return inventory.filter(item => item.slot === inventoryFilter);
  }, [inventory, inventoryFilter]);

  // Split units into active and bench (memoized)
  const activeUnits = useMemo(
    () => allUnits.filter(u => activePartyIds.includes(u.id)),
    [allUnits, activePartyIds]
  );
  const benchUnits = useMemo(
    () => allUnits.filter(u => !activePartyIds.includes(u.id)),
    [allUnits, activePartyIds]
  );

  // Auto-select first active unit if none selected
  React.useEffect(() => {
    if (!selectedUnit && activeUnits.length > 0) {
      setSelectedUnit(activeUnits[0]);
    }
  }, [activeUnits, selectedUnit]);

  if (!selectedUnit) {
    return <div className="equipment-screen">Loading...</div>;
  }

  // Memoize equipment abilities
  const currentEquipment = selectedUnit?.equipment || {};
  const getEquipmentAbilities = useMemo(() => {
    return (equipment: Record<EquipmentSlot, Equipment | null>): Ability[] => {
      const abilities: Ability[] = [];
      Object.values(equipment).forEach(item => {
        if (item?.unlocksAbility) {
          const ability = ABILITIES[item.unlocksAbility];
          if (ability) {
            abilities.push(ability);
          }
        }
      });
      return abilities;
    };
  }, []);

  const currentAbilities = useMemo(
    () => getEquipmentAbilities(currentEquipment),
    [currentEquipment, getEquipmentAbilities]
  );

  // Get ability changes when hovering over an item
  const getAbilityChanges = (item: Equipment | null): { added: Ability[]; removed: Ability[] } => {
    if (!item) {
      return { added: [], removed: [] };
    }

    const currentItem = currentEquipment[item.slot];
    const added: Ability[] = [];
    const removed: Ability[] = [];

    // Check if new item grants ability
    if (item.unlocksAbility) {
      const ability = ABILITIES[item.unlocksAbility];
      if (ability) {
        added.push(ability);
      }
    }

    // Check if current item grants ability
    if (currentItem?.unlocksAbility) {
      const ability = ABILITIES[currentItem.unlocksAbility];
      if (ability) {
        removed.push(ability);
      }
    }

    return { added, removed };
  };

  const abilityChanges = getAbilityChanges(selectedItem);

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

  const handleReturn = React.useCallback(() => {
    actions.goBack();
  }, [actions]);

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

        {/* Current Team Bar */}
        <div className="current-team-bar">
          <div className="team-section">
            <h3>Current Team</h3>
            <div className="team-portraits">
              {activeUnits.map(unit => (
                <div
                  key={unit.id}
                  className={`team-portrait ${selectedUnit?.id === unit.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedUnit(unit);
                    setSelectedItem(null);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <BattleUnit unit={unit} animation="Front" className="portrait-sprite" />
                  <div className="portrait-name">{unit.name}</div>
                </div>
              ))}
            </div>
          </div>

          {benchUnits.length > 0 && (
            <div className="bench-section">
              <h3>Bench</h3>
              <div className="team-portraits">
                {benchUnits.map(unit => (
                  <div
                    key={unit.id}
                    className={`team-portrait ${selectedUnit?.id === unit.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setSelectedItem(null);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <BattleUnit unit={unit} animation="Front" className="portrait-sprite" />
                    <div className="portrait-name">{unit.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content - Equipment and Inventory */}
        <div className="equipment-content">
      {/* Equipped Items Panel */}
      {selectedUnit && (
        <section className="equipped-panel" aria-label="Currently equipped items">
          {/* Unit Info Banner */}
          <div className="unit-info-banner">
            <div className="banner-portrait">
              <BattleUnit unit={selectedUnit} animation="Front" className="banner-sprite" />
            </div>
            <div className="banner-details">
              <h2 className="banner-unit-name">{selectedUnit.name}</h2>
              <div className="banner-meta">
                <span>Lv {selectedUnit.level}</span>
                <span className="divider">•</span>
                <ElementIcon element={selectedUnit.element} size="small" />
                <span>{selectedUnit.element}</span>
              </div>
            </div>
          </div>

          {/* Equipment Slots - Plus/Cross Layout */}
          <div className="equipped-plus-layout">
            {/* Top: Helm */}
            <div className="equipment-top">
              {renderSlot('helm', 'HELM')}
            </div>

            {/* Middle Row: Weapon, Armor, Accessory */}
            <div className="equipment-middle">
              {renderSlot('weapon', 'WEAPON')}
              {renderSlot('armor', 'ARMOR')}
              {renderSlot('accessory', 'ACCESSORY')}
            </div>

            {/* Bottom: Boots */}
            <div className="equipment-bottom">
              {renderSlot('boots', 'BOOTS')}
            </div>
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

          {/* Equipment Abilities */}
          <div className="equipment-abilities">
            <h3>ABILITIES {selectedItem && (abilityChanges.added.length > 0 || abilityChanges.removed.length > 0) ? '(Current → With Selection)' : '(Current)'}</h3>
            
            {currentAbilities.length === 0 && !selectedItem && (
              <p className="no-abilities">No equipment abilities equipped</p>
            )}

            {currentAbilities.length > 0 && (
              <div className="abilities-list current">
                {currentAbilities.map(ability => (
                  <div 
                    key={ability.id} 
                    className={`ability-badge ${selectedItem && abilityChanges.removed.some(a => a.id === ability.id) ? 'ability-removed' : ''}`}
                  >
                    <span className="ability-name">{ability.name}</span>
                    {ability.element && <ElementIcon element={ability.element} size="tiny" />}
                    <span className="ability-pp">PP: {ability.ppCost}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedItem && abilityChanges.added.length > 0 && (
              <>
                {currentAbilities.length > 0 && <div className="abilities-arrow">↓</div>}
                <div className="abilities-list preview">
                  {abilityChanges.added.map(ability => (
                    <div key={ability.id} className="ability-badge ability-added">
                      <span className="ability-name">{ability.name}</span>
                      {ability.element && <ElementIcon element={ability.element} size="tiny" />}
                      <span className="ability-pp">PP: {ability.ppCost}</span>
                      <span className="ability-tag">NEW!</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedItem && !selectedItem.unlocksAbility && currentAbilities.some(a => abilityChanges.removed.some(r => r.id === a.id)) && (
              <div className="ability-warning">
                ⚠️ Unequipping will remove ability access
              </div>
            )}
          </div>
        </section>
      )}

      {/* Inventory Panel */}
      <section className="inventory-panel" aria-label="Equipment inventory">
        <h2>INVENTORY</h2>

        {/* Filter Tabs */}
        <div className="inventory-filter-tabs">
          <button
            className={`filter-tab ${inventoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setInventoryFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${inventoryFilter === 'weapon' ? 'active' : ''}`}
            onClick={() => setInventoryFilter('weapon')}
          >
            Weapon
          </button>
          <button
            className={`filter-tab ${inventoryFilter === 'armor' ? 'active' : ''}`}
            onClick={() => setInventoryFilter('armor')}
          >
            Armor
          </button>
          <button
            className={`filter-tab ${inventoryFilter === 'helm' ? 'active' : ''}`}
            onClick={() => setInventoryFilter('helm')}
          >
            Helm
          </button>
          <button
            className={`filter-tab ${inventoryFilter === 'boots' ? 'active' : ''}`}
            onClick={() => setInventoryFilter('boots')}
          >
            Boots
          </button>
          <button
            className={`filter-tab ${inventoryFilter === 'accessory' ? 'active' : ''}`}
            onClick={() => setInventoryFilter('accessory')}
          >
            Accessory
          </button>
        </div>

        {/* Selected Item Details */}
        {selectedItem && (
          <div className="selected-item-details">
            <div className="item-details-header">
              <EquipmentIcon equipment={selectedItem} size="medium" />
              <div>
                <h3>{selectedItem.name}</h3>
                <p className="item-tier">{selectedItem.tier} {selectedItem.slot}</p>
              </div>
            </div>
            
            {selectedItem.unlocksAbility && ABILITIES[selectedItem.unlocksAbility] && (
              <div className="item-ability-info">
                <div className="ability-label">✨ Grants Ability:</div>
                <div className="ability-details">
                  <span className="ability-name-large">{ABILITIES[selectedItem.unlocksAbility].name}</span>
                  {ABILITIES[selectedItem.unlocksAbility].element && (
                    <ElementIcon element={ABILITIES[selectedItem.unlocksAbility].element!} size="small" />
                  )}
                </div>
                <p className="ability-description">{ABILITIES[selectedItem.unlocksAbility].description}</p>
                <div className="ability-stats">
                  <span>PP Cost: {ABILITIES[selectedItem.unlocksAbility].ppCost}</span>
                  {ABILITIES[selectedItem.unlocksAbility].basePower > 0 && (
                    <span> | Power: {ABILITIES[selectedItem.unlocksAbility].basePower}</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="item-stat-bonuses">
              {selectedItem.statBonus.atk && <div>ATK +{selectedItem.statBonus.atk}</div>}
              {selectedItem.statBonus.def && <div>DEF +{selectedItem.statBonus.def}</div>}
              {selectedItem.statBonus.spd && <div>SPD +{selectedItem.statBonus.spd}</div>}
              {selectedItem.statBonus.hp && <div>HP +{selectedItem.statBonus.hp}</div>}
              {selectedItem.statBonus.pp && <div>PP +{selectedItem.statBonus.pp}</div>}
              {selectedItem.statBonus.mag && <div>MAG +{selectedItem.statBonus.mag}</div>}
            </div>
          </div>
        )}
        
        <div className="inventory-grid">
          {filteredInventory.map(item => {
            const grantsAbility = item.unlocksAbility ? ABILITIES[item.unlocksAbility] : null;
            
            return (
              <div
                key={item.id}
                className={`inventory-item ${selectedItem?.id === item.id ? 'selected' : ''} ${grantsAbility ? 'has-ability' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={`${item.name}${grantsAbility ? ` - Grants ${grantsAbility.name}` : ''}`}
                onClick={() => setSelectedItem(item)}
                onDoubleClick={() => handleEquipItem(item)}
              >
                <EquipmentIcon equipment={item} size="medium" className="item-icon" />
                <div className="item-name">{item.name}</div>
                {grantsAbility && (
                  <div className="ability-indicator" title={`Grants: ${grantsAbility.name}`}>
                    ✨
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
        </div>
      </div>
    </div>
  );
};
