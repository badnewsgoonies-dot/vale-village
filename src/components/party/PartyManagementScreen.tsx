import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { PartyMemberCard } from './PartyMemberCard';
import { Button, ElementIcon } from '../shared';
import type { Unit } from '@/types/Unit';
import './PartyManagement.css';

export const PartyManagementScreen: React.FC = () => {
  const { state, actions } = useGame();
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allUnits = state.playerData.unitsCollected;
  const activePartyIds = state.playerData.activePartyIds;

  // Split units into active and bench
  const activeUnits = allUnits.filter(u => activePartyIds.includes(u.id));
  const benchUnits = allUnits.filter(u => !activePartyIds.includes(u.id));

  // Auto-select first unit if none selected
  React.useEffect(() => {
    if (!selectedUnit && allUnits.length > 0) {
      setSelectedUnit(allUnits[0]);
    }
  }, [allUnits, selectedUnit]);

  // Add ESC key support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleReturn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReturn]);

  const handleSwapToActive = (unit: Unit) => {
    // Validation: Can't exceed 4 active units
    if (activeUnits.length >= 4) {
      setErrorMessage('Active party is full! Remove a unit first.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Add unit to active party
    actions.setActiveParty([...activePartyIds, unit.id]);
    setErrorMessage(null);
  };

  const handleSwapToBench = (unit: Unit) => {
    // Validation: Must have at least 1 active unit
    if (activeUnits.length <= 1) {
      setErrorMessage('Must have at least 1 active unit!');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Remove unit from active party
    actions.setActiveParty(activePartyIds.filter(id => id !== unit.id));
    setErrorMessage(null);
  };

  const handleSwap = (unit: Unit) => {
    const isActive = activePartyIds.includes(unit.id);
    if (isActive) {
      handleSwapToBench(unit);
    } else {
      handleSwapToActive(unit);
    }
  };

  const handleReturn = React.useCallback(() => {
    actions.goBack();
  }, [actions]);

  const selectedStats = selectedUnit ? selectedUnit.calculateStats() : null;

  return (
    <div className="party-management-screen">
      <div className="party-management-container">
        {/* Header */}
        <header className="party-header">
          <div className="header-content">
            <h1>PARTY MANAGEMENT</h1>
            <div className="party-summary">
              <span className="active-count">Active: {activeUnits.length} / 4</span>
              <span className="divider">•</span>
              <span className="total-count">Total: {allUnits.length} / 10</span>
            </div>
          </div>
          <Button onClick={handleReturn} ariaLabel="Return to overworld">
            RETURN
          </Button>
        </header>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Main Content - Split into Active and Bench */}
        <div className="party-content">
          {/* Active Party Section */}
          <section className="active-party-section">
            <div className="section-header">
              <h2>ACTIVE PARTY</h2>
              <span className="section-count">{activeUnits.length} / 4 slots</span>
            </div>
            <div className="active-party-grid">
              {activeUnits.map(unit => (
                <PartyMemberCard
                  key={unit.id}
                  unit={unit}
                  isActive={true}
                  onSwap={handleSwap}
                  onSelect={setSelectedUnit}
                  isSelected={selectedUnit?.id === unit.id}
                  size="large"
                />
              ))}
              {/* Empty slots */}
              {Array.from({ length: 4 - activeUnits.length }).map((_, i) => (
                <div key={`empty-${i}`} className="empty-slot">
                  <div className="empty-slot-icon">+</div>
                  <div className="empty-slot-text">Empty Slot</div>
                </div>
              ))}
            </div>
          </section>

          {/* Bench Section */}
          <section className="bench-section">
            <div className="section-header">
              <h2>BENCH</h2>
              <span className="section-count">{benchUnits.length} units</span>
            </div>
            {benchUnits.length === 0 ? (
              <div className="empty-bench">
                <p>All recruited units are in the active party!</p>
              </div>
            ) : (
              <div className="bench-grid">
                {benchUnits.map(unit => (
                  <PartyMemberCard
                    key={unit.id}
                    unit={unit}
                    isActive={false}
                    onSwap={handleSwap}
                    onSelect={setSelectedUnit}
                    isSelected={selectedUnit?.id === unit.id}
                    size="small"
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Unit Details Panel */}
        {selectedUnit && selectedStats && (
          <aside className="unit-details-panel">
            <div className="details-header">
              <h3>{selectedUnit.name}</h3>
              <ElementIcon element={selectedUnit.element} size="medium" />
            </div>
            <div className="details-info">
              <div className="info-row">
                <span className="label">Level:</span>
                <span className="value">{selectedUnit.level}</span>
              </div>
              <div className="info-row">
                <span className="label">Role:</span>
                <span className="value">{selectedUnit.role}</span>
              </div>
              <div className="info-row">
                <span className="label">Element:</span>
                <span className="value">{selectedUnit.element}</span>
              </div>
              <div className="info-row">
                <span className="label">XP:</span>
                <span className="value">{selectedUnit.xp}</span>
              </div>
            </div>
            <div className="details-stats">
              <h4>Stats</h4>
              <div className="stat-grid">
                <div className="stat-item">
                  <span className="stat-name">HP</span>
                  <span className="stat-value">{selectedStats.hp}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">PP</span>
                  <span className="stat-value">{selectedStats.pp}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">ATK</span>
                  <span className="stat-value">{selectedStats.atk}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">DEF</span>
                  <span className="stat-value">{selectedStats.def}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">MAG</span>
                  <span className="stat-value">{selectedStats.mag}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">SPD</span>
                  <span className="stat-value">{selectedStats.spd}</span>
                </div>
              </div>
            </div>
            <div className="details-description">
              <h4>Description</h4>
              <p>{selectedUnit.description}</p>
            </div>
            <div className="details-equipment">
              <h4>Equipment</h4>
              <div className="equipment-slots">
                {Object.entries(selectedUnit.equipment).map(([slot, item]) => (
                  <div key={slot} className="equipment-slot">
                    <span className="slot-name">{slot}:</span>
                    <span className="slot-item">{item?.name || 'Empty'}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
