import type { BattleState } from '../../core/models/BattleState';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { Unit } from '../../core/models/Unit';
import { canAffordAction, getAbilityManaCost } from '../../core/algorithms/mana';
import { DJINN_ABILITIES } from '../../data/definitions/djinnAbilities';

export type ActionMenuMode = 'root' | 'abilities' | 'djinn';

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
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 8,
      }}
    >
      {abilities.map((ability) => {
        const manaCost = getAbilityManaCost(ability.id, ability);
        const canAfford = canAffordAction(battle.remainingMana, manaCost);
        const isDjinnAbility = Boolean(DJINN_ABILITIES[ability.id]);
        const isSelected = selectedAbilityId === ability.id;
        return (
          <button
            key={ability.id}
            onClick={() => canAfford && onSelect(ability.id, ability)}
            disabled={!canAfford}
            style={{
              textAlign: 'left',
              background: isSelected
                ? 'linear-gradient(135deg, rgba(255,213,74,0.3), rgba(255,213,74,0.1))'
                : 'rgba(0,0,0,0.35)',
              border: `1px solid ${isDjinnAbility ? '#ba68c8' : 'rgba(255,255,255,0.12)'}`,
              padding: '10px',
              color: canAfford ? '#eaeaea' : '#777',
              borderRadius: 6,
              fontSize: '0.85rem',
              cursor: canAfford ? 'pointer' : 'not-allowed',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: 6,
              alignItems: 'center',
            }}
          >
            <span aria-hidden style={{ fontSize: '1.1rem' }}>
              {isDjinnAbility ? '✦' : '🔥'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span
                style={{
                  color: '#f6e8b1',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                {ability.name}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>
                {ability.description ?? 'Deterministic effect'}
              </span>
            </div>
            <div
              style={{
                color: canAfford ? '#4fc3f7' : '#777',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
              aria-label={`Mana cost ${manaCost}`}
            >
              {manaCost}MP
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
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 12,
          borderRadius: 8,
          color: '#aaa',
          minHeight: 120,
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

  if (mode !== 'root') {
    const abilitiesToRender = mode === 'abilities' ? regularAbilities : djinnAbilities;
    return (
      <div
        style={{
          background: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: 12,
          borderRadius: 8,
          width: 320,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <SectionHeader title={mode === 'abilities' ? 'ABILITIES' : 'DJINN ABILITIES'} />
          <button
            onClick={() => onModeChange('root')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#eaeaea',
              borderRadius: 4,
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            BACK
          </button>
        </div>
        <AbilityGrid
          abilities={abilitiesToRender}
          selectedAbilityId={selectedAbilityId}
          battle={battle}
          onSelect={onSelectAbility}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.12)',
        padding: 12,
        borderRadius: 8,
        width: 240,
      }}
    >
      <SectionHeader title="ACTIONS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={onSelectAttack}
          style={{
            textAlign: 'left',
            background: 'rgba(255, 213, 74, 0.12)',
            border: '1px solid rgba(255, 213, 74, 0.4)',
            borderRadius: 6,
            padding: '10px',
            color: '#f6e8b1',
            cursor: 'pointer',
          }}
        >
          ⚔️ ATTACK
          <div style={{ fontSize: '0.85rem', color: '#eaeaea' }}>+1 mana (this round)</div>
        </button>

        <button
          onClick={() => onModeChange('abilities')}
          style={{
            textAlign: 'left',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6,
            padding: '10px',
            color: '#eaeaea',
            cursor: 'pointer',
          }}
        >
          ABILITIES →
          <div style={{ fontSize: '0.85rem', color: '#b3b3b3' }}>Open 3-column grid</div>
        </button>

        <button
          onClick={() => onModeChange('djinn')}
          style={{
            textAlign: 'left',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(186,104,200,0.5)',
            borderRadius: 6,
            padding: '10px',
            color: '#eaeaea',
            cursor: 'pointer',
          }}
        >
          DJINN ABILIT. →
          <div style={{ fontSize: '0.85rem', color: '#b3b3b3' }}>Djinn-granted skills</div>
        </button>
      </div>
    </div>
  );
}
