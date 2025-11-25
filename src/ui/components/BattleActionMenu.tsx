import type { BattleState } from '../../core/models/BattleState';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { Unit } from '../../core/models/Unit';
import { canAffordAction, getAbilityManaCost } from '../../core/algorithms/mana';
import { DJINN_ABILITIES } from '../../data/definitions/djinnAbilities';

const ACTION_ICONS: Record<string, string> = {
  attack: '/sprites/icons/buttons/Attack.gif',
  abilities: '/sprites/icons/buttons/Psynergy.gif',
  djinn: '/sprites/icons/buttons/Djinni.gif',
  defend: '/sprites/icons/buttons/Defend.gif',
};

// Element star icons (fallback by element)
const ELEMENT_ICONS: Record<string, string> = {
  Venus: '/sprites/icons/misc/Venus_Star.gif',
  Mars: '/sprites/icons/misc/Mars_Star.gif',
  Mercury: '/sprites/icons/misc/Mercury_Star.gif',
  Jupiter: '/sprites/icons/misc/Jupiter_Star.gif',
  Neutral: '/sprites/icons/buttons/Attack.gif',
  neutral: '/sprites/icons/buttons/Psynergy.gif',
};

// Ability type icons (fallback by type)
const TYPE_ICONS: Record<string, string> = {
  physical: '/sprites/icons/buttons/Attack.gif',
  healing: '/sprites/icons/misc/Mercury_Star.gif',
  buff: '/sprites/icons/misc/Stat-Up.gif',
  debuff: '/sprites/icons/misc/Stat-Down.gif',
  summon: '/sprites/icons/buttons/Summon.gif',
  psynergy: '/sprites/icons/buttons/Psynergy.gif',
};

// Element theme colors for ability cards
const ELEMENT_COLORS: Record<string, { border: string; glow: string; bg: string }> = {
  Venus: {
    border: '#D4A855',
    glow: 'rgba(212, 168, 85, 0.6)',
    bg: 'rgba(139, 119, 42, 0.25)',
  },
  Mars: {
    border: '#E85D3B',
    glow: 'rgba(232, 93, 59, 0.6)',
    bg: 'rgba(139, 54, 38, 0.25)',
  },
  Mercury: {
    border: '#5BA3D4',
    glow: 'rgba(91, 163, 212, 0.6)',
    bg: 'rgba(42, 95, 139, 0.25)',
  },
  Jupiter: {
    border: '#A855D4',
    glow: 'rgba(168, 85, 212, 0.6)',
    bg: 'rgba(95, 42, 139, 0.25)',
  },
  Neutral: {
    border: '#888888',
    glow: 'rgba(136, 136, 136, 0.4)',
    bg: 'rgba(60, 60, 60, 0.25)',
  },
};

// Target type icons/labels
const TARGET_LABELS: Record<string, { icon: string; label: string }> = {
  'single-enemy': { icon: '◎', label: '1' },
  'all-enemies': { icon: '◉', label: 'ALL' },
  'single-ally': { icon: '♥', label: '1' },
  'all-allies': { icon: '♥♥', label: 'ALL' },
  self: { icon: '★', label: 'SELF' },
};

