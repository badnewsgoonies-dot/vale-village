/**
 * Queue-Based Battle View Component
 * PR-QUEUE-BATTLE: Main battle UI with planning and execution phases
 * Phase 4: Execution polish, rewards wiring, UX refinements
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

export function QueueBattleView() {
  const battle = useStore((s) => s.battle);
  const events = useStore((s) => s.events);
  const dequeue = useStore((s) => s.dequeueEvent);
  const queueUnitAction = useStore((s) => s.queueUnitAction);
  const clearUnitAction = useStore((s) => s.clearUnitAction);
  const queueDjinnActivation = useStore((s) => s.queueDjinnActivation);
  const unqueueDjinnActivation = useStore((s) => s.unqueueDjinnActivation);
  const executeQueuedRound = useStore((s) => s.executeQueuedRound);
  const setMode = useStore((s) => s.setMode);

  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  // Phase 4: Error message state for UX feedback
  const [queueError, setQueueError] = useState<string | null>(null);

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

  // Clear error message when battle phase changes
  useEffect(() => {
    if (battle?.phase !== 'planning') {
      setQueueError(null);
    }
  }, [battle?.phase]);

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
          setMode('rewards');
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

  // Phase 4: Get execute validation message
  const getExecuteValidationMessage = (): string | null => {
    if (battle.phase !== 'planning') return null;
    if (isOverBudget) {
      const over = totalQueuedManaCost - battle.maxMana;
      return `Cannot execute: ${over} mana over budget`;
    }
    const missingActions = battle.playerTeam.units.filter((unit, idx) => {
      const isKo = unit.currentHp <= 0;
      const action = battle.queuedActions[idx];
      return !isKo && action == null;
    });
    if (missingActions.length > 0) {
      return `Cannot execute: ${missingActions.length} unit(s) need actions`;
    }
    return null;
  };

  const executeValidationMessage = getExecuteValidationMessage();

  // Phase 4: Check if in execution phase for visual lockdown
  const isExecuting = battle.phase === 'executing';
  const isPlanningLocked = isExecuting;

  const handleAbilitySelect = (abilityId: string | null) => {
    setSelectedAbility(abilityId);
    setSelectedTargets([]);
    setQueueError(null); // Clear error on new selection
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

    // Phase 4: Better error handling with inline messages
    try {
      queueUnitAction(selectedUnitIndex, selectedAbility, selectedTargets, ability);
      setSelectedAbility(null);
      setSelectedTargets([]);
      setQueueError(null); // Clear error on success
      // Phase 2 Fix #1: Use actual party size instead of hard-coded MAX_QUEUE_SIZE
      const unitCount = battle.playerTeam.units.length;
      if (selectedUnitIndex < unitCount - 1) {
        setSelectedUnitIndex(selectedUnitIndex + 1);
      }
    } catch (error) {
      // Phase 4: Show inline error instead of alert
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setQueueError(errorMsg);
      console.error('Failed to queue action:', error);
    }
  };

  const handleExecuteRound = () => {
    if (!isQueueComplete) {
      // Phase 4: Better validation message already shown inline
      return;
    }
    executeQueuedRound();
  };

  return (
    <div className="queue-battle-root" style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100dvh',
      maxHeight: '100dvh',
      padding: '1rem',
      background: '#0a0a0a',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Top Bar: Mana + Djinn */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem',
          backgroundColor: '#1a1a1a',
          border: '2px solid #444',
          borderRadius: '4px',
          marginBottom: '1rem',
          // Phase 4: Dim during execution
          opacity: isPlanningLocked ? 0.6 : 1,
          pointerEvents: isPlanningLocked ? 'none' : 'auto',
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

      {/* Phase 4: Execution indicator */}
      {isExecuting && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '4px',
            marginBottom: '1rem',
            textAlign: 'center',
            color: '#FFD87F',
            fontWeight: 'bold',
            fontSize: '1.1rem',
          }}
        >
          ⚔️ EXECUTING ROUND... ⚔️
        </div>
      )}

      {/* Battlefield */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginBottom: '1rem',
        flex: '1 1 auto',
        minHeight: 0,
        overflow: 'auto',
      }}>
        {/* Enemy Side (NO HP BARS) */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#fff' }}>Enemies</h3>
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
          <h3 style={{ color: '#fff' }}>Player Team</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {battle.playerTeam.units.map((unit, index) => (
              <div
                key={unit.id}
                onClick={() => {
                  if (battle.phase === 'planning' && !isPlanningLocked) {
                    setSelectedUnitIndex(index);
                    setSelectedAbility(null);
                    setSelectedTargets([]);
                    setQueueError(null);
                  }
                }}
                style={{
                  cursor: battle.phase === 'planning' && !isPlanningLocked ? 'pointer' : 'default',
                  border: selectedUnitIndex === index ? '3px solid #4CAF50' : '1px solid transparent',
                  borderRadius: '4px',
                  padding: '0.25rem',
                  // Phase 4: Dim during execution
                  opacity: isPlanningLocked ? 0.7 : 1,
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
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          flex: '0 0 auto',
          minHeight: 0,
          maxHeight: '40vh',
          overflow: 'auto',
        }}>
          {/* Action Queue Panel */}
          <div
            style={{
              flex: '0 0 40%',
              // Phase 4: Dim during execution
              opacity: isPlanningLocked ? 0.6 : 1,
              pointerEvents: isPlanningLocked ? 'none' : 'auto',
            }}
          >
            <ActionQueuePanel battle={battle} onClearAction={clearUnitAction} />
          </div>

          {/* Command Panel */}
          <div
            style={{
              flex: '1',
              backgroundColor: '#1a1a1a',
              border: '2px solid #444',
              borderRadius: '4px',
              padding: '1rem',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              minHeight: 0,
              overflow: 'auto',
              // Phase 4: Dim during execution
              opacity: isPlanningLocked ? 0.6 : 1,
              pointerEvents: isPlanningLocked ? 'none' : 'auto',
            }}
          >
            {selectedUnitIndex !== null && currentUnit ? (
              <>
                <h3 style={{ 
                  marginTop: 0, 
                  color: '#FFD87F',
                  fontSize: '10px',
                  textShadow: '2px 2px 0 #000',
                }}>
                  CURRENT: {currentUnit.name.toUpperCase()}
                </h3>

                {/* Phase 4: Queue error message */}
                {queueError && (
                  <div
                    style={{
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      backgroundColor: '#5a1a1a',
                      border: '1px solid #8a2a2a',
                      borderRadius: '4px',
                      color: '#ffaaaa',
                      fontSize: '0.9rem',
                    }}
                  >
                    ⚠️ {queueError}
                  </div>
                )}

                {/* Abilities */}
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#FFD87F', fontSize: '8px', marginBottom: '0.5rem', textShadow: '1px 1px 0 #000' }}>
                    ABILITIES:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAbilitySelect(null)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: selectedAbility === null ? '#4CAF50' : '#2a2a2a',
                        color: '#fff',
                        border: '2px solid #444',
                        borderRightColor: '#666',
                        borderBottomColor: '#666',
                        borderRadius: '0',
                        cursor: 'pointer',
                        fontSize: '8px',
                        fontFamily: "'Press Start 2P', monospace",
                        textShadow: '1px 1px 0 #000',
                      }}
                    >
                      ATTACK [0○]
                    </button>
                    {currentUnit.abilities
                      .filter(a => currentUnit.unlockedAbilityIds.includes(a.id))
                      .map((ability) => {
                        const manaCost = ability.manaCost ?? 0;
                        const canAfford = canAffordAction(battle.remainingMana, manaCost);
                        // Phase 4: Check if this is a Djinn ability
                        const isDjinnAbility = DJINN_ABILITIES[ability.id] != null;
                        return (
                          <button
                            key={ability.id}
                            onClick={() => handleAbilitySelect(ability.id)}
                            disabled={!canAfford}
                            title={!canAfford ? 'Not enough mana' : isDjinnAbility ? 'Djinn ability' : ''}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: selectedAbility === ability.id ? '#4CAF50' : canAfford ? '#2a2a2a' : '#1a1a1a',
                              color: canAfford ? '#fff' : '#666',
                              border: isDjinnAbility ? '2px solid #9C27B0' : '2px solid #444',
                              borderRightColor: isDjinnAbility ? '#BA68C8' : '#666',
                              borderBottomColor: isDjinnAbility ? '#BA68C8' : '#666',
                              borderRadius: '0',
                              cursor: canAfford ? 'pointer' : 'not-allowed',
                              fontSize: '8px',
                              fontFamily: "'Press Start 2P', monospace",
                              textShadow: canAfford ? '1px 1px 0 #000' : 'none',
                            }}
                          >
                            {isDjinnAbility && '✦ '}{ability.name.toUpperCase()} [{manaCost}○]
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Phase 4: Locked Djinn abilities with improved clarity */}
                {lockedDjinnAbilitiesForCurrentUnit.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h5 style={{ margin: '0 0 0.25rem 0', color: '#aaa', fontSize: '8px', textShadow: '1px 1px 0 #000' }}>
                      🔒 LOCKED DJINN ABILITIES
                    </h5>
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
                              backgroundColor: '#1a1a1a',
                              color: '#888',
                              border: '2px dashed #555',
                              borderRadius: '0',
                              cursor: 'not-allowed',
                              textAlign: 'left',
                              fontSize: '8px',
                              fontFamily: "'Press Start 2P', monospace",
                            }}
                          >
                            🔒 {ability.name.toUpperCase()} [{ability.manaCost ?? 0}○] — {formatLockedReason(meta)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Target Selection */}
                {selectedAbility !== undefined && currentUnit && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: '#FFD87F', fontSize: '8px', marginBottom: '0.5rem', textShadow: '1px 1px 0 #000' }}>
                      SELECT TARGETS:
                    </h4>
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
                            backgroundColor: selectedTargets.includes(target.id) ? '#2196F3' : '#2a2a2a',
                            color: '#fff',
                            border: '2px solid #444',
                            borderRightColor: '#666',
                            borderBottomColor: '#666',
                            borderRadius: '0',
                            cursor: 'pointer',
                            fontSize: '8px',
                            fontFamily: "'Press Start 2P', monospace",
                            textShadow: '1px 1px 0 #000',
                          }}
                        >
                          {target.name.toUpperCase()}
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
                      color: '#000',
                      border: '2px solid #66bb6a',
                      borderRightColor: '#2E7D32',
                      borderBottomColor: '#2E7D32',
                      borderRadius: '0',
                      cursor: 'pointer',
                      fontSize: '8px',
                      fontFamily: "'Press Start 2P', monospace",
                      fontWeight: 'normal',
                      textShadow: 'none',
                    }}
                  >
                    QUEUE ACTION
                  </button>
                )}

                {/* Execute Round Button */}
                <div style={{ marginTop: '1rem' }}>
                  {/* Phase 4: Show validation message */}
                  {executeValidationMessage && (
                    <div
                      style={{
                        padding: '0.5rem',
                        marginBottom: '0.5rem',
                        backgroundColor: '#2a2a2a',
                        border: '1px solid #666',
                        borderRadius: '4px',
                        color: '#FFD87F',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                      }}
                    >
                      ℹ️ {executeValidationMessage}
                    </div>
                  )}
                  <button
                    onClick={handleExecuteRound}
                    disabled={!isQueueComplete}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: isQueueComplete ? '#FFD87F' : '#666',
                      color: isQueueComplete ? '#000' : '#999',
                      border: '2px solid',
                      borderColor: isQueueComplete ? '#FFE082' : '#888',
                      borderRightColor: isQueueComplete ? '#F9A825' : '#555',
                      borderBottomColor: isQueueComplete ? '#F9A825' : '#555',
                      borderRadius: '0',
                      cursor: isQueueComplete ? 'pointer' : 'not-allowed',
                      fontSize: '8px',
                      fontFamily: "'Press Start 2P', monospace",
                      fontWeight: 'normal',
                      textShadow: 'none',
                    }}
                  >
                    {isQueueComplete ? 'EXECUTE ROUND' : 'QUEUE ALL ACTIONS FIRST'}
                  </button>
                </div>
              </>
            ) : (
                <div style={{ 
                  color: '#aaa', 
                  textAlign: 'center', 
                  padding: '2rem',
                  fontSize: '8px',
                  fontFamily: "'Press Start 2P', monospace",
                  textShadow: '1px 1px 0 #000',
                }}>
                  SELECT A UNIT TO QUEUE AN ACTION
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
