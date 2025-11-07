import { useState } from 'react';
import { ENEMIES } from '@/data/enemies';
import type { Enemy } from '@/data/enemies';
import './EnemyCatalog.css';

/**
 * Enemy Catalog UI
 *
 * A browsable directory of all enemies in the game.
 * Useful for:
 * - Developers to review implemented enemies
 * - Future bestiary feature for players
 * - QA testing enemy data
 */

type FilterElement = 'All' | 'Neutral' | 'Venus' | 'Mars' | 'Mercury' | 'Jupiter';
type FilterLevel = 'All' | '1-2' | '3-4' | '5-6' | '7-8' | '9-10';

export function EnemyCatalog() {
  const [elementFilter, setElementFilter] = useState<FilterElement>('All');
  const [levelFilter, setLevelFilter] = useState<FilterLevel>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);

  // Get all enemies as array
  const allEnemies = Object.values(ENEMIES);

  // Apply filters
  const filteredEnemies = allEnemies.filter((enemy) => {
    // Element filter
    if (elementFilter !== 'All' && enemy.element !== elementFilter) {
      return false;
    }

    // Level filter
    if (levelFilter !== 'All') {
      const level = enemy.level;
      switch (levelFilter) {
        case '1-2': if (level < 1 || level > 2) return false; break;
        case '3-4': if (level < 3 || level > 4) return false; break;
        case '5-6': if (level < 5 || level > 6) return false; break;
        case '7-8': if (level < 7 || level > 8) return false; break;
        case '9-10': if (level < 9 || level > 10) return false; break;
      }
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return enemy.name.toLowerCase().includes(query) ||
             enemy.id.toLowerCase().includes(query);
    }

    return true;
  });

  // Sort by level, then name
  const sortedEnemies = [...filteredEnemies].sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.name.localeCompare(b.name);
  });

  // Group by level
  const groupedByLevel = sortedEnemies.reduce((acc, enemy) => {
    const level = enemy.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(enemy);
    return acc;
  }, {} as Record<number, Enemy[]>);

  const handleEnemyClick = (enemy: Enemy) => {
    setSelectedEnemy(enemy);
  };

  const handleClose = () => {
    setSelectedEnemy(null);
  };

  return (
    <div className="enemy-catalog">
      <div className="catalog-container">
        <div className="catalog-header">
          <h1>Enemy Catalog</h1>
          <p className="catalog-stats">
            {sortedEnemies.length} / {allEnemies.length} enemies shown
          </p>
        </div>

        <div className="catalog-filters">
          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Element:</label>
            <select
              value={elementFilter}
              onChange={(e) => setElementFilter(e.target.value as FilterElement)}
            >
              <option value="All">All</option>
              <option value="Neutral">Neutral</option>
              <option value="Venus">Venus (Earth)</option>
              <option value="Mars">Mars (Fire)</option>
              <option value="Mercury">Mercury (Water)</option>
              <option value="Jupiter">Jupiter (Wind)</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Level:</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as FilterLevel)}
            >
              <option value="All">All Levels</option>
              <option value="1-2">Level 1-2</option>
              <option value="3-4">Level 3-4</option>
              <option value="5-6">Level 5-6</option>
              <option value="7-8">Level 7-8</option>
              <option value="9-10">Level 9-10</option>
            </select>
          </div>
        </div>

        <div className="catalog-content">
        {Object.entries(groupedByLevel).map(([level, enemies]) => (
          <div key={level} className="level-group">
            <h2 className="level-header">Level {level} ({enemies.length} enemies)</h2>
            <div className="enemy-grid">
              {enemies.map((enemy) => (
                <div
                  key={enemy.id}
                  className={`enemy-card element-${enemy.element.toLowerCase()}`}
                  onClick={() => handleEnemyClick(enemy)}
                >
                  <div className="enemy-card-header">
                    <span className="enemy-name">{enemy.name}</span>
                    <span className="enemy-level">Lv.{enemy.level}</span>
                  </div>
                  <div className="enemy-element">{enemy.element}</div>
                  <div className="enemy-stats-mini">
                    <span>HP: {enemy.stats.hp}</span>
                    <span>ATK: {enemy.stats.atk}</span>
                    <span>DEF: {enemy.stats.def}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

          {sortedEnemies.length === 0 && (
            <div className="no-results">
              <p>No enemies found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {selectedEnemy && (
        <div className="enemy-detail-modal" onClick={handleClose}>
          <div className="enemy-detail-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleClose}>×</button>

            <div className="detail-header">
              <h2>{selectedEnemy.name}</h2>
              <span className="detail-level">Level {selectedEnemy.level}</span>
            </div>

            <div className="detail-body">
              <div className="detail-section">
                <h3>Info</h3>
                <p><strong>ID:</strong> {selectedEnemy.id}</p>
                <p><strong>Element:</strong> {selectedEnemy.element}</p>
                <p><strong>Base XP:</strong> {selectedEnemy.baseXp}</p>
                <p><strong>Base Gold:</strong> {selectedEnemy.baseGold}</p>
              </div>

              <div className="detail-section">
                <h3>Stats</h3>
                <div className="stat-grid">
                  <div className="stat-item">
                    <span className="stat-label">HP:</span>
                    <span className="stat-value">{selectedEnemy.stats.hp}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">PP:</span>
                    <span className="stat-value">{selectedEnemy.stats.pp}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">ATK:</span>
                    <span className="stat-value">{selectedEnemy.stats.atk}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">DEF:</span>
                    <span className="stat-value">{selectedEnemy.stats.def}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">MAG:</span>
                    <span className="stat-value">{selectedEnemy.stats.mag}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">SPD:</span>
                    <span className="stat-value">{selectedEnemy.stats.spd}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Abilities ({selectedEnemy.abilities.length})</h3>
                <ul className="ability-list">
                  {selectedEnemy.abilities.map((ability, i) => (
                    <li key={i}>
                      <strong>{ability.name}</strong>
                      {ability.ppCost > 0 && <span> ({ability.ppCost} PP)</span>}
                      {ability.element && <span className="ability-element"> - {ability.element}</span>}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedEnemy.drops && selectedEnemy.drops.length > 0 && (
                <div className="detail-section">
                  <h3>Drops</h3>
                  <ul className="drop-list">
                    {selectedEnemy.drops.map((drop, i) => (
                      <li key={i}>
                        {drop.equipment.name} ({(drop.chance * 100).toFixed(0)}% chance)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
