import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { PartyMemberCard } from '../party/PartyMemberCard';
import { Button } from '../shared';
import type { Unit } from '@/types/Unit';
import './PreBattleTeamSelection.css';

interface PreBattleTeamSelectionProps {
  onConfirm: (selectedUnitIds: string[]) => void;
  onCancel: () => void;
}

export const PreBattleTeamSelection: React.FC<PreBattleTeamSelectionProps> = ({
  onConfirm,
  onCancel,
}) => {
  const { state } = useGame();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const allUnits = state.playerData.unitsCollected;
  const currentActiveIds = state.playerData.activePartyIds;

  // Initialize with current active party
  const [tempActivePartyIds, setTempActivePartyIds] = useState<string[]>(currentActiveIds);

  // Split units
  const activeUnits = allUnits.filter(u => tempActivePartyIds.includes(u.id));
  const benchUnits = allUnits.filter(u => !tempActivePartyIds.includes(u.id));

  // Auto-select first unit
  React.useEffect(() => {
    if (!selectedUnit && allUnits.length > 0) {
      setSelectedUnit(allUnits[0]);
    }
  }, [allUnits, selectedUnit]);

  const handleSwapToActive = (unit: Unit) => {
    if (tempActivePartyIds.length >= 4) {
      setErrorMessage('Active party is full! Remove a unit first.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    setTempActivePartyIds([...tempActivePartyIds, unit.id]);
    setErrorMessage(null);
  };

  const handleSwapToBench = (unit: Unit) => {
    if (tempActivePartyIds.length <= 1) {
      setErrorMessage('Must have at least 1 active unit!');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    setTempActivePartyIds(tempActivePartyIds.filter(id => id !== unit.id));
    setErrorMessage(null);
  };

  const handleSwap = (unit: Unit) => {
    const isActive = tempActivePartyIds.includes(unit.id);
    if (isActive) {
      handleSwapToBench(unit);
    } else {
      handleSwapToActive(unit);
    }
  };

  const handleConfirm = () => {
    if (tempActivePartyIds.length === 0) {
      setErrorMessage('Must have at least 1 active unit!');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    onConfirm(tempActivePartyIds);
  };

  const selectedStats = selectedUnit ? selectedUnit.calculateStats() : null;

  return (
    <div className="pre-battle-team-selection">
      <div className="pre-battle-container">
        {/* Header */}
        <header className="pre-battle-header">
          <div className="header-content">
            <h1>SELECT YOUR BATTLE PARTY</h1>
            <p className="subtitle">Choose up to 4 units for this battle</p>
          </div>
          <div className="header-actions">
            <Button onClick={onCancel} ariaLabel="Cancel">
              CANCEL
            </Button>
            <Button onClick={handleConfirm} ariaLabel="Confirm team selection" variant="primary">
              CONFIRM
            </Button>
          </div>
        </header>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Main Content */}
        <div className="pre-battle-content">
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

          {/* Unit Details Panel */}
          <aside className="unit-details-panel">
            {selectedUnit && selectedStats ? (
              <>
                <div className="details-header">
                  <h3>{selectedUnit.name}</h3>
                  <span className="element-badge">{selectedUnit.element}</span>
                </div>
                <div className="details-info">
                  <div className="info-row">
                    <span className="label">Level:</span>
                    <span className="value">{selectedUnit.level}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">HP:</span>
                    <span className="value">{selectedUnit.currentHp} / {selectedStats.hp}</span>
                  </div>
                </div>
                <div className="details-stats">
                  <h4>Stats</h4>
                  <div className="stat-grid">
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
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '20px' }}>
                Click on a unit to view details
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
