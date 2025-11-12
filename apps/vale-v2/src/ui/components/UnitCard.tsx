/**
 * Unit card component
 * Displays unit stats, HP/PP bars, and status effects
 * PR-STATS-EFFECTIVE: Shows effective stats (base + level + equipment + Djinn + status)
 */

import { useMemo } from 'react';
import type { Unit } from '../../core/models/Unit';
import type { Team } from '../../core/models/Team';
import { calculateMaxHp } from '../../core/models/Unit';
import { calculateEffectiveStats } from '../../core/algorithms/stats';
import { SimpleSprite } from '../sprites/SimpleSprite';

interface UnitCardProps {
  unit: Unit;
  isPlayer: boolean;
  team?: Team; // Optional team for effective stats calculation (only needed for player units)
  hideHp?: boolean; // PR-QUEUE-BATTLE: Hide HP bar (for enemies)
}

export function UnitCard({ unit, isPlayer, team, hideHp = false }: UnitCardProps) {
  const maxHp = calculateMaxHp(unit);
  const hpPercent = (unit.currentHp / maxHp) * 100;
  
  // Calculate max PP (similar to max HP)
  const maxPp = unit.baseStats.pp + (unit.level - 1) * unit.growthRates.pp;
  // For now, use maxPp as currentPp (PP isn't tracked separately per unit - team uses mana pool)
  // TODO: Track currentPp per unit if needed
  const currentPp = maxPp;
  const ppPercent = (currentPp / maxPp) * 100;

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

  return (
    <div
      className={`unit-card ${isPlayer ? 'player' : 'enemy'}`}
      style={{
        border: `2px solid ${isPlayer ? '#2196F3' : '#F44336'}`,
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        gap: '1rem',
      }}
    >
      {/* Unit Sprite */}
      <div style={{ flexShrink: 0 }}>
        <SimpleSprite 
          id={isPlayer 
            ? `${unit.id.toLowerCase()}-lblade-front`  // Try to find Isaac lBlade Front, etc.
            : unit.id.toLowerCase()  // Enemy sprite ID
          }
          width={64}
          height={64}
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
          }}
        />
      </div>
      
      {/* Unit Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0 }}>{unit.name}</h4>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              Lv {unit.level} {unit.element}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {!hideHp && <div>HP: {unit.currentHp} / {maxHp}</div>}
            {hideHp && <div>HP: ???</div>}
            <div>PP: {currentPp} / {maxPp}</div>
          </div>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          {!hideHp && (
            <div style={{ marginBottom: '0.25rem' }}>
              <div style={{ fontSize: '0.75rem', marginBottom: '0.125rem' }}>HP</div>
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${hpPercent}%`,
                    height: '100%',
                    backgroundColor: hpPercent > 50 ? '#4CAF50' : hpPercent > 25 ? '#FF9800' : '#F44336',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: '0.75rem', marginBottom: '0.125rem' }}>PP</div>
            <div
              style={{
                width: '100%',
                height: '12px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${ppPercent}%`,
                  height: '100%',
                  backgroundColor: '#2196F3',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>

        {unit.statusEffects.length > 0 && (
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {unit.statusEffects.map((status, idx) => {
              const statusConfig: Record<string, { icon: string; bgColor: string; textColor: string }> = {
                poison: { icon: '☠️', bgColor: '#4CAF50', textColor: '#fff' },
                burn: { icon: '🔥', bgColor: '#F44336', textColor: '#fff' },
                freeze: { icon: '❄️', bgColor: '#2196F3', textColor: '#fff' },
                paralyze: { icon: '⚡', bgColor: '#FFEB3B', textColor: '#000' },
                buff: { icon: '⬆️', bgColor: '#2E7D32', textColor: '#fff' },
                debuff: { icon: '⬇️', bgColor: '#BF360C', textColor: '#fff' },
              };

              const statLabels: Record<string, string> = {
                atk: 'ATK',
                def: 'DEF',
                mag: 'MAG',
                spd: 'SPD',
                hp: 'HP',
                pp: 'PP',
              };

              // Handle both old status.id format and new status.type format
              const statusType = 'type' in status ? status.type : status.id;
              const config = statusConfig[statusType] || {
                icon: '⚠️',
                bgColor: '#FFEB3B',
                textColor: '#000',
              };

              const statusName = statusType.charAt(0).toUpperCase() + statusType.slice(1);

              const badgeLabel = (() => {
                if (statusType === 'buff' || statusType === 'debuff') {
                  const stat = 'stat' in status ? status.stat : '';
                  const modifier = 'modifier' in status ? (status.modifier ?? 0) : 0;
                  const statLabel = stat ? (statLabels[stat] || stat.toUpperCase()) : '';
                  const formatted = `${modifier >= 0 ? '+' : ''}${modifier}`;
                  return `${statLabel}${formatted} ${status.duration}`;
                }
                return `${statusName} ${status.duration}`;
              })();

              const tooltip = (() => {
                if (statusType === 'buff' || statusType === 'debuff') {
                  const stat = 'stat' in status ? status.stat : '';
                  const modifier = 'modifier' in status ? (status.modifier ?? 0) : 0;
                  const statLabel = stat ? (statLabels[stat] || stat.toUpperCase()) : '';
                  return `${statusType === 'buff' ? 'Buff' : 'Debuff'}: ${statLabel}${modifier >= 0 ? '+' : ''}${modifier} (${status.duration} turn${status.duration !== 1 ? 's' : ''} remaining)`;
                }
                return `${statusName} (${status.duration} turn${status.duration !== 1 ? 's' : ''} remaining)`;
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
        <details style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
          <summary style={{ cursor: 'pointer' }}>Stats</summary>
          <div style={{ marginTop: '0.25rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
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
