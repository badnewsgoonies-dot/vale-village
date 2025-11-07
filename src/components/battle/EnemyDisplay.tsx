import React from 'react';
import type { Unit } from '@/types/Unit';
import './EnemyDisplay.css';

interface EnemyDisplayProps {
  enemy: Unit;
  isActive?: boolean;
  onClick?: () => void;
}

export const EnemyDisplay: React.FC<EnemyDisplayProps> = ({
  enemy,
  isActive = false,
  onClick,
}) => {
  const stats = enemy.calculateStats();
  const hpPercent = (enemy.currentHp / stats.hp) * 100;

  return (
    <div
      className={`enemy-display ${isActive ? 'active' : ''} ${enemy.isKO ? 'ko' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Enemy Sprite */}
      <div className="enemy-sprite-container">
        <img
          src={`/sprites/enemies/${enemy.name}.gif`}
          alt={enemy.name}
          className="enemy-sprite"
          onError={(e) => {
            e.currentTarget.src = '/sprites/enemies/Slime.gif';
          }}
        />
      </div>

      {/* Enemy Info Overlay */}
      <div className="enemy-info">
        <div className="enemy-name">{enemy.name}</div>
        <div className="enemy-hp-bar">
          <div className="hp-bar-bg">
            <div
              className="hp-bar-fill"
              style={{ width: `${Math.max(0, hpPercent)}%` }}
            />
          </div>
          <div className="hp-text">
            {enemy.currentHp} / {stats.hp}
          </div>
        </div>
        {enemy.statusEffects.length > 0 && (
          <div className="status-icons">
            {enemy.statusEffects.map((effect, idx) => (
              <span key={idx} className={`status-icon status-${effect.type}`}>
                {getStatusIcon(effect.type)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    poison: '☠',
    burn: '🔥',
    freeze: '❄',
    paralyze: '⚡',
  };
  return icons[status] || '?';
}
