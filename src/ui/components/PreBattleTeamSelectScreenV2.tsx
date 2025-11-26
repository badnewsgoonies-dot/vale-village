/**
 * PreBattleTeamSelectScreenV2 Component
 *
 * Clean, mockup-inspired team selection screen.
 * Features:
 * - Two-panel layout: Available Units (left) | Selected Team (right)
 * - Auto-sorts selected units by SPD (fastest first)
 * - Shows turn order badges (1st, 2nd, 3rd, 4th)
 * - Golden Sun-inspired earthy color palette
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useStore } from '../state/store';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { validateBattleConfig } from '../state/battleConfig';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPortraitSprite } from '../sprites/mappings';
import { EnemyPortalTile } from './EnemyPortalTile';
import type { Unit } from '@/core/models/Unit';
import './PreBattleTeamSelectScreenV2.css';

interface PreBattleTeamSelectScreenV2Props {
  encounterId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Ordinal suffixes for turn order
const ORDINALS = ['1st', '2nd', '3rd', '4th'] as const;

export function PreBattleTeamSelectScreenV2({
  encounterId,
  onConfirm,
  onCancel,
}: PreBattleTeamSelectScreenV2Props) {
  const {
    roster,
    team,
    currentBattleConfig,
    updateBattleConfigSlot,
    equipment: inventory,
  } = useStore((s) => ({
    roster: s.roster,
    team: s.team,
    currentBattleConfig: s.currentBattleConfig,
    updateBattleConfigSlot: s.updateBattleConfigSlot,
    equipment: s.equipment,
  }));

  const encounter = ENCOUNTERS[encounterId];
  const battleConfig = currentBattleConfig;
  const slots = battleConfig?.slots ?? [];

  // Get all available units (roster + team units)
  const allUnits = useMemo(() => {
    const unitMap = new Map<string, Unit>();
    roster.forEach((u) => unitMap.set(u.id, u));
    team?.units.forEach((u) => unitMap.set(u.id, u));
    return Array.from(unitMap.values());
  }, [roster, team]);

  // Get currently selected unit IDs from battle config
  const selectedUnitIds = useMemo(() =>
    slots
      .map((slot) => slot.unitId)
      .filter((id): id is string => Boolean(id)),
    [slots]
  );

  // Get selected units sorted by speed (descending)
  const selectedUnits = useMemo(() => {
    return selectedUnitIds
      .map((id) => allUnits.find((u) => u.id === id))
      .filter((u): u is Unit => Boolean(u))
      .sort((a, b) => {
        // Primary: base speed (descending) - good approximation for turn order preview
        const speedDiff = b.baseStats.spd - a.baseStats.spd;
        if (speedDiff !== 0) return speedDiff;
        // Tiebreaker: level
        return b.level - a.level;
      });
  }, [selectedUnitIds, allUnits]);

  // Available units (not selected)
  const availableUnits = useMemo(() =>
    allUnits.filter((u) => !selectedUnitIds.includes(u.id)),
    [allUnits, selectedUnitIds]
  );

  // Validation
  const configValidation = useMemo(() => {
    if (!battleConfig) {
      return { valid: false, message: 'Battle configuration missing' };
    }
    return validateBattleConfig(battleConfig, inventory, roster, team);
  }, [battleConfig, inventory, roster, team]);

  // Toggle unit selection
  const handleUnitToggle = useCallback((unit: Unit) => {
    const isSelected = selectedUnitIds.includes(unit.id);

    if (isSelected) {
      // Find which slot has this unit and clear it
      const slotIndex = slots.findIndex((s) => s.unitId === unit.id);
      if (slotIndex !== -1) {
        updateBattleConfigSlot(slotIndex, null);
      }
    } else if (selectedUnitIds.length < 4) {
      // Find first empty slot and fill it
      const emptySlotIndex = slots.findIndex((s) => !s.unitId);
      if (emptySlotIndex !== -1) {
        updateBattleConfigSlot(emptySlotIndex, unit.id);
      }
    }
  }, [selectedUnitIds, slots, updateBattleConfigSlot]);

  // Remove unit from team
  const handleRemoveUnit = useCallback((unitId: string) => {
    const slotIndex = slots.findIndex((s) => s.unitId === unitId);
    if (slotIndex !== -1) {
      updateBattleConfigSlot(slotIndex, null);
    }
  }, [slots, updateBattleConfigSlot]);

  // Start battle
  const handleStartBattle = useCallback(() => {
    if (!battleConfig || !configValidation.valid) return;
    onConfirm();
  }, [battleConfig, configValidation.valid, onConfirm]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Enter' && configValidation.valid) {
        e.preventDefault();
        handleStartBattle();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [configValidation.valid, handleStartBattle, onCancel]);

  // Error states
  if (!encounter) {
    return (
      <div className="prebattle-v2-overlay">
        <div className="prebattle-v2-error">
          <div>Error: Encounter not found</div>
          <button onClick={onCancel}>Close</button>
        </div>
      </div>
    );
  }

  if (!team || !battleConfig) {
    return (
      <div className="prebattle-v2-overlay">
        <div className="prebattle-v2-error">
          <div>Error: Team or battle config missing</div>
          <button onClick={onCancel}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="prebattle-v2-overlay">
      <div className="prebattle-v2-container">
        {/* Header */}
        <div className="prebattle-v2-header">
          <div className="prebattle-v2-title">Select Your Team</div>
          <div className="prebattle-v2-subtitle">
            {encounter.name} • {encounter.difficulty} • {encounter.reward.xp} XP
          </div>
        </div>

        {/* Main Content */}
        <div className="prebattle-v2-layout">
          {/* Left Panel: Available Units */}
          <div className="prebattle-v2-available">
            <div className="panel-title">Available Units</div>
            <div className="unit-roster">
              {availableUnits.map((unit) => (
                <div
                  key={unit.id}
                  className={`roster-unit ${selectedUnitIds.length >= 4 ? 'disabled' : ''}`}
                  onClick={() => handleUnitToggle(unit)}
                >
                  <div className="roster-unit-sprite">
                    <SimpleSprite
                      id={getPortraitSprite(unit.id)}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="roster-unit-info">
                    <div className="roster-unit-name">{unit.name}</div>
                    <div className="roster-unit-stats">
                      Lv.{unit.level} | SPD: <span className="unit-speed">{unit.baseStats.spd}</span>
                    </div>
                  </div>
                  <div className={`roster-unit-element element-${unit.element.toLowerCase()}`}>
                    {unit.element}
                  </div>
                </div>
              ))}
              {availableUnits.length === 0 && (
                <div className="roster-empty">All units selected!</div>
              )}
            </div>
          </div>

          {/* Right Panel: Selected Team */}
          <div className="prebattle-v2-selected">
            <div className="panel-title">Battle Party (Sorted by Speed)</div>
            <div className="team-slots">
              {[0, 1, 2, 3].map((slotIndex) => {
                const unit = selectedUnits[slotIndex];
                return (
                  <div
                    key={slotIndex}
                    className={`team-slot ${unit ? 'filled' : 'empty'}`}
                  >
                    <span className="slot-badge">{ORDINALS[slotIndex]}</span>
                    <span className="slot-order">{slotIndex + 1}</span>

                    {unit ? (
                      <>
                        <div className="slot-sprite">
                          <SimpleSprite
                            id={getPortraitSprite(unit.id)}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="slot-unit-info">
                          <div className="slot-unit-name">{unit.name}</div>
                          <div className="slot-unit-speed">SPD: {unit.baseStats.spd}</div>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveUnit(unit.id);
                          }}
                          aria-label={`Remove ${unit.name}`}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <span className="slot-empty-text">
                        {slotIndex === 0 ? 'Empty - Fastest' : slotIndex === 3 ? 'Empty - Slowest' : 'Empty'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Enemy Preview */}
            <div className="enemy-preview">
              <div className="panel-title">Enemies</div>
              <div className="enemy-portal-wrap">
                <EnemyPortalTile encounterId={encounterId} />
              </div>
            </div>

            {/* Start Battle Button */}
            <button
              className="start-battle-btn"
              onClick={handleStartBattle}
              disabled={!configValidation.valid}
            >
              {configValidation.valid
                ? `Start Battle (${selectedUnits.length} unit${selectedUnits.length !== 1 ? 's' : ''})`
                : configValidation.message ?? 'Select at least 1 unit'}
            </button>
          </div>
        </div>

        {/* Footer with Cancel */}
        <div className="prebattle-v2-footer">
          <button className="cancel-btn" onClick={onCancel}>
            ← Cancel
          </button>
          <div className="keyboard-hints">
            <span className="key">Enter</span> Start &nbsp;|&nbsp; <span className="key">Esc</span> Cancel
          </div>
        </div>
      </div>
    </div>
  );
}
