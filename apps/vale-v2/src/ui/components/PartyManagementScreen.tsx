/**
 * PartyManagementScreen Component
 * Now a Unit Compendium - shows all recruited units and their details
 */

import { useState } from 'react';
import { useStore } from '../state/store';
import { calculateEffectiveStats } from '@/core/algorithms/stats';
import './PartyManagementScreen.css';

interface PartyManagementScreenProps {
  onClose: () => void;
}

export function PartyManagementScreen({ onClose }: PartyManagementScreenProps) {
  const { team, roster } = useStore((s) => ({
    team: s.team,
    roster: s.roster,
  }));

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  if (!team) {
    return (
      <div className="party-management-overlay" onClick={onClose}>
        <div className="party-management-container" onClick={(e) => e.stopPropagation()}>
          <div className="party-error">No team data available</div>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const activeUnitIds = new Set(team.units.map((u) => u.id));
  const selectedUnit = roster.find((u) => u.id === selectedUnitId);
  const selectedStats = selectedUnit ? calculateEffectiveStats(selectedUnit, team) : null;

  return (
    <div className="party-management-overlay" onClick={onClose}>
      <div className="party-management-container" onClick={(e) => e.stopPropagation()}>
        <div className="party-management-header">
          <h1>Unit Compendium</h1>
          <button className="close-btn" onClick={onClose} aria-label="Close compendium">
            ×
          </button>
        </div>

        <div className="party-instructions">
          <p>View all recruited units and their stats. Units are added to your active party before battles.</p>
        </div>

        <div className="party-content">
          {/* Unit List */}
          <div className="party-section">
            <h2>Recruited Units ({roster.length})</h2>
            <div className="party-grid">
              {roster.map((unit) => {
                const isActive = activeUnitIds.has(unit.id);
                const isSelected = selectedUnitId === unit.id;

                return (
                  <div
                    key={unit.id}
                    className={`party-member-card ${isSelected ? 'selected' : ''} ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedUnitId(unit.id)}
                  >
                    <div className="member-icon">
                      <span className="member-initial">{unit.name[0]}</span>
                    </div>
                    <div className="member-info">
                      <div className="member-name">{unit.name}</div>
                      <div className="member-stats">Lv: {unit.level}</div>
                      <div className="member-element">{unit.element}</div>
                      <div className="member-role">{unit.role}</div>
                      {isActive && <div className="active-badge">In Party</div>}
                    </div>
                    {isSelected && (
                      <div className="selection-indicator">Selected</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unit Details */}
          {selectedUnit && selectedStats && (
            <div className="party-section unit-details">
              <h2>{selectedUnit.name}</h2>
              <div className="detail-grid">
                <div className="detail-row">
                  <span className="detail-label">Level:</span>
                  <span className="detail-value">{selectedUnit.level}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Element:</span>
                  <span className="detail-value">{selectedUnit.element}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{selectedUnit.role}</span>
                </div>
                <div className="detail-divider" />
                <div className="detail-row">
                  <span className="detail-label">HP:</span>
                  <span className="detail-value">{selectedUnit.currentHp} / {selectedStats.hp}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ATK:</span>
                  <span className="detail-value">{selectedStats.atk}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">DEF:</span>
                  <span className="detail-value">{selectedStats.def}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">MAG:</span>
                  <span className="detail-value">{selectedStats.mag}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">SPD:</span>
                  <span className="detail-value">{selectedStats.spd}</span>
                </div>
                <div className="detail-divider" />
                <div className="detail-section">
                  <h3>Abilities ({selectedUnit.abilities.length})</h3>
                  <div className="ability-list">
                    {selectedUnit.abilities.map((ability) => (
                      <div key={ability.id} className="ability-item">
                        <span className="ability-name">{ability.name}</span>
                        {ability.manaCost > 0 && (
                          <span className="ability-cost">[{ability.manaCost}]</span>
                        )}
                      </div>
                    ))}
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
