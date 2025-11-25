import { useEffect } from 'react';
import { MAPS } from '@/data/definitions/maps';
import { useStore } from '../state/store';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPlayerSprite, shouldMirrorSprite, getNPCSprite } from '../sprites/mappings';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';
import type { Tile, Position } from '@/core/models/overworld';
import './OverworldMap.css';

export function OverworldMap() {
  const { currentMapId, playerPosition, facing, movePlayer, currentTrigger, clearTrigger, teleportPlayer, resetLastTrigger, mode, team } = useStore(state => ({
    currentMapId: state.currentMapId,
    playerPosition: state.playerPosition,
    facing: state.facing,
    movePlayer: state.movePlayer,
    currentTrigger: state.currentTrigger,
    clearTrigger: state.clearTrigger,
    teleportPlayer: state.teleportPlayer,
    resetLastTrigger: state.resetLastTrigger,
    mode: state.mode,
    team: state.team,
  }));

  const map = MAPS[currentMapId];
  useEffect(() => {
    // Only listen in overworld mode
    if (mode !== 'overworld') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle movement when in overworld mode (not during dialogue, shops, etc.)
      if (mode !== 'overworld') return;

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        movePlayer('up');
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        movePlayer('down');
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        movePlayer('left');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
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
            Position: ({playerPosition.x}, {playerPosition.y})
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

              // Find NPC at this position
              const npcAtPosition = map.npcs.find(npc =>
                npc.position.x === x && npc.position.y === y
              );

              return (
                <div
                  key={`${x}-${y}`}
                  className={`tile tile-${tile.type}`}
                  style={{
                    backgroundImage:
                      tile.spriteId && (tile.spriteId.startsWith('/') || tile.spriteId.startsWith('http'))
                        ? `url(${tile.spriteId})`
                        : undefined,
                    position: 'relative',
                  }}
                  data-sprite={tile.spriteId ?? undefined}
                >
                  {/* NPC Sprite */}
                  {npcAtPosition && !isPlayer && (
                    <SimpleSprite
                      id={(() => {
                        const npcSpriteId = getNPCSprite(npcAtPosition.id);
                        warnIfPlaceholderSprite('OverworldMap', npcSpriteId);
                        return npcSpriteId;
                      })()}
                      width={32}
                      height={32}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 2, // Above tiles, below player
                      }}
                    />
                  )}

                  {/* Player Sprite */}
                  {isPlayer && team && team.units[0] && (
                    <SimpleSprite
                      id={(() => {
                        const playerSpriteId = getPlayerSprite(team.units[0].id, facing);
                        warnIfPlaceholderSprite('OverworldMap', playerSpriteId);
                        return playerSpriteId;
                      })()}
                      width={32}
                      height={32}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 3, // Above NPCs
                        transform: shouldMirrorSprite(facing) ? 'scaleX(-1)' : 'none',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
