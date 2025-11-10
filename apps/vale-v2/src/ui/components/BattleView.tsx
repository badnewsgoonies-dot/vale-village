/**
 * Main battle view component
 * Orchestrates battle UI and event handling
 */

import { useEffect } from 'react';
import { useStore } from '../state/store';
import { renderEventText } from '../utils/text';
import { TurnOrderStrip } from './TurnOrderStrip';
import { ActionBar } from './ActionBar';
import { BattleLog } from './BattleLog';
import { UnitCard } from './UnitCard';

export function BattleView() {
  const battle = useStore((s) => s.battle);
  const events = useStore((s) => s.events);
  const dequeue = useStore((s) => s.dequeueEvent);
  const startTurnTick = useStore((s) => s.startTurnTick);

  useEffect(() => {
    if (!battle) return;
    startTurnTick(); // Process start-of-turn effects on mount/turn change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle?.currentTurn]);

  useEffect(() => {
    if (!events.length) return;
    const t = setTimeout(() => dequeue(), 450); // ~450ms per event; tune or vary by type
    return () => clearTimeout(t);
  }, [events, dequeue]);

  if (!battle) return <div>No battle loaded.</div>;

  const playerUnits = battle.playerTeam.units;
  const enemies = battle.enemies;

  return (
    <div className="battle-root" style={{ padding: '1rem' }}>
      <TurnOrderStrip state={battle} />
      
      <div className="stage" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <div className="player-side" style={{ flex: 1 }}>
          <h3>Player Team</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {playerUnits.map((unit) => (
              <UnitCard key={unit.id} unit={unit} isPlayer={true} />
            ))}
          </div>
        </div>

        <div className="enemy-side" style={{ flex: 1 }}>
          <h3>Enemies</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {enemies.map((unit) => (
              <UnitCard key={unit.id} unit={unit} isPlayer={false} />
            ))}
          </div>
        </div>
      </div>

      <ActionBar />

      <BattleLog events={events} renderText={renderEventText} />
    </div>
  );
}

