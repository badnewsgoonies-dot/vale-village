import React, { useState, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { Button, ElementIcon } from '../shared';
import { BattleUnit } from '@/sprites/components/BattleUnit';
import { getDjinnGrantedAbilities } from '@/utils/djinnCalculations';
import type { Ability } from '@/types/Ability';
import './AbilitiesScreen.css';

export const AbilitiesScreen: React.FC = () => {
  const { state, actions } = useGame();
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

  const allUnits = state.playerData.unitsCollected;
  const activePartyIds = state.playerData.activePartyIds;

  // Split units into active and bench
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

  // Get equipped Djinn for ability grants
  const equippedDjinn = useMemo(
    () => state.playerData.djinnCollected.filter(d => 
      state.playerData.equippedDjinnIds.includes(d.id)
    ),
    [state.playerData.djinnCollected, state.playerData.equippedDjinnIds]
  );

  if (!selectedUnit) {
    return <div className="abilities-screen">Loading...</div>;
  }

  // Get unit's native abilities
  const nativeAbilities = selectedUnit.abilities;

  // Get Djinn-granted abilities for this unit (returns ability IDs)
  const djinnAbilityIds = getDjinnGrantedAbilities(selectedUnit, equippedDjinn);
  const djinnAbilities = djinnAbilityIds
    .map((id: string) => nativeAbilities.find((a: Ability) => a.id === id))
    .filter((a): a is Ability => a !== undefined);

  // Get equipment-granted abilities
  const equipmentAbilities = Object.values(selectedUnit.equipment as any)
    .filter((equip: any) => equip?.unlocksAbility)
    .map((equip: any) => nativeAbilities.find((a: Ability) => a.id === equip.unlocksAbility))
    .filter((a): a is Ability => a !== undefined);

  // Categorize abilities by element and type
  const categorizeAbilities = (abilities: Ability[]) => {
    const categories: Record<string, Ability[]> = {
      Physical: [],
      Venus: [],
      Mars: [],
      Mercury: [],
      Jupiter: [],
      Support: [],
    };

    abilities.forEach(ability => {
      if (ability.type === 'physical') {
        categories.Physical.push(ability);
      } else if (ability.element) {
        categories[ability.element].push(ability);
      } else if (ability.type === 'healing' || ability.type === 'buff') {
        categories.Support.push(ability);
      }
    });

    return categories;
  };

  const nativeCategories = categorizeAbilities(nativeAbilities);

  const handleReturn = () => {
    actions.goBack();
  };

  // Unit ability counts memoized for performance
  const unitAbilityCounts = useMemo(() => {
    const counts = new Map<string, number>();
    allUnits.forEach(unit => {
      const total = unit.abilities.length + 
        getDjinnGrantedAbilities(unit, equippedDjinn).length +
        Object.values(unit.equipment).filter(e => e?.unlocksAbility).length;
      counts.set(unit.id, total);
    });
    return counts;
  }, [allUnits, equippedDjinn]);

  const getAbilityColor = (ability: Ability): string => {
    if (ability.type === 'physical') return 'physical';
    if (ability.element) return ability.element.toLowerCase();
    return 'support';
  };

  const renderAbilityCard = (ability: Ability, source: 'native' | 'djinn' | 'equipment') => {
    const isSelected = selectedAbility?.id === ability.id;
    const isLocked = ability.unlockLevel && ability.unlockLevel > selectedUnit.level;

    return (
      <div
        key={`${source}-${ability.id}`}
        className={`ability-card ${getAbilityColor(ability)} ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`}
        onClick={() => setSelectedAbility(ability)}
        role="button"
        tabIndex={0}
        aria-label={`${ability.name} - ${ability.description}`}
      >
        <div className="ability-header">
          <div className="ability-name">{ability.name}</div>
          {isLocked && <div className="lock-icon">🔒</div>}
        </div>
        <div className="ability-stats">
          <span className="ability-cost">Mana: {ability.manaCost}○</span>
          {ability.basePower > 0 && (
            <span className="ability-power">PWR: {ability.basePower}</span>
          )}
        </div>
        <div className="ability-source">
          {source === 'djinn' && <span className="source-badge djinn">Djinn</span>}
          {source === 'equipment' && <span className="source-badge equipment">Equipment</span>}
        </div>
        {isLocked && (
          <div className="unlock-level">Lv {ability.unlockLevel}</div>
        )}
      </div>
    );
  };

  return (
    <div className="abilities-screen">
      <div className="abilities-container">
        {/* Header */}
        <header className="abilities-header">
          <div className="header-content">
            <h1>ABILITIES</h1>
            <div className="unit-summary">
              <span className="active-count">Active: {activeUnits.length} / 4</span>
              <span className="divider">•</span>
              <span className="total-count">Total: {allUnits.length} / 10</span>
            </div>
          </div>
          <Button 
            onClick={handleReturn} 
            ariaLabel="Return to previous menu"
          >
            RETURN
          </Button>
        </header>

        {/* Main Content */}
        <div className="abilities-content">
          {/* Unit Selector Panel */}
          <aside className="unit-selector" role="navigation" aria-label="Unit selection">
            <h2>PARTY</h2>
            <div className="unit-list">
              {activeUnits.map(unit => {
                const totalAbilities = unitAbilityCounts.get(unit.id) || 0;

                return (
                  <div
                    key={unit.id}
                    className={`unit-card ${selectedUnit?.id === unit.id ? 'selected' : ''}`}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedUnit?.id === unit.id}
                    aria-label={`${unit.name}, Level ${unit.level}, ${totalAbilities} abilities`}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setSelectedAbility(null);
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
                      <div className="unit-ability-count">{totalAbilities} abilities</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {benchUnits.length > 0 && (
              <>
                <h3 className="bench-header">BENCH</h3>
                <div className="unit-list bench-list">
                  {benchUnits.map(unit => {
                    const totalAbilities = unit.abilities.length + 
                      getDjinnGrantedAbilities(unit, equippedDjinn).length +
                      Object.values(unit.equipment).filter(e => e?.unlocksAbility).length;

                    return (
                      <div
                        key={unit.id}
                        className={`unit-card ${selectedUnit?.id === unit.id ? 'selected' : ''}`}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedUnit?.id === unit.id}
                        aria-label={`${unit.name}, Level ${unit.level}, ${totalAbilities} abilities`}
                        onClick={() => {
                          setSelectedUnit(unit);
                          setSelectedAbility(null);
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
                          <div className="unit-ability-count">{totalAbilities} abilities</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </aside>

          {/* Abilities Display */}
          <section className="abilities-main">
            <div className="abilities-main-header">
              <h2>{selectedUnit.name}'s Abilities</h2>
              <div className="unit-stats-summary">
                <span>Lv {selectedUnit.level}</span>
              </div>
            </div>

            {/* Native Abilities */}
            <div className="ability-section">
              <h3 className="section-title">Native Abilities</h3>
              
              {Object.entries(nativeCategories).map(([category, abilities]) => {
                if (abilities.length === 0) return null;
                
                return (
                  <div key={category} className="ability-category">
                    <h4 className="category-title">
                      {category === 'Physical' && '⚔️ Physical'}
                      {category === 'Venus' && '🪨 Venus (Earth)'}
                      {category === 'Mars' && '🔥 Mars (Fire)'}
                      {category === 'Mercury' && '💧 Mercury (Water)'}
                      {category === 'Jupiter' && '⚡ Jupiter (Wind)'}
                      {category === 'Support' && '✨ Support'}
                    </h4>
                    <div className="ability-grid">
                      {abilities.map(ability => renderAbilityCard(ability, 'native'))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Djinn-Granted Abilities */}
            {djinnAbilities.length > 0 && (
              <div className="ability-section djinn-section">
                <h3 className="section-title">🔮 Djinn-Granted Abilities</h3>
                <div className="ability-grid">
                  {djinnAbilities.map(ability => renderAbilityCard(ability, 'djinn'))}
                </div>
              </div>
            )}

            {/* Equipment-Granted Abilities */}
            {equipmentAbilities.length > 0 && (
              <div className="ability-section equipment-section">
                <h3 className="section-title">⚔️ Equipment-Granted Abilities</h3>
                <div className="ability-grid">
                  {equipmentAbilities.map(ability => renderAbilityCard(ability, 'equipment'))}
                </div>
              </div>
            )}
          </section>

          {/* Ability Details Panel */}
          {selectedAbility && (
            <aside className="ability-details-panel">
              <div className="details-header">
                <h3>{selectedAbility.name}</h3>
              </div>
              <div className="details-content">
                <div className="detail-row">
                  <span className="label">Type:</span>
                  <span className="value">{selectedAbility.type}</span>
                </div>
                {selectedAbility.element && (
                  <div className="detail-row">
                    <span className="label">Element:</span>
                    <span className="value">
                      <ElementIcon element={selectedAbility.element} size="small" />
                      {selectedAbility.element}
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">Mana Cost:</span>
                  <span className="value">{selectedAbility.manaCost}○</span>
                </div>
                {selectedAbility.basePower > 0 && (
                  <div className="detail-row">
                    <span className="label">Base Power:</span>
                    <span className="value">{selectedAbility.basePower}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">Targets:</span>
                  <span className="value">{selectedAbility.targets}</span>
                </div>
                {selectedAbility.unlockLevel && (
                  <div className="detail-row">
                    <span className="label">Unlock Level:</span>
                    <span className="value">Level {selectedAbility.unlockLevel}</span>
                  </div>
                )}
                <div className="detail-description">
                  <p>{selectedAbility.description}</p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
