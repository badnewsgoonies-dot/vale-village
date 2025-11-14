/**
 * Battle Screen Container
 *
 * Container component that connects battle UI to Zustand state and core services.
 * Builds view models from BattleState and delegates to presentational components.
 */

import React from 'react';
import { useStore } from '../state/store';
import type {
  TurnOrderUnitVM,
  UnitVM,
  AbilityVM,
  DjinnVM,
  ActionSlotVM,
  ManaVM,
  BattleLogEntry,
  BattleStatus,
  BattleRewardsVM,
  CommandType,
} from '../components/battle/types';

// Import styles
import '../styles/battle-screen.css';

// TODO: Import components when created
// import { LayoutBattle } from '../components/battle/LayoutBattle';
// import { TurnOrderStrip } from '../components/battle/TurnOrderStrip';
// import { SidePanelPlayer } from '../components/battle/SidePanelPlayer';
// import { SidePanelEnemy } from '../components/battle/SidePanelEnemy';
// import { Battlefield } from '../components/battle/Battlefield';
// import { CommandPanel } from '../components/battle/CommandPanel';
// import { QueuePanel } from '../components/battle/QueuePanel';
// import { DjinnPanel } from '../components/battle/DjinnPanel';
// import { BattleLog } from '../components/battle/BattleLog';
// import { BattleOverlay } from '../components/battle/BattleOverlay';

/**
 * Battle Screen
 *
 * Top-level container for the queue-based battle UI.
 * Responsibilities:
 * - Read state from queueBattleSlice
 * - Build view models from core BattleState
 * - Handle user interactions by calling slice actions
 * - Delegate rendering to presentational components
 */
