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
  
  // TODO: Migrate PP to team mana in PR-MANA-QUEUE
  // For now, calculate PP from base stats + level
  const maxPp = unit.baseStats.pp + (unit.level - 1) * unit.growthRates.pp;
  const currentPp = unit.baseStats.pp + (unit.level - 1) * unit.growthRates.pp; // TODO: Track PP separately
  const ppPercent = maxPp > 0 ? (currentPp / maxPp) * 100 : 0;
  
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
                paralyze: { icon: '⚡', bgColor: '#FF9800', textColor: '#fff' },
                defend: { icon: '🛡️', bgColor: '#9E9E9E', textColor: '#fff' },
              };

              const config = statusConfig[status.id] ?? { icon: '?', bgColor: '#9E9E9E', textColor: '#fff' };

              return (
                <div
                  key={idx}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    backgroundColor: config.bgColor,
                    color: config.textColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                  title={`${status.id} (${status.duration} turns)`}
                >
                  <span>{config.icon}</span>
                  <span>{status.id}</span>
                  <span>{status.duration}T</span>
                </div>
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
