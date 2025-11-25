/**
 * Queue-Based Battle View Component
 * Bottom layout implementation aligning with battle UI spec.
 */

import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../state/store';
import { renderEventText } from '../utils/text';
import { BattleLog } from './BattleLog';
import { UnitCard } from './UnitCard';
import { PostBattleCutscene } from './PostBattleCutscene';
import { VictoryOverlay } from './VictoryOverlay';
import { getValidTargets } from '../../core/algorithms/targeting';
import { getPlanningTurnOrder } from '../../core/services/QueueBattleService';
import { isUnitKO } from '../../core/models/Unit';
import { BattleManaBar } from './BattleManaBar';
import { BattlePortraitRow } from './BattlePortraitRow';
import { BattleActionMenu, type ActionMenuMode } from './BattleActionMenu';
import { DjinnAdvisorPanel } from './DjinnAdvisorPanel';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { Unit } from '../../core/models/Unit';

// --- CSS CONSTANTS ---
// Unused - commented out to fix TypeScript warnings
/*
const STYLES = {
  root: {
    height: '100vh',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    backgroundColor: '#0a0b10',
    color: '#fff',
    fontFamily: '"Segoe UI", Tahoma, sans-serif',
    overflow: 'hidden',
  },
  topHud: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(180deg, rgba(10,15,25,0.95) 0%, rgba(10,15,25,0.8) 100%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 100,
  },
  battlefield: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at 50% 30%, #1a253a 0%, #050810 80%)',
    perspective: '1000px',
  },
  enemyRow: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '4rem',
    transform: 'scale(1.1)',
  },
  playerRow: {
    display: 'flex',
    gap: '3rem',
    alignItems: 'flex-end',
    zIndex: 10,
  },
  commandDeck: {
    height: '280px',
    background: 'linear-gradient(180deg, #1a202c 0%, #0f1218 100%)',
    borderTop: '4px double #4a5568', // Double border for RPG feel
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    zIndex: 20,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.6)',
  },
  deckLeft: {
    borderRight: '2px solid #2d3748',
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'rgba(0,0,0,0.2)',
  },
  deckRight: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'rgba(0,0,0,0.4)',
    overflow: 'hidden',
  },
  abilityList: {
    overflowY: 'auto' as const,
    flex: 1,
  },
  abilityBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#a0aec0',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.1s',
    fontFamily: 'inherit', // Inherit font for consistent feel
  },
  abilityBtnSelected: {
    background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0) 100%)',
    color: '#ffd700',
    borderLeft: '4px solid #ffd700',
    textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
  },
  abilityBtnHover: {
    background: 'rgba(255,255,255,0.05)',
    color: '#e2e8f0',
  },
  activeUnitIndicator: {
    padding: '0.75rem 1rem',
    background: 'linear-gradient(90deg, #2d3748 0%, #1a202c 100%)',
    borderBottom: '1px solid #4a5568',
    fontWeight: 'bold' as const,
    color: '#ffd700',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.2)',
  },
  detailsPanel: {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    padding: '1.5rem',
    background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.98) 0%, rgba(15, 20, 30, 0.98) 100%)',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  detailsHeader: {
    borderBottom: '1px solid #4a5568',
    paddingBottom: '0.5rem',
    marginBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  detailsTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold' as const,
    color: '#ffd700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  detailsMeta: {
    fontSize: '0.9rem',
    color: '#63b3ed',
    fontWeight: 500,
  },
  detailsBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
  statBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    background: 'rgba(0,0,0,0.2)',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#718096',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: 600,
  },
  statValue: {
    fontSize: '1.1rem',
    color: '#e2e8f0',
    fontWeight: 500,
  },
  targetOverlay: {
    position: 'absolute' as const,
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '1rem 2rem',
    background: 'rgba(15, 20, 30, 0.9)',
    borderRadius: '8px',
    border: '1px solid #ffd700',
    zIndex: 50,
    textAlign: 'center' as const,
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
  },
  executeBtn: {
    padding: '1rem',
    background: 'linear-gradient(180deg, #48bb78 0%, #2f855a 100%)',
    color: '#fff',
    border: 'none',
    borderTop: '1px solid #68d391',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    marginTop: 'auto',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    transition: 'all 0.2s',
  }
};
*/

