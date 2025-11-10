/**
 * Unit card component
 * Displays unit stats, HP/PP bars, and status effects
 */

import type { Unit } from '../../core/models/Unit';
import { calculateMaxHp } from '../../core/models/Unit';

interface UnitCardProps {
  unit: Unit;
  isPlayer: boolean;
}

export function UnitCard({ unit, isPlayer }: UnitCardProps) {
  const maxHp = calculateMaxHp(unit);
  const hpPercent = (unit.currentHp / maxHp) * 100;
  const maxPp = unit.baseStats.pp + (unit.level - 1) * unit.growthRates.pp;
  const currentPp = unit.baseStats.pp + (unit.level - 1) * unit.growthRates.pp; // TODO: Track PP separately
  const ppPercent = maxPp > 0 ? (currentPp / maxPp) * 100 : 0;

  return (
    <div
      className={`unit-card ${isPlayer ? 'player' : 'enemy'}`}
      style={{
        border: `2px solid ${isPlayer ? '#2196F3' : '#F44336'}`,
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0 }}>{unit.name}</h4>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            Lv {unit.level} {unit.element}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>HP: {unit.currentHp} / {maxHp}</div>
          <div>PP: {currentPp} / {maxPp}</div>
        </div>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
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
          {unit.statusEffects.map((status, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.75rem',
                padding: '0.125rem 0.25rem',
                backgroundColor: '#FFEB3B',
                borderRadius: '4px',
              }}
            >
              {status.type} ({status.duration})
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
        ATK: {unit.baseStats.atk} | DEF: {unit.baseStats.def} | MAG: {unit.baseStats.mag} | SPD: {unit.baseStats.spd}
      </div>
    </div>
  );
}

