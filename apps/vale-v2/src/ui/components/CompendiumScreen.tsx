/**
 * CompendiumScreen Component
 * Displays game data in tabs: Units, Equipment, Djinn, Enemies, Bosses, NPCs
 */

import { useState, useEffect } from 'react';
import { UNIT_DEFINITIONS } from '@/data/definitions/units';
import { EQUIPMENT } from '@/data/definitions/equipment';
import { DJINN } from '@/data/definitions/djinn';
import { ENEMIES } from '@/data/definitions/enemies';
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
        onClose();
        return;
      }

      // Arrow key navigation between tabs
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
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
  }, [activeTab, tabs, onClose]);

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
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="compendium-content">
          {activeTab === 'units' && (
            <div className="compendium-section">
              <h2>Units ({Object.keys(UNIT_DEFINITIONS).length})</h2>
              <div className="compendium-grid">
                {Object.values(UNIT_DEFINITIONS).map((unit) => (
                  <div key={unit.id} className="compendium-item">
                    <div className="item-name">{unit.name}</div>
                    <div className="item-details">
                      <div>Element: {unit.element}</div>
                      <div>Role: {unit.role}</div>
                      <div>Level 1 HP: {unit.baseStats.hp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="compendium-section">
              <h2>Equipment ({Object.keys(EQUIPMENT).length})</h2>
              <div className="compendium-grid">
                {Object.values(EQUIPMENT).map((equip) => (
                  <div key={equip.id} className="compendium-item">
                    <div className="item-name">{equip.name}</div>
                    <div className="item-details">
                      <div>Slot: {equip.slot}</div>
                      <div>Tier: {equip.tier}</div>
                      <div>Cost: {equip.cost} gold</div>
                      {equip.statBonus && (
                        <div>
                          Stats: {Object.entries(equip.statBonus)
                            .map(([stat, val]) => `${stat}+${val}`)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'djinn' && (
            <div className="compendium-section">
              <h2>Djinn ({Object.keys(DJINN).length})</h2>
              <div className="compendium-grid">
                {Object.values(DJINN).map((djinn) => (
                  <div key={djinn.id} className="compendium-item">
                    <div className="item-name">{djinn.name}</div>
                    <div className="item-details">
                      <div>Element: {djinn.element}</div>
                      <div>Tier: {djinn.tier}</div>
                      <div>Summon: {djinn.summonEffect.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'enemies' && (
            <div className="compendium-section">
              <h2>Enemies ({regularEnemies.length})</h2>
              <div className="compendium-grid">
                {regularEnemies.map((enemy) => (
                  <div key={enemy.id} className="compendium-item">
                    <div className="item-name">{enemy.name}</div>
                    <div className="item-details">
                      <div>Element: {enemy.element}</div>
                      <div>Level: {enemy.level}</div>
                      <div>HP: {enemy.stats.hp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bosses' && (
            <div className="compendium-section">
              <h2>Boss Enemies ({bossEnemies.length})</h2>
              <div className="compendium-grid">
                {bossEnemies.map((enemy) => (
                  <div key={enemy.id} className="compendium-item">
                    <div className="item-name">{enemy.name}</div>
                    <div className="item-details">
                      <div>Element: {enemy.element}</div>
                      <div>Level: {enemy.level}</div>
                      <div>HP: {enemy.stats.hp}</div>
                    </div>
                  </div>
                ))}
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
