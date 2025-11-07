import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/context';
import type { Unit } from '@/types/Unit';
import type { Ability } from '@/types/Ability';
import { StatusBar } from './StatusBar';
import { UnitRow } from './UnitRow';
import { CommandMenu } from './CommandMenu';
import { AbilityMenu } from './AbilityMenu';
import { CombatLog } from './CombatLog';
import { PartyPortraits } from './PartyPortraits';
import { PsynergyAnimation } from './PsynergyAnimation';
import { AttackAnimation } from './AttackAnimation';
import { DamageNumber } from './DamageNumber';
import { shouldShowPsynergyAnimation } from '@/data/psynergySprites';
import { executeAbility, calculateTurnOrder, attemptFlee, processStatusEffectTick, checkParalyzeFailure } from '@/types/Battle';
import './BattleScreen.css';

type BattlePhase =
  | 'idle'              // Waiting for player/AI turn
  | 'selectCommand'     // Player selecting Attack/Psynergy/Djinn
  | 'selectAbility'     // Player selecting which ability
  | 'selectTarget'      // Player selecting target unit
  | 'animating'         // Playing action animation
  | 'victory'           // Battle won
  | 'defeat';           // Battle lost

export const BattleScreen: React.FC = () => {
  const { state, actions } = useGame();
  const battle = state.currentBattle;

  const [phase, setPhase] = useState<BattlePhase>('idle');
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [currentActorIndex, setCurrentActorIndex] = useState(0);

  // Animation state
  const [activeAnimations, setActiveAnimations] = useState<Array<{
    id: number;
    type: 'psynergy' | 'attack' | 'damage' | 'heal';
    abilityId?: string;
    element?: string;
    damage?: number;
    isHeal?: boolean;
    isCritical?: boolean;
    position: { x: number; y: number };
  }>>([]);
  // We only use the setter to allocate unique animation IDs atomically.
  // The current counter value is intentionally unused.
  const [, setAnimationIdCounter] = useState(0);

  if (!battle) {
    return (
      <div className="battle-screen error">
        <div className="error-message">No battle active</div>
      </div>
    );
  }

  // Get turn order
  const allUnits = [...battle.playerTeam.units, ...battle.enemies];
  const turnOrder = calculateTurnOrder(allUnits);
  const currentActor = turnOrder[currentActorIndex];
  const isPlayerUnit = battle.playerTeam.units.includes(currentActor);

  // Start turn
  useEffect(() => {
    if (!currentActor || currentActor.currentHp <= 0) {
      // Skip KO'd units
      advanceTurn();
      return;
    }

    // Process status effects at start of turn
    const statusResult = processStatusEffectTick(currentActor);
    if (statusResult.messages.length > 0) {
      setCombatLog(prev => [...prev, ...statusResult.messages]);
    }

    // Check if unit is frozen (skip turn)
    const isFrozen = currentActor.statusEffects.some(e => e.type === 'freeze' && e.duration > 0);
    if (isFrozen) {
      // Skip turn if frozen
      setTimeout(() => advanceTurn(), 1500);
      return;
    }

    if (isPlayerUnit && phase === 'idle') {
      setPhase('selectCommand');
    } else if (!isPlayerUnit && phase === 'idle') {
      // AI turn - execute after delay
      setTimeout(() => executeAITurn(), 1000);
    }
  }, [currentActorIndex, phase, currentActor, isPlayerUnit]);

  // Handle command selection
  const handleCommandSelect = useCallback((command: 'attack' | 'psynergy' | 'djinn' | 'defend' | 'flee') => {
    setSelectedCommand(command);

    if (command === 'attack') {
      // Attack = select target directly
      setPhase('selectTarget');
    } else if (command === 'psynergy') {
      // Psynergy = show ability menu
      setPhase('selectAbility');
    } else if (command === 'defend') {
      // Defend = apply buff, advance turn
      applyDefendBuff();
      advanceTurn();
    } else if (command === 'flee') {
      // Attempt to flee from battle
      handleFlee();
    }
  }, []);

  // Handle ability selection
  const handleAbilitySelect = useCallback((ability: Ability) => {
    setSelectedAbility(ability);
    setPhase('selectTarget');
  }, []);

  // Handle target selection
  const handleTargetSelect = useCallback((target: Unit) => {
    if (target.currentHp <= 0) return; // Can't target KO'd units

    executePlayerTurn(target);
  }, [selectedCommand, selectedAbility, currentActor]);

  // Helper: Trigger animation for ability
  // Allocates 2 animation IDs atomically to avoid race conditions
  const triggerAnimation = (ability: Ability, _target: Unit, damage: number, isHeal: boolean = false) => {
    const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    setAnimationIdCounter(prev => {
      const attackId = prev;
      const numberId = prev + 1;

      // Show psynergy animation for non-physical abilities
      if (shouldShowPsynergyAnimation(ability.id)) {
        setActiveAnimations(prevAnims => [...prevAnims, {
          id: attackId,
          type: 'psynergy',
          abilityId: ability.id,
          position,
        }]);
      } else {
        // Show attack animation for physical attacks
        setActiveAnimations(prevAnims => [...prevAnims, {
          id: attackId,
          type: 'attack',
          element: ability.element,
          position,
        }]);
      }

      // Show damage/heal number after a brief delay
      setTimeout(() => {
        setActiveAnimations(prevAnims => [...prevAnims, {
          id: numberId,
          type: isHeal ? 'heal' : 'damage',
          damage: Math.abs(damage),
          isHeal,
          isCritical: false, // TODO: Implement critical hit detection
          position,
        }]);
      }, 300);

      return prev + 2;
    });
  };

  // Helper: Remove animation by ID
  const removeAnimation = (id: number) => {
    setActiveAnimations(prev => prev.filter(anim => anim.id !== id));
  };

  // Execute player action
  const executePlayerTurn = async (target: Unit) => {
    setPhase('animating');

    // Check paralyze before action
    if (checkParalyzeFailure(currentActor)) {
      setCombatLog(prev => [...prev, `${currentActor.name} is paralyzed and cannot move!`]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      advanceTurn();
      return;
    }

    // Determine ability
    let ability: Ability;
    if (selectedCommand === 'attack') {
      // Use basic attack (first physical ability)
      ability = currentActor.getAvailableAbilities().find(a => a.type === 'physical') || currentActor.getAvailableAbilities()[0];
    } else {
      ability = selectedAbility!;
    }

    // Execute via Battle functions
    const result = executeAbility(currentActor, ability, [target]);

    // Add to combat log
    setCombatLog(prev => [...prev, result.message]);

    // Trigger animation based on ability type
    const isHeal = ability.type === 'healing';
    const damageAmount = isHeal ? (result.healing || 0) : (result.damage || 0);
    triggerAnimation(ability, target, damageAmount, isHeal);

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check battle end
    const battleEnd = checkBattleEnd();
    if (battleEnd === 'victory') {
      setPhase('victory');
      setCombatLog(prev => [...prev, '>>> VICTORY! <<<']);
      
      // Regenerate PP for all alive units
      let totalPPRestored = 0;
      battle.playerTeam.units.forEach(unit => {
        if (!unit.isKO) {
          totalPPRestored += unit.regeneratePP();
        }
      });
      
      if (totalPPRestored > 0) {
        setCombatLog(prev => [...prev, `Party PP restored! (+${totalPPRestored} PP)`]);
      }
      
      setTimeout(() => actions.navigate({ type: 'REWARDS' }), 2000);
      return;
    } else if (battleEnd === 'defeat') {
      setPhase('defeat');
      setCombatLog(prev => [...prev, '>>> DEFEAT... <<<']);
      setTimeout(() => actions.navigate({ type: 'TITLE' }), 2000);
      return;
    }

    // Advance to next turn
    advanceTurn();
  };

  // Execute AI turn
  const executeAITurn = async () => {
    setPhase('animating');

    // Check paralyze before action
    if (checkParalyzeFailure(currentActor)) {
      setCombatLog(prev => [...prev, `${currentActor.name} is paralyzed and cannot move!`]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      advanceTurn();
      return;
    }

    // Simple AI: attack random player unit
    const targets = battle.playerTeam.units.filter(u => u.currentHp > 0);
    if (targets.length === 0) return;

    const target = targets[Math.floor(Math.random() * targets.length)];
    const ability = currentActor.getAvailableAbilities()[0] || currentActor.getAvailableAbilities().find(a => a.type === 'physical');

    if (!ability) {
      advanceTurn();
      return;
    }

    const result = executeAbility(currentActor, ability, [target]);

    // Add to combat log
    setCombatLog(prev => [...prev, result.message]);

    // Trigger animation based on ability type
    const isHeal = ability.type === 'healing';
    const damageAmount = isHeal ? (result.healing || 0) : (result.damage || 0);
    triggerAnimation(ability, target, damageAmount, isHeal);

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check battle end
    const battleEnd = checkBattleEnd();
    if (battleEnd === 'victory') {
      setPhase('victory');
      setCombatLog(prev => [...prev, '>>> VICTORY! <<<']);
      
      // Regenerate PP for all alive units
      let totalPPRestored = 0;
      battle.playerTeam.units.forEach(unit => {
        if (!unit.isKO) {
          totalPPRestored += unit.regeneratePP();
        }
      });
      
      if (totalPPRestored > 0) {
        setCombatLog(prev => [...prev, `Party PP restored! (+${totalPPRestored} PP)`]);
      }
      
      setTimeout(() => actions.navigate({ type: 'REWARDS' }), 2000);
      return;
    } else if (battleEnd === 'defeat') {
      setPhase('defeat');
      setCombatLog(prev => [...prev, '>>> DEFEAT... <<<']);
      setTimeout(() => actions.navigate({ type: 'TITLE' }), 2000);
      return;
    }

    advanceTurn();
  };

  // Advance turn
  const advanceTurn = () => {
    setCurrentActorIndex(prev => (prev + 1) % turnOrder.length);
    setPhase('idle');
    setSelectedCommand(null);
    setSelectedAbility(null);
  };

  // Check battle end
  const checkBattleEnd = (): 'victory' | 'defeat' | null => {
    const playersAlive = battle.playerTeam.units.some(u => u.currentHp > 0);
    const enemiesAlive = battle.enemies.some(u => u.currentHp > 0);

    if (!enemiesAlive) return 'victory';
    if (!playersAlive) return 'defeat';
    return null;
  };

  // Attempt to flee from battle
  const handleFlee = () => {
    const fleeResult = attemptFlee(
      battle.playerTeam.units,
      battle.enemies,
      battle.isBossBattle || false
    );

    if (!fleeResult.ok) {
      // Error (e.g., boss battle)
      setCombatLog(prev => [...prev, fleeResult.error]);
      return;
    }

    const success = fleeResult.value;

    if (success) {
      // Flee succeeded - return to overworld
      setCombatLog(prev => [...prev, 'The party fled from battle!']);
      setPhase('victory');
      setTimeout(() => actions.navigate({ type: 'OVERWORLD' }), 1500);
    } else {
      // Flee failed - advance turn (enemies get a turn)
      setCombatLog(prev => [...prev, 'Could not escape!']);
      advanceTurn();
    }
  };

  // Apply defend buff (placeholder)
  const applyDefendBuff = () => {
    setCombatLog(prev => [...prev, `${currentActor.name} defends!`]);
    // TODO: Apply defense buff to unit
  };

  return (
    <div 
      className="battle-screen"
      data-area={state.currentLocation || 'vale_village'}
    >
      {/* Top Status Bar */}
      <StatusBar units={battle.playerTeam.units} />

      {/* Turn Order Bar */}
      <div className="turn-order-bar">
        {turnOrder.slice(0, 5).map((unit, idx) => (
          <div
            key={unit.id}
            className={`turn-indicator ${idx === 0 ? 'active' : ''}`}
          >
            {unit.name}
          </div>
        ))}
      </div>

      {/* Enemy Row */}
      <div className="enemy-area">
        <UnitRow
          units={battle.enemies}
          currentActor={!isPlayerUnit ? currentActor : null}
          onUnitClick={phase === 'selectTarget' ? handleTargetSelect : undefined}
          isEnemy={true}
        />
      </div>

      {/* Party Row */}
      <div className="party-area">
        <UnitRow
          units={battle.playerTeam.units}
          currentActor={isPlayerUnit ? currentActor : null}
          onUnitClick={phase === 'selectTarget' && selectedCommand === 'attack' ? handleTargetSelect : undefined}
          isEnemy={false}
        />
      </div>

      {/* Bottom Panel */}
      <div className="bottom-panel">
        {/* Combat Log */}
        <div className="log-area">
          <CombatLog messages={combatLog} />
        </div>

        {/* Party Portraits */}
        <div className="portraits-area">
          <PartyPortraits
            units={battle.playerTeam.units}
            currentActor={isPlayerUnit ? currentActor : null}
          />
        </div>

        {/* Action Menu */}
        <div className="action-area">
          {phase === 'selectCommand' && (
            <CommandMenu
              unit={currentActor}
              onSelectCommand={handleCommandSelect}
              isBossBattle={battle.isBossBattle}
            />
          )}

          {phase === 'selectAbility' && (
            <AbilityMenu
              unit={currentActor}
              onSelectAbility={handleAbilitySelect}
              onBack={() => setPhase('selectCommand')}
            />
          )}

          {phase === 'selectTarget' && (
            <div className="target-prompt">
              <h3>Select Target</h3>
              <p>Click on {selectedCommand === 'attack' ? 'an enemy' : 'a target'} to attack</p>
            </div>
          )}

          {phase === 'animating' && (
            <div className="animating-indicator">
              <span className="dots">...</span>
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

      {/* Active Animations */}
      {activeAnimations.map(anim => {
        if (anim.type === 'psynergy' && anim.abilityId) {
          return (
            <PsynergyAnimation
              key={anim.id}
              abilityId={anim.abilityId}
              position={anim.position}
              size={anim.abilityId.includes('all') ? 192 : 128} // Larger for AOE spells
              onComplete={() => removeAnimation(anim.id)}
            />
          );
        } else if (anim.type === 'attack') {
          return (
            <AttackAnimation
              key={anim.id}
              element={anim.element as any}
              targetPosition={anim.position}
              onComplete={() => removeAnimation(anim.id)}
              duration={1000}
            />
          );
        } else if (anim.type === 'damage' && anim.damage !== undefined) {
          return (
            <DamageNumber
              key={anim.id}
              value={anim.damage}
              type={anim.isCritical ? 'critical' : 'damage'}
              position={anim.position}
              onComplete={() => removeAnimation(anim.id)}
            />
          );
        } else if (anim.type === 'heal' && anim.damage !== undefined) {
          return (
            <DamageNumber
              key={anim.id}
              value={anim.damage}
              type="heal"
              position={anim.position}
              onComplete={() => removeAnimation(anim.id)}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

