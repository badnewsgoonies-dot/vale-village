/**
 * PreBattleTeamSelectScreen Component
 * Main pre-battle team selection screen
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useStore } from '../state/store';
import type { EquipmentSlot, Equipment } from '@/core/models/Equipment';
import { createEmptyLoadout } from '@/core/models/Equipment';
import { updateTeam } from '@/core/models/Team';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { validateBattleConfig } from '../state/battleConfig';
import { TeamBenchSection } from './TeamBenchSection';
import { EquipmentSection } from './EquipmentSection';
import { DjinnSection } from './DjinnSection';
import { EnemyPortalTile } from './EnemyPortalTile';
import { VS1_ENCOUNTER_ID } from '@/story/vs1Constants';
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
  const {
    roster,
    team,
    currentBattleConfig,
    updateBattleConfigSlot,
    updateBattleSlotEquipment,
    setBattleConfigDjinnSlot,
    equipment: inventory,
    story,
    setStoryFlag,
  } = useStore((s) => ({
    roster: s.roster,
    team: s.team,
    currentBattleConfig: s.currentBattleConfig,
    updateBattleConfigSlot: s.updateBattleConfigSlot,
    updateBattleSlotEquipment: s.updateBattleSlotEquipment,
    setBattleConfigDjinnSlot: s.setBattleConfigDjinnSlot,
    equipment: s.equipment,
    story: s.story,
    setStoryFlag: s.setStoryFlag,
  }));

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
  const [selectedEquipmentSlot, setSelectedEquipmentSlot] = useState<EquipmentSlot | null>(null);
  const [selectedDjinnSlot, setSelectedDjinnSlot] = useState<number | null>(null);
  const [tutorialDismissed, setTutorialDismissed] = useState(false);

  const encounter = ENCOUNTERS[encounterId];
  const battleConfig = currentBattleConfig;
  const slots = battleConfig?.slots ?? [];
  const findUnitById = (unitId: string) =>
    roster.find((unit) => unit.id === unitId) ?? team?.units.find((unit) => unit.id === unitId) ?? null;

  const activeUnitIds = slots
    .map((slot) => slot.unitId)
    .filter((unitId): unitId is string => Boolean(unitId));

  const handleAddToSlot = (slotIndex: number, unitId: string) => {
    updateBattleConfigSlot(slotIndex, unitId);
    setSelectedSlotIndex(slotIndex);
  };

  const configValidation = useMemo(() => {
    if (!battleConfig) {
      return { valid: false, message: 'Battle configuration missing' };
    }

    return validateBattleConfig(battleConfig, inventory, roster, team);
  }, [battleConfig, inventory, roster, team]);

  const handleStartBattle = useCallback(() => {
    if (!battleConfig) {
      alert('Battle configuration missing');
      return;
    }

    if (!configValidation.valid) {
      alert(configValidation.message ?? 'Battle configuration invalid');
      return;
    }

    onConfirm();
  }, [battleConfig, configValidation.message, configValidation.valid, onConfirm]);

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

        if (battleConfig && configValidation.valid) {
          handleStartBattle();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [battleConfig, configValidation.valid, handleStartBattle, onCancel]);

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

  const selectedSlotEquipmentLoadout = selectedSlotConfig?.equipmentLoadout ?? createEmptyLoadout();
  const djinnSlots = battleConfig.djinnSlots;
  const selectedDjinnIds = djinnSlots.filter((id): id is string => Boolean(id));
  let previewTeam = team;
  try {
    previewTeam = updateTeam(team, { equippedDjinn: selectedDjinnIds });
  } catch (error) {
    console.error('Failed to preview Djinn configuration', error);
  }

  const handleEquipItem = (equipmentSlot: EquipmentSlot, item: Equipment) => {
    if (selectedSlotIndex === null) return;
    updateBattleSlotEquipment(selectedSlotIndex, equipmentSlot, item);
  };

  const handleUnequipItem = (equipmentSlot: EquipmentSlot) => {
    if (selectedSlotIndex === null) return;
    updateBattleSlotEquipment(selectedSlotIndex, equipmentSlot, null);
  };

  const handleEquipDjinn = (djinnId: string, slotIndex: number) => {
    setBattleConfigDjinnSlot(slotIndex, djinnId);
  };

  const handleUnequipDjinn = (slotIndex: number) => {
    setBattleConfigDjinnSlot(slotIndex, null);
  };

  const validationMessage = !configValidation.valid ? configValidation.message : undefined;

  const hasSeenPreBattleTutorial = Boolean(story.flags['tutorial:prebattle:vs1']);
  const isTutorialEncounter = encounterId === 'house-01' || encounterId === VS1_ENCOUNTER_ID;
  const showTutorial = isTutorialEncounter && !hasSeenPreBattleTutorial && !tutorialDismissed;

  const handleDismissTutorial = () => {
    setTutorialDismissed(true);
    try {
      setStoryFlag('tutorial:prebattle:vs1', true);
    } catch (error) {
      console.warn('Failed to set pre-battle tutorial flag:', error);
    }
  };

  return (
    <div className="pre-battle-overlay">
      <div className="pre-battle-container">
        {showTutorial && (
          <div className="pre-battle-tutorial-overlay">
            <div className="pre-battle-tutorial-box" role="dialog" aria-modal="true" aria-label="Pre-battle tutorial">
              <div className="pre-battle-tutorial-title">First Battle Setup</div>
              <div className="pre-battle-tutorial-content">
                <p>This screen lets you prepare your team before the fight:</p>
                <ul>
                  <li>Pick which Adepts from your roster will fight in this battle.</li>
                  <li>Assign temporary equipment from the shared, element-locked pool for this encounter.</li>
                  <li>Use the Djinn panel to configure up to three Djinn that empower your whole active team.</li>
                </ul>
              </div>
              <button className="pre-battle-tutorial-btn" onClick={handleDismissTutorial}>
                Got it – let&apos;s prepare
              </button>
            </div>
          </div>
        )}
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
                selectedSlot={selectedEquipmentSlot}
                onSelectSlot={setSelectedEquipmentSlot}
                equipmentLoadout={selectedSlotEquipmentLoadout}
                inventory={inventory}
                onEquip={handleEquipItem}
                onUnequip={handleUnequipItem}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="section-card summary-card">
              <div className="summary-header">
                <div>
                  <div className="summary-title">{encounter.name}</div>
                  <div className="summary-subtitle">
                    Difficulty: <span className="pill difficulty-pill">{encounter.difficulty ?? 'normal'}</span>
                  </div>
                </div>
                <div className="pill encounter-pill">House</div>
              </div>
              <div className="summary-rewards">
                <div className="reward-chip">
                  <span>XP</span>
                  <strong>{encounter.reward.xp}</strong>
                </div>
                <div className="reward-chip">
                  <span>Gold</span>
                  <strong>{encounter.reward.gold}</strong>
                </div>
                {encounter.reward.djinn && (
                  <div className="reward-chip">
                    <span>Djinn</span>
                    <strong>{encounter.reward.djinn}</strong>
                  </div>
                )}
                {encounter.reward.unlockUnit && (
                  <div className="reward-chip">
                    <span>Recruit</span>
                    <strong>{encounter.reward.unlockUnit}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Djinn + Granted Abilities on the right */}
            {selectedUnit && (
              <DjinnSection
                unit={selectedUnit}
                team={previewTeam}
                selectedSlot={selectedDjinnSlot}
                onSelectSlot={setSelectedDjinnSlot}
                djinnSlots={djinnSlots}
                onEquipDjinn={handleEquipDjinn}
                onUnequipDjinn={handleUnequipDjinn}
              />
            )}

            <div className="section-card enemies-card">
              <div className="section-title">ENEMIES</div>
              <div className="enemy-portal-wrap">
                <EnemyPortalTile encounterId={encounterId} />
              </div>
            </div>
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
            disabled={!configValidation.valid}
          >
            Start Battle
          </button>
        </div>
        {validationMessage && (
          <div
            className="validation-message"
            style={{ color: '#ff7a7a', fontSize: '0.8rem', marginTop: '0.35rem', textAlign: 'center' }}
          >
            {validationMessage}
          </div>
        )}
      </div>
    </div>
  );
}
