/**
 * Queue-Based Battle View Component
 * PR-QUEUE-BATTLE: Main battle UI with planning and execution phases
 * Phase 5: "Command Deck" Redesign & Speed-Based Turn Input
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../state/store';
import { renderEventText } from '../utils/text';
import { BattleLog } from './BattleLog';
import { UnitCard } from './UnitCard';
import { ManaCirclesBar } from './ManaCirclesBar';
import { DjinnBar } from './DjinnBar';
import { PostBattleCutscene } from './PostBattleCutscene';
import { VictoryOverlay } from './VictoryOverlay';
import { getValidTargets } from '../../core/algorithms/targeting';
import { canAffordAction } from '../../core/algorithms/mana';
import { DJINN_ABILITIES } from '../../data/definitions/djinnAbilities';
import { DJINN } from '../../data/definitions/djinn';
import { getLockedDjinnAbilityMetadataForUnit } from '../../core/algorithms/djinnAbilities';
import { getPlanningTurnOrder } from '../../core/services/QueueBattleService';
import { isUnitKO } from '../../core/models/Unit';

// --- CSS CONSTANTS ---
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
    borderBottom: '1px solid #2a3b55',
    zIndex: 100,
  },
  battlefield: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    // Placeholder gradient - ideally a background image
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
    backgroundColor: '#0f1218',
    borderTop: '2px solid #ffd700',
    display: 'grid',
    gridTemplateColumns: '260px 1fr', // 30% approx (fixed width is safer for list) vs 70%
    zIndex: 20,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
  },
  deckLeft: {
    borderRight: '1px solid #2a3b55',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#12161f',
  },
  deckRight: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#0a0b10',
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
    borderBottom: '1px solid #1f293a',
    color: '#aaa',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.1s',
  },
  abilityBtnSelected: {
    background: '#1e2532',
    color: '#ffd700',
    borderLeft: '4px solid #ffd700',
  },
  abilityBtnHover: {
    background: '#1a202c',
    color: '#fff',
  },
  activeUnitIndicator: {
    padding: '0.5rem 1rem',
    background: '#1a202c',
    borderBottom: '1px solid #2a3b55',
    fontWeight: 'bold' as const,
    color: '#ffd700',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueStatus: {
    fontSize: '0.8rem',
    color: '#666',
  },
  detailsPanel: {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    padding: '1.5rem',
    backgroundColor: 'rgba(15, 20, 30, 0.98)',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  detailsHeader: {
    borderBottom: '1px solid #2a3b55',
    paddingBottom: '0.5rem',
    marginBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  detailsTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold' as const,
    color: '#ffd700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  detailsMeta: {
    fontSize: '0.9rem',
    color: '#4fc3f7',
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
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  statValue: {
    fontSize: '1rem',
    color: '#eee',
  },
  targetOverlay: {
    position: 'absolute' as const,
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '1rem 2rem',
    background: 'rgba(0,0,0,0.8)',
    borderRadius: '8px',
    border: '1px solid #ffd700',
    zIndex: 50,
    textAlign: 'center' as const,
  }
};

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

  // Selection State
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(null);
  const [selectedAbilityId, setSelectedAbilityId] = useState<string | null>(null);
  const [hoveredAbilityId, setHoveredAbilityId] = useState<string | null>(null);
  
  // Post-battle State
  const [showCutscene, setShowCutscene] = useState(false);
  const [showVictoryOverlay, setShowVictoryOverlay] = useState(false);

  const battleEnded = battle?.phase === 'victory' || battle?.phase === 'defeat';
  const battleResult = battle?.phase === 'victory' ? 'PLAYER_VICTORY' : battle?.phase === 'defeat' ? 'PLAYER_DEFEAT' : null;

  // --- EFFECTS ---

  // 1. Auto-select first unit based on SPEED
  useEffect(() => {
    if (battle?.phase === 'planning' && selectedUnitIndex === null) {
      const order = getPlanningTurnOrder(battle);
      if (order.length > 0) {
        setSelectedUnitIndex(order[0]);
      }
    }
  }, [battle?.phase, selectedUnitIndex, battle]);

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

  const currentUnit = useMemo(() => 
    (battle && selectedUnitIndex !== null) ? battle.playerTeam.units[selectedUnitIndex] : null
  , [battle, selectedUnitIndex]);

  const lockedDjinnAbilities = useMemo(() => 
    (currentUnit && battle) ? getLockedDjinnAbilityMetadataForUnit(currentUnit, battle.playerTeam) : []
  , [currentUnit, battle]);

  const isPlanningLocked = battle?.phase !== 'planning';
  
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

  const handleAbilityHover = (id: string | null) => {
    setHoveredAbilityId(id);
  };

  const handleAbilitySelect = (id: string | null) => {
    // Toggle selection
    if (selectedAbilityId === id) {
      setSelectedAbilityId(null); // Deselect
    } else {
      setSelectedAbilityId(id);
      
      // Auto-select target if only one valid target exists?
      // Optional QoL, keeping it manual for now to be safe
    }
  };

  const handleTargetSelect = (targetId: string) => {
    if (!currentUnit || selectedUnitIndex === null || !battle) return;

    const ability = currentUnit.abilities.find(a => a.id === selectedAbilityId);
    
    // Queue the action
    queueUnitAction(selectedUnitIndex, selectedAbilityId, [targetId], ability);
    
    // Reset selection for next
    setSelectedAbilityId(null);
    setHoveredAbilityId(null);

    // Auto-advance to next unit by SPEED
    const order = getPlanningTurnOrder(battle);
    const currentOrderIdx = order.indexOf(selectedUnitIndex);
    if (currentOrderIdx !== -1 && currentOrderIdx < order.length - 1) {
      setSelectedUnitIndex(order[currentOrderIdx + 1]);
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
  let validTargets: { id: string; name: string }[] = [];
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
    validTargets = getValidTargets(ability, currentUnit, battle.playerTeam, battle.enemies);
  }

  // --- HELPERS FOR RENDERING ABILITY LIST ---
  const renderAbilityButton = (
    id: string | null, 
    name: string, 
    cost: number, 
    isDjinn: boolean = false,
    isLocked: boolean = false,
    lockedReason?: string
  ) => {
    const canAfford = canAffordAction(battle.remainingMana, cost);
    const isSelected = selectedAbilityId === id;
    const isHovered = hoveredAbilityId === id;
    
    let bgStyle = STYLES.abilityBtn;
    if (isSelected) bgStyle = { ...bgStyle, ...STYLES.abilityBtnSelected };
    else if (isHovered && !isLocked) bgStyle = { ...bgStyle, ...STYLES.abilityBtnHover };
    
    const opacity = (isLocked || !canAfford) ? 0.5 : 1;

    return (
      <button
        key={id ?? 'attack'}
        style={{ ...bgStyle, opacity }}
        onClick={() => !isLocked && canAfford && handleAbilitySelect(id)}
        onMouseEnter={() => handleAbilityHover(id)}
        onMouseLeave={() => handleAbilityHover(null)}
        disabled={isLocked || !canAfford}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isDjinn && <span style={{ color: '#9c27b0' }}>✦</span>}
          {isLocked && <span>🔒</span>}
          {name}
        </span>
        <span style={{ fontSize: '0.8rem', color: canAfford ? '#4fc3f7' : '#ef5350' }}>
          {cost} MP
        </span>
      </button>
    );
  };

  // --- HELPERS FOR DETAILS PANEL ---
  const activeDetailId = hoveredAbilityId ?? selectedAbilityId;
  const activeAbility = activeDetailId && currentUnit 
    ? currentUnit.abilities.find(a => a.id === activeDetailId) 
    : null;
  
  const isBasicAttackDetail = activeDetailId === null;

  return (
    <div style={STYLES.root}>
      
      {/* TOP HUD */}
      <div style={STYLES.topHud}>
        <ManaCirclesBar remainingMana={Math.max(0, battle.remainingMana)} maxMana={battle.maxMana} />
        <DjinnBar 
          team={battle.playerTeam} 
          queuedDjinn={battle.queuedDjinn} 
          onDjinnClick={isPlanningLocked ? undefined : (id) => {
            battle.queuedDjinn.includes(id) ? unqueueDjinnActivation(id) : queueDjinnActivation(id);
          }} 
        />
      </div>

      {/* BATTLEFIELD */}
      <div style={STYLES.battlefield}>
        
        {/* ENEMIES */}
        <div style={STYLES.enemyRow}>
          {battle.enemies.map(enemy => {
            const isTargetCandidate = validTargets.some(t => t.id === enemy.id);
            const isDead = isUnitKO(enemy);
            if (isDead) return null; // Or render corpse

            return (
              <div 
                key={enemy.id}
                onClick={() => isTargetCandidate && handleTargetSelect(enemy.id)}
                style={{
                  cursor: isTargetCandidate ? 'pointer' : 'default',
                  filter: isTargetCandidate ? 'drop-shadow(0 0 15px #ffd700)' : 'none',
                  transform: isTargetCandidate ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s'
                }}
              >
                <UnitCard unit={enemy} isPlayer={false} team={battle.playerTeam} hideHp={true} />
                {isTargetCandidate && (
                  <div style={{ 
                    textAlign: 'center', marginTop: '0.5rem', color: '#ffd700', fontWeight: 'bold', fontSize: '0.8rem' 
                  }}>
                    CLICK TO TARGET
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PLAYERS */}
        <div style={STYLES.playerRow}>
          {battle.playerTeam.units.map((unit, idx) => {
             const isActive = idx === selectedUnitIndex;
             const action = battle.queuedActions[idx];
             const hasAction = action !== null;

             return (
               <div 
                 key={unit.id}
                 onClick={() => !isPlanningLocked && setSelectedUnitIndex(idx)}
                 style={{
                   transform: isActive ? 'translateY(-20px) scale(1.1)' : 'none',
                   filter: isActive ? 'brightness(1.2)' : hasAction ? 'grayscale(0.5)' : 'none',
                   opacity: isUnitKO(unit) ? 0.5 : 1,
                   transition: 'all 0.2s',
                   cursor: 'pointer',
                   position: 'relative'
                 }}
               >
                 <UnitCard unit={unit} isPlayer={true} team={battle.playerTeam} />
                 {hasAction && (
                   <div style={{
                     position: 'absolute', top: '-10px', right: '-10px',
                     background: '#4CAF50', color: '#fff', width: '24px', height: '24px',
                     borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                     fontSize: '14px', border: '2px solid #1a202c'
                   }}>✓</div>
                 )}
               </div>
             );
          })}
        </div>

        {/* Target Prompt Overlay */}
        {validTargets.length > 0 && (
          <div style={STYLES.targetOverlay}>
            <div style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              SELECT TARGET
            </div>
            <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
              Click a valid target to confirm action
            </div>
            <button 
              onClick={() => { setSelectedAbilityId(null); setHoveredAbilityId(null); }}
              style={{
                marginTop: '1rem',
                background: 'transparent', border: '1px solid #666', color: '#888',
                padding: '0.25rem 1rem', borderRadius: '4px', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        )}

      </div>

      {/* COMMAND DECK (30/70 Split) */}
      <div style={STYLES.commandDeck}>
        
        {/* LEFT: ABILITY LIST (30%) */}
        <div style={STYLES.deckLeft}>
          <div style={STYLES.activeUnitIndicator}>
            <span>{currentUnit ? currentUnit.name : 'Select Unit...'}</span>
            {currentUnit && <span style={{ fontSize: '0.8rem', color: '#888' }}>Lv {currentUnit.level}</span>}
          </div>
          
          <div style={STYLES.abilityList}>
            {currentUnit && !isPlanningLocked && !isUnitKO(currentUnit) ? (
              <>
                {renderAbilityButton(null, '⚔️ Attack', 0)}
                
                {currentUnit.abilities
                  .filter(a => currentUnit.unlockedAbilityIds.includes(a.id))
                  .map(ability => {
                    const isDjinn = !!DJINN_ABILITIES[ability.id];
                    return renderAbilityButton(ability.id, ability.name, ability.manaCost || 0, isDjinn);
                })}
                
                {lockedDjinnAbilities.map(meta => {
                  const ability = DJINN_ABILITIES[meta.abilityId];
                  if (!ability) return null;
                  return renderAbilityButton(ability.id, ability.name, ability.manaCost || 0, true, true);
                })}
              </>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                {isExecuting ? 'Executing...' : 'Unit cannot act'}
              </div>
            )}
          </div>

          {/* EXECUTE BUTTON (Bottom of List) */}
          {isQueueComplete && !isExecuting && (
            <button 
              onClick={handleExecute}
              style={{
                padding: '1rem',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: 'auto'
              }}
            >
              EXECUTE ROUND ►
            </button>
          )}
        </div>

        {/* RIGHT: COMBAT LOG / DETAILS (70%) */}
        <div style={STYLES.deckRight}>
          
          {/* STATE A: ABILITY DETAILS (Overlay) */}
          {(activeAbility || isBasicAttackDetail) && (hoveredAbilityId !== null || selectedAbilityId !== null) && (
            <div style={STYLES.detailsPanel}>
              <div style={STYLES.detailsHeader}>
                <div style={STYLES.detailsTitle}>
                  {activeAbility ? (
                    <>
                      {DJINN_ABILITIES[activeAbility.id] ? '✦' : ''}
                      {activeAbility.name}
                    </>
                  ) : '⚔️ Attack'}
                </div>
                <div style={STYLES.detailsMeta}>
                  {activeAbility ? `${activeAbility.manaCost} MP` : '0 MP'} • 
                  {activeAbility ? ` ${activeAbility.element || 'Physical'}` : ' Physical'}
                </div>
              </div>

              <div style={STYLES.detailsBody}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '1rem', color: '#ccc', lineHeight: '1.5' }}>
                    {activeAbility?.description || 'Perform a standard physical attack with your equipped weapon.'}
                  </div>
                  
                  {/* Dynamic Weakness Hint could go here if we wanted to be fancy */}
                  {/* <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#1a253a', borderRadius: '4px' }}>
                    Targeting: {activeAbility?.targets || 'Single Enemy'}
                  </div> */}
                </div>

                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={STYLES.statBlock}>
                     <span style={STYLES.statLabel}>POWER</span>
                     <span style={STYLES.statValue}>{activeAbility?.power ? activeAbility.power : '100% ATK'}</span>
                   </div>
                   <div style={STYLES.statBlock}>
                     <span style={STYLES.statLabel}>TARGET</span>
                     <span style={STYLES.statValue}>
                       {activeAbility?.targets?.replace('-', ' ') || 'Single Enemy'}
                     </span>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* STATE B: COMBAT LOG (Default) */}
          <div style={{ padding: '1rem', overflowY: 'auto', height: '100%' }}>
            <BattleLog events={events} renderText={renderEventText} />
          </div>
        </div>

      </div>
    </div>
  );
}
