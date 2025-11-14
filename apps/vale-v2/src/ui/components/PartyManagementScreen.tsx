/**
 * PartyManagementScreen Component
 * Manages active party and bench units
 */

import { useState } from 'react';
import { useStore } from '../state/store';
import { UNIT_DEFINITIONS } from '@/data/definitions/units';
import { createUnit } from '@/core/models/Unit';
import './PartyManagementScreen.css';

interface PartyManagementScreenProps {
  onClose: () => void;
}

export function PartyManagementScreen({ onClose }: PartyManagementScreenProps) {
  const { team, swapPartyMember } = useStore((s) => ({
    team: s.team,
    swapPartyMember: s.swapPartyMember,
  }));

  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(null);
  const [selectedBenchUnitId, setSelectedBenchUnitId] = useState<string | null>(null);

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

  const activeParty = team.units || [];
  const allUnitIds = Object.keys(UNIT_DEFINITIONS);
  
  // Get bench units (units not in active party)
  const activeUnitIds = activeParty.map((u) => u.id);
  const benchUnitIds = allUnitIds.filter((id) => !activeUnitIds.includes(id));

  const handleSwap = (partyIndex: number, benchUnitId: string) => {
    if (swapPartyMember) {
      swapPartyMember(partyIndex, benchUnitId);
      setSelectedUnitIndex(null);
      setSelectedBenchUnitId(null);
    }
  };

  const handleSelectPartyMember = (index: number) => {
    if (selectedUnitIndex === index) {
      setSelectedUnitIndex(null);
      setSelectedBenchUnitId(null);
    } else {
      setSelectedUnitIndex(index);
      setSelectedBenchUnitId(null);
    }
  };

  const handleSelectBenchUnit = (unitId: string) => {
    if (selectedBenchUnitId === unitId) {
      setSelectedBenchUnitId(null);
    } else {
      setSelectedBenchUnitId(unitId);
    }
  };

  const handleSwapClick = () => {
    if (selectedUnitIndex !== null && selectedBenchUnitId !== null) {
      handleSwap(selectedUnitIndex, selectedBenchUnitId);
    }
  };

  return (
    <div className="party-management-overlay" onClick={onClose}>
      <div className="party-management-container" onClick={(e) => e.stopPropagation()}>
        <div className="party-management-header">
          <h1>Party Management</h1>
          <button className="close-btn" onClick={onClose} aria-label="Close party management">
            ×
          </button>
        </div>

        <div className="party-instructions">
          <p>Select a party member and a bench unit to swap positions.</p>
        </div>

        <div className="party-content">
          {/* Active Party */}
          <div className="party-section">
            <h2>Active Party</h2>
            <div className="party-grid">
              {activeParty.map((unit, index) => {
                const isSelected = selectedUnitIndex === index;

                return (
                  <div
                    key={unit.id}
                    className={`party-member-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectPartyMember(index)}
                  >
                    <div className="member-slot-number">Slot {index + 1}</div>
                    <div className="member-icon">
                      <span className="member-initial">{unit.name[0]}</span>
                    </div>
                    <div className="member-info">
                      <div className="member-name">{unit.name}</div>
                      <div className="member-level">Lv. {unit.level}</div>
                      <div className="member-element">{unit.element}</div>
                      <div className="member-role">{unit.role}</div>
                    </div>
                    {isSelected && (
                      <div className="selection-indicator">Selected</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bench Units */}
          <div className="party-section">
            <h2>Bench</h2>
            {benchUnitIds.length === 0 ? (
              <div className="no-bench-message">No units available on bench</div>
            ) : (
              <div className="bench-grid">
                {benchUnitIds.map((unitId) => {
                  const unitDef = UNIT_DEFINITIONS[unitId];
                  if (!unitDef) return null;

                  const isSelected = selectedBenchUnitId === unitId;
                  // Create a preview unit at level 1 for display
                  const previewUnit = createUnit(unitDef, 1, 0);

                  return (
                    <div
                      key={unitId}
                      className={`bench-unit-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectBenchUnit(unitId)}
                    >
                      <div className="member-icon">
                        <span className="member-initial">{previewUnit.name[0]}</span>
                      </div>
                      <div className="member-info">
                        <div className="member-name">{previewUnit.name}</div>
                        <div className="member-element">{previewUnit.element}</div>
                        <div className="member-role">{previewUnit.role}</div>
                      </div>
                      {isSelected && (
                        <div className="selection-indicator">Selected</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        {selectedUnitIndex !== null && selectedBenchUnitId !== null && (
          <div className="swap-actions">
            <button className="swap-btn" onClick={handleSwapClick}>
              Swap Positions
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                setSelectedUnitIndex(null);
                setSelectedBenchUnitId(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

