/**
 * EnemyPortalTile Component
 * Minimal enemy display (illustrative portal tile design)
 */

import { ENCOUNTERS } from '@/data/definitions/encounters';
import { ENEMIES } from '@/data/definitions/enemies';
import { getEnemyBattleSprite } from '../sprites/mappings/battleSprites';

interface EnemyPortalTileProps {
  encounterId: string;
}

function getEnemySpritePath(enemyId: string): string {
  const enemy = ENEMIES[enemyId];
  const explicit: Record<string, string> = {
    'war-mage': '/sprites/battle/party/garet/Garet_Axe_Front.gif',
  };
  if (explicit[enemyId]) return explicit[enemyId];

  const nameCandidate = enemy?.name?.replace(/\s+/g, '');
  if (nameCandidate) {
    return `/sprites/battle/enemies/${nameCandidate}.gif`;
  }

  const mapped = getEnemyBattleSprite(enemyId, 'idle');
  return mapped ?? '/sprites/battle/enemies/Goblin.gif';
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

  const enemySprites = encounter.enemies
    .map((enemyId) => ({ id: enemyId, src: getEnemySpritePath(enemyId), name: ENEMIES[enemyId]?.name ?? enemyId }))
    .filter(Boolean);

  return (
    <div className="enemies-section">
      <div className="enemy-portal">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 6,
            flexWrap: 'wrap',
          }}
        >
          {enemySprites.map((enemy) => (
            <div key={enemy.id} style={{ textAlign: 'center' }}>
              <img
                src={enemy.src}
                alt={enemy.name}
                style={{
                  width: 72,
                  height: 72,
                  imageRendering: 'pixelated',
                  borderRadius: 4,
                  background: '#111',
                  border: '1px solid #333',
                  padding: 4,
                  boxShadow: '0 0 12px rgba(0,0,0,0.5)',
                }}
              />
              <div style={{ fontSize: '0.8rem', color: '#ddd', marginTop: 4 }}>{enemy.name}</div>
            </div>
          ))}
        </div>
        <div className="portal-title">ENEMIES</div>
        <div className="portal-enemies">{enemyNames || 'None'}</div>
      </div>
    </div>
  );
}
