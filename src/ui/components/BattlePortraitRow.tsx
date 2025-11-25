import type { Unit } from '../../core/models/Unit';
import type { QueuedAction } from '../../core/models/BattleState';
import { calculateMaxHp } from '../../core/models/Unit';

interface BattlePortraitRowProps {
  units: readonly Unit[];
  activeIndex: number | null;
  queuedActions: readonly (QueuedAction | null)[];
  critCounters: Record<string, number>;
  critThresholds: Record<string, number>;
  critFlashes?: Record<string, boolean>;
  onSelect?: (index: number) => void;
}

const statusIconMap: Record<string, string> = {
  burn: '/sprites/icons/misc/Poison.gif',
  poison: '/sprites/icons/misc/Poison.gif',
  paralyze: '/sprites/icons/misc/Psynergy_Seal.gif',
  freeze: '/sprites/icons/misc/Haunted.gif',
  stun: '/sprites/icons/misc/Exclamatory.gif',
  buff: '/sprites/icons/misc/Stat-Up.gif',
  debuff: '/sprites/icons/misc/Stat-Down.gif',
  elementalResistance: '/sprites/icons/misc/Venus_Star.gif',
  damageReduction: '/sprites/icons/misc/Stat-Up.gif',
  shield: '/sprites/icons/misc/Stat-Up.gif',
  invulnerable: '/sprites/icons/misc/Stat-Up.gif',
  immunity: '/sprites/icons/misc/Stat-Up.gif',
  autoRevive: '/sprites/icons/misc/Up_Arrow.gif',
};

function getPortraitSprite(unit: Unit): string {
  const baseDir = '/sprites/battle/party';
  // Map unit element → canonical hero sprite folder/prefix/weapon
  const byElement: Record<string, { folder: string; prefix: string; weapon: string }> = {
    Venus: { folder: 'isaac', prefix: 'Isaac', weapon: 'lSword' },
    Mars: { folder: 'garet', prefix: 'Garet', weapon: 'lSword' },
    Mercury: { folder: 'mia', prefix: 'Mia', weapon: 'Staff' },
    Jupiter: { folder: 'ivan', prefix: 'Ivan', weapon: 'Staff' },
  };
  const fallback = { folder: 'isaac', prefix: 'Isaac', weapon: 'lSword' };
  const sprite = byElement[unit.element] ?? fallback;
  return `${baseDir}/${sprite.folder}/${sprite.prefix}_${sprite.weapon}_Front.gif`;
}

function StatusChips({ unit }: { unit: Unit }) {
  const maxVisible = 3;
  const effects = unit.statusEffects.slice(0, maxVisible);

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {effects.map((status, idx) => (
        <div
          key={`${status.type}-${idx}`}
          title={status.type}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: 'rgba(0,0,0,0.45)',
            padding: '2px 4px',
            borderRadius: 3,
            border: '1px solid rgba(255,216,127,0.25)',
            minWidth: 18,
          }}
        >
          <img
            src={statusIconMap[status.type] ?? '/sprites/icons/misc/Stat-Up.gif'}
            alt={status.type}
            width={14}
            height={14}
            style={{ imageRendering: 'pixelated' }}
          />
          <span style={{ fontSize: '0.7rem', color: '#f6e8b1' }}>
            {'duration' in status && typeof status.duration === 'number'
              ? status.duration
              : 'remainingCharges' in status
                ? status.remainingCharges
                : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

export function BattlePortraitRow({
  units,
  activeIndex,
  queuedActions,
  critCounters,
  critThresholds,
  critFlashes,
  onSelect,
}: BattlePortraitRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        background: 'rgba(0,0,0,0.35)',
        padding: '8px 10px',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 6,
      }}
    >
      {units.map((unit, idx) => {
        const maxHp = calculateMaxHp(unit);
        const hpPct = Math.max(0, Math.min(1, unit.currentHp / maxHp));
        const critCount = critCounters[unit.id] ?? 0;
        const critThreshold = critThresholds[unit.id] ?? 10;
        const queued = queuedActions[idx] !== null;
        const isActive = idx === activeIndex;
        const flash = critFlashes?.[unit.id];

        return (
          <button
            key={unit.id}
            onClick={() => onSelect?.(idx)}
            style={{
              width: 64,
              height: 64,
              position: 'relative',
              border: isActive ? '2px solid #FFD54A' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: 6,
              padding: 0,
              background: '#0f0f10',
              boxShadow: flash
                ? '0 0 10px 2px rgba(255, 216, 74, 0.9)'
                : isActive
                  ? '0 0 6px rgba(255, 216, 74, 0.6)'
                  : 'none',
              overflow: 'hidden',
              cursor: onSelect ? 'pointer' : 'default',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                fontSize: '0.7rem',
                color: '#FFD54A',
                background: 'rgba(0,0,0,0.55)',
                padding: '2px 4px',
                borderRadius: 4,
                border: '1px solid rgba(255,213,74,0.6)',
              }}
              title="Crit counter"
            >
              ⚡{critCount}/{critThreshold}
            </div>

            {queued && (
              <div
                title="Queued"
                style={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                  background: '#4CAF50',
                  color: '#fff',
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  borderRadius: 4,
                }}
              >
                ✓
              </div>
            )}

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: 8,
                background: 'rgba(255,255,255,0.08)',
              }}
            >
              <div
                style={{
                  width: `${hpPct * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #7FFFD4, #4CAF50)',
                  transition: 'width 0.2s',
                }}
              />
            </div>

            <StatusChips unit={unit} />

            <img
              src={getPortraitSprite(unit)}
              alt={`${unit.name} portrait`}
              width={64}
              height={64}
              style={{
                imageRendering: 'pixelated',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                background:
                  'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.08), transparent 60%)',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
