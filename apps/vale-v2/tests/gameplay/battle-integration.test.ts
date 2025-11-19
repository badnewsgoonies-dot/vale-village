import { describe, test, expect } from 'vitest';
import { createBattleFromEncounter } from '@/core/services/EncounterService';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { mkTeam, mkUnit } from '@/test/factories';
import { makePRNG } from '@/core/random/prng';
import { executeRound, queueAction } from '@/core/services/QueueBattleService';

describe('Battle Integration', () => {
  test('should create battle from encounter ID', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);
    const rng = makePRNG(42);
    
    const result = createBattleFromEncounter('house-03', team, rng);
    
    expect(result).toBeDefined();
    expect(result?.battle).toBeDefined();
    expect(result?.battle.phase).toBe('planning');
    expect(result?.encounter).toBeDefined();
    expect(result?.encounter.id).toBe('house-03');
  });

  test('should create battle with correct enemies', () => {
    const team = mkTeam([mkUnit()]);
    const rng = makePRNG(42);
    
    const result = createBattleFromEncounter('house-03', team, rng);
    const encounter = ENCOUNTERS['house-03'];
    
    expect(result).toBeDefined();
    expect(result?.battle.enemies.length).toBe(encounter.enemies.length);
    expect(result?.battle.enemies.every(e => e.currentHp > 0)).toBe(true);
  });

  test('should allow winning battle and getting rewards', () => {
    const strongUnit = mkUnit({ id: 'u1', level: 10 });
    const team = mkTeam([strongUnit]);
    const rng = makePRNG(42);
    
    const result = createBattleFromEncounter('house-01', team, rng);
    if (!result) {
      throw new Error('Failed to create encounter');
    }
    let battle = result.battle;
    
    let rounds = 0;
    while (battle.phase === 'planning' && rounds < 20) {
      for (let i = 0; i < 4; i++) {
        const unit = battle.playerTeam.units[i];
        if (!unit) continue;
        const enemyId = battle.enemies[0]?.id;
        if (!enemyId) continue;
        
        // Find strike ability from unit
        const strikeAbility = unit.abilities.find(a => a.id === 'strike');
        if (!strikeAbility) {
          throw new Error(`Unit ${unit.id} does not have strike ability`);
        }
        
        const queueResult = queueAction(battle, unit.id, 'strike', [enemyId], strikeAbility);
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
