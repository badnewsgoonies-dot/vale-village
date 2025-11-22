/**
 * CompendiumScreen Component
 * Enhanced with detailed stats, abilities, and descriptions
 */

import { useState, useEffect } from 'react';
import { UNIT_DEFINITIONS } from '@/data/definitions/units';
import { EQUIPMENT } from '@/data/definitions/equipment';
import { DJINN } from '@/data/definitions/djinn';
import { ENEMIES } from '@/data/definitions/enemies';
import { ABILITIES } from '@/data/definitions/abilities';
import { DJINN_ABILITIES } from '@/data/definitions/djinnAbilities';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPortraitSprite } from '../sprites/mappings/portraits';
import { getAbilityIconSprite } from '../sprites/mappings/abilityIcons';
import { EquipmentIcon } from './EquipmentIcon';
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
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedDjinnId, setSelectedDjinnId] = useState<string | null>(null);

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
        if (selectedUnitId || selectedDjinnId) {
          setSelectedUnitId(null);
          setSelectedDjinnId(null);
        } else {
          onClose();
        }
        return;
      }

      // Arrow key navigation between tabs
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (selectedUnitId || selectedDjinnId) return; // Don't navigate tabs when viewing details
        
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
  }, [activeTab, tabs, onClose, selectedUnitId, selectedDjinnId]);

  // Filter enemies into regular and boss
  const regularEnemies = Object.values(ENEMIES).filter(
    (enemy) => !BOSS_ENEMY_IDS.has(enemy.id)
  );
  const bossEnemies = Object.values(ENEMIES).filter((enemy) =>
    BOSS_ENEMY_IDS.has(enemy.id)
  );

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
                setSelectedUnitId(null);
                setSelectedDjinnId(null);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="compendium-content">
          {activeTab === 'units' && (
            <div className="compendium-section">
              <h2>Recruitable Units ({Object.keys(UNIT_DEFINITIONS).length})</h2>
              {selectedUnitId ? (
                <UnitDetailView
                  unitId={selectedUnitId}
                  onBack={() => setSelectedUnitId(null)}
                />
              ) : (
                <div className="compendium-grid">
                  {Object.values(UNIT_DEFINITIONS).map((unit) => (
                    <div
                      key={unit.id}
                      className="compendium-item clickable"
                      onClick={() => setSelectedUnitId(unit.id)}
                    >
                      <div className="item-sprite">
                        <SimpleSprite
                          id={getPortraitSprite(unit.id)}
                          width={64}
                          height={64}
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                      <div className="item-name">{unit.name}</div>
                      <div className="item-details">
                        <div>Element: {unit.element}</div>
                        <div>Role: {unit.role}</div>
                        <div>Level 1 HP: {unit.baseStats.hp}</div>
                        <div className="click-hint">Click for details</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="compendium-section">
              <h2>Equipment ({Object.keys(EQUIPMENT).length})</h2>
              <div className="compendium-grid">
                {Object.values(EQUIPMENT).map((equip) => {
                  const ability = equip.unlocksAbility ? ABILITIES[equip.unlocksAbility] : null;
                  return (
                    <div key={equip.id} className="compendium-item detailed">
                      <div className="item-sprite">
                        <EquipmentIcon equipment={equip} size="large" />
                      </div>
                      <div className="item-name">{equip.name}</div>
                      <div className="item-details">
                        <div className="detail-row">
                          <span className="detail-label">Slot:</span>
                          <span className="detail-value">{equip.slot}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Tier:</span>
                          <span className="detail-value">{equip.tier}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Cost:</span>
                          <span className="detail-value">{equip.cost} gold</span>
                        </div>
                        {equip.statBonus && (
                          <div className="detail-row">
                            <span className="detail-label">Stats:</span>
                            <span className="detail-value">
                              {Object.entries(equip.statBonus)
                                .map(([stat, val]) => `${stat.toUpperCase()}+${val}`)
                                .join(', ')}
                            </span>
                          </div>
                        )}
                        {equip.allowedElements && equip.allowedElements.length > 0 && (
                          <div className="detail-row">
                            <span className="detail-label">Elements:</span>
                            <span className="detail-value">{equip.allowedElements.join(', ')}</span>
                          </div>
                        )}
                        {ability && (
                          <div className="ability-section">
                            <div className="ability-header-with-icon">
                              <SimpleSprite
                                id={getAbilityIconSprite(ability.id)}
                                width={24}
                                height={24}
                              />
                              <div className="ability-name">{ability.name}</div>
                            </div>
                            <div className="ability-description">{ability.description}</div>
                            <div className="ability-stats">
                              {ability.type && <span>Type: {ability.type}</span>}
                              {ability.manaCost !== undefined && ability.manaCost > 0 && (
                                <span>Mana: {ability.manaCost}</span>
                              )}
                              {ability.basePower !== undefined && ability.basePower > 0 && (
                                <span>Power: {ability.basePower}</span>
                              )}
                              {ability.targets && <span>Target: {ability.targets}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'djinn' && (
            <div className="compendium-section">
              <h2>Djinn ({Object.keys(DJINN).length})</h2>
              {selectedDjinnId ? (
                <DjinnDetailView
                  djinnId={selectedDjinnId}
                  onBack={() => setSelectedDjinnId(null)}
                />
              ) : (
                <div className="compendium-grid">
                  {Object.values(DJINN).map((djinn) => {
                    const elementLower = djinn.element.toLowerCase();
                    return (
                      <div
                        key={djinn.id}
                        className="compendium-item clickable"
                        onClick={() => setSelectedDjinnId(djinn.id)}
                      >
                        <div className="item-sprite">
                          <SimpleSprite
                            id={`${elementLower}-djinn-front`}
                            width={64}
                            height={64}
                          />
                        </div>
                        <div className="item-name">{djinn.name}</div>
                        <div className="item-details">
                          <div>Element: {djinn.element}</div>
                          <div>Tier: {djinn.tier}</div>
                          <div>Summon: {djinn.summonEffect.type}</div>
                          <div className="click-hint">Click for ability network</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'enemies' && (
            <div className="compendium-section">
              <h2>Enemies ({regularEnemies.length})</h2>
              <div className="compendium-grid">
                {regularEnemies.map((enemy) => {
                  return (
                    <div key={enemy.id} className="compendium-item detailed">
                      <div className="item-sprite">
                        <SimpleSprite
                          id={enemy.id.toLowerCase()}
                          width={64}
                          height={64}
                        />
                      </div>
                      <div className="item-name">{enemy.name}</div>
                      <div className="item-details">
                        <div className="detail-row">
                          <span className="detail-label">Element:</span>
                          <span className="detail-value">{enemy.element}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Level:</span>
                          <span className="detail-value">{enemy.level}</span>
                        </div>
                        <div className="stats-grid">
                          <div>HP: {enemy.stats.hp}</div>
                          <div>ATK: {enemy.stats.atk}</div>
                          <div>DEF: {enemy.stats.def}</div>
                          <div>MAG: {enemy.stats.mag}</div>
                          <div>SPD: {enemy.stats.spd}</div>
                        </div>
                        {enemy.abilities && enemy.abilities.length > 0 && (
                          <div className="ability-section">
                            <div className="ability-header">Abilities:</div>
                            {enemy.abilities.map((abilityRef, idx) => {
                              const ability = ABILITIES[abilityRef.id];
                              if (!ability) return null;
                              return (
                                <div key={idx} className="ability-item">
                                  <div className="ability-header-with-icon">
                                    <SimpleSprite
                                      id={getAbilityIconSprite(ability.id)}
                                      width={24}
                                      height={24}
                                    />
                                    <div className="ability-name">{ability.name}</div>
                                  </div>
                                  <div className="ability-description">{ability.description}</div>
                                  <div className="ability-stats">
                                    {ability.type && <span>Type: {ability.type}</span>}
                                    {ability.manaCost !== undefined && ability.manaCost > 0 && (
                                      <span>Mana: {ability.manaCost}</span>
                                    )}
                                    {ability.basePower !== undefined && ability.basePower > 0 && (
                                      <span>Power: {ability.basePower}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="detail-row">
                          <span className="detail-label">XP:</span>
                          <span className="detail-value">{enemy.baseXp}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Gold:</span>
                          <span className="detail-value">{enemy.baseGold}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'bosses' && (
            <div className="compendium-section">
              <h2>Boss Enemies ({bossEnemies.length})</h2>
              <div className="compendium-grid">
                {bossEnemies.map((enemy) => {
                  return (
                    <div key={enemy.id} className="compendium-item detailed boss">
                      <div className="item-sprite">
                        <SimpleSprite
                          id={enemy.id.toLowerCase()}
                          width={64}
                          height={64}
                        />
                      </div>
                      <div className="item-name boss-name">{enemy.name}</div>
                      <div className="item-details">
                        <div className="detail-row">
                          <span className="detail-label">Element:</span>
                          <span className="detail-value">{enemy.element}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Level:</span>
                          <span className="detail-value">{enemy.level}</span>
                        </div>
                        <div className="stats-grid">
                          <div>HP: {enemy.stats.hp}</div>
                          <div>ATK: {enemy.stats.atk}</div>
                          <div>DEF: {enemy.stats.def}</div>
                          <div>MAG: {enemy.stats.mag}</div>
                          <div>SPD: {enemy.stats.spd}</div>
                        </div>
                        {enemy.abilities && enemy.abilities.length > 0 && (
                          <div className="ability-section">
                            <div className="ability-header">Abilities:</div>
                            {enemy.abilities.map((abilityRef, idx) => {
                              const ability = ABILITIES[abilityRef.id];
                              if (!ability) return null;
                              return (
                                <div key={idx} className="ability-item">
                                  <div className="ability-header-with-icon">
                                    <SimpleSprite
                                      id={getAbilityIconSprite(ability.id)}
                                      width={24}
                                      height={24}
                                    />
                                    <div className="ability-name">{ability.name}</div>
                                  </div>
                                  <div className="ability-description">{ability.description}</div>
                                  <div className="ability-stats">
                                    {ability.type && <span>Type: {ability.type}</span>}
                                    {ability.manaCost !== undefined && ability.manaCost > 0 && (
                                      <span>Mana: {ability.manaCost}</span>
                                    )}
                                    {ability.basePower !== undefined && ability.basePower > 0 && (
                                      <span>Power: {ability.basePower}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="detail-row">
                          <span className="detail-label">XP:</span>
                          <span className="detail-value">{enemy.baseXp}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Gold:</span>
                          <span className="detail-value">{enemy.baseGold}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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

// Unit Detail View Component
function UnitDetailView({ unitId, onBack }: { unitId: string; onBack: () => void }) {
  const unit = UNIT_DEFINITIONS[unitId];
  if (!unit) return null;

  const statsLv1 = unit.baseStats;
  const statsLv5 = {
    hp: unit.baseStats.hp + (unit.growthRates.hp * 4),
    atk: unit.baseStats.atk + (unit.growthRates.atk * 4),
    def: unit.baseStats.def + (unit.growthRates.def * 4),
    mag: unit.baseStats.mag + (unit.growthRates.mag * 4),
    spd: unit.baseStats.spd + (unit.growthRates.spd * 4),
  };
  const statsLv10 = {
    hp: unit.baseStats.hp + (unit.growthRates.hp * 9),
    atk: unit.baseStats.atk + (unit.growthRates.atk * 9),
    def: unit.baseStats.def + (unit.growthRates.def * 9),
    mag: unit.baseStats.mag + (unit.growthRates.mag * 9),
    spd: unit.baseStats.spd + (unit.growthRates.spd * 9),
  };

  return (
    <div className="unit-detail-view">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="unit-detail-header">
        <div className="unit-header-with-sprite">
          <SimpleSprite
            id={getPortraitSprite(unit.id)}
            width={96}
            height={96}
            style={{ borderRadius: '12px' }}
          />
          <div>
            <h2>{unit.name}</h2>
            <div className="unit-meta">
              <span>Element: {unit.element}</span>
              <span>Role: {unit.role}</span>
            </div>
            {unit.description && <p className="unit-description">{unit.description}</p>}
          </div>
        </div>
      </div>

      <div className="unit-stats-progression">
        <h3>Stat Progression</h3>
        <div className="stats-table">
          <div className="stats-row header">
            <div>Stat</div>
            <div>Lv 1</div>
            <div>Lv 5</div>
            <div>Lv 10</div>
            <div>Growth/Value</div>
          </div>
          <div className="stats-row">
            <div>HP</div>
            <div>{statsLv1.hp}</div>
            <div>{statsLv5.hp}</div>
            <div>{statsLv10.hp}</div>
            <div>+{unit.growthRates.hp}/lv</div>
          </div>
          <div className="stats-row">
            <div>Mana Contribution</div>
            <div>{unit.manaContribution}</div>
            <div>{unit.manaContribution}</div>
            <div>{unit.manaContribution}</div>
            <div>Fixed</div>
          </div>
          <div className="stats-row">
            <div>ATK</div>
            <div>{statsLv1.atk}</div>
            <div>{statsLv5.atk}</div>
            <div>{statsLv10.atk}</div>
            <div>+{unit.growthRates.atk}/lv</div>
          </div>
          <div className="stats-row">
            <div>DEF</div>
            <div>{statsLv1.def}</div>
            <div>{statsLv5.def}</div>
            <div>{statsLv10.def}</div>
            <div>+{unit.growthRates.def}/lv</div>
          </div>
          <div className="stats-row">
            <div>MAG</div>
            <div>{statsLv1.mag}</div>
            <div>{statsLv5.mag}</div>
            <div>{statsLv10.mag}</div>
            <div>+{unit.growthRates.mag}/lv</div>
          </div>
          <div className="stats-row">
            <div>SPD</div>
            <div>{statsLv1.spd}</div>
            <div>{statsLv5.spd}</div>
            <div>{statsLv10.spd}</div>
            <div>+{unit.growthRates.spd}/lv</div>
          </div>
        </div>
      </div>

      <div className="unit-abilities">
        <h3>Unlockable Abilities</h3>
        <div className="abilities-list">
          {unit.abilities
            .sort((a, b) => (a.unlockLevel || 1) - (b.unlockLevel || 1))
            .map((abilityRef, idx) => {
              const ability = ABILITIES[abilityRef.id];
              if (!ability) return null;
              return (
                <div key={idx} className="ability-card">
                  <div className="ability-card-header">
                    <span className="ability-level">Lv {abilityRef.unlockLevel || 1}</span>
                    <SimpleSprite
                      id={getAbilityIconSprite(ability.id)}
                      width={32}
                      height={32}
                    />
                    <span className="ability-name">{ability.name}</span>
                  </div>
                  <div className="ability-description">{ability.description}</div>
                  <div className="ability-meta">
                    <span>Type: {ability.type}</span>
                    {ability.element && <span>Element: {ability.element}</span>}
                    {ability.manaCost !== undefined && ability.manaCost > 0 && (
                      <span>Mana Cost: {ability.manaCost}</span>
                    )}
                    {ability.basePower !== undefined && ability.basePower > 0 && (
                      <span>Power: {ability.basePower}</span>
                    )}
                    {ability.targets && <span>Target: {ability.targets}</span>}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// Djinn Detail View Component - Network Visualization
function DjinnDetailView({ djinnId, onBack }: { djinnId: string; onBack: () => void }) {
  const djinn = DJINN[djinnId];
  if (!djinn) return null;

  // Get all units that can use this Djinn
  const unitIds = Object.keys(djinn.grantedAbilities);

  return (
    <div className="djinn-detail-view">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="djinn-detail-header">
        <div className="djinn-header-with-sprite">
          <SimpleSprite
            id={`${djinn.element.toLowerCase()}-djinn-front`}
            width={96}
            height={96}
          />
          <div>
            <h2>{djinn.name}</h2>
            <div className="djinn-meta">
              <span>Element: {djinn.element}</span>
              <span>Tier: {djinn.tier}</span>
            </div>
            <div className="summon-effect">
              <strong>Summon Effect:</strong> {djinn.summonEffect.description}
            </div>
          </div>
        </div>
      </div>

      <div className="djinn-ability-network">
        <h3>Ability Network - Grants to Units</h3>
        <div className="network-container">
          {unitIds.map((unitId) => {
            const unit = UNIT_DEFINITIONS[unitId];
            if (!unit) return null;

            const abilityGroup = djinn.grantedAbilities[unitId];
            if (!abilityGroup) return null;
            
            const compatibility = 
              unit.element === djinn.element ? 'same' :
              (unit.element === 'Venus' && djinn.element === 'Mars') || 
              (unit.element === 'Mars' && djinn.element === 'Venus') ||
              (unit.element === 'Jupiter' && djinn.element === 'Mercury') ||
              (unit.element === 'Mercury' && djinn.element === 'Jupiter') ? 'counter' : 'neutral';

            return (
              <div key={unitId} className={`network-node ${compatibility}`}>
                <div className="node-header">
                  <div className="node-unit-name">{unit.name}</div>
                  <div className="node-compatibility">
                    {compatibility === 'same' && '✓ Same Element'}
                    {compatibility === 'counter' && '⚠ Counter Element'}
                    {compatibility === 'neutral' && '○ Neutral'}
                  </div>
                </div>
                <div className="node-abilities">
                  {abilityGroup.same.length > 0 && (
                    <div className="ability-group same-element">
                      <div className="group-label">Same Element Abilities:</div>
                      {abilityGroup.same.map((abilityId) => {
                        const ability = DJINN_ABILITIES[abilityId];
                        if (!ability) return null;
                        return (
                          <div key={abilityId} className="network-ability">
                            <div className="network-ability-header">
                              <SimpleSprite
                                id={getAbilityIconSprite(abilityId)}
                                width={20}
                                height={20}
                              />
                              <div className="network-ability-name">{ability.name}</div>
                            </div>
                            <div className="network-ability-desc">{ability.description}</div>
                            <div className="network-ability-stats">
                              {ability.type && <span>{ability.type}</span>}
                        {ability.manaCost !== undefined && ability.manaCost > 0 && (
                          <span>Mana: {ability.manaCost}</span>
                        )}
                              {ability.basePower !== undefined && ability.basePower > 0 && (
                                <span>Power: {ability.basePower}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {abilityGroup.counter.length > 0 && (
                    <div className="ability-group counter-element">
                      <div className="group-label">Counter Element Abilities:</div>
                      {abilityGroup.counter.map((abilityId) => {
                        const ability = DJINN_ABILITIES[abilityId];
                        if (!ability) return null;
                        return (
                          <div key={abilityId} className="network-ability">
                            <div className="network-ability-header">
                              <SimpleSprite
                                id={getAbilityIconSprite(abilityId)}
                                width={20}
                                height={20}
                              />
                              <div className="network-ability-name">{ability.name}</div>
                            </div>
                            <div className="network-ability-desc">{ability.description}</div>
                            <div className="network-ability-stats">
                              {ability.type && <span>{ability.type}</span>}
                        {ability.manaCost !== undefined && ability.manaCost > 0 && (
                          <span>Mana: {ability.manaCost}</span>
                        )}
                              {ability.basePower !== undefined && ability.basePower > 0 && (
                                <span>Power: {ability.basePower}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {abilityGroup.neutral.length > 0 && (
                    <div className="ability-group neutral-element">
                      <div className="group-label">Neutral Abilities:</div>
                      {abilityGroup.neutral.map((abilityId) => {
                        const ability = DJINN_ABILITIES[abilityId];
                        if (!ability) return null;
                        return (
                          <div key={abilityId} className="network-ability">
                            <div className="network-ability-header">
                              <SimpleSprite
                                id={getAbilityIconSprite(abilityId)}
                                width={20}
                                height={20}
                              />
                              <div className="network-ability-name">{ability.name}</div>
                            </div>
                            <div className="network-ability-desc">{ability.description}</div>
                            <div className="network-ability-stats">
                              {ability.type && <span>{ability.type}</span>}
                        {ability.manaCost !== undefined && ability.manaCost > 0 && (
                          <span>Mana: {ability.manaCost}</span>
                        )}
                              {ability.basePower !== undefined && ability.basePower > 0 && (
                                <span>Power: {ability.basePower}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