export function BattleScreen(): JSX.Element | null {
  // ========================================================================
  // State from Zustand
  // ========================================================================

  const battle = useStore((state) => state.battle);
  const events = useStore((state) => state.events);

  // Actions
  const queueUnitAction = useStore((state) => state.queueUnitAction);
  const clearUnitAction = useStore((state) => state.clearUnitAction);
  const queueDjinnActivation = useStore((state) => state.queueDjinnActivation);
  const unqueueDjinnActivation = useStore((state) => state.unqueueDjinnActivation);
  const executeQueuedRound = useStore((state) => state.executeQueuedRound);

  // TODO: Get team state for Djinn data
  // const team = useStore((state) => state.team);

  // ========================================================================
  // Local UI state
  // ========================================================================

  const [selectedCommand, setSelectedCommand] = React.useState<CommandType | null>(null);
  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(null);
  const [targetingMode, setTargetingMode] = React.useState(false);
  const [pendingAbilityId, setPendingAbilityId] = React.useState<string | null>(null);

  // ========================================================================
  // Early return if no battle
  // ========================================================================

  if (!battle) {
    return null;
  }

  // ========================================================================
  // Build View Models
  // ========================================================================

  // TODO: Build TurnOrderUnitVM[] from battle.turnOrder
  const turnOrderVM: TurnOrderUnitVM[] = [];
  /* Example:
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
  */

  // TODO: Build UnitVM[] for player units
  const playerUnitsVM: UnitVM[] = [];
  /* Example:
  const playerUnitsVM: UnitVM[] = battle.playerTeam.units.map((unit) => ({
    id: unit.id,
    name: unit.name,
    element: unit.element,
    hp: unit.currentHp,
    maxHp: unit.maxHp,
    statuses: [], // TODO: map status effects
    isSelected: selectedUnitId === unit.id,
    isKo: unit.currentHp <= 0,
    isEnemy: false,
  }));
  */

  // TODO: Build UnitVM[] for enemies (no HP shown)
  const enemyUnitsVM: UnitVM[] = [];
  /* Example:
  const enemyUnitsVM: UnitVM[] = battle.enemies.map((enemy) => ({
    id: enemy.id,
    name: enemy.name,
    element: enemy.element,
    hp: undefined,       // Hide enemy HP
    maxHp: undefined,
    statuses: [], // TODO: map status effects
    isSelected: selectedUnitId === enemy.id,
    isKo: enemy.currentHp <= 0,
    isEnemy: true,
  }));
  */

  // TODO: Build AbilityVM[] for current unit
  const coreAbilitiesVM: AbilityVM[] = [];
  const djinnAbilitiesVM: AbilityVM[] = [];
  /* Example:
  const currentUnit = battle.playerTeam.units[battle.currentQueueIndex];
  if (currentUnit) {
    // Get abilities from core
    const abilities = getAvailableAbilities(currentUnit, battle);

    coreAbilitiesVM = abilities
      .filter((a) => a.source === 'level' || a.source === 'equip')
      .map((a) => ({
        id: a.id,
        name: a.name,
        manaCost: a.manaCost,
        targeting: a.targeting,
        source: a.source,
        sourceLabel: a.sourceLabel,
        description: formatTargeting(a.targeting),
        isLocked: false,
        lockedReason: undefined,
      }));

    djinnAbilitiesVM = abilities
      .filter((a) => a.source === 'djinn')
      .map((a) => ({
        ...a,
        isLocked: isDjinnAbilityLocked(a, battle),
        lockedReason: getDjinnLockReason(a, battle),
      }));
  }
  */

  // TODO: Build DjinnVM[] from team.djinn + battle.djinnRecoveryTimers
  const djinnVM: DjinnVM[] = [];
  /* Example:
  const djinnVM: DjinnVM[] = team.djinn.map((djinn) => {
    const turnsRemaining = battle.djinnRecoveryTimers[djinn.id] ?? 0;
    const state = turnsRemaining > 0 ? 'recovery' :
                  battle.queuedDjinn.includes(djinn.id) ? 'standby' : 'set';

    return {
      id: djinn.id,
      name: djinn.name,
      element: djinn.element,
      state,
      turnsRemaining,
      summonDescription: djinn.summonEffect.description,
      isSelectable: state === 'set' && battle.phase === 'planning',
    };
  });
  */

  // TODO: Build ActionSlotVM[] from battle.queuedActions
  const queueSlotsVM: ActionSlotVM[] = [];
  /* Example:
  const queueSlotsVM: ActionSlotVM[] = battle.playerTeam.units.map((unit, idx) => {
    const action = battle.queuedActions[idx];
    const isKo = unit.currentHp <= 0;

    if (!action) {
      return {
        unitId: unit.id,
        unitName: unit.name,
        summary: isKo ? '[KO\'d]' : '[Empty]',
        manaCost: 0,
        isCurrent: idx === battle.currentQueueIndex,
        isEmpty: true,
        isKo,
      };
    }

    return {
      unitId: unit.id,
      unitName: unit.name,
      summary: formatActionSummary(action, battle),
      manaCost: action.manaCost,
      isCurrent: idx === battle.currentQueueIndex,
      isEmpty: false,
      isKo,
    };
  });
  */

  // TODO: Build ManaVM
  const manaVM: ManaVM = {
    current: battle.remainingMana,
    max: battle.maxMana,
    overBudget: battle.remainingMana < 0,
  };

  // TODO: Build BattleLogEntry[] from battle.log
  const logEntriesVM: BattleLogEntry[] = [];
  /* Example:
  const logEntriesVM: BattleLogEntry[] = battle.log.map((text, idx) => ({
    id: `log-${idx}`,
    text,
    timestamp: Date.now() - (battle.log.length - idx) * 100,
  }));
  */

  // TODO: Build BattleStatus and rewards
  const battleStatusVM: BattleStatus = battle.phase === 'victory' ? 'victory' :
                                       battle.phase === 'defeat' ? 'defeat' : 'ongoing';
  const rewardsVM: BattleRewardsVM | undefined = undefined;
  /* Example:
  if (battle.phase === 'victory') {
    rewardsVM = {
      xp: calculateXpReward(battle.enemies),
      gold: calculateGoldReward(battle.enemies),
    };
  }
  */

  // ========================================================================
  // Event Handlers
  // ========================================================================

  const handleSelectUnit = React.useCallback((unitId: string) => {
    // TODO: Implement unit selection logic
    // - If in targeting mode, apply target
    // - Otherwise, select unit for planning
    setSelectedUnitId(unitId);
  }, []);

  const handleSelectCommand = React.useCallback((command: CommandType) => {
    // TODO: Implement command selection logic
    setSelectedCommand(command);
  }, []);

  const handleSelectAbility = React.useCallback((abilityId: string) => {
    // TODO: Implement ability selection logic
    // - Enter targeting mode
    // - Store pending ability ID
    setPendingAbilityId(abilityId);
    setTargetingMode(true);
  }, []);

  const handleSelectTarget = React.useCallback((targetId: string) => {
    // TODO: Implement target selection logic
    // - Call queueUnitAction with pendingAbilityId and targetId
    // - Exit targeting mode
    if (!pendingAbilityId) return;

    // queueUnitAction(battle.currentQueueIndex, pendingAbilityId, [targetId]);

    setPendingAbilityId(null);
    setTargetingMode(false);
  }, [pendingAbilityId, battle.currentQueueIndex, queueUnitAction]);

  const handleSelectDjinn = React.useCallback((djinnId: string) => {
    // TODO: Implement Djinn selection logic
    // - Toggle queued state
    if (battle.queuedDjinn.includes(djinnId)) {
      unqueueDjinnActivation(djinnId);
    } else {
      queueDjinnActivation(djinnId);
    }
  }, [battle.queuedDjinn, queueDjinnActivation, unqueueDjinnActivation]);

  const handleClearQueueSlot = React.useCallback((unitId: string) => {
    // TODO: Find unit index from unitId
    // const unitIndex = battle.playerTeam.units.findIndex((u) => u.id === unitId);
    // if (unitIndex >= 0) clearUnitAction(unitIndex);
  }, [clearUnitAction, battle.playerTeam.units]);

  const handleSelectQueueSlot = React.useCallback((unitId: string) => {
    // TODO: Switch currentQueueIndex to selected unit
    // const unitIndex = battle.playerTeam.units.findIndex((u) => u.id === unitId);
    // if (unitIndex >= 0) {
    //   // Need a slice action to set currentQueueIndex
    // }
  }, [battle.playerTeam.units]);

  const handlePrevUnit = React.useCallback(() => {
    // TODO: Navigate to previous unit in queue
    // const prevIndex = (battle.currentQueueIndex - 1 + 4) % 4;
    // Need slice action to set currentQueueIndex
  }, [battle.currentQueueIndex]);

  const handleNextUnit = React.useCallback(() => {
    // TODO: Navigate to next unit in queue
    // const nextIndex = (battle.currentQueueIndex + 1) % 4;
    // Need slice action to set currentQueueIndex
  }, [battle.currentQueueIndex]);

  const handleExecuteRound = React.useCallback(() => {
    // TODO: Validate all actions queued
    // TODO: Validate mana budget
    executeQueuedRound();
  }, [executeQueuedRound]);

  const handleContinue = React.useCallback(() => {
    // TODO: Transition to rewards screen or overworld
  }, []);

  const handleReturnToVillage = React.useCallback(() => {
    // TODO: Transition to overworld
  }, []);

  const handleRetry = React.useCallback(() => {
    // TODO: Restart battle
  }, []);

  const handleReturnToTitle = React.useCallback(() => {
    // TODO: Return to title screen
  }, []);

  // ========================================================================
  // Render
  // ========================================================================

  // TODO: Replace with actual components once created
  return (
    <div className="game-root">
      <div className="battle-screen">
        <div className="turn-order-strip">
          {/* TODO: <TurnOrderStrip units={turnOrderVM} /> */}
          <div className="turn-order-unit turn-order-unit--player">P1</div>
          <div className="turn-order-unit turn-order-unit--enemy turn-order-unit--current">E1</div>
          <div className="turn-order-unit turn-order-unit--player">P2</div>
        </div>

        <div className="top-row">
          <div className="player-side">
            {/* TODO: <SidePanelPlayer units={playerUnitsVM} onSelectUnit={handleSelectUnit} /> */}
            <div className="side-title">Player Party</div>
            <div className="unit-list">
              {battle.playerTeam.units.map((unit) => (
                <div key={unit.id} className="unit-card">
                  <div className="unit-sprite">{unit.name.slice(0, 3)}</div>
                  <div className="unit-header">
                    <div className="unit-name">{unit.name}</div>
                    <div className="unit-element">{unit.element}</div>
                  </div>
                  <div className="unit-hp-row">
                    <div className="hp-bar">
                      <div
                        className="hp-fill"
                        style={{ width: `${(unit.currentHp / unit.maxHp) * 100}%` }}
                      />
                    </div>
                    <div className="hp-text">{unit.currentHp} / {unit.maxHp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="enemy-side">
            {/* TODO: <SidePanelEnemy units={enemyUnitsVM} onSelectUnit={handleSelectUnit} /> */}
            <div className="side-title">Enemies</div>
            <div className="unit-list">
              {battle.enemies.map((enemy) => (
                <div key={enemy.id} className="unit-card">
                  <div className="unit-sprite">{enemy.name.slice(0, 3)}</div>
                  <div className="unit-header">
                    <div className="unit-name">{enemy.name}</div>
                    <div className="unit-element">{enemy.element}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="middle-row">
          <div className="phase-indicator">
            {battle.phase === 'planning' ? 'Planning Phase – Queue Actions' : 'Executing...'}
          </div>
          <div className="battlefield">
            {/* TODO: <Battlefield
              playerUnits={playerUnitsVM}
              enemyUnits={enemyUnitsVM}
              targetingMode={targetingMode}
              onSelectTarget={handleSelectTarget}
            /> */}
            <div className="battlefield-inner">
              <div className="battlefield-column">
                {battle.playerTeam.units.map((unit) => (
                  <div key={unit.id} className="battlefield-unit">{unit.name.slice(0, 1)}</div>
                ))}
              </div>
              <div className="battlefield-column">
                {battle.enemies.map((enemy) => (
                  <div key={enemy.id} className="battlefield-unit">{enemy.name.slice(0, 1)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-row">
          <div className="command-bar">
            {/* TODO: <CommandPanel
              currentUnit={currentUnitVM}
              selectedCommand={selectedCommand}
              coreAbilities={coreAbilitiesVM}
              djinnAbilities={djinnAbilitiesVM}
              onCommandSelect={handleSelectCommand}
              onSelectAbility={handleSelectAbility}
            /> */}
            <div className="command-header">Battle Commands (TODO)</div>
          </div>

          <div className="queue-mana-panel">
            {/* TODO: <QueuePanel
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
            /> */}
            <div className="queue-header">
              <span>Action Queue – Round {battle.roundNumber}</span>
            </div>
            <div className="mana-row">
              <div className="mana-display">Mana: {battle.remainingMana} / {battle.maxMana}</div>
            </div>
          </div>

          <div className="right-bottom-panel">
            {/* TODO: <DjinnPanel djinns={djinnVM} onSelectDjinn={handleSelectDjinn} /> */}
            {/* TODO: <BattleLog entries={logEntriesVM} /> */}
            <div>Djinn & Log (TODO)</div>
          </div>
        </div>

        {/* TODO: <BattleOverlay
          status={battleStatusVM}
          rewards={rewardsVM}
          onContinue={handleContinue}
          onReturnToVillage={handleReturnToVillage}
          onRetry={handleRetry}
          onReturnToTitle={handleReturnToTitle}
        /> */}
      </div>
    </div>
  );
}
