import { useEffect } from 'react';
import { MAPS } from '@/data/definitions/maps';
import { useStore } from '../state/store';
import type { Tile, Position } from '@/core/models/overworld';
import './OverworldMap.css';

export function OverworldMap() {
  const { currentMapId, playerPosition, movePlayer, currentTrigger, clearTrigger, teleportPlayer, resetLastTrigger } = useStore(state => ({
    currentMapId: state.currentMapId,
    playerPosition: state.playerPosition,
    movePlayer: state.movePlayer,
    currentTrigger: state.currentTrigger,
    clearTrigger: state.clearTrigger,
    teleportPlayer: state.teleportPlayer,
    resetLastTrigger: state.resetLastTrigger,
  }));

  const map = MAPS[currentMapId];
  useEffect(() => {
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
  }, [movePlayer]);


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

  return (
    <div className="overworld-container">
      {map.tiles.map((row, y) => (
        <div key={y} className="tile-row">
          {row.map((tile: Tile, x) => {
            const isPlayer = playerPosition.x === x && playerPosition.y === y;
            return (
              <div
                key={`${x}-${y}`}
                className={`tile tile-${tile.type}`}
                style={{
                  backgroundImage: tile.spriteId ? `url(/sprites/${tile.spriteId}.png)` : undefined,
                }}
              >
                {isPlayer && <div className="player-sprite" />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
