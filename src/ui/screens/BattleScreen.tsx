/**
 * Battle Screen Container
 *
 * Container component that connects battle UI to Zustand state and core services.
 * Builds view models from BattleState and delegates to presentational components.
 *
 * Phase 1: Read-only state display (no action handlers yet)
 */

import { useState, useCallback } from 'react';
import { useStore } from '../state/store';
import type { StatusEffect } from '../../core/models/types';
import type { Unit } from '../../core/models/Unit';
import { calculateMaxHp } from '../../core/models/Unit';
import type {
  TurnOrderUnitVM,
  UnitVM,
  StatusEffectVM,
  AbilityVM,
  DjinnVM,
  ActionSlotVM,
  ManaVM,
  BattleLogEntry,
  BattleStatus,
  BattleRewardsVM,
  BattlePhase,
  CommandType,
} from '../components/battle/types';

// Import styles
import '../styles/battle-screen.css';

// Import components
import { TurnOrderStrip } from '../components/battle/TurnOrderStrip';
import { SidePanelPlayer } from '../components/battle/SidePanelPlayer';
import { SidePanelEnemy } from '../components/battle/SidePanelEnemy';
import { Battlefield } from '../components/battle/Battlefield';
import { CommandPanel } from '../components/battle/CommandPanel';
import { QueuePanel } from '../components/battle/QueuePanel';
import { DjinnPanel } from '../components/battle/DjinnPanel';
import { BattleLog } from '../components/battle/BattleLog';
import { BattleOverlay } from '../components/battle/BattleOverlay';

// ============================================================================
// Helper Functions: Status Effect Mapping
// ============================================================================

/**
 * Map core StatusEffect to UI-friendly icon and title
 */
function mapStatusEffectToVM(status: StatusEffect): StatusEffectVM {
  switch (status.type) {
    case 'buff':
      return {
        id: `buff-${status.stat}`,
        icon: '⬆️',
        title: `${status.stat.toUpperCase()} +${Math.abs(status.modifier)} (${status.duration} turns)`,
      };
    case 'debuff':
      return {
        id: `debuff-${status.stat}`,
        icon: '⬇️',
        title: `${status.stat.toUpperCase()} ${status.modifier} (${status.duration} turns)`,
      };
    case 'poison':
      return {
        id: 'poison',
        icon: '☠',
        title: `Poisoned: ${status.damagePerTurn} damage/turn (${status.duration} turns)`,
      };
    case 'burn':
      return {
        id: 'burn',
        icon: '🔥',
        title: `Burned: ${status.damagePerTurn} damage/turn (${status.duration} turns)`,
      };
    case 'freeze':
      return {
        id: 'freeze',
        icon: '❄️',
        title: `Frozen (${status.duration} turns)`,
      };
    case 'paralyze':
      return {
        id: 'paralyze',
        icon: '⚡',
        title: `Paralyzed (${status.duration} turns)`,
      };
    case 'stun':
      return {
        id: 'stun',
        icon: '💫',
        title: `Stunned (${status.duration} turns)`,
      };
    case 'healOverTime':
      return {
        id: 'healOverTime',
        icon: '💚',
        title: `Regen: +${status.healPerTurn} HP/turn (${status.duration} turns)`,
      };
    case 'elementalResistance':
      return {
        id: `resist-${status.element}`,
        icon: '🛡',
        title: `${status.element} ${status.modifier > 0 ? 'Resist' : 'Weakness'} (${status.duration} turns)`,
      };
    case 'damageReduction':
      return {
        id: 'damage-reduction',
        icon: '🛡',
        title: `Damage -${Math.round(status.percent * 100)}% (${status.duration} turns)`,
      };
    case 'shield':
      return {
        id: 'shield',
        icon: '🛡',
        title: `Shield: ${status.remainingCharges} charges (${status.duration} turns)`,
      };
    case 'invulnerable':
      return {
        id: 'invulnerable',
        icon: '✨',
        title: `Invulnerable (${status.duration} turns)`,
      };
    case 'immunity':
      return {
        id: 'immunity',
        icon: '🔰',
        title: status.all ? `Status Immunity (${status.duration} turns)` : `Partial Immunity (${status.duration} turns)`,
      };
    case 'autoRevive':
      return {
        id: 'auto-revive',
        icon: '❤️',
        title: `Auto-Revive: ${status.hpPercent * 100}% HP (${status.usesRemaining} uses)`,
      };
    default:
      return { id: 'unknown', icon: '?', title: 'Unknown Status' };
  }
}

