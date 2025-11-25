/**
 * Unit card component
 * Displays unit stats, HP bar, and status effects
 * PR-STATS-EFFECTIVE: Shows effective stats (base + level + equipment + Djinn + status)
 */

import { useMemo } from 'react';
import type { Unit } from '../../core/models/Unit';
import type { Team } from '../../core/models/Team';
import { calculateMaxHp } from '../../core/models/Unit';
import { calculateEffectiveStats } from '../../core/algorithms/stats';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPlayerBattleSprite, getEnemyBattleSprite } from '../sprites/mappings/battleSprites';

interface UnitCardProps {
  unit: Unit;
  isPlayer: boolean;
  team?: Team; // Optional team for effective stats calculation (only needed for player units)
  hideHp?: boolean; // PR-QUEUE-BATTLE: Hide HP bar (for enemies)
}

// Helper function for varied portrait backgrounds by element
function getPortraitBgColor(element: string): string {
  const colors: Record<string, string> = {
    Venus: '#4A7AB8',   // Blue
    Mars: '#4CAF50',    // Green
    Mercury: '#E91E63', // Magenta/Pink
    Jupiter: '#9C27B0', // Purple
  };
  return colors[element] || '#444';
}

export function UnitCard({ unit, isPlayer, team, hideHp = false }: UnitCardProps) {
  const maxHp = calculateMaxHp(unit);
  const hpPercent = (unit.currentHp / maxHp) * 100;

  // Calculate effective stats (memoized for performance)
  // PR-STATS-EFFECTIVE: Effective stats include base + level + equipment + Djinn + status
  // Both player and enemy units use player team for Djinn bonuses (team-wide effect)
  const effectiveStats = useMemo(() => {
    if (team) {
      return calculateEffectiveStats(unit, team);
    }
    // Fallback to base stats if team not provided (shouldn't happen in battle)
    return unit.baseStats;
  }, [unit, team]);

  const spritePath = isPlayer
    ? getPlayerBattleSprite(unit.id, 'idle')
    : getEnemyBattleSprite(unit.id, 'idle');
  const spriteId = spritePath ?? '/sprites/battle/enemies/Goblin.gif';

  return (
    <div
      className={`unit-card ${isPlayer ? 'player' : 'enemy'}`}
      style={{
        border: `2px solid ${isPlayer ? '#4CAF50' : '#F44336'}`,
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        gap: '1rem',
        color: '#fff',
      }}
    >
      {/* Unit Sprite */}
      <div style={{ flexShrink: 0 }}>
        <SimpleSprite 
          id={spriteId}
          width={64}
          height={64}
          style={{
            border: '1px solid #444',
            borderRadius: '4px',
            backgroundColor: isPlayer ? getPortraitBgColor(unit.element) : '#444',
          }}
        />
      </div>
      
      {/* Unit Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, color: '#fff' }}>{unit.name}</h4>
            <div style={{ fontSize: '0.875rem', color: '#aaa' }}>
              Lv {unit.level} | {unit.element}
            </div>
          </div>
          <div style={{ textAlign: 'right', color: '#fff' }}>
            {!hideHp && <div>HP: {unit.currentHp} / {maxHp}</div>}
            {hideHp && <div>HP: ???</div>}
          </div>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          {!hideHp && (
            <div style={{ marginBottom: '0.25rem' }}>
              <div style={{ fontSize: '0.75rem', marginBottom: '0.125rem', color: '#aaa' }}>HP</div>
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: '#2a2a2a',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${hpPercent}%`,
                    height: '100%',
                    // Color-coded HP bars: green >70%, orange 40-70%, red <40%
                    backgroundColor: hpPercent > 70 ? '#4CAF50' : hpPercent > 40 ? '#FF9800' : '#F44336',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          )}
          {hideHp && (
            <div style={{ marginBottom: '0.25rem', height: '28px' }}>
              {/* Spacer to maintain layout when HP is hidden */}
            </div>
          )}
        </div>

        {unit.statusEffects.length > 0 && (
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {unit.statusEffects.map((status, idx) => {
              // Orange theme for status effects (as shown in second image)
              const statusConfig: Record<string, { icon: string; bgColor: string; textColor: string }> = {
                poison: { icon: '☠️', bgColor: '#ff9800', textColor: '#fff' },
                burn: { icon: '🔥', bgColor: '#ff9800', textColor: '#fff' },
                freeze: { icon: '❄️', bgColor: '#ff9800', textColor: '#fff' },
                paralyze: { icon: '⚡', bgColor: '#ff9800', textColor: '#fff' },
                buff: { icon: '⬆️', bgColor: '#4CAF50', textColor: '#fff' },
                debuff: { icon: '⬇️', bgColor: '#ff9800', textColor: '#fff' },
              };

              const statLabels: Record<string, string> = {
                atk: 'ATK',
                def: 'DEF',
                mag: 'MAG',
                spd: 'SPD',
                hp: 'HP',
              };

              // All status effects have a type property
              const statusType = status.type;
              const config = statusConfig[statusType] || {
                icon: '⚠️',
                bgColor: '#FFEB3B',
                textColor: '#000',
              };

              const statusName = statusType.charAt(0).toUpperCase() + statusType.slice(1);

              // Get duration or uses remaining for display
              const getDurationDisplay = () => {
                if ('duration' in status) return status.duration;
                if ('usesRemaining' in status) return status.usesRemaining;
                return 0;
              };
              const durationValue = getDurationDisplay();

              const badgeLabel = (() => {
                if (statusType === 'buff' || statusType === 'debuff') {
                  const stat = 'stat' in status ? status.stat : '';
                  const modifier = 'modifier' in status ? (status.modifier ?? 0) : 0;
                  const statLabel = stat ? (statLabels[stat] || stat.toUpperCase()) : '';
                  const formatted = `${modifier >= 0 ? '+' : ''}${modifier}`;
                  return `${statLabel}${formatted} ${durationValue}`;
                }
                return `${statusName} ${durationValue}`;
              })();

              const tooltip = (() => {
                const durationLabel = 'usesRemaining' in status ? 'use' : 'turn';
                if (statusType === 'buff' || statusType === 'debuff') {
                  const stat = 'stat' in status ? status.stat : '';
                  const modifier = 'modifier' in status ? (status.modifier ?? 0) : 0;
                  const statLabel = stat ? (statLabels[stat] || stat.toUpperCase()) : '';
                  return `${statusType === 'buff' ? 'Buff' : 'Debuff'}: ${statLabel}${modifier >= 0 ? '+' : ''}${modifier} (${durationValue} ${durationLabel}${durationValue !== 1 ? 's' : ''} remaining)`;
                }
                return `${statusName} (${durationValue} ${durationLabel}${durationValue !== 1 ? 's' : ''} remaining)`;
              })();

              return (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.375rem',
                    backgroundColor: config.bgColor,
                    color: config.textColor,
                    borderRadius: '4px',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                  title={tooltip}
                >
                  <span>{config.icon}</span>
                  <span>{badgeLabel}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* PR-STATS-EFFECTIVE: Display effective stats */}
        <details style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#aaa' }}>
          <summary style={{ cursor: 'pointer', color: '#fff' }}>Stats</summary>
          <div style={{ marginTop: '0.25rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem', color: '#aaa' }}>
            <div>ATK: {effectiveStats.atk}</div>
            <div>DEF: {effectiveStats.def}</div>
            <div>MAG: {effectiveStats.mag}</div>
            <div>SPD: {effectiveStats.spd}</div>
          </div>
        </details>
      </div>
    </div>
  );
}
