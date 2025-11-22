/**
 * Queue-Based Battle View Component
 * PR-QUEUE-BATTLE: Main battle UI with planning and execution phases
 * Phase 5: "Command Deck" Redesign & Speed-Based Turn Input
 */

import { useEffect, useState, useMemo } from 'react';
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
import { ActionQueuePanel } from './ActionQueuePanel';

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
      if (order.length > 0 && order[0] !== undefined) {
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

  // const handleAbilityHover = (id: string | null) => {
  //   setHoveredAbilityId(id);
  // };

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
      const nextIndex = order[currentOrderIdx + 1];
      if (nextIndex !== undefined) {
        setSelectedUnitIndex(nextIndex);
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

  // --- HELPERS FOR RENDERING ABILITY LIST ---
  // Unused function - commented out to fix TypeScript warnings
  /*
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
  */

  // --- HELPERS FOR DETAILS PANEL ---
  // const activeDetailId = hoveredAbilityId ?? selectedAbilityId; // Unused - commented out
  // Unused variables - commented out to fix TypeScript warnings
  /*
  const activeAbility = activeDetailId && currentUnit 
    ? currentUnit.abilities.find(a => a.id === activeDetailId) 
    : null;
  
  const isBasicAttackDetail = activeDetailId === null;
  */

  const isExecuting = battle.phase === 'executing';

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
          borderRadius: '0',
          marginBottom: '1rem',
          opacity: isPlanningLocked ? 0.6 : 1,
          pointerEvents: isPlanningLocked ? 'none' : 'auto',
        }}
      >
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

      {/* Execution indicator */}
      {isExecuting && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#2a2a2a',
            border: '2px solid #666',
            borderRadius: '0',
            marginBottom: '1rem',
            textAlign: 'center',
            color: '#FFD87F',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            fontFamily: "'Press Start 2P', monospace",
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
        {/* Enemy Side */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#fff', fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}>ENEMIES</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {battle.enemies.map((enemy) => {
              const isTargetCandidate = validTargets.some(t => t.id === enemy.id);
              const isDead = isUnitKO(enemy);
              if (isDead) return null;

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
                      textAlign: 'center', marginTop: '0.5rem', color: '#ffd700', fontWeight: 'bold', fontSize: '0.8rem',
                      fontFamily: "'Press Start 2P', monospace",
                    }}>
                      CLICK TO TARGET
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Player Side */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#fff', fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}>PLAYER TEAM</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {battle.playerTeam.units.map((unit, index) => {
              const isActive = index === selectedUnitIndex;
              const action = battle.queuedActions[index];
              const hasAction = action !== null;

              return (
                <div
                  key={unit.id}
                  onClick={() => {
                    if (battle.phase === 'planning' && !isPlanningLocked) {
                      setSelectedUnitIndex(index);
                      setSelectedAbilityId(null);
                      setHoveredAbilityId(null);
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    transform: isActive ? 'translateY(-10px) scale(1.05)' : 'none',
                    filter: isActive ? 'brightness(1.2)' : hasAction ? 'grayscale(0.5)' : 'none',
                    opacity: isUnitKO(unit) ? 0.5 : 1,
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <UnitCard unit={unit} isPlayer={true} team={battle.playerTeam} />
                  {hasAction && (
                    <div style={{
                      position: 'absolute', top: '-10px', right: '-10px',
                      background: '#4CAF50', color: '#fff', width: '24px', height: '24px',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', border: '2px solid #1a1a1a'
                    }}>✓</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target Prompt Overlay */}
      {validTargets.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '200px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '1rem 2rem',
          background: 'rgba(15, 20, 30, 0.95)',
          borderRadius: '0',
          border: '2px solid #ffd700',
          zIndex: 50,
          textAlign: 'center',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '8px',
        }}>
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
              background: 'transparent', border: '2px solid #666', color: '#888',
              padding: '0.5rem 1rem', borderRadius: '0', cursor: 'pointer',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '8px',
            }}
          >
            CANCEL
          </button>
        </div>
      )}

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
              borderRadius: '0',
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
                        backgroundColor: selectedAbilityId === null ? '#4CAF50' : '#2a2a2a',
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
                              backgroundColor: selectedAbilityId === ability.id ? '#4CAF50' : canAfford ? '#2a2a2a' : '#1a1a1a',
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

                {/* Locked Djinn abilities */}
                {lockedDjinnAbilities.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h5 style={{ margin: '0 0 0.25rem 0', color: '#aaa', fontSize: '8px', textShadow: '1px 1px 0 #000' }}>
                      🔒 LOCKED DJINN ABILITIES
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {lockedDjinnAbilities.map((meta) => {
                        const ability = DJINN_ABILITIES[meta.abilityId];
                        if (!ability) return null;
                        const reason = meta.djinnId ? `Djinn ${DJINN[meta.djinnId]?.name || meta.djinnId} not available` : 'Unknown';
                        return (
                          <button
                            key={`${meta.abilityId}-${meta.djinnId}`}
                            disabled
                            title={`${ability.name} locked because ${reason}`}
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
                            🔒 {ability.name.toUpperCase()} [{ability.manaCost ?? 0}○] — {reason}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Execute Round Button */}
                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={handleExecute}
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
        /* Execution Phase: Show Battle Log */
        <div style={{
          flex: '0 0 auto',
          maxHeight: '40vh',
          backgroundColor: '#1a1a1a',
          border: '2px solid #444',
          borderRadius: '0',
          padding: '1rem',
          overflow: 'auto',
        }}>
          <BattleLog events={events} renderText={renderEventText} />
        </div>
      )}
    </div>
  );
}
