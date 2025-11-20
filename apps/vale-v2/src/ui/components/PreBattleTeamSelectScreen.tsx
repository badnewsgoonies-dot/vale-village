/**
 * PreBattleTeamSelectScreen Component
 * Main pre-battle team selection screen
 */

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../state/store';
import type { EquipmentSlot } from '@/core/models/Equipment';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '@/core/constants';
import { TeamBenchSection } from './TeamBenchSection';
import { EquipmentSection } from './EquipmentSection';
import { DjinnSection } from './DjinnSection';
import { EnemyPortalTile } from './EnemyPortalTile';
import './PreBattleTeamSelectScreen.css';

interface PreBattleTeamSelectScreenProps {
  encounterId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PreBattleTeamSelectScreen({
  encounterId,
  onConfirm,
  onCancel,
}: PreBattleTeamSelectScreenProps) {
  const { roster, team, currentBattleConfig, updateBattleConfigSlot } = useStore((s) => ({
    roster: s.roster,
    team: s.team,
    currentBattleConfig: s.currentBattleConfig,
    updateBattleConfigSlot: s.updateBattleConfigSlot,
  }));

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
  const [selectedEquipmentSlot, setSelectedEquipmentSlot] = useState<EquipmentSlot | null>(null);
  const [selectedDjinnSlot, setSelectedDjinnSlot] = useState<number | null>(null);

  const encounter = ENCOUNTERS[encounterId];
  const battleConfig = currentBattleConfig;
  const slots = battleConfig?.slots ?? [];
  const findUnitById = (unitId: string) =>
    roster.find((unit) => unit.id === unitId) ?? team?.units.find((unit) => unit.id === unitId) ?? null;

  const activeUnitIds = slots
    .map((slot) => slot.unitId)
    .filter((unitId): unitId is string => Boolean(unitId));

  const filledUnitCount = activeUnitIds.length;

  const handleAddToSlot = (slotIndex: number, unitId: string) => {
    updateBattleConfigSlot(slotIndex, unitId);
    setSelectedSlotIndex(slotIndex);
  };

  const handleStartBattle = useCallback(() => {
    if (!battleConfig) {
      alert('Battle configuration missing');
      return;
    }

    if (filledUnitCount < MIN_PARTY_SIZE) {
      alert(`Team must have at least ${MIN_PARTY_SIZE} units`);
      return;
    }

    if (filledUnitCount > MAX_PARTY_SIZE) {
      alert(`Team cannot exceed ${MAX_PARTY_SIZE} units`);
      return;
    }

    onConfirm();
  }, [battleConfig, filledUnitCount, onConfirm]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
        return;
      }

      if (event.key === 'Enter' || event.code === 'Enter') {
        event.preventDefault();
        event.stopPropagation();

        if (
          battleConfig &&
          filledUnitCount >= MIN_PARTY_SIZE &&
          filledUnitCount <= MAX_PARTY_SIZE
        ) {
          handleStartBattle();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [battleConfig, filledUnitCount, handleStartBattle, onCancel]);

  if (!encounter) {
    return (
      <div className="pre-battle-overlay">
        <div className="pre-battle-container">
          <div>Error: Encounter not found</div>
          <button onClick={onCancel}>Close</button>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="pre-battle-overlay">
        <div className="pre-battle-container">
          <div>Error: No team available</div>
          <button onClick={onCancel}>Close</button>
        </div>
      </div>
    );
  }

  if (!battleConfig) {
    return (
      <div className="pre-battle-overlay">
        <div className="pre-battle-container">
          <div>Error: Battle configuration missing</div>
          <button onClick={onCancel}>Close</button>
        </div>
      </div>
    );
  }

  const activeParty = battleConfig.slots.map((slot) =>
    slot.unitId ? findUnitById(slot.unitId) : null
  );

  const benchUnits = roster.filter((unit) => !activeUnitIds.includes(unit.id));

  const selectedSlotConfig =
    selectedSlotIndex !== null ? battleConfig.slots[selectedSlotIndex] : null;
  const selectedUnit = selectedSlotConfig?.unitId ? findUnitById(selectedSlotConfig.unitId) : null;

  return (
    <div className="pre-battle-overlay">
      <div className="pre-battle-container">
        {/* Header */}
        <div className="pre-battle-header">
          <div>
            <div className="header-title">PRE-BATTLE PREPARATION</div>
            <div className="header-info">
              {encounter.name} | Difficulty: {encounter.difficulty} | Rewards: {encounter.reward.xp} XP,{' '}
              {encounter.reward.gold} Gold
            </div>
          </div>
          <button className="close-btn" onClick={onCancel} aria-label="Close">
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Column */}
          <div className="left-column">
            {/* Team & Bench Section */}
            <TeamBenchSection
              activeParty={activeParty}
              benchUnits={benchUnits}
              selectedSlotIndex={selectedSlotIndex}
              onSelectSlot={setSelectedSlotIndex}
              onAddToSlot={handleAddToSlot}
            />

            {/* Equipment Section */}
            {selectedUnit && (
              <EquipmentSection
                unit={selectedUnit}
                team={team}
                selectedSlot={selectedEquipmentSlot}
                onSelectSlot={setSelectedEquipmentSlot}
              />
            )}

            {/* Djinn Section */}
            {selectedUnit && (
              <DjinnSection
                unit={selectedUnit}
                team={team}
                selectedSlot={selectedDjinnSlot}
                onSelectSlot={setSelectedDjinnSlot}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Enemies Portal Tile */}
            <EnemyPortalTile encounterId={encounterId} />
          </div>
        </div>

        {/* Actions */}
        <div className="actions-section">
          <button className="cancel-btn-action" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="start-battle-btn"
            onClick={handleStartBattle}
            disabled={!currentBattleConfig || filledUnitCount < MIN_PARTY_SIZE}
          >
            Start Battle
          </button>
        </div>
      </div>
    </div>
  );
}


