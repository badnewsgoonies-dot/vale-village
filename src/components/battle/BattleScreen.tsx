import React, { useState, useEffect } from 'react';
import { useGame } from '@/context';
import type { Unit } from '@/types/Unit';
import type { Ability } from '@/types/Ability';
import type { DjinnState } from '@/types/Djinn';
import { StatusBar } from './StatusBar';
import { ManaCircles } from './ManaCircles';
import { DjinnBar } from './DjinnBar';
import { SummonAnimation } from './SummonAnimation';
import { AbilityAnimation } from './AbilityAnimation';
import { UnitRow } from './UnitRow';
import { CommandMenu } from './CommandMenu';
import { AbilityMenu } from './AbilityMenu';
import { CombatLog } from './CombatLog';
import { executeAbility, calculateTurnOrder } from '@/types/Battle';
import './BattleScreen.css';

type BattlePhase = 'planning' | 'executing' | 'summoning' | 'victory' | 'defeat';

interface QueuedAction {
  unitId: string;
  abilityId: string | null; // null = basic attack
  targetId: string;
  manaCost: number;
}

export const QueueBattleScreen: React.FC = () => {
  const { state, actions } = useGame();
  const battle = state.currentBattle;

  if (!battle) {
    return (
      <div className="battle-screen error">
        <div className="error-message">No battle active</div>
      </div>
    );
  }

  // Calculate mana pool
  const totalManaPool = battle.playerTeam.units.reduce(
    (sum, unit) => sum + unit.manaContribution,
    0
  );

  // State
  const [phase, setPhase] = useState<BattlePhase>('planning');
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0); // Which unit we're selecting for (0-3)
  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);
  const [remainingMana, setRemainingMana] = useState(totalManaPool);
  const [combatLog, setCombatLog] = useState<string[]>(['Battle Start!']);

  // Djinn state
  const [selectedDjinn, setSelectedDjinn] = useState<string[]>([]); // Djinn IDs selected for summon
  const [djinnStates, setDjinnStates] = useState<Map<string, DjinnState>>(
    new Map(battle.playerTeam.equippedDjinn.map(d => [d.id, 'Set']))
  );
  const [djinnRecoveryTimers, setDjinnRecoveryTimers] = useState<Map<string, number>>(new Map());

  // UI sub-states for planning
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

  // Animation state
  const [currentAbilityAnimation, setCurrentAbilityAnimation] = useState<Ability | null>(null);

  const currentUnit = battle.playerTeam.units[currentQueueIndex];
  const isQueueComplete = queuedActions.length === 4;

  // Handle Djinn selection toggle
  const handleDjinnToggle = (djinnId: string) => {
    setSelectedDjinn(prev => {
      if (prev.includes(djinnId)) {
        return prev.filter(id => id !== djinnId);
      } else {
        return [...prev, djinnId];
      }
    });
  };

  // Handle command selection
  const handleCommandSelect = (command: 'attack' | 'psynergy' | 'djinn' | 'defend' | 'flee') => {
    setSelectedCommand(command);

    if (command === 'attack') {
      // Basic attack - go to target selection
      // (will handle in next step)
    } else if (command === 'psynergy') {
      // Show ability menu
    } else if (command === 'defend') {
      // Queue defend action
      queueDefend();
    }
  };

  // Handle ability selection
  const handleAbilitySelect = (ability: Ability) => {
    setSelectedAbility(ability);
    // Go to target selection
  };

  // Handle target selection
  const handleTargetSelect = (target: Unit) => {
    if (!currentUnit) return;

    let ability: Ability;
    let manaCost = 0;

    if (selectedCommand === 'attack') {
      // Basic attack (0 mana)
      const abilities = currentUnit.getAvailableAbilities({
        equippedDjinn: battle.playerTeam.equippedDjinn,
        djinnStates
      });
      ability = abilities.find(a => a.type === 'physical') || abilities[0];
      manaCost = 0;
    } else if (selectedAbility) {
      ability = selectedAbility;
      manaCost = ability.manaCost;
    } else {
      return;
    }

    // Check mana budget
    if (manaCost > remainingMana) {
      setCombatLog(prev => [...prev, `Not enough mana! Need ${manaCost}, have ${remainingMana}`]);
      return;
    }

    // Queue the action
    const action: QueuedAction = {
      unitId: currentUnit.id,
      abilityId: ability.id,
      targetId: target.id,
      manaCost,
    };

    setQueuedActions(prev => [...prev, action]);
    setRemainingMana(prev => prev - manaCost);

    // Advance to next unit or finish queue
    setSelectedCommand(null);
    setSelectedAbility(null);

    if (currentQueueIndex < 3) {
      setCurrentQueueIndex(prev => prev + 1);
    }
  };

  // Queue defend action
  const queueDefend = () => {
    if (!currentUnit) return;

    const action: QueuedAction = {
      unitId: currentUnit.id,
      abilityId: null,
      targetId: currentUnit.id, // Defend self
      manaCost: 0,
    };

    setQueuedActions(prev => [...prev, action]);

    // Advance to next unit or finish queue
    setSelectedCommand(null);

    if (currentQueueIndex < 3) {
      setCurrentQueueIndex(prev => prev + 1);
    }
  };

  // Go back to previous unit
  const handleBack = () => {
    if (currentQueueIndex > 0) {
      // Remove last queued action
      const lastAction = queuedActions[queuedActions.length - 1];
      if (lastAction) {
        setRemainingMana(prev => prev + lastAction.manaCost);
        setQueuedActions(prev => prev.slice(0, -1));
      }
      setCurrentQueueIndex(prev => prev - 1);
      setSelectedCommand(null);
      setSelectedAbility(null);
    }
  };

  // Execute summon
  const executeSummon = async () => {
    if (selectedDjinn.length === 0) return;

    const djinnCount = selectedDjinn.length;
    const firstDjinn = battle.playerTeam.equippedDjinn.find(d => d.id === selectedDjinn[0]);
    if (!firstDjinn) return;

    // Show summon animation
    setPhase('summoning');

    // Wait for animation to complete (handled by SummonAnimation component)
    await new Promise<void>(resolve => {
      setTimeout(() => {
        // Calculate summon damage
        const baseDamage = djinnCount === 3 ? 300 : djinnCount === 2 ? 150 : 80;

        // Apply damage to all enemies
        battle.enemies.forEach(enemy => {
          if (!enemy.isKO) {
            enemy.takeDamage(baseDamage);
          }
        });

        const summonName = djinnCount === 3 ? 'Mega Summon' : djinnCount === 2 ? 'Medium Summon' : 'Djinn Attack';
        setCombatLog(prev => [...prev, `${summonName}! All enemies take ${baseDamage} damage!`]);

        // Set all used Djinn to Standby
        const newStates = new Map(djinnStates);
        selectedDjinn.forEach(id => newStates.set(id, 'Standby'));
        setDjinnStates(newStates);

        // Set recovery timers - staggered so they recover one per turn
        const newTimers = new Map(djinnRecoveryTimers);
        selectedDjinn.forEach((id, index) => {
          newTimers.set(id, index + 1); // First recovers in 1 turn, second in 2, third in 3
        });
        setDjinnRecoveryTimers(newTimers);

        resolve();
      }, djinnCount === 3 ? 3000 : djinnCount === 2 ? 2500 : 2000);
    });

    setPhase('executing');
  };

  // Execute all queued actions
  const executeQueue = async () => {
    if (!isQueueComplete) return;

    // Execute summon first (if any)
    await executeSummon();

    // Check victory after summon (in case summon killed all enemies)
    const allEnemiesDownAfterSummon = battle.enemies.every(e => e.isKO);
    if (allEnemiesDownAfterSummon) {
      setPhase('victory');
      setCombatLog(prev => [...prev, '>>> VICTORY! <<<']);
      setTimeout(() => {
        actions.navigate({
          type: 'POST_BATTLE_CUTSCENE',
          npcId: battle.npcId,
          victory: true,
        });
      }, 2000);
      return;
    }

    setPhase('executing');

    // Sort actions by SPD
    const actionsWithUnits = queuedActions.map(action => {
      const unit = battle.playerTeam.units.find(u => u.id === action.unitId)!;
      return { action, unit };
    });

    actionsWithUnits.sort((a, b) => {
      const statsA = a.unit.calculateStats();
      const statsB = b.unit.calculateStats();
      return statsB.spd - statsA.spd; // Fastest first
    });

    // Execute player actions
    for (const { action, unit } of actionsWithUnits) {
      const target = [...battle.playerTeam.units, ...battle.enemies].find(u => u.id === action.targetId);
      if (!target || target.isKO) continue;

      const abilities = unit.getAvailableAbilities({
        equippedDjinn: battle.playerTeam.equippedDjinn,
        djinnStates
      });
      const ability = action.abilityId
        ? abilities.find(a => a.id === action.abilityId)
        : abilities.find(a => a.type === 'physical');

      if (!ability) {
        console.error('[BATTLE] Ability not found for unit:', { unitId: unit.id, abilityId: action.abilityId, availableAbilities: abilities.map(a => a.id) });
        setCombatLog(prev => [...prev, `${unit.name} couldn't use the ability!`]);
        continue;
      }

      // Show ability animation (if it's a psynergy)
      if (ability.type === 'psynergy') {
        setCurrentAbilityAnimation(ability);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for animation
        setCurrentAbilityAnimation(null);
      }

      const result = executeAbility(unit, ability, [target]);
      setCombatLog(prev => [...prev, result.message]);

      await new Promise(resolve => setTimeout(resolve, ability.type === 'psynergy' ? 300 : 600));
    }

    // Check victory
    const allEnemiesDown = battle.enemies.every(e => e.isKO);
    console.log('[BATTLE] Victory check:', { allEnemiesDown, enemyStatus: battle.enemies.map(e => ({ id: e.id, hp: e.stats.hp, isKO: e.isKO })) });
    if (allEnemiesDown) {
      console.log('[BATTLE] Victory detected! Transitioning to post-battle cutscene...');
      setPhase('victory');
      setCombatLog(prev => [...prev, '>>> VICTORY! <<<']);
      setTimeout(() => {
        console.log('[BATTLE] Navigating to POST_BATTLE_CUTSCENE', { npcId: battle.npcId });
        actions.navigate({
          type: 'POST_BATTLE_CUTSCENE',
          npcId: battle.npcId,
          victory: true,
        });
      }, 2000);
      return;
    }

    // Execute enemy actions
    await executeEnemyTurn();

    // Check defeat
    const allPlayersDown = battle.playerTeam.units.every(u => u.isKO);
    if (allPlayersDown) {
      setPhase('defeat');
      setCombatLog(prev => [...prev, '>>> DEFEAT... <<<']);
      setTimeout(() => {
        actions.navigate({
          type: 'POST_BATTLE_CUTSCENE',
          npcId: battle.npcId,
          victory: false,
        });
      }, 2000);
      return;
    }

    // Djinn recovery - decrement timers
    const newTimers = new Map(djinnRecoveryTimers);
    const newStates = new Map(djinnStates);

    djinnRecoveryTimers.forEach((timer, djinnId) => {
      const newTimer = timer - 1;
      if (newTimer <= 0) {
        // Djinn recovered!
        newStates.set(djinnId, 'Set');
        newTimers.delete(djinnId);
        setCombatLog(prev => [...prev, `${djinnId} recovered!`]);
      } else {
        newTimers.set(djinnId, newTimer);
      }
    });

    setDjinnRecoveryTimers(newTimers);
    setDjinnStates(newStates);

    // Return to planning - refresh mana
    setPhase('planning');
    setCurrentQueueIndex(0);
    setQueuedActions([]);
    setRemainingMana(totalManaPool);
    setSelectedCommand(null);
    setSelectedAbility(null);
    setSelectedDjinn([]); // Clear selected Djinn
  };

  // Enemy turn (simple AI)
  const executeEnemyTurn = async () => {
    const aliveEnemies = battle.enemies.filter(e => !e.isKO);

    for (const enemy of aliveEnemies) {
      const targets = battle.playerTeam.units.filter(u => !u.isKO);
      if (targets.length === 0) break;

      const target = targets[Math.floor(Math.random() * targets.length)];
      const ability = enemy.getAvailableAbilities()[0];

      if (ability) {
        // Show ability animation (if it's a psynergy)
        if (ability.type === 'psynergy') {
          setCurrentAbilityAnimation(ability);
          await new Promise(resolve => setTimeout(resolve, 1000));
          setCurrentAbilityAnimation(null);
        }

        const result = executeAbility(enemy, ability, [target]);
        setCombatLog(prev => [...prev, result.message]);
        await new Promise(resolve => setTimeout(resolve, ability.type === 'psynergy' ? 300 : 600));
      }
    }
  };

  return (
    <div className="battle-screen" data-area={state.currentLocation || 'vale_village'}>
      {/* Summon Animation Overlay */}
      {phase === 'summoning' && selectedDjinn.length > 0 && (
        <SummonAnimation
          djinnCount={selectedDjinn.length}
          element={battle.playerTeam.equippedDjinn.find(d => d.id === selectedDjinn[0])!.element}
          onComplete={() => setPhase('executing')}
        />
      )}

      {/* Ability Animation Overlay */}
      {currentAbilityAnimation && (
        <AbilityAnimation
          ability={currentAbilityAnimation}
          onComplete={() => setCurrentAbilityAnimation(null)}
        />
      )}

      {/* Top Status Bar */}
      <StatusBar units={battle.playerTeam.units} />

      {/* Mana Circles */}
      <ManaCircles total={totalManaPool} remaining={remainingMana} />

      {/* Djinn Bar */}
      <DjinnBar
        equippedDjinn={battle.playerTeam.equippedDjinn}
        djinnStates={djinnStates}
        selectedDjinn={selectedDjinn}
        djinnRecoveryTimers={djinnRecoveryTimers}
        onDjinnToggle={handleDjinnToggle}
        disabled={phase !== 'planning'}
      />

      {/* Enemy Row - NO HP BARS */}
      <div className="enemy-area">
        <UnitRow
          units={battle.enemies}
          currentActor={null}
          onUnitClick={phase === 'planning' && selectedCommand ? handleTargetSelect : undefined}
          isEnemy={true}
        />
      </div>

      {/* Party Row */}
      <div className="party-area">
        <UnitRow
          units={battle.playerTeam.units}
          currentActor={phase === 'planning' ? currentUnit : null}
          onUnitClick={phase === 'planning' && selectedCommand ? handleTargetSelect : undefined}
          isEnemy={false}
        />
      </div>

      {/* Bottom Panel */}
      <div className="bottom-panel">
        {phase === 'planning' && (
          <>
            {/* Action Queue */}
            <div className="action-queue">
              <h3>Action Queue</h3>
              {battle.playerTeam.units.map((unit, idx) => {
                const action = queuedActions[idx];
                return (
                  <div key={unit.id} className="queue-slot">
                    {idx + 1}. {unit.name}: {action ? '✓' : '????'}
                  </div>
                );
              })}
              <button
                onClick={executeQueue}
                disabled={!isQueueComplete}
                className={`execute-button ${isQueueComplete ? 'ready' : 'disabled'}`}
              >
                EXECUTE
              </button>
            </div>

            {/* Command Panel - hide when queue is complete */}
            {!isQueueComplete && (
              <div className="command-panel">
                <h3>Current: {currentUnit?.name}</h3>
                <p>Remaining Mana: {remainingMana}/{totalManaPool}</p>

                {!selectedCommand && (
                  <CommandMenu
                    unit={currentUnit}
                    onSelectCommand={handleCommandSelect}
                    isBossBattle={battle.isBossBattle}
                  />
                )}

                {selectedCommand === 'psynergy' && (
                  <AbilityMenu
                    unit={currentUnit}
                    remainingMana={remainingMana}
                    onSelectAbility={handleAbilitySelect}
                    onBack={() => setSelectedCommand(null)}
                    equippedDjinn={battle.playerTeam.equippedDjinn}
                    djinnStates={djinnStates}
                  />
                )}

                {selectedCommand && (
                  <p className="target-hint">
                    {selectedCommand === 'attack' ? 'Click an enemy' : 'Click a target'}
                  </p>
                )}

                {currentQueueIndex > 0 && (
                  <button onClick={handleBack} className="back-button">
                    ← Back
                  </button>
                )}
              </div>
            )}

            {/* Ready to Execute message when queue is complete */}
            {isQueueComplete && (
              <div className="command-panel">
                <h3 style={{ textAlign: 'center', color: '#4CAF50', fontSize: '18px' }}>
                  ✓ All Actions Queued!
                </h3>
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                  Press EXECUTE to begin the battle round
                </p>
              </div>
            )}
          </>
        )}

        {phase === 'executing' && (
          <div className="combat-log-full">
            <CombatLog messages={combatLog} />
          </div>
        )}

        {phase === 'victory' && (
          <div className="battle-result victory">
            <h2>VICTORY!</h2>
          </div>
        )}

        {phase === 'defeat' && (
          <div className="battle-result defeat">
            <h2>DEFEAT...</h2>
          </div>
        )}
      </div>
    </div>
  );
};
