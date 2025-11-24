import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { skipStartupScreens, navigateToPosition, waitForMode, getGameState } from './helpers';

const TOWER_X = 76;
const TOWER_Y = 2;

test.describe('Battle Tower basic flow', () => {
  test('enter tower, clear first floor, and return to Vale', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await skipStartupScreens(page);

    const reached = await navigateToPosition(page, TOWER_X, TOWER_Y);
    expect(reached).toBe(true);

    await waitForMode(page, 'tower', 10000);

    await page.getByRole('button', { name: /Start Tower Run/i }).click();

    const injuredHp = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      const state = store.getState();
      const team = state.team;
      if (!team) return null;
      const updatedUnits = team.units.map((unit: any, idx: number) => {
        if (idx === 0) {
          const reducedHp = Math.max(1, Math.floor(unit.currentHp / 2));
          return { ...unit, currentHp: reducedHp };
        }
        return unit;
      });
      state.updateTeamUnits(updatedUnits);
      return updatedUnits[0]?.currentHp ?? null;
    });
    expect(injuredHp).toBeTruthy();

    await page.getByRole('button', { name: /Begin Battle/i }).click();
    await waitForMode(page, 'team-select', 5000);
    await page.getByRole('button', { name: /Start Battle/i }).click();
    await waitForMode(page, 'battle', 5000);

    await runBattleRound(page);

    // Some encounters may require multiple rounds; attempt a second round if still in battle mode
    const stillInBattle = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState().mode === 'battle';
    });
    if (stillInBattle) {
      await runBattleRound(page);
    }

    await waitForMode(page, 'tower', 15000);

    // Attrition check: first unit should remain injured
    const hpCheck = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      const state = store.getState();
      const team = state.team;
      if (!team) return null;
      const unit = team.units[0];
      const statsHelpers = (window as any).__VALE_STATS_HELPERS__;
      const stats = statsHelpers?.calculateEffectiveStats(unit, team);
      return {
        current: unit.currentHp,
        max: stats?.hp ?? unit.currentHp,
      };
    });
    expect(hpCheck).not.toBeNull();
    expect(hpCheck && hpCheck.current).toBeLessThan(hpCheck!.max);

    await expect(page.getByTestId('tower-next-reward')).toContainText(/Floor 6/i);

    await page.getByRole('button', { name: /Quit Run/i }).click();
    await page.getByRole('button', { name: /Confirm Quit/i }).click();
    await page.getByRole('button', { name: /Return to Vale/i }).click();

    await waitForMode(page, 'overworld', 5000);
    const finalState = await getGameState(page);
    expect(finalState?.playerPosition).toEqual({ x: TOWER_X, y: TOWER_Y });
  });
});

async function runBattleRound(page: Page) {
  await page.waitForFunction(() => {
    const store = (window as any).__VALE_STORE__;
    return store?.getState().battle?.phase === 'planning';
  });

  await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return;
    const state = store.getState();
    const battle = state.battle;
    if (!battle) return;
    const enemyId = battle.enemies[0]?.id;
    if (!enemyId) return;
    battle.playerTeam.units.forEach((_, idx) => {
      state.queueUnitAction(idx, null, [enemyId], undefined);
    });
  });

  await page.getByRole('button', { name: /EXECUTE ROUND/i }).click();
}

