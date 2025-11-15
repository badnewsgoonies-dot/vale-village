import { useEffect } from 'react';
import { MAPS } from '@/data/definitions/maps';
import { useStore } from '../state/store';
import type { Tile, Position } from '@/core/models/overworld';
import './OverworldMap.css';

export function OverworldMap() {
  const { currentMapId, playerPosition, movePlayer, currentTrigger, clearTrigger, teleportPlayer, resetLastTrigger, stepCount, mode } = useStore(state => ({
    currentMapId: state.currentMapId,
    playerPosition: state.playerPosition,
    movePlayer: state.movePlayer,
    currentTrigger: state.currentTrigger,
    clearTrigger: state.clearTrigger,
    teleportPlayer: state.teleportPlayer,
    resetLastTrigger: state.resetLastTrigger,
    stepCount: state.stepCount,
    mode: state.mode,
  }));

  const map = MAPS[currentMapId];
  useEffect(() => {
    // Only listen in overworld mode
    if (mode !== 'overworld') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        movePlayer('up');
      } else if (event.key === 'ArrowDown') {
        movePlayer('down');
      } else if (event.key === 'ArrowLeft') {
        movePlayer('left');
      } else if (event.key === 'ArrowRight') {
        movePlayer('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, mode]);


  useEffect(() => {
    if (!currentTrigger) return;

    if (currentTrigger.type === 'transition') {
      const data = currentTrigger.data as { targetMap?: string; targetPos?: Position };
      if (data.targetMap && data.targetPos) {
        teleportPlayer(data.targetMap, data.targetPos);
      }
    }

    clearTrigger();
    resetLastTrigger();
  }, [currentTrigger, clearTrigger, teleportPlayer, resetLastTrigger]);

  if (!map) {
    return <div>No overworld map loaded.</div>;
  }

  // Calculate encounter rate display
  const encounterRatePercent = map.encounterRate ? Math.round(map.encounterRate * 100) : 0;
  const hasRandomEncounters = map.encounterRate && map.encounterPool && map.encounterPool.length > 0;

  // Find triggers at various positions
  const getTriggerAt = (x: number, y: number) => {
    return map.triggers.find(t => t.position.x === x && t.position.y === y);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
      {/* Map Info Header */}
      <div style={{
        padding: '0.75rem',
        backgroundColor: '#2c3e50',
        color: 'white',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{map.name}</h2>
          <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.9 }}>
            Position: ({playerPosition.x}, {playerPosition.y}) | Steps: {stepCount}
          </div>
        </div>
        {hasRandomEncounters && (
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e74c3c',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
          }}>
            Encounter Rate: {encounterRatePercent}%
          </div>
        )}
      </div>

      {/* Map Visualization */}
      <div className="overworld-container">
        {map.tiles.map((row, y) => (
          <div key={y} className="tile-row">
            {row.map((tile: Tile, x) => {
              const isPlayer = playerPosition.x === x && playerPosition.y === y;
              const trigger = getTriggerAt(x, y);
              const hasTrigger = !!trigger;
              const triggerType = trigger?.type;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`tile tile-${tile.type}`}
                  style={{
                    backgroundImage: tile.spriteId ? `url(/sprites/${tile.spriteId}.png)` : undefined,
                    position: 'relative',
                  }}
                >
                  {/* Trigger indicators */}
                  {hasTrigger && !isPlayer && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor:
                        triggerType === 'battle' ? '#e74c3c' :
                        triggerType === 'shop' ? '#f39c12' :
                        triggerType === 'npc' ? '#3498db' :
                        triggerType === 'transition' ? '#9b59b6' :
                        '#95a5a6',
                    }} />
                  )}
                  {isPlayer && <div className="player-sprite" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        padding: '0.75rem',
        backgroundColor: '#ecf0f1',
        borderRadius: '4px',
        fontSize: '0.75rem',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Legend:</div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#e74c3c' }} />
            <span>Battle Trigger</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f39c12' }} />
            <span>Shop</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3498db' }} />
            <span>NPC</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#9b59b6' }} />
            <span>Transition</span>
          </div>
        </div>
      </div>
    </div>
  );
}
