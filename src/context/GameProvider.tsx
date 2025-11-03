import React, { useState, useCallback } from 'react';
import { GameContext } from './GameContext';
import type { GameState, Screen } from './types';
import type { PlayerData } from '@/types/PlayerData';
import { Unit } from '@/types/Unit';
import { UNIT_DEFINITIONS } from '@/data/unitDefinitions';
import type { Equipment, EquipmentLoadout } from '@/types/Equipment';
import type { Djinn } from '@/types/Djinn';
import { ENEMIES, type Enemy } from '@/data/enemies';
import { createBattleState } from '@/types/Battle';
import type { UnitDefinition } from '@/types/Unit';
import { createTeam } from '@/types/Team';

// Convert Enemy to Unit for battles
function enemyToUnit(enemy: Enemy): Unit {
  const unitDef: UnitDefinition = {
    id: enemy.id,
    name: enemy.name,
    role: enemy.name as any, // Use name as role for enemies
    description: `A ${enemy.name} enemy`,
    element: enemy.element,
    baseStats: enemy.stats,
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 }, // No growth for enemies
    abilities: enemy.abilities,
  };
  return new Unit(unitDef, enemy.level);
}

function createInitialPlayerData(): PlayerData {
  // Create starter party: Isaac, Garet, Ivan, Mia
  const isaac = new Unit(UNIT_DEFINITIONS.isaac);
  const garet = new Unit(UNIT_DEFINITIONS.garet);
  const ivan = new Unit(UNIT_DEFINITIONS.ivan);
  const mia = new Unit(UNIT_DEFINITIONS.mia);

  return {
    unitsCollected: [isaac, garet, ivan, mia],
    activePartyIds: [isaac.id, garet.id, ivan.id, mia.id],
    recruitmentFlags: {},
    gold: 100,
    inventory: [],
    djinnCollected: [],
    storyFlags: {},
  };
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>({
    playerData: createInitialPlayerData(),
    currentBattle: null,
    currentScreen: { type: 'OVERWORLD' },
    screenHistory: [],
    loading: false,
    error: null,
  });

  // Navigation
  const navigate = useCallback((screen: Screen) => {
    setState(prev => ({
      ...prev,
      screenHistory: [...prev.screenHistory, prev.currentScreen],
      currentScreen: screen,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      const history = [...prev.screenHistory];
      const previousScreen = history.pop();

      if (!previousScreen) return prev;

      return {
        ...prev,
        screenHistory: history,
        currentScreen: previousScreen,
      };
    });
  }, []);

  // Equipment
  const equipItem = useCallback((unitId: string, slot: string, equipment: Equipment) => {
    setState(prev => {
      const unit = prev.playerData.unitsCollected.find(u => u.id === unitId);
      if (!unit) {
        return { ...prev, error: `Unit ${unitId} not found` };
      }

      try {
        const updatedUnit = unit.clone();
        updatedUnit.equipItem(slot as keyof EquipmentLoadout, equipment);

        return {
          ...prev,
          playerData: {
            ...prev.playerData,
            unitsCollected: prev.playerData.unitsCollected.map(u =>
              u.id === unitId ? updatedUnit : u
            ),
          },
          error: null,
        };
      } catch (error) {
        return {
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to equip item',
        };
      }
    });
  }, []);

  const unequipItem = useCallback((unitId: string, slot: string) => {
    setState(prev => {
      const unit = prev.playerData.unitsCollected.find(u => u.id === unitId);
      if (!unit) {
        return { ...prev, error: `Unit ${unitId} not found` };
      }

      try {
        const updatedUnit = unit.clone();
        const unequippedItem = updatedUnit.unequipItem(slot as keyof EquipmentLoadout);

        // Add unequipped item back to inventory if it exists
        const newInventory = unequippedItem
          ? [...prev.playerData.inventory, unequippedItem]
          : prev.playerData.inventory;

        return {
          ...prev,
          playerData: {
            ...prev.playerData,
            unitsCollected: prev.playerData.unitsCollected.map(u =>
              u.id === unitId ? updatedUnit : u
            ),
            inventory: newInventory,
          },
          error: null,
        };
      } catch (error) {
        return {
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to unequip item',
        };
      }
    });
  }, []);

  // Party management
  const setActiveParty = useCallback((unitIds: string[]) => {
    if (unitIds.length !== 4) {
      setState(prev => ({ ...prev, error: 'Active party must have exactly 4 units' }));
      return;
    }

    setState(prev => {
      // Validate all unit IDs exist
      const allExist = unitIds.every(id =>
        prev.playerData.unitsCollected.some(u => u.id === id)
      );

      if (!allExist) {
        return { ...prev, error: 'One or more units not found in collection' };
      }

      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          activePartyIds: unitIds,
        },
        error: null,
      };
    });
  }, []);

  // Battle actions
  const startBattle = useCallback((enemyIds: string[]) => {
    console.log('Starting battle with enemies:', enemyIds);

    setState(prev => {
      // Get active party units
      const activeParty = prev.playerData.unitsCollected.filter(
        unit => prev.playerData.activePartyIds.includes(unit.id)
      );

      // Create player team
      const playerTeam = createTeam(activeParty);

      // Create enemy units from IDs
      const enemies = enemyIds
        .map(id => {
          const enemy = ENEMIES[id];
          if (!enemy) {
            console.error(`Enemy not found: ${id}`);
            return null;
          }
          return enemyToUnit(enemy);
        })
        .filter((u): u is Unit => u !== null);

      if (enemies.length === 0) {
        console.error('No valid enemies found!');
        return prev;
      }

      // Create battle state
      const battleState = createBattleState(playerTeam, enemies);

      console.log('Battle initialized:', {
        playerUnits: playerTeam.units.length,
        enemyUnits: enemies.length,
        turnOrder: battleState.turnOrder.map(u => u.name),
      });

      return {
        ...prev,
        currentBattle: battleState,
      };
    });
  }, []);

  const executeTurn = useCallback((abilityId: string, targetId: string) => {
    console.log('executeTurn not yet implemented', abilityId, targetId);
  }, []);

  const endBattle = useCallback(() => {
    console.log('endBattle not yet implemented');
  }, []);

  // Djinn actions (placeholder implementations)
  const equipDjinn = useCallback((unitId: string, djinn: Djinn) => {
    console.log('equipDjinn not yet implemented', unitId, djinn);
  }, []);

  const unequipDjinn = useCallback((djinnId: string) => {
    console.log('unequipDjinn not yet implemented', djinnId);
  }, []);

  const actions = {
    navigate,
    goBack,
    equipItem,
    unequipItem,
    setActiveParty,
    startBattle,
    executeTurn,
    endBattle,
    equipDjinn,
    unequipDjinn,
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  );
};