// Specific ability icons using psynergy animation GIFs
const ABILITY_ICONS: Record<string, string> = {
  // Physical attacks
  strike: '/sprites/icons/buttons/Attack.gif',
  'heavy-strike': '/sprites/icons/buttons/Attack.gif',
  'focus-strike': '/sprites/icons/buttons/Attack.gif',
  'guard-break': '/sprites/icons/buttons/Attack.gif',
  'precise-jab': '/sprites/icons/buttons/Attack.gif',

  // Defensive
  fortify: '/sprites/icons/buttons/Defend.gif',
  'guardian-stance': '/sprites/icons/buttons/Defend.gif',
  guard: '/sprites/icons/buttons/Defend.gif',
  'stone-wall': '/sprites/icons/buttons/Defend.gif',
  'iron-wall': '/sprites/icons/buttons/Defend.gif',

  // Venus (Earth) psynergy
  quake: '/sprites/psynergy/Grand_Gaia.gif',
  tremor: '/sprites/psynergy/Grand_Gaia.gif',
  'rock-breaker': '/sprites/psynergy/Grand_Gaia.gif',
  earthquake: '/sprites/psynergy/Grand_Gaia.gif',
  'earth-spike': '/sprites/psynergy/Grand_Gaia.gif',
  'stone-fist': '/sprites/psynergy/Grand_Gaia.gif',
  'granite-guard': '/sprites/psynergy/Grand_Gaia.gif',
  'terra-break': '/sprites/psynergy/Grand_Gaia.gif',
  nettle: '/sprites/psynergy/Nettle.gif',
  'froth-spiral': '/sprites/psynergy/Froth_Spiral.gif',

  // Mars (Fire) psynergy
  fireball: '/sprites/psynergy/Heat_Wave.gif',
  'flame-burst': '/sprites/psynergy/Dragon_Fire.gif',
  'fire-burst': '/sprites/psynergy/Dragon_Fire.gif',
  'dragon-fire': '/sprites/psynergy/Dragon_Fire.gif',
  inferno: '/sprites/psynergy/Inferno.gif',
  'inferno-blaze': '/sprites/psynergy/Inferno.gif',
  'heat-wave': '/sprites/psynergy/Heat_Wave.gif',
  supernova: '/sprites/psynergy/Supernova.gif',
  pyroclasm: '/sprites/psynergy/Pyroclasm.gif',
  fume: '/sprites/psynergy/Fume.gif',
  'fiery-blast': '/sprites/psynergy/Fiery_Blast.gif',
  'flame-strike': '/sprites/psynergy/Heat_Wave.gif',
  scorch: '/sprites/psynergy/Heat_Wave.gif',
  'ember-wave': '/sprites/psynergy/Heat_Wave.gif',

  // Mercury (Ice/Water) psynergy
  'ice-shard': '/sprites/psynergy/Ice_Missile.gif',
  'ice-missile': '/sprites/psynergy/Ice_Missile.gif',
  freeze: '/sprites/psynergy/Freeze_Prism.gif',
  'freeze-blast': '/sprites/psynergy/Freeze_Prism.gif',
  'freeze-prism': '/sprites/psynergy/Freeze_Prism.gif',
  glacier: '/sprites/psynergy/Glacier.gif',
  'glacial-wave': '/sprites/psynergy/Glacier.gif',
  deluge: '/sprites/psynergy/Deluge.gif',
  'aqua-pulse': '/sprites/psynergy/Deluge.gif',
  'frost-storm': '/sprites/psynergy/Glacier.gif',
  heal: '/sprites/icons/misc/Mercury_Star.gif',
  'party-heal': '/sprites/icons/misc/Mercury_Star.gif',
  cure: '/sprites/icons/misc/Mercury_Star.gif',

  // Jupiter (Wind/Lightning) psynergy
  gust: '/sprites/psynergy/Sonic_Slash.gif',
  plasma: '/sprites/psynergy/Spark_Plasma.gif',
  'spark-plasma': '/sprites/psynergy/Spark_Plasma.gif',
  'chain-lightning': '/sprites/psynergy/Blue_Bolt.gif',
  'blue-bolt': '/sprites/psynergy/Blue_Bolt.gif',
  'destruct-ray': '/sprites/psynergy/Destruct_Ray.gif',
  'sonic-slash': '/sprites/psynergy/Sonic_Slash.gif',
  tempest: '/sprites/psynergy/Tempest.gif',
  'gale-force': '/sprites/psynergy/Sonic_Slash.gif',
  'storm-burst': '/sprites/psynergy/Spark_Plasma.gif',
  'chain-gale': '/sprites/psynergy/Tempest.gif',

  // Buffs
  'boost-atk': '/sprites/icons/misc/Stat-Up.gif',
  'boost-def': '/sprites/icons/misc/Stat-Up.gif',
  'boost-attack': '/sprites/icons/misc/Stat-Up.gif',
  'boost-defense': '/sprites/icons/misc/Stat-Up.gif',
  'stone-skin': '/sprites/icons/misc/Stat-Up.gif',

  // Debuffs
  weaken: '/sprites/icons/misc/Stat-Down.gif',
  slow: '/sprites/icons/misc/Stat-Down.gif',
};

export type ActionMenuMode = 'root' | 'abilities';

interface BattleActionMenuProps {
  battle: BattleState;
  currentUnit: Unit | null;
  selectedAbilityId: string | null;
  mode: ActionMenuMode;
  onModeChange: (mode: ActionMenuMode) => void;
  onSelectAttack: () => void;
  onSelectAbility: (id: string | null, ability?: Ability) => void;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        color: '#f6e8b1',
        fontSize: '0.75rem',
        marginBottom: 4,
        letterSpacing: 0.5,
      }}
    >
      {title}
    </div>
  );
}

