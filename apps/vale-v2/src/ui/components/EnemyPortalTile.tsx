/**
 * EnemyPortalTile Component
 * Minimal enemy display (illustrative portal tile design)
 */

import { ENCOUNTERS } from '@/data/definitions/encounters';
import { ENEMIES } from '@/data/definitions/enemies';

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

  return (
    <div className="enemies-section">
      <div className="enemy-portal">
        <div className="portal-icon">⚔️</div>
        <div className="portal-title">ENEMIES</div>
        <div className="portal-enemies">{enemyNames || 'None'}</div>
      </div>
    </div>
  );
}