/**
 * Build UnitVM from core Unit
 */
function buildUnitVM(
  unit: Unit,
  isEnemy: boolean,
  isSelected: boolean
): UnitVM {
  const maxHp = calculateMaxHp(unit);
  const isKo = unit.currentHp <= 0;

  return {
    id: unit.id,
    name: unit.name,
    element: unit.element,
    hp: isEnemy ? undefined : unit.currentHp,
    maxHp: isEnemy ? undefined : maxHp,
    statuses: unit.statusEffects.map(mapStatusEffectToVM),
    isSelected,
    isKo,
    isEnemy,
  };
}

/**
 * Battle Screen
 *
 * Top-level container for the queue-based battle UI.
 * Phase 1: Displays read-only battle state (no actions yet)
 */
export function BattleScreen(): JSX.Element | null {
  // ========================================================================
  // State from Zustand
  // ========================================================================

  const battle = useStore((state) => state.battle);
  const team = useStore((state) => state.team);

  // Actions (for Phase 2+)

  // ========================================================================
  // Local UI state (Phase 1: placeholders)
  // ========================================================================

  const [selectedCommand, setSelectedCommand] = useState<CommandType | null>(null);
  const [targetingMode, setTargetingMode] = useState(false);
  const [pendingAbilityId, setPendingAbilityId] = useState<string | null>(null);

  // ========================================================================
  // Early return if no battle
  // ========================================================================

  if (!battle) {
    return null;
  }

  // ========================================================================
  // Build View Models
  // ========================================================================

  // Phase and Status
  const phase: BattlePhase = battle.phase as BattlePhase;
  const battleStatusVM: BattleStatus =
    battle.phase === 'victory' ? 'victory' :
    battle.phase === 'defeat' ? 'defeat' : 'ongoing';

  // Rewards (Phase 1: undefined, will be wired in Phase 2)
  const rewardsVM: BattleRewardsVM | undefined = undefined;

  // Turn Order
  const turnOrderVM: TurnOrderUnitVM[] = battle.turnOrder.map((unitId) => {
    const unitIndex = battle.unitById.get(unitId);
    if (!unitIndex) return null;

    return {
      id: unitId,
      name: unitIndex.unit.name,
      side: unitIndex.isPlayer ? 'player' : 'enemy',
      isCurrent: unitId === battle.turnOrder[battle.currentActorIndex],
    };
  }).filter((u): u is TurnOrderUnitVM => u !== null);

  // Player Units
  const currentQueueUnitId = battle.playerTeam.units[battle.currentQueueIndex]?.id;
  const playerUnitsVM: UnitVM[] = battle.playerTeam.units.map((unit) =>
    buildUnitVM(unit, false, unit.id === currentQueueUnitId)
  );

  // Enemy Units
  const enemyUnitsVM: UnitVM[] = battle.enemies.map((enemy) =>
    buildUnitVM(enemy, true, false)
  );

  // Current Unit for CommandPanel (Phase 1: show current queue unit)
  const currentUnit = battle.playerTeam.units[battle.currentQueueIndex];
  const currentUnitVM: UnitVM | null = currentUnit
    ? buildUnitVM(currentUnit, false, true)
    : null;

  // Abilities (Phase 1: empty, will wire in Phase 2)
  const coreAbilitiesVM: AbilityVM[] = [];
  const djinnAbilitiesVM: AbilityVM[] = [];

  // TODO Phase 2: Build abilities using core services
  // const abilities = getAvailableAbilities(currentUnit, battle);
  // coreAbilitiesVM = abilities.filter(...);
  // djinnAbilitiesVM = abilities.filter(...);

  // Djinn (Phase 1: basic wiring to team Djinn)
  const djinnVM: DjinnVM[] = [];
  if (team?.equippedDjinn) {
    for (const djinnId of team.equippedDjinn) {
      const tracker = team.djinnTrackers[djinnId];
      if (!tracker) continue;

      // Map state to lowercase for VM
      const state = tracker.state.toLowerCase() as 'set' | 'standby' | 'recovery';
      const turnsRemaining = battle.djinnRecoveryTimers[djinnId] ?? 0;

      djinnVM.push({
        id: djinnId,
        name: djinnId, // TODO Phase 2: Look up actual Djinn name from definitions
        element: 'Venus', // TODO Phase 2: Look up actual element
        state,
        turnsRemaining,
        summonDescription: 'TODO: Djinn effect description', // TODO Phase 2
        isSelectable: state === 'set' && battle.phase === 'planning',
      });
    }
  }

  // Action Queue Slots
  const queueSlotsVM: ActionSlotVM[] = battle.playerTeam.units.map((unit, idx) => {
    const action = battle.queuedActions[idx];
    const isKo = unit.currentHp <= 0;
    const isCurrent = idx === battle.currentQueueIndex;

    if (!action) {
      return {
        unitId: unit.id,
        unitName: unit.name,
        summary: isKo ? '[KO\'d]' : '[Empty]',
        manaCost: 0,
        isCurrent,
        isEmpty: true,
        isKo,
      };
    }

    // TODO Phase 2: Format action summary properly
    const targetUnit = battle.unitById.get(action.targetIds[0] ?? '');
    const targetName = targetUnit?.unit.name ?? 'Unknown';
    const abilityName = action.abilityId ?? 'Attack';

    return {
      unitId: unit.id,
      unitName: unit.name,
      summary: `${abilityName} → ${targetName}`,
      manaCost: action.manaCost,
      isCurrent,
      isEmpty: false,
      isKo,
    };
  });

  // Mana
  const manaVM: ManaVM = {
    current: battle.remainingMana,
    max: battle.maxMana,
    overBudget: battle.remainingMana < 0,
  };

  // Battle Log
  const logEntriesVM: BattleLogEntry[] = battle.log.map((text, idx) => ({
    id: `log-${idx}`,
    text,
    timestamp: Date.now() - (battle.log.length - idx) * 100,
  }));

  // Can Execute (Phase 1: simple check)
  const canExecute = battle.phase === 'planning' &&
                     battle.queuedActions.filter(a => a !== null).length >=
                     battle.playerTeam.units.filter(u => u.currentHp > 0).length;

  // ========================================================================
  // Event Handlers (Phase 1: Stubs with TODOs)
  // ========================================================================

  const handleSelectUnit = useCallback((unitId: string) => {
    // TODO Phase 2: Implement unit selection logic
    // - If in targeting mode, apply target
    // - Otherwise, select unit for planning
    // TODO: Add proper logging
    // console.log('[TODO] Selected unit:', unitId);
  }, []);

  const handleSelectCommand = useCallback((command: CommandType) => {
    // TODO Phase 2: Implement command selection logic
    setSelectedCommand(command);
    // TODO: Add proper logging
    // console.log('[TODO] Selected command:', command);
  }, []);

  const handleSelectAbility = useCallback((abilityId: string) => {
    // TODO Phase 2: Implement ability selection logic
    // - Enter targeting mode
    // - Store pending ability ID
    setPendingAbilityId(abilityId);
    setTargetingMode(true);
    // TODO: Add proper logging
    // console.log('[TODO] Selected ability:', abilityId);
  }, []);

  const handleSelectTarget = useCallback((targetId: string) => {
    // TODO Phase 2: Implement target selection logic
    // - Call queueUnitAction with pendingAbilityId and targetId
    // - Exit targeting mode
    // TODO: Add proper logging
    // console.log('[TODO] Selected target:', targetId, 'for ability:', pendingAbilityId);

    setPendingAbilityId(null);
    setTargetingMode(false);
  }, [pendingAbilityId]);

  const handleSelectDjinn = useCallback((djinnId: string) => {
    // TODO Phase 2: Implement Djinn selection logic
    // TODO: Add proper logging
    // console.log('[TODO] Selected Djinn:', djinnId);
  }, []);

  const handleClearQueueSlot = useCallback((unitId: string) => {
    // TODO Phase 2: Find unit index and call clearUnitAction
    const unitIndex = battle.playerTeam.units.findIndex((u) => u.id === unitId);
    console.log('[TODO] Clear queue slot for unit:', unitId, 'index:', unitIndex);
  }, [battle.playerTeam.units]);

  const handleSelectQueueSlot = useCallback((unitId: string) => {
    // TODO Phase 2: Switch currentQueueIndex to selected unit
    console.log('[TODO] Select queue slot:', unitId);
  }, []);

  const handlePrevUnit = useCallback(() => {
    // TODO Phase 2: Navigate to previous unit in queue
    console.log('[TODO] Navigate to previous unit');
  }, []);

  const handleNextUnit = useCallback(() => {
    // TODO Phase 2: Navigate to next unit in queue
    console.log('[TODO] Navigate to next unit');
  }, []);

  const handleExecuteRound = useCallback(() => {
    // TODO Phase 2: Validate and execute round
    console.log('[TODO] Execute round - button clicked');
  }, []);

  const handleContinue = useCallback(() => {
    // TODO Phase 2: Transition to rewards screen
    console.log('[TODO] Continue to rewards');
  }, []);

  const handleReturnToVillage = useCallback(() => {
    // TODO Phase 2: Transition to overworld
    console.log('[TODO] Return to village');
  }, []);

  const handleRetry = useCallback(() => {
    // TODO Phase 2: Restart battle
    console.log('[TODO] Retry battle');
  }, []);

  const handleReturnToTitle = useCallback(() => {
    // TODO Phase 2: Return to title screen
    console.log('[TODO] Return to title');
  }, []);

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <div className="game-root">
      <div className="battle-screen">
        {/* Turn Order Strip */}
        <TurnOrderStrip units={turnOrderVM} />

        {/* Top Row: Player + Enemy Sides */}
        <div className="top-row">
          <SidePanelPlayer
            units={playerUnitsVM}
            onSelectUnit={handleSelectUnit}
          />
          <SidePanelEnemy
            units={enemyUnitsVM}
            onSelectUnit={handleSelectUnit}
          />
        </div>

        {/* Middle Row: Phase Indicator + Battlefield */}
        <div className="middle-row">
          <div className="phase-indicator">
            {phase === 'planning' && 'Planning Phase – Queue Actions'}
            {phase === 'executing' && 'Executing Round...'}
            {phase === 'victory' && 'Victory!'}
            {phase === 'defeat' && 'Defeat'}
          </div>
          <Battlefield
            playerUnits={playerUnitsVM}
            enemyUnits={enemyUnitsVM}
            targetingMode={targetingMode}
            onSelectTarget={handleSelectTarget}
          />
        </div>

        {/* Bottom Row: Commands, Queue, Djinn/Log */}
        <div className="bottom-row">
          <CommandPanel
            currentUnit={currentUnitVM}
            selectedCommand={selectedCommand}
            coreAbilities={coreAbilitiesVM}
            djinnAbilities={djinnAbilitiesVM}
            onCommandSelect={handleSelectCommand}
            onSelectAbility={handleSelectAbility}
          />

          <QueuePanel
            roundNumber={battle.roundNumber}
            queueSlots={queueSlotsVM}
            mana={manaVM}
            canExecute={canExecute}
            targetingMode={targetingMode}
            onSelectSlot={handleSelectQueueSlot}
            onClearSlot={handleClearQueueSlot}
            onPrevUnit={handlePrevUnit}
            onNextUnit={handleNextUnit}
            onExecuteRound={handleExecuteRound}
          />

          <div className="right-bottom-panel">
            <DjinnPanel
              djinns={djinnVM}
              onSelectDjinn={handleSelectDjinn}
            />
            <BattleLog entries={logEntriesVM} />
          </div>
        </div>

        {/* Battle Overlay (Victory/Defeat) */}
        <BattleOverlay
          status={battleStatusVM}
          rewards={rewardsVM}
          onContinue={handleContinue}
          onReturnToVillage={handleReturnToVillage}
          onRetry={handleRetry}
          onReturnToTitle={handleReturnToTitle}
        />
      </div>
    </div>
  );
}
