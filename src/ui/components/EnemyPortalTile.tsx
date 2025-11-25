/**
 * EnemyPortalTile Component
 * Minimal enemy display (illustrative portal tile design)
 */

import { ENCOUNTERS } from '@/data/definitions/encounters';
import { ENEMIES } from '@/data/definitions/enemies';
import { getEnemyBattleSprite } from '../sprites/mappings';
import { SimpleSprite } from '../sprites/SimpleSprite';

interface EnemyPortalTileProps {
  encounterId: string;
}

export function EnemyPortalTile({ encounterId }: EnemyPortalTileProps) {
  const encounter = ENCOUNTERS[encounterId];
  if (!encounter) {
    return (
      <div className="enemies-section">
        <div className="enemy-portal">
          <div className="portal-title">ENEMIES</div>
          <div className="portal-enemies">Unknown</div>
        </div>
      </div>
    );
  }

  // Get enemy names from encounter
  const enemyNames = encounter.enemies
    .map((enemyId) => {
      const enemy = ENEMIES[enemyId];
      return enemy?.name || enemyId;
    })
    .join(' • ');

  const enemyEntries = encounter.enemies.map((enemyId) => {
    const enemy = ENEMIES[enemyId];
    return {
      id: enemyId,
      name: enemy?.name ?? enemyId,
      spriteId: getEnemyBattleSprite(enemyId, 'idle'),
    };
  });

  return (
    <div className="enemies-section">
      <div className="enemy-portal">
        <div className="portal-icon">⚔️</div>
        <div className="portal-title">ENEMIES</div>
        <div className="portal-enemies">{enemyNames || 'None'}</div>
        <div className="enemy-portraits">
          {enemyEntries.map((entry) => (
            <div key={entry.id} className="enemy-portrait-chip">
              {entry.spriteId ? (
                <SimpleSprite id={entry.spriteId} width={36} height={36} alt={entry.name} />
              ) : (
                <div className="enemy-portrait-fallback">?</div>
              )}
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

