/**
 * Queue-Based Battle View Component
 * PR-QUEUE-BATTLE: Main battle UI with planning and execution phases
 */

import { useEffect, useState } from 'react';
import { useStore } from '../state/store';
import { renderEventText } from '../utils/text';
import { BattleLog } from './BattleLog';
import { UnitCard } from './UnitCard';
import { ManaCirclesBar } from './ManaCirclesBar';
import { DjinnBar } from './DjinnBar';
import { ActionQueuePanel } from './ActionQueuePanel';
import { PostBattleCutscene } from './PostBattleCutscene';
import { VictoryOverlay } from './VictoryOverlay';
import { getValidTargets } from '../../core/algorithms/targeting';
import { canAffordAction } from '../../core/algorithms/mana';
import { DJINN_ABILITIES } from '../../data/definitions/djinnAbilities';
import { DJINN } from '../../data/definitions/djinn';
import { getLockedDjinnAbilityMetadataForUnit } from '../../core/algorithms/djinnAbilities';
import { MAX_QUEUE_SIZE } from '../../core/constants';

export function QueueBattleView() {
  const battle = useStore((s) => s.battle);
  const events = useStore((s) => s.events);
  const dequeue = useStore((s) => s.dequeueEvent);
  const queueUnitAction = useStore((s) => s.queueUnitAction);
  const clearUnitAction = useStore((s) => s.clearUnitAction);
  const queueDjinnActivation = useStore((s) => s.queueDjinnActivation);
  const unqueueDjinnActivation = useStore((s) => s.unqueueDjinnActivation);
  const executeQueuedRound = useStore((s) => s.executeQueuedRound);
  const setShowRewards = useStore((s) => s.setShowRewards);

  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  // Post-battle flow state
  const [showCutscene, setShowCutscene] = useState(false);
  const [showVictoryOverlay, setShowVictoryOverlay] = useState(false);

  const battleEnded = battle?.phase === 'victory' || battle?.phase === 'defeat';
  const battleResult = battle?.phase === 'victory' ? 'PLAYER_VICTORY' : battle?.phase === 'defeat' ? 'PLAYER_DEFEAT' : null;

  // Detect battle end and trigger cutscene
  useEffect(() => {
    if (battleEnded && battleResult === 'PLAYER_VICTORY' && !showCutscene && !showVictoryOverlay) {
      setShowCutscene(true);
    }
  }, [battleEnded, battleResult, showCutscene, showVictoryOverlay]);

  // Process events during execution phase
  useEffect(() => {
    if (!battle || battle.phase !== 'executing' || !events.length) return;
    const t = setTimeout(() => dequeue(), 450);
    return () => clearTimeout(t);
  }, [battle?.phase, events.length, dequeue]);

  if (!battle) return <div>No battle loaded.</div>;

  // Post-battle flow
  if (showCutscene) {
    return (
      <PostBattleCutscene
        victory={battleResult === 'PLAYER_VICTORY'}
        onComplete={() => {
          setShowCutscene(false);
          setShowVictoryOverlay(true);
        }}
      />
    );
  }

  if (showVictoryOverlay) {
    return (
      <VictoryOverlay
        onComplete={() => {
          setShowVictoryOverlay(false);
          setShowRewards(true);
        }}
      />
    );
  }

  const currentUnit = selectedUnitIndex !== null ? battle.playerTeam.units[selectedUnitIndex] : null;
  const lockedDjinnAbilitiesForCurrentUnit = currentUnit
    ? getLockedDjinnAbilityMetadataForUnit(currentUnit, battle.playerTeam)
    : [];
  const formatLockedReason = (meta: { djinnId: string }) => {
    const tracker = battle.playerTeam.djinnTrackers[meta.djinnId];
    const djinnName = DJINN[meta.djinnId]?.name ?? meta.djinnId;
    const state = tracker?.state ?? 'Unknown';
    const timer = battle.djinnRecoveryTimers[meta.djinnId];
    const countdownText = timer !== undefined ? ` (${timer} rounds left)` : '';
    return `${djinnName} is ${state}${countdownText}`;
  };

  // Phase 2 Fix #3: Robust canExecute check
  // Check: in planning phase, mana budget OK, all non-KO units have actions
  const totalQueuedManaCost = battle.queuedActions
    .filter((action): action is NonNullable<typeof action> => action != null)
    .reduce((sum, action) => sum + action.manaCost, 0);
  const isOverBudget = totalQueuedManaCost > battle.maxMana;

  const isQueueComplete =
    battle.phase === 'planning' &&
    !isOverBudget &&
    battle.playerTeam.units.every((unit, idx) => {
      const isKo = unit.currentHp <= 0;
      const action = battle.queuedActions[idx];
      const hasAction = action != null;
      return isKo || hasAction;
    });

  const handleAbilitySelect = (abilityId: string | null) => {
    setSelectedAbility(abilityId);
    setSelectedTargets([]);
  };

  const handleTargetSelect = (targetId: string) => {
    if (!currentUnit) return;

    if (selectedAbility === null) {
      // Basic attack - single enemy target
      setSelectedTargets([targetId]);
      return;
    }

    const ability = currentUnit.abilities.find(a => a.id === selectedAbility);
    if (!ability) return;

    // Single target abilities
    if (ability.targets === 'single-enemy' || ability.targets === 'single-ally' || ability.targets === 'self') {
      setSelectedTargets([targetId]);
    } else {
      // Multi-target abilities
      if (selectedTargets.includes(targetId)) {
        setSelectedTargets(selectedTargets.filter(id => id !== targetId));
      } else {
        setSelectedTargets([...selectedTargets, targetId]);
      }
    }
  };

  const handleQueueAction = () => {
    if (selectedUnitIndex === null || !currentUnit) return;
    if (selectedAbility === null && selectedTargets.length === 0) {
      // Basic attack - need to select target
      return;
    }

    const ability = selectedAbility ? currentUnit.abilities.find(a => a.id === selectedAbility) : undefined;

    // Let the service validate (it checks mana affordability, etc.)
    try {
      queueUnitAction(selectedUnitIndex, selectedAbility, selectedTargets, ability);
      setSelectedAbility(null);
      setSelectedTargets([]);
      // Phase 2 Fix #1: Use actual party size instead of hard-coded MAX_QUEUE_SIZE
      const unitCount = battle.playerTeam.units.length;
      if (selectedUnitIndex < unitCount - 1) {
        setSelectedUnitIndex(selectedUnitIndex + 1);
      }
    } catch (error) {
      // Service will throw descriptive errors for validation failures
      console.error('Failed to queue action:', error);
      alert(`Failed to queue action: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleExecuteRound = () => {
    if (!isQueueComplete) {
      const unitCount = battle.playerTeam.units.length;
      alert(`Please queue actions for all ${unitCount} units first`);
      return;
    }
    executeQueuedRound();
  };

  return (
    <div className="queue-battle-root" style={{ padding: '1rem' }}>
      {/* Top Bar: Mana + Djinn */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem',
          backgroundColor: '#1a2a4a',
          border: '2px solid #4a6a8a',
          borderRadius: '4px',
          marginBottom: '1rem',
        }}
      >
        {/* Phase 2 Fix #2: Clamp remaining mana to not go negative */}
        <ManaCirclesBar
          remainingMana={Math.max(0, battle.remainingMana)}
          maxMana={battle.maxMana}
        />
        <DjinnBar
          team={battle.playerTeam}
          queuedDjinn={battle.queuedDjinn}
          onDjinnClick={(djinnId) => {
            if (battle.queuedDjinn.includes(djinnId)) {
              unqueueDjinnActivation(djinnId);
            } else {
              queueDjinnActivation(djinnId);
            }
          }}
        />
      </div>

      {/* Battlefield */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
        {/* Enemy Side (NO HP BARS) */}
        <div style={{ flex: 1 }}>
          <h3>Enemies</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {battle.enemies.map((enemy) => (
              <UnitCard
                key={enemy.id}
                unit={enemy}
                isPlayer={false}
                team={battle.playerTeam}
                hideHp={true} // PR-QUEUE-BATTLE: Hide enemy HP
              />
            ))}
          </div>
        </div>

        {/* Player Side */}
        <div style={{ flex: 1 }}>
          <h3>Player Team</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {battle.playerTeam.units.map((unit, index) => (
              <div
                key={unit.id}
                onClick={() => {
                  if (battle.phase === 'planning') {
                    setSelectedUnitIndex(index);
                    setSelectedAbility(null);
                    setSelectedTargets([]);
                  }
                }}
                style={{
                  cursor: battle.phase === 'planning' ? 'pointer' : 'default',
                  border: selectedUnitIndex === index ? '3px solid #4CAF50' : '1px solid transparent',
                  borderRadius: '4px',
                  padding: '0.25rem',
                }}
              >
                <UnitCard unit={unit} isPlayer={true} team={battle.playerTeam} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Panel: Planning or Execution */}
      {battle.phase === 'planning' ? (
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Action Queue Panel */}
          <div style={{ flex: '0 0 40%' }}>
            <ActionQueuePanel battle={battle} onClearAction={clearUnitAction} />
          </div>

          {/* Command Panel */}
          <div style={{ flex: '1', backgroundColor: '#1a2a4a', border: '2px solid #4a6a8a', borderRadius: '4px', padding: '1rem' }}>
            {selectedUnitIndex !== null && currentUnit ? (
              <>
                <h3 style={{ marginTop: 0, color: '#FFD87F' }}>
                  Current: {currentUnit.name}
                </h3>
                {/* Abilities */}
                <div style={{ marginBottom: '1rem' }}>
                  <h4>Abilities:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAbilitySelect(null)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: selectedAbility === null ? '#4CAF50' : '#444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Attack [0○]
                    </button>
                    {currentUnit.abilities
                      .filter(a => currentUnit.unlockedAbilityIds.includes(a.id))
                      .map((ability) => {
                        const manaCost = ability.manaCost ?? 0;
                        const canAfford = canAffordAction(battle.remainingMana, manaCost);
                        return (
                          <button
                            key={ability.id}
                            onClick={() => handleAbilitySelect(ability.id)}
                            disabled={!canAfford}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: selectedAbility === ability.id ? '#4CAF50' : canAfford ? '#444' : '#222',
                              color: canAfford ? '#fff' : '#666',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: canAfford ? 'pointer' : 'not-allowed',
                            }}
                          >
                            {ability.name} [{manaCost}○]
                          </button>
                        );
                      })}
                  </div>
                </div>

                {lockedDjinnAbilitiesForCurrentUnit.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h5 style={{ margin: '0 0 0.25rem 0', color: '#ccc' }}>Locked Djinn Abilities</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {lockedDjinnAbilitiesForCurrentUnit.map((meta) => {
                        const ability = DJINN_ABILITIES[meta.abilityId];
                        if (!ability) return null;
                        return (
                          <button
                            key={`${meta.abilityId}-${meta.djinnId}`}
                            disabled
                            title={`${ability.name} locked because ${formatLockedReason(meta)}`}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#222',
                              color: '#888',
                              border: '1px dashed #555',
                              borderRadius: '4px',
                              cursor: 'not-allowed',
                              textAlign: 'left',
                            }}
                          >
                            {ability.name} [{ability.manaCost ?? 0}○] — {formatLockedReason(meta)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Target Selection */}
                {selectedAbility !== undefined && currentUnit && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4>Select Targets:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(() => {
                        const ability = selectedAbility
                          ? currentUnit.abilities.find(a => a.id === selectedAbility) ?? null
                          : null;
                        return getValidTargets(ability, currentUnit, battle.playerTeam, battle.enemies);
                      })().map((target) => (
                        <button
                          key={target.id}
                          onClick={() => handleTargetSelect(target.id)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: selectedTargets.includes(target.id) ? '#2196F3' : '#444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          {target.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Queue Action Button */}
                {selectedTargets.length > 0 && (
                  <button
                    onClick={handleQueueAction}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Queue Action
                  </button>
                )}

                {/* Execute Round Button */}
                {isQueueComplete && (
                  <div style={{ marginTop: '1rem' }}>
                    <button
                      onClick={handleExecuteRound}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#FFD87F',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      EXECUTE ROUND
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
                Select a unit to queue an action
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Execution Phase: Combat Log */
        <BattleLog events={events} renderText={renderEventText} />
      )}
    </div>
  );
}
