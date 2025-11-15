/**
 * PreBattleTeamSelectScreen Component
 * Main pre-battle team selection screen
 */

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../state/store';
import type { Team } from '@/core/models/Team';
import type { Unit } from '@/core/models/Unit';
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
  onConfirm: (team: Team) => void;
  onCancel: () => void;
}

export function PreBattleTeamSelectScreen({
  encounterId,
  onConfirm,
  onCancel,
}: PreBattleTeamSelectScreenProps) {
  const { roster, team, swapPartyMember, updateTeamUnits } = useStore((s) => ({
    roster: s.roster,
    team: s.team,
    swapPartyMember: s.swapPartyMember,
    updateTeamUnits: s.updateTeamUnits,
  }));

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
  const [selectedEquipmentSlot, setSelectedEquipmentSlot] = useState<EquipmentSlot | null>(null);
  const [selectedDjinnSlot, setSelectedDjinnSlot] = useState<number | null>(null);

  const encounter = ENCOUNTERS[encounterId];
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

  // Get current active party (1-4 units)
  const activeParty = team.units || [];

  // Get bench units (roster units not in active party)
  const benchUnits = roster.filter(
    (unit) => !activeParty.some((active) => active.id === unit.id)
  );

  // Get selected unit for equipment/Djinn management
  const selectedUnit = selectedSlotIndex !== null ? activeParty[selectedSlotIndex] : null;

  // Handle adding unit to slot
  const handleAddToSlot = (slotIndex: number, unitId: string) => {
    swapPartyMember(slotIndex, unitId);
    setSelectedSlotIndex(slotIndex);
  };

  // Handle removing unit from party
  const handleRemoveFromParty = (slotIndex: number) => {
    const newUnits = activeParty.filter((_, i) => i !== slotIndex);
    if (newUnits.length === 0) {
      // Can't have empty team
      return;
    }
    updateTeamUnits(newUnits);
    setSelectedSlotIndex(null);
  };

  // Handle start battle
  const handleStartBattle = useCallback(() => {
    if (!team || team.units.length < MIN_PARTY_SIZE) {
      alert(`Team must have at least ${MIN_PARTY_SIZE} unit`);
      return;
    }
    if (team.units.length > MAX_PARTY_SIZE) {
      alert(`Team cannot exceed ${MAX_PARTY_SIZE} units`);
      return;
    }
    onConfirm(team);
  }, [team, onConfirm]);

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

        if (team && team.units.length >= MIN_PARTY_SIZE && team.units.length <= MAX_PARTY_SIZE) {
          handleStartBattle();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [team, onCancel, handleStartBattle]);

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
              onRemoveFromParty={handleRemoveFromParty}
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
            disabled={!team || team.units.length < MIN_PARTY_SIZE}
          >
            Start Battle
          </button>
        </div>
      </div>
    </div>
  );
}