export function QueueBattleView() {
  const battle = useStore((s) => s.battle);
  const events = useStore((s) => s.events);
  const dequeue = useStore((s) => s.dequeueEvent);
  const queueUnitAction = useStore((s) => s.queueUnitAction);
  const executeQueuedRound = useStore((s) => s.executeQueuedRound);
  const setMode = useStore((s) => s.setMode);
  const activePortraitIndex = useStore((s) => s.activePortraitIndex);
  const setActivePortrait = useStore((s) => s.setActivePortrait);
  const tutorialMessage = useStore((s) => s.tutorialMessage);
  const setSummonScreenOpen = useStore((s) => s.setSummonScreenOpen);
  const currentManaDisplay = useStore((s) => s.currentMana);
  const maxManaDisplay = useStore((s) => s.maxMana);
  const pendingManaThisRound = useStore((s) => s.pendingManaThisRound);
  const pendingManaNextRound = useStore((s) => s.pendingManaNextRound);
  const critCounters = useStore((s) => s.critCounters);
  const critThresholds = useStore((s) => s.critThresholds);
  const critFlash = useStore((s) => s.critFlash);
  const incrementCritCounter = useStore((s) => s.incrementCritCounter);
  const resetCritCounter = useStore((s) => s.resetCritCounter);
  const triggerCritFlash = useStore((s) => s.triggerCritFlash);

  // Selection State
  const [selectedAbilityId, setSelectedAbilityId] = useState<string | null | undefined>(undefined);
  const [menuMode, setMenuMode] = useState<ActionMenuMode>('root');
  
  // Post-battle State
  const [showCutscene, setShowCutscene] = useState(false);
  const [showVictoryOverlay, setShowVictoryOverlay] = useState(false);

  const battleEnded = battle?.phase === 'victory' || battle?.phase === 'defeat';
  const battleResult = battle?.phase === 'victory' ? 'PLAYER_VICTORY' : battle?.phase === 'defeat' ? 'PLAYER_DEFEAT' : null;

  // --- EFFECTS ---

  // 1. Auto-select first unit based on SPEED
  useEffect(() => {
    if (battle?.phase === 'planning' && activePortraitIndex === null) {
      const order = getPlanningTurnOrder(battle);
      if (order.length > 0 && order[0] !== undefined) {
        setActivePortrait(order[0]);
      }
    }
  }, [battle?.phase, activePortraitIndex, battle, setActivePortrait]);

  // 2. Post-battle Cutscene Trigger
  useEffect(() => {
    if (battleEnded && battleResult === 'PLAYER_VICTORY' && !showCutscene && !showVictoryOverlay) {
      setShowCutscene(true);
    }
  }, [battleEnded, battleResult, showCutscene, showVictoryOverlay]);

  // 3. Event Queue Processing
  useEffect(() => {
    if (!battle || battle.phase !== 'executing' || !events.length) return;
    const t = setTimeout(() => dequeue(), 450);
    return () => clearTimeout(t);
  }, [battle?.phase, events.length, dequeue]);

  // --- COMPUTED VALUES ---

  const currentUnit = useMemo<Unit | null>(() => {
    if (!battle) return null;
    if (activePortraitIndex === null || activePortraitIndex === undefined) return null;
    return battle.playerTeam.units[activePortraitIndex] ?? null;
  }, [battle, activePortraitIndex]);

  const totalQueuedMana = useMemo(() => 
    battle?.queuedActions.reduce((sum, a) => sum + (a?.manaCost || 0), 0) || 0
  , [battle?.queuedActions]);

  const isQueueComplete = useMemo(() => {
    if (!battle) return false;
    const aliveUnits = battle.playerTeam.units.filter(u => !isUnitKO(u));
    const queuedCount = battle.queuedActions.filter(a => a !== null && !isUnitKO(battle.playerTeam.units.find(u => u.id === a.unitId)!)).length;
    return aliveUnits.length === queuedCount && totalQueuedMana <= battle.maxMana;
  }, [battle, totalQueuedMana]);

  // --- HANDLERS ---

  // const handleAbilityHover = (id: string | null) => {
  //   setHoveredAbilityId(id);
  // };

  const handleSelectAttack = () => {
    setSelectedAbilityId(null);
    setMenuMode('root');
  };

  const handleAbilitySelect = (id: string | null, ability?: Ability) => {
    if (selectedAbilityId === id) {
      setSelectedAbilityId(undefined);
      return;
    }
    setSelectedAbilityId(id);
    void ability; // reserved for future metadata uses
    setMenuMode('root');
  };

  const handleTargetSelect = (targetId: string) => {
    if (!currentUnit || activePortraitIndex === null || !battle) return;

    const ability = currentUnit.abilities.find(a => a.id === selectedAbilityId);
    
    // Resolve target list based on ability target type
    let targetIds: string[] = [targetId];
    const aliveEnemies = battle.enemies.filter((e) => !isUnitKO(e)).map((e) => e.id);
    const aliveAllies = battle.playerTeam.units.filter((u) => !isUnitKO(u)).map((u) => u.id);

    switch (ability?.targets) {
      case 'all-enemies':
        targetIds = aliveEnemies;
        break;
      case 'all-allies':
        targetIds = aliveAllies;
        break;
      case 'self':
        targetIds = [currentUnit.id];
        break;
      default:
        targetIds = [targetId];
    }

    // Queue the action
    queueUnitAction(activePortraitIndex, selectedAbilityId ?? null, targetIds, ability);

    // Crit counter progression for basic attacks
    if (selectedAbilityId === null) {
      const nextCount = (critCounters[currentUnit.id] ?? 0) + 1;
      const threshold = critThresholds[currentUnit.id] ?? 10;
      if (nextCount >= threshold) {
        resetCritCounter(currentUnit.id);
        triggerCritFlash(currentUnit.id);
      } else {
        incrementCritCounter(currentUnit.id);
      }
    }
    
    // Reset selection for next
    setSelectedAbilityId(undefined);

    // Auto-advance to next unit by SPEED
    const order = getPlanningTurnOrder(battle);
    const currentOrderIdx = order.indexOf(activePortraitIndex);
    if (currentOrderIdx !== -1 && currentOrderIdx < order.length - 1) {
      const nextIndex = order[currentOrderIdx + 1];
      if (nextIndex !== undefined) {
        setActivePortrait(nextIndex);
      }
    }
  };

  const handleExecute = () => {
    if (isQueueComplete) executeQueuedRound();
  };

  // --- RENDER ---

  if (!battle) return <div>Loading Battle...</div>;

  // Post-battle handling
  if (showCutscene) return <PostBattleCutscene victory={true} onComplete={() => { setShowCutscene(false); setShowVictoryOverlay(true); }} />;
  if (showVictoryOverlay) return <VictoryOverlay onComplete={() => { setShowVictoryOverlay(false); setMode('rewards'); }} />;

  // Determine valid targets if in selection mode
  let validTargets: readonly { id: string; name: string }[] = [];
  if (selectedAbilityId !== undefined && currentUnit) {
    // selectedAbilityId is null -> Basic Attack
    // selectedAbilityId is string -> Ability
    const ability = selectedAbilityId 
      ? currentUnit.abilities.find(a => a.id === selectedAbilityId) 
      : undefined; // undefined corresponds to 'Basic Attack' in getValidTargets if logic allows? 
                   // Actually getValidTargets expects ability object or undefined for Basic Attack
    
    // Note: getValidTargets signature might need checking.
    // Assuming getValidTargets(ability | null/undefined, unit, team, enemies)
    // Checking import... getValidTargets(ability: Ability | null | undefined, ...)
    validTargets = getValidTargets(ability || null, currentUnit, battle.playerTeam, battle.enemies);
  }
  const validTargetIds = new Set(validTargets.map((t) => t.id));
  const isTargeting = selectedAbilityId !== undefined && validTargets.length > 0;

  // --- HELPERS FOR RENDERING ABILITY LIST ---
  // Helpers not required; rendering handled via BattleActionMenu.

  const isExecuting = battle.phase === 'executing';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr auto',
        height: '100dvh',
        background: '#0b0b0f',
        color: '#fff',
      }}
    >
      {/* Battlefield Area */}
      <div
        style={{
          position: 'relative',
          padding: '24px',
          overflow: 'hidden',
        }}
      >
        {isExecuting && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,216,127,0.4)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#FFD87F',
              fontWeight: 700,
              letterSpacing: 0.5,
              zIndex: 5,
            }}
          >
            ⚔️ Executing round...
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px', letterSpacing: 1 }}>Enemies</h3>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {battle.enemies.map((enemy) => {
                const isTargetCandidate = validTargetIds.has(enemy.id);
                if (isUnitKO(enemy)) return null;
                return (
                  <div
                    key={enemy.id}
                    onClick={() => isTargetCandidate && handleTargetSelect(enemy.id)}
                    style={{
                      border: '1px solid rgba(255,255,255,0.12)',
                      padding: 10,
                      borderRadius: 8,
                      background: 'rgba(0,0,0,0.3)',
                      cursor: isTargetCandidate ? 'pointer' : 'default',
                      boxShadow: isTargetCandidate ? '0 0 12px rgba(255,216,127,0.5)' : 'none',
                      transition: 'all 0.2s',
                      minWidth: 160,
                    }}
                  >
                    <UnitCard unit={enemy} isPlayer={false} team={battle.playerTeam} hideHp />
                    {isTargetCandidate && (
                      <div style={{ textAlign: 'center', marginTop: 4, color: '#FFD87F', fontSize: '0.85rem' }}>
                        Click to target
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {validTargets.length > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.8)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,216,127,0.4)',
              textAlign: 'center',
              zIndex: 5,
            }}
          >
            <div style={{ color: '#FFD87F', fontWeight: 700, marginBottom: 4 }}>Select target</div>
            <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Click a highlighted target to confirm</div>
            <button
              onClick={() => {
                setSelectedAbilityId(undefined);
              }}
              style={{
                marginTop: 8,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#eaeaea',
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {battle.phase === 'executing' && (
          <div
            style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              width: 340,
              maxHeight: '45vh',
              overflow: 'auto',
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: 8,
            }}
          >
            <BattleLog events={events} renderText={renderEventText} />
          </div>
        )}
      </div>

      {/* Bottom UI (Golden Sun-style) */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(8,8,10,0.92)',
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          padding: '12px 16px',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <DjinnAdvisorPanel
          tutorialMessage={tutorialMessage}
          onClick={() => setSummonScreenOpen(true)}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <BattleManaBar
            currentMana={currentManaDisplay}
            maxMana={maxManaDisplay}
            pendingThisRound={pendingManaThisRound}
            pendingNextRound={pendingManaNextRound}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              position: 'relative',
              minHeight: 240,
            }}
          >
            {(() => {
              const portraitWidth = 64;
              const portraitGap = 8;
              const actionMenuWidth = 240;
              const count = battle.playerTeam.units.length;
              const rowWidth = count * portraitWidth + (count - 1) * portraitGap;
              const activeIdx = Math.max(0, Math.min(activePortraitIndex ?? 0, count - 1));
              const actionX = activeIdx * (portraitWidth + portraitGap);
              const menuOffsetX = actionX + portraitWidth / 2 - actionMenuWidth / 2;

              return (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 120,
                      left: `calc(50% - ${rowWidth / 2}px + ${menuOffsetX}px)`,
                      zIndex: 2,
                    }}
                  >
                    <BattleActionMenu
                      battle={battle}
                      currentUnit={currentUnit}
                      selectedAbilityId={selectedAbilityId ?? null}
                      mode={menuMode}
                      onModeChange={setMenuMode}
                      onSelectAttack={handleSelectAttack}
                      onSelectAbility={handleAbilitySelect}
                    />
                  </div>

                  <div style={{ width: rowWidth }}>
                    <BattlePortraitRow
                      units={battle.playerTeam.units}
                      activeIndex={activePortraitIndex}
                      queuedActions={battle.queuedActions}
                      critCounters={critCounters}
                      critThresholds={critThresholds}
                      critFlashes={critFlash}
                      onSelect={(idx) => {
                        const unit = battle.playerTeam.units[idx];
                        if (isTargeting && unit && validTargetIds.has(unit.id)) {
                          handleTargetSelect(unit.id);
                          return;
                        }
                        if (battle.phase === 'planning') {
                          setActivePortrait(idx);
                          setSelectedAbilityId(undefined);
                        }
                      }}
                    />
                  </div>
                </>
              );
            })()}
          </div>

          <div style={{ alignSelf: 'stretch', marginTop: 4 }}>
            <button
              onClick={handleExecute}
              disabled={!isQueueComplete}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: isQueueComplete ? '#FFD54A' : 'rgba(255,255,255,0.08)',
                color: isQueueComplete ? '#000' : '#888',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 8,
                cursor: isQueueComplete ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              {isQueueComplete ? 'Execute Round' : 'Queue all actions first'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
