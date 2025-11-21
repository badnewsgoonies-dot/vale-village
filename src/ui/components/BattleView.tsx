/**
 * Main battle view component
 * Orchestrates battle UI and event handling
 */

import { useEffect, useState } from 'react';
import { useStore } from '../state/store';
import { renderEventText } from '../utils/text';
import { TurnOrderStrip } from './TurnOrderStrip';
import { ActionBar } from './ActionBar';
import { BattleLog } from './BattleLog';
import { UnitCard } from './UnitCard';
import { PostBattleCutscene } from './PostBattleCutscene';
import { VictoryOverlay } from './VictoryOverlay';
import { BackgroundSprite } from '../sprites/BackgroundSprite';

export function BattleView() {
  // Use narrow selectors to minimize re-renders
  const battle = useStore((s) => s.battle);
  const eventsLength = useStore((s) => s.events.length);
  const events = useStore((s) => s.events);
  const dequeue = useStore((s) => s.dequeueEvent);
  const startTurnTick = useStore((s) => s.startTurnTick);
  const performAIAction = useStore((s) => s.performAIAction);
  const setMode = useStore((s) => s.setMode);
  
  // Post-battle flow state
  const [showCutscene, setShowCutscene] = useState(false);
  const [showVictoryOverlay, setShowVictoryOverlay] = useState(false);
  
  // Check for battle end
  const battleEnded = useStore((s) => {
    if (!s.battle) return false;
    return s.events.some(e => e.type === 'battle-end');
  });

  // Get battle result
  const battleResult = useStore((s) => {
    const endEvent = s.events.find(e => e.type === 'battle-end');
    return endEvent && 'result' in endEvent ? endEvent.result : null;
  });

  // Detect battle end and trigger cutscene
  useEffect(() => {
    if (battleEnded && battleResult === 'PLAYER_VICTORY' && !showCutscene && !showVictoryOverlay) {
      setShowCutscene(true);
    }
  }, [battleEnded, battleResult, showCutscene, showVictoryOverlay]);

  useEffect(() => {
    if (!battle) return;
    startTurnTick(); // Process start-of-turn effects on mount/turn change
    
    // Check if it's an enemy turn and auto-execute AI
    const currentActorId = battle.turnOrder[battle.currentActorIndex];
    const isPlayerUnit = battle.playerTeam.units.some(u => u.id === currentActorId);
    
    if (!isPlayerUnit && currentActorId) {
      // Enemy turn - execute AI decision after a short delay
      const timer = setTimeout(() => {
        performAIAction();
      }, 500); // 500ms delay for visual feedback
      return () => clearTimeout(timer);
    }
    
    return undefined; // Explicit return for player turns
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle?.currentTurn, battle?.currentActorIndex, performAIAction]);

  useEffect(() => {
    if (!events.length || battleEnded) return; // Stop processing if battle ended
    const t = setTimeout(() => dequeue(), 450); // ~450ms per event; tune or vary by type
    return () => clearTimeout(t);
  }, [eventsLength, battleEnded, dequeue]); // Use eventsLength instead of events array

  if (!battle) return <div>No battle loaded.</div>;

  // Post-battle flow: Cutscene → Overlay → Rewards (handled in App.tsx)
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

  const playerUnits = battle.playerTeam.units;
  const enemies = battle.enemies;

  return (
    <div className="battle-root" style={{ position: 'relative', width: '100%', minHeight: '600px' }}>
      {/* Battle Background */}
      <BackgroundSprite 
        id="random"
        category="backgrounds-gs1"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />
      
      {/* Battle UI Overlay */}
      <div style={{ position: 'relative', zIndex: 1, padding: '1rem' }}>
        <TurnOrderStrip state={battle} />
        
        <div className="stage" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div className="player-side" style={{ flex: 1 }}>
            <h3 style={{ color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Player Team</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {playerUnits.map((unit) => (
                <UnitCard key={unit.id} unit={unit} isPlayer={true} team={battle.playerTeam} />
              ))}
            </div>
          </div>

          <div className="enemy-side" style={{ flex: 1 }}>
            <h3 style={{ color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Enemies</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* PR-STATS-EFFECTIVE: Enemies also need team for effective stats (Djinn bonuses apply to all units) */}
              {enemies.map((unit) => (
                <UnitCard key={unit.id} unit={unit} isPlayer={false} team={battle.playerTeam} />
              ))}
            </div>
          </div>
        </div>

        <ActionBar disabled={battleEnded} />

        <BattleLog events={events} renderText={renderEventText} />
      </div>
    </div>
  );
}