function AbilityGrid({
  abilities,
  selectedAbilityId,
  battle,
  onSelect,
}: {
  abilities: readonly Ability[];
  selectedAbilityId: string | null;
  battle: BattleState;
  onSelect: (id: string, ability: Ability) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 6,
        maxHeight: 240,
        overflowY: 'auto',
        padding: '2px',
      }}
    >
      {abilities.map((ability) => {
        const manaCost = getAbilityManaCost(ability.id, ability);
        const canAfford = canAffordAction(battle.remainingMana, manaCost);
        const isDjinnAbility = Boolean(DJINN_ABILITIES[ability.id]);
        const isSelected = selectedAbilityId === ability.id;
        const element = (ability as any).element || 'Neutral';
        const elementTheme: { border: string; glow: string; bg: string } = (
          ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] ?? ELEMENT_COLORS.Neutral
        ) as { border: string; glow: string; bg: string };
        const targets = (ability as any).targets || 'single-enemy';
        const targetInfo: { icon: string; label: string } = (
          TARGET_LABELS[targets as keyof typeof TARGET_LABELS] || TARGET_LABELS['single-enemy']
        ) as { icon: string; label: string };
        const basePower = (ability as any).basePower || 0;
        const abilityType = (ability as any).type || 'psynergy';

        return (
          <button
            key={ability.id}
            onClick={() => canAfford && onSelect(ability.id, ability)}
            disabled={!canAfford}
            style={{
              textAlign: 'left',
              background: isSelected
                ? `linear-gradient(135deg, ${elementTheme.bg}, rgba(255,213,74,0.15))`
                : 'rgba(0,0,0,0.6)',
              border: `2px solid ${
                isSelected
                  ? elementTheme.border
                  : isDjinnAbility
                    ? 'rgba(186,104,200,0.5)'
                    : 'rgba(255,255,255,0.15)'
              }`,
              borderLeft: `4px solid ${elementTheme.border}`,
              padding: '6px 8px',
              color: canAfford ? '#f6e8b1' : '#555',
              borderRadius: 6,
              fontSize: '0.85rem',
              cursor: canAfford ? 'pointer' : 'not-allowed',
              opacity: canAfford ? 1 : 0.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              transition: 'all 0.15s',
              boxShadow: isSelected ? `0 0 12px ${elementTheme.glow}` : 'none',
              minHeight: 70,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img
                src={
                  ABILITY_ICONS[ability.id] ||
                  ELEMENT_ICONS[element] ||
                  TYPE_ICONS[abilityType] ||
                  ELEMENT_ICONS.neutral
                }
                alt=""
                width={18}
                height={18}
                style={{
                  imageRendering: 'pixelated',
                  flexShrink: 0,
                  filter: canAfford ? 'none' : 'grayscale(100%)',
                }}
              />
              <span
                style={{
                  color: isDjinnAbility ? '#ce93d8' : elementTheme.border,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textShadow: '1px 1px 2px #000',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {ability.name}
              </span>
              <div
                style={{
                  color: canAfford ? '#ffd700' : '#555',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '2px 5px',
                  borderRadius: 3,
                  border: '1px solid rgba(255,215,0,0.4)',
                }}
              >
                {manaCost}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem' }}>
              <div
                style={{
                  color: '#aaa',
                  background: 'rgba(0,0,0,0.4)',
                  padding: '1px 4px',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
                title={targets}
              >
                <span>{targetInfo.icon}</span>
                <span>{targetInfo.label}</span>
              </div>

              {basePower > 0 && (
                <div
                  style={{
                    color: abilityType === 'healing' ? '#7FFFD4' : '#ff9999',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '1px 4px',
                    borderRadius: 2,
                  }}
                  title={`Base power: ${basePower}`}
                >
                  {abilityType === 'healing' ? '+' : '⚔'}
                  {basePower}
                </div>
              )}

              {(abilityType === 'buff' || abilityType === 'debuff') && (
                <div
                  style={{
                    color: abilityType === 'buff' ? '#90EE90' : '#FFB6C1',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '1px 4px',
                    borderRadius: 2,
                  }}
                >
                  {abilityType === 'buff' ? '↑BUFF' : '↓DEBUFF'}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function BattleActionMenu({
  battle,
  currentUnit,
  selectedAbilityId,
  mode,
  onModeChange,
  onSelectAttack,
  onSelectAbility,
}: BattleActionMenuProps) {
  if (!currentUnit) {
    return (
      <div
        style={{
          background: 'rgba(0,0,0,0.85)',
          border: '2px solid rgba(255,215,0,0.4)',
          padding: 12,
          borderRadius: 8,
          color: '#888',
          minHeight: 80,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        Select a unit to begin.
      </div>
    );
  }

  const unlocked = currentUnit.abilities.filter((a) =>
    currentUnit.unlockedAbilityIds.includes(a.id)
  );
  const djinnAbilities = unlocked.filter((a) => DJINN_ABILITIES[a.id]);
  const regularAbilities = unlocked.filter((a) => !DJINN_ABILITIES[a.id]);

  if (mode === 'abilities') {
    return (
      <div
        style={{
          background: 'rgba(0,0,0,0.9)',
          border: '2px solid #ffd700',
          padding: 10,
          borderRadius: 8,
          width: 360,
          maxHeight: 320,
          overflowY: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <SectionHeader title="PSYNERGY" />
          <button
            onClick={() => onModeChange('root')}
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '2px solid #ffd700',
              color: '#ffd87f',
              borderRadius: 4,
              padding: '4px 12px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              textShadow: '1px 1px 2px #000',
            }}
          >
            ← BACK
          </button>
        </div>

        {/* Unit abilities section */}
        {regularAbilities.length > 0 && (
          <>
            <div style={{ color: '#aaa', fontSize: '0.7rem', marginBottom: 4, letterSpacing: 0.5 }}>
              UNIT ABILITIES
            </div>
            <AbilityGrid
              abilities={regularAbilities}
              selectedAbilityId={selectedAbilityId}
              battle={battle}
              onSelect={onSelectAbility}
            />
          </>
        )}

        {/* Djinn abilities section - visually distinct */}
        {djinnAbilities.length > 0 && (
          <div
            style={{
              marginTop: 12,
              paddingTop: 10,
              borderTop: '2px solid rgba(186, 104, 200, 0.5)',
              background: 'linear-gradient(180deg, rgba(186, 104, 200, 0.15) 0%, transparent 100%)',
              borderRadius: '0 0 6px 6px',
              padding: '10px 6px 6px 6px',
              marginLeft: -6,
              marginRight: -6,
              marginBottom: -4,
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#ce93d8',
              fontSize: '0.75rem',
              marginBottom: 6,
              letterSpacing: 0.5,
              fontWeight: 600,
            }}>
              <img
                src="/sprites/icons/buttons/Djinni.gif"
                alt=""
                width={16}
                height={16}
                style={{ imageRendering: 'pixelated' }}
              />
              DJINN ABILITIES
            </div>
            <AbilityGrid
              abilities={djinnAbilities}
              selectedAbilityId={selectedAbilityId}
              battle={battle}
              onSelect={onSelectAbility}
            />
          </div>
        )}

        {regularAbilities.length === 0 && djinnAbilities.length === 0 && (
          <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: 16 }}>
            No abilities available
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.85)',
        border: '2px solid #ffd700',
        padding: 10,
        borderRadius: 8,
        width: 200,
        boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
      }}
    >
      <SectionHeader title="ACTIONS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={onSelectAttack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            background: 'rgba(0,0,0,0.5)',
            border: '2px solid rgba(255, 213, 74, 0.7)',
            borderRadius: 6,
            padding: '8px 10px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <img
            src={ACTION_ICONS.attack}
            alt=""
            width={24}
            height={24}
            style={{ imageRendering: 'pixelated', transform: 'scale(1.5)', transformOrigin: 'center' }}
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#ffd87f', fontWeight: 600, fontSize: '0.95rem', textShadow: '1px 1px 2px #000' }}>
              ATTACK
            </div>
            <div style={{ color: '#aaa', fontSize: '0.75rem' }}>+1 mana</div>
          </div>
        </button>

        <button
          onClick={() => onModeChange('abilities')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            background: 'rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 6,
            padding: '8px 10px',
            cursor: 'pointer',
          }}
        >
          <img
            src={ACTION_ICONS.abilities}
            alt=""
            width={24}
            height={24}
            style={{ imageRendering: 'pixelated', transform: 'scale(1.5)', transformOrigin: 'center' }}
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#f6e8b1', fontWeight: 600, fontSize: '0.95rem', textShadow: '1px 1px 2px #000' }}>
              PSYNERGY
            </div>
            <div style={{ color: '#888', fontSize: '0.75rem' }}>Abilities</div>
          </div>
        </button>

      </div>
    </div>
  );
}
