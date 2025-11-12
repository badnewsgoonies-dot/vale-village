import { describe, it, expect } from 'vitest';
import { createBattleFromEncounter } from '@/core/services/EncounterService';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { mkTeam, mkUnit } from '@/test/factories';
import { makePRNG } from '@/core/random/prng';
import { executeRound, queueAction } from '@/core/services/QueueBattleService';

describe('Battle Integration', () => {
  it('should create battle from encounter ID', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);
    const rng = makePRNG(42);
    
    const result = createBattleFromEncounter('c1_normal_3', team, rng);
    
    expect(result).toBeDefined();
    expect(result?.battle).toBeDefined();
    expect(result?.battle.phase).toBe('planning');
    expect(result?.encounter).toBeDefined();
    expect(result?.encounter.id).toBe('c1_normal_3');
  });

  it('should create battle with correct enemies', () => {
    const team = mkTeam([mkUnit()]);
    const rng = makePRNG(42);
    
    const result = createBattleFromEncounter('c1_normal_3', team, rng);
    const encounter = ENCOUNTERS['c1_normal_3'];
    
    expect(result).toBeDefined();
    expect(result?.battle.enemies.length).toBe(encounter.enemies.length);
    expect(result?.battle.enemies.every(e => e.currentHp > 0)).toBe(true);
  });

  it('should allow winning battle and getting rewards', () => {
    const strongUnit = mkUnit({ id: 'u1', level: 10 });
    const team = mkTeam([strongUnit]);
    const rng = makePRNG(42);
    
    const result = createBattleFromEncounter('c1_normal_1', team, rng);
    if (!result) {
      throw new Error('Failed to create encounter');
    }
    let battle = result.battle;
    
    let rounds = 0;
    while (battle.phase === 'planning' && rounds < 20) {
      for (let i = 0; i < 4; i++) {
        const unitId = battle.playerTeam.units[i]?.id;
        if (!unitId) continue;
        const enemyId = battle.enemies[0]?.id;
        if (!enemyId) continue;
        
        const queueResult = queueAction(battle, unitId, null, [enemyId]);
        if (!queueResult.ok) {
          throw new Error(queueResult.error);
        }
        battle = queueResult.value;
      }
      
      const roundResult = executeRound(battle, rng);
      battle = roundResult.state;
      rounds++;
    }
    
    expect(battle.phase).toBe('victory');
    expect(rounds).toBeLessThan(20);
  });
});
