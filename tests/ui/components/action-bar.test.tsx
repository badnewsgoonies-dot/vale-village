import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { UnitCard } from '@/ui/components/UnitCard';
import { ActionBar } from '@/ui/components/ActionBar';
import { useStore } from '@/ui/state/store';
import { mkUnit, mkTeam, mkEnemy, mkBattle } from '@/test/factories';

describe('UnitCard (Mana-only UI)', () => {
  it('renders HP without any PP labels', () => {
    const unit = mkUnit();
    const team = mkTeam([unit]);
    render(<UnitCard unit={unit} isPlayer team={team} />);

    expect(screen.queryByText(/pp/i)).toBeNull();
    expect(screen.queryByText(/hp:/i)).not.toBeNull();
  });
});

describe('ActionBar (team mana filtering)', () => {
  const ability = {
    id: 'test-mana-strike',
    name: 'Mana Strike',
    type: 'psynergy',
    manaCost: 3,
    basePower: 12,
    targets: 'single-enemy' as const,
    unlockLevel: 1,
    description: 'Test cost filtering',
  };

  const playerUnit = mkUnit({
    abilities: [ability],
    unlockedAbilityIds: [ability.id],
  });

  const battleTemplate = mkBattle({
    party: [playerUnit],
    enemies: [mkEnemy()],
  });
  battleTemplate.turnOrder = [playerUnit.id, ...battleTemplate.enemies.map((enemy) => enemy.id)];
  battleTemplate.currentActorIndex = 0;

  const abilityButtonLabel = `${ability.name} (Cost: ${ability.manaCost})`;
  const initialState = useStore.getState();

  beforeEach(() => {
    act(() => {
      useStore.setState({
        ...initialState,
        battle: battleTemplate,
        perform: vi.fn(),
        endTurn: vi.fn(),
        preview: vi.fn(() => ({ avg: 0, min: 0, max: 0 })),
      });
    });
  });

  afterEach(() => {
    act(() => {
      useStore.setState(initialState);
    });
  });

  it('does not render abilities when mana is insufficient', () => {
    const lowManaBattle = { ...battleTemplate, remainingMana: ability.manaCost - 1 };
    act(() => {
      useStore.setState((state) => ({ ...state, battle: lowManaBattle }));
    });

    render(<ActionBar />);

    expect(screen.queryByText(abilityButtonLabel)).toBeNull();
  });

  it('shows ability cost label when mana is sufficient', () => {
    const fullManaBattle = { ...battleTemplate, remainingMana: ability.manaCost };
    act(() => {
      useStore.setState((state) => ({ ...state, battle: fullManaBattle }));
    });

    render(<ActionBar />);

    expect(screen.queryByText(abilityButtonLabel)).not.toBeNull();
  });
});

