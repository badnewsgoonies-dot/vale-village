/**
 * CompendiumScreen Component
 * Displays game data in tabs: Units, Equipment, Djinn, Enemies, Bosses, NPCs
 * Enhanced with detailed stats, abilities, and descriptions
 */

import { useState, useEffect } from 'react';
import { UNIT_DEFINITIONS } from '@/data/definitions/units';
import { EQUIPMENT } from '@/data/definitions/equipment';
import { DJINN } from '@/data/definitions/djinn';
import { ENEMIES } from '@/data/definitions/enemies';
import { ABILITIES } from '@/data/definitions/abilities';
import { DJINN_ABILITIES } from '@/data/definitions/djinnAbilities';
import './CompendiumScreen.css';

interface CompendiumScreenProps {
  onClose: () => void;
}

type CompendiumTab = 'units' | 'equipment' | 'djinn' | 'enemies' | 'bosses' | 'npcs';

// Boss enemy IDs - from the "BOSS ENEMIES" section in enemies.ts
const BOSS_ENEMY_IDS = new Set([
  'mars-sprite',
  'mercury-sprite',
  'venus-sprite',
  'chimera',
  'overseer',
]);

export function CompendiumScreen({ onClose }: CompendiumScreenProps) {
  const [activeTab, setActiveTab] = useState<CompendiumTab>('units');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedDjinn, setSelectedDjinn] = useState<string | null>(null);

  const tabs: { id: CompendiumTab; label: string }[] = [
    { id: 'units', label: 'Units' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'djinn', label: 'Djinn' },
    { id: 'enemies', label: 'Enemies' },
    { id: 'bosses', label: 'Bosses' },
    { id: 'npcs', label: 'NPCs' },
  ];

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        if (selectedUnit || selectedDjinn) {
          setSelectedUnit(null);
          setSelectedDjinn(null);
        } else {
          onClose();
        }
        return;
      }

      // Arrow key navigation between tabs
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (selectedUnit || selectedDjinn) return; // Don't navigate tabs when viewing details
        event.preventDefault();
        event.stopPropagation();
        const currentIndex = tabs.findIndex((t) => t.id === activeTab);
        if (event.key === 'ArrowLeft') {
          const newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          const newTab = tabs[newIndex];
          if (newTab) {
            setActiveTab(newTab.id);
          }
        } else {
          const newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          const newTab = tabs[newIndex];
          if (newTab) {
            setActiveTab(newTab.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTab, tabs, onClose, selectedUnit, selectedDjinn]);

  // Filter enemies into regular and boss
  const regularEnemies = Object.values(ENEMIES).filter(
    (enemy) => !BOSS_ENEMY_IDS.has(enemy.id)
  );
  const bossEnemies = Object.values(ENEMIES).filter((enemy) =>
    BOSS_ENEMY_IDS.has(enemy.id)
  );

  // Units Tab - Detailed View
  const renderUnitsTab = () => {
    if (selectedUnit) {
      const unit = UNIT_DEFINITIONS[selectedUnit];
      if (!unit) return null;

      const abilities = unit.abilities.map((abilityRef) => {
        const ability = ABILITIES[abilityRef.id];
        return { ...abilityRef, details: ability };
      });

      return (
        <div className="compendium-detail-view">
          <button className="back-btn" onClick={() => setSelectedUnit(null)}>← Back</button>
          <div className="detail-header">
            <h2>{unit.name}</h2>
            <div className="detail-subtitle">{unit.role} • {unit.element}</div>
          </div>
          
          <div className="detail-content">
            <div className="detail-section">
              <h3>Base Stats (Level 1)</h3>
              <div className="stats-grid">
                <div className="stat-item"><span>HP:</span> <strong>{unit.baseStats.hp}</strong></div>
                <div className="stat-item"><span>PP:</span> <strong>{unit.baseStats.pp}</strong></div>
                <div className="stat-item"><span>ATK:</span> <strong>{unit.baseStats.atk}</strong></div>
                <div className="stat-item"><span>DEF:</span> <strong>{unit.baseStats.def}</strong></div>
                <div className="stat-item"><span>MAG:</span> <strong>{unit.baseStats.mag}</strong></div>
                <div className="stat-item"><span>SPD:</span> <strong>{unit.baseStats.spd}</strong></div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Growth Rates (per level)</h3>
              <div className="stats-grid">
                <div className="stat-item"><span>HP:</span> <strong>+{unit.growthRates.hp}</strong></div>
                <div className="stat-item"><span>PP:</span> <strong>+{unit.growthRates.pp}</strong></div>
                <div className="stat-item"><span>ATK:</span> <strong>+{unit.growthRates.atk}</strong></div>
                <div className="stat-item"><span>DEF:</span> <strong>+{unit.growthRates.def}</strong></div>
                <div className="stat-item"><span>MAG:</span> <strong>+{unit.growthRates.mag}</strong></div>
                <div className="stat-item"><span>SPD:</span> <strong>+{unit.growthRates.spd}</strong></div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Abilities</h3>
              <div className="abilities-list">
                {abilities.map((ability) => (
                  <div key={ability.id} className="ability-item">
                    <div className="ability-header">
                      <span className="ability-name">{ability.details?.name || ability.id}</span>
                      <span className="ability-level">Lv {ability.unlockLevel}</span>
                    </div>
                    <div className="ability-description">
                      {ability.details?.description || 'No description'}
                    </div>
                    {ability.details && (
                      <div className="ability-details">
                        <span>Type: {ability.details.type}</span>
                        {ability.details.element && <span>Element: {ability.details.element}</span>}
                        {ability.details.manaCost > 0 && <span>Cost: {ability.details.manaCost} PP</span>}
                        {ability.details.basePower > 0 && <span>Power: {ability.details.basePower}</span>}
                        <span>Targets: {ability.details.targets}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {unit.description && (
              <div className="detail-section">
                <h3>Description</h3>
                <p>{unit.description}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="compendium-section">
        <h2>Units ({Object.keys(UNIT_DEFINITIONS).length})</h2>
        <div className="compendium-grid">
          {Object.values(UNIT_DEFINITIONS).map((unit) => (
            <div
              key={unit.id}
              className="compendium-item clickable"
              onClick={() => setSelectedUnit(unit.id)}
            >
              <div className="item-name">{unit.name}</div>
              <div className="item-details">
                <div>Element: {unit.element}</div>
                <div>Role: {unit.role}</div>
                <div>HP: {unit.baseStats.hp} | ATK: {unit.baseStats.atk} | DEF: {unit.baseStats.def}</div>
                <div className="click-hint">Click for details</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Equipment Tab - Detailed View
  const renderEquipmentTab = () => {
    return (
      <div className="compendium-section">
        <h2>Equipment ({Object.keys(EQUIPMENT).length})</h2>
        <div className="compendium-grid">
          {Object.values(EQUIPMENT).map((equip) => {
            const ability = equip.unlocksAbility ? ABILITIES[equip.unlocksAbility] : null;
            return (
              <div key={equip.id} className="compendium-item equipment-item">
                <div className="item-name">{equip.name}</div>
                <div className="item-details">
                  <div className="equip-slot-tier">
                    <span className="equip-slot">{equip.slot}</span>
                    <span className="equip-tier">{equip.tier}</span>
                  </div>
                  <div>Cost: {equip.cost} gold</div>
                  {equip.statBonus && (
                    <div className="stat-bonuses">
                      <strong>Stats:</strong> {Object.entries(equip.statBonus)
                        .map(([stat, val]) => `${stat.toUpperCase()}+${val}`)
                        .join(', ')}
                    </div>
                  )}
                  {equip.allowedElements && equip.allowedElements.length > 0 && (
                    <div className="allowed-elements">
                      <strong>Elements:</strong> {equip.allowedElements.join(', ')}
                    </div>
                  )}
                  {ability && (
                    <div className="equipment-ability">
                      <div className="ability-name-small">
                        <strong>Unlocks:</strong> {ability.name}
                      </div>
                      <div className="ability-description-small">{ability.description}</div>
                      <div className="ability-details-small">
                        {ability.type} • {ability.targets}
                        {ability.manaCost > 0 && ` • ${ability.manaCost} PP`}
                        {ability.basePower > 0 && ` • Power: ${ability.basePower}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Djinn Tab - Network View
  const renderDjinnTab = () => {
    if (selectedDjinn) {
      const djinn = DJINN[selectedDjinn];
      if (!djinn) return null;

      return (
        <div className="compendium-detail-view">
          <button className="back-btn" onClick={() => setSelectedDjinn(null)}>← Back</button>
          <div className="detail-header">
            <h2>{djinn.name}</h2>
            <div className="detail-subtitle">{djinn.element} • Tier {djinn.tier}</div>
          </div>

          <div className="detail-content">
            <div className="detail-section">
              <h3>Summon Effect</h3>
              <div className="summon-effect">
                <div className="summon-type">{djinn.summonEffect.type}</div>
                <div className="summon-description">{djinn.summonEffect.description}</div>
                {djinn.summonEffect.type === 'damage' && 'damage' in djinn.summonEffect && (
                  <div>Damage: {djinn.summonEffect.damage}</div>
                )}
                {djinn.summonEffect.type === 'heal' && 'healAmount' in djinn.summonEffect && (
                  <div>Heal Amount: {djinn.summonEffect.healAmount}</div>
                )}
                {djinn.summonEffect.type === 'buff' && 'statBonus' in djinn.summonEffect && (
                  <div>
                    Stat Bonus: {Object.entries(djinn.summonEffect.statBonus || {})
                      .map(([stat, val]) => `${stat.toUpperCase()}+${val}`)
                      .join(', ')}
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>Granted Abilities by Unit</h3>
              <div className="djinn-abilities-network">
                {Object.entries(djinn.grantedAbilities).map(([unitId, abilityGroups]) => {
                  const unit = UNIT_DEFINITIONS[unitId];
                  if (!unit) return null;

                  return (
                    <div key={unitId} className="unit-ability-group">
                      <div className="unit-header">{unit.name} ({unit.element})</div>
                      <div className="compatibility-groups">
                        {Object.entries(abilityGroups).map(([compatibility, abilityIds]) => {
                          if (abilityIds.length === 0) return null;
                          return (
                            <div key={compatibility} className={`compatibility-group ${compatibility}`}>
                              <div className="compatibility-label">
                                {compatibility === 'same' ? 'Same Element' : 
                                 compatibility === 'counter' ? 'Counter Element' : 
                                 'Neutral'}
                              </div>
                              <div className="abilities-list">
                                {abilityIds.map((abilityId) => {
                                  const ability = DJINN_ABILITIES[abilityId];
                                  return (
                                    <div key={abilityId} className="ability-item-small">
                                      <div className="ability-name-small">{ability?.name || abilityId}</div>
                                      <div className="ability-description-small">
                                        {ability?.description || 'No description'}
                                      </div>
                                      {ability && (
                                        <div className="ability-details-small">
                                          {ability.type} • {ability.targets}
                                          {ability.manaCost > 0 && ` • ${ability.manaCost} PP`}
                                          {ability.basePower > 0 && ` • Power: ${ability.basePower}`}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="compendium-section">
        <h2>Djinn ({Object.keys(DJINN).length})</h2>
        <div className="compendium-grid">
          {Object.values(DJINN).map((djinn) => (
            <div
              key={djinn.id}
              className="compendium-item clickable"
              onClick={() => setSelectedDjinn(djinn.id)}
            >
              <div className="item-name">{djinn.name}</div>
              <div className="item-details">
                <div>Element: {djinn.element}</div>
                <div>Tier: {djinn.tier}</div>
                <div>Summon: {djinn.summonEffect.type}</div>
                <div className="click-hint">Click for ability details</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Enemies Tab - Detailed View
  const renderEnemiesTab = () => {
    return (
      <div className="compendium-section">
        <h2>Enemies ({regularEnemies.length})</h2>
        <div className="compendium-grid">
          {regularEnemies.map((enemy) => {
            const abilities = enemy.abilities.map((abilityRef) => {
              const ability = ABILITIES[abilityRef.id];
              return { ...abilityRef, details: ability };
            });

            return (
              <div key={enemy.id} className="compendium-item enemy-item">
                <div className="item-name">{enemy.name}</div>
                <div className="item-details">
                  <div className="enemy-stats">
                    <div>Level {enemy.level} • {enemy.element}</div>
                    <div>HP: {enemy.stats.hp} | PP: {enemy.stats.pp}</div>
                    <div>ATK: {enemy.stats.atk} | DEF: {enemy.stats.def}</div>
                    <div>MAG: {enemy.stats.mag} | SPD: {enemy.stats.spd}</div>
                  </div>
                  <div className="enemy-rewards">
                    <div>XP: {enemy.baseXp} | Gold: {enemy.baseGold}</div>
                  </div>
                  <div className="enemy-abilities">
                    <strong>Abilities:</strong>
                    {abilities.map((ability) => (
                      <div key={ability.id} className="ability-item-small">
                        <span className="ability-name-small">
                          {ability.details?.name || ability.id}
                        </span>
                        {ability.unlockLevel > 1 && (
                          <span className="ability-level"> (Lv {ability.unlockLevel})</span>
                        )}
                        {ability.details?.description && (
                          <div className="ability-description-small">{ability.details.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Bosses Tab - Detailed View
  const renderBossesTab = () => {
    return (
      <div className="compendium-section">
        <h2>Boss Enemies ({bossEnemies.length})</h2>
        <div className="compendium-grid">
          {bossEnemies.map((enemy) => {
            const abilities = enemy.abilities.map((abilityRef) => {
              const ability = ABILITIES[abilityRef.id];
              return { ...abilityRef, details: ability };
            });

            return (
              <div key={enemy.id} className="compendium-item enemy-item boss-item">
                <div className="item-name boss-name">{enemy.name} ⭐</div>
                <div className="item-details">
                  <div className="enemy-stats">
                    <div>Level {enemy.level} • {enemy.element}</div>
                    <div>HP: {enemy.stats.hp} | PP: {enemy.stats.pp}</div>
                    <div>ATK: {enemy.stats.atk} | DEF: {enemy.stats.def}</div>
                    <div>MAG: {enemy.stats.mag} | SPD: {enemy.stats.spd}</div>
                  </div>
                  <div className="enemy-rewards">
                    <div>XP: {enemy.baseXp} | Gold: {enemy.baseGold}</div>
                  </div>
                  <div className="enemy-abilities">
                    <strong>Abilities:</strong>
                    {abilities.map((ability) => (
                      <div key={ability.id} className="ability-item-small">
                        <span className="ability-name-small">
                          {ability.details?.name || ability.id}
                        </span>
                        {ability.unlockLevel > 1 && (
                          <span className="ability-level"> (Lv {ability.unlockLevel})</span>
                        )}
                        {ability.details?.description && (
                          <div className="ability-description-small">{ability.details.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="compendium-overlay" onClick={onClose}>
      <div className="compendium-container" onClick={(e) => e.stopPropagation()}>
        <div className="compendium-header">
          <h1>Compendium</h1>
          <button className="close-btn" onClick={onClose} aria-label="Close compendium">
            ×
          </button>
        </div>

        <div className="compendium-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`compendium-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedUnit(null);
                setSelectedDjinn(null);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="compendium-content">
          {activeTab === 'units' && renderUnitsTab()}
          {activeTab === 'equipment' && renderEquipmentTab()}
          {activeTab === 'djinn' && renderDjinnTab()}
          {activeTab === 'enemies' && renderEnemiesTab()}
          {activeTab === 'bosses' && renderBossesTab()}
          {activeTab === 'npcs' && (
            <div className="compendium-section">
              <h2>NPCs</h2>
              <div className="compendium-grid">
                <div className="compendium-item">
                  <div className="item-name">NPC Compendium</div>
                  <div className="item-details">
                    <div>NPC data coming soon</div>
                    <div>NPCs are defined in dialogue trees and map triggers</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
