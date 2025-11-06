import React, { useState, useCallback } from 'react';
import { GameContext } from './GameContext';
import type { GameState, Screen, StoryFlags, AreaState } from './types';
import type { PlayerData } from '@/types/PlayerData';
import { Unit } from '@/types/Unit';
import { UNIT_DEFINITIONS } from '@/data/unitDefinitions';
import type { Equipment, EquipmentLoadout } from '@/types/Equipment';
import type { Djinn } from '@/types/Djinn';
import { ENEMIES, type Enemy } from '@/data/enemies';
import { createBattleState, processBattleVictory, BattleResult } from '@/types/Battle';
import type { UnitDefinition } from '@/types/Unit';
import { createTeam } from '@/types/Team';
import { getAllQuests } from '@/data/quests';
import { updateObjectiveProgress } from '@/types/Quest';
import type { AreaId, ChestId, BossId } from '@/types/Area';

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
    items: {}, // Start with no consumable items
    djinnCollected: [],
    storyFlags: {},
  };
}

function createInitialStoryFlags(): StoryFlags {
  return {
    intro_seen: false,
    talked_to_elder_first_time: false,
    quest_forest_started: false,
    quest_forest_complete: false,
    quest_ruins_started: false,
    quest_ruins_complete: false,
    defeated_alpha_wolf: false,
    defeated_golem_king: false,
    met_mysterious_stranger: false,
    talked_to_shopkeeper: false,
    used_inn: false,
    obtained_djinn_flint: false,
    obtained_djinn_forge: false,
    forest_path_unlocked: false,
    ancient_ruins_unlocked: false,
    tutorial_battle_complete: false,
    tutorial_shop_complete: false,
  };
}

function createInitialAreaState(): AreaState {
  return {
    openedChests: new Set(),
    defeatedBosses: new Set(),
    stepCounter: 0,
  };
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>({
    playerData: createInitialPlayerData(),
    currentBattle: null,
    lastBattleRewards: null,
    currentScreen: { type: 'TITLE' },
    screenHistory: [],
    loading: false,
    error: null,
    quests: getAllQuests(),
    storyFlags: createInitialStoryFlags(),
    currentLocation: 'vale_village',
    playerPosition: { x: 10, y: 7 }, // Starting position in Vale Village
    areaStates: {
      vale_village: createInitialAreaState(),
      forest_path: createInitialAreaState(),
      ancient_ruins: createInitialAreaState(),
    },
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

  const recruitUnit = useCallback((unitId: string) => {
    setState(prev => {
      // Check if unit already recruited
      const alreadyRecruited = prev.playerData.unitsCollected.some(u => u.id === unitId);
      if (alreadyRecruited) {
        console.log(`Unit ${unitId} already recruited`);
        return prev;
      }

      // Find unit definition
      const unitDef = UNIT_DEFINITIONS[unitId];
      if (!unitDef) {
        console.error(`Unit definition not found: ${unitId}`);
        return { ...prev, error: `Unit ${unitId} not found` };
      }

      // Create new unit instance
      const newUnit = new Unit(unitDef);

      // Check if we have space (max 10 units)
      if (prev.playerData.unitsCollected.length >= 10) {
        return { ...prev, error: 'Maximum unit collection reached (10 units)' };
      }

      console.log(`Recruiting unit: ${newUnit.name}`);

      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          unitsCollected: [...prev.playerData.unitsCollected, newUnit],
          recruitmentFlags: {
            ...prev.playerData.recruitmentFlags,
            [unitId]: true,
          },
        },
        error: null,
      };
    });
  }, []);

  const addGold = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      playerData: {
        ...prev.playerData,
        gold: prev.playerData.gold + amount,
      },
    }));
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
    setState(prev => {
      if (!prev.currentBattle) {
        console.warn('No active battle to end');
        return prev;
      }
      
      // Calculate rewards if player won
      let rewards = null;
      if (prev.currentBattle.status === BattleResult.PLAYER_VICTORY) {
        rewards = processBattleVictory(prev.currentBattle);
        
        // Add equipment drops to inventory and gold
        const updatedPlayerData = {
          ...prev.playerData,
          gold: prev.playerData.gold + rewards.goldEarned,
          inventory: [
            ...prev.playerData.inventory,
            ...rewards.rewards.equipmentDrops
          ],
        };
        
        return {
          ...prev,
          playerData: updatedPlayerData,
          currentBattle: null,
          lastBattleRewards: rewards,
        };
      }

      return {
        ...prev,
        currentBattle: null,
        lastBattleRewards: rewards,
      };
    });
  }, []);

  // Djinn actions (placeholder implementations)
  const equipDjinn = useCallback((unitId: string, djinn: Djinn) => {
    console.log('equipDjinn not yet implemented', unitId, djinn);
  }, []);

  const unequipDjinn = useCallback((djinnId: string) => {
    console.log('unequipDjinn not yet implemented', djinnId);
  }, []);

  // Quest management
  const startQuest = useCallback((questId: string) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(q =>
        q.id === questId ? { ...q, status: 'active' as const } : q
      ),
    }));
  }, []);

  const completeQuest = useCallback((questId: string) => {
    setState(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest) return prev;

      // Give rewards
      const newGold = prev.playerData.gold + quest.rewards.gold;
      const newInventory = [...prev.playerData.inventory, ...quest.rewards.items];

      // Add Djinn if reward includes one
      const newDjinnCollected = quest.rewards.djinn
        ? [...prev.playerData.djinnCollected, quest.rewards.djinn]
        : prev.playerData.djinnCollected;

      // Mark quest as complete
      const updatedQuests = prev.quests.map(q =>
        q.id === questId ? { ...q, status: 'completed' as const } : q
      );

      // Unlock next quests if any
      const questsToUnlock = quest.unlocksQuestIds || [];
      const finalQuests = updatedQuests.map(q =>
        questsToUnlock.includes(q.id) ? { ...q, status: 'active' as const } : q
      );

      return {
        ...prev,
        quests: finalQuests,
        playerData: {
          ...prev.playerData,
          gold: newGold,
          inventory: newInventory,
          djinnCollected: newDjinnCollected,
        },
      };
    });
  }, []);

  const updateQuestObjective = useCallback(
    (questId: string, objectiveId: string, increment: number = 1) => {
      setState(prev => {
        const quest = prev.quests.find(q => q.id === questId);
        if (!quest || quest.status !== 'active') return prev;

        const updatedQuests = prev.quests.map(q => {
          if (q.id !== questId) return q;

          const updatedObjectives = q.objectives.map(obj =>
            obj.id === objectiveId ? updateObjectiveProgress(obj, increment) : obj
          );

          // Auto-complete quest if all objectives done
          const allComplete = updatedObjectives.every(obj => obj.completed);

          return {
            ...q,
            objectives: updatedObjectives,
            status: allComplete ? ('completed' as const) : q.status,
          };
        });

        return { ...prev, quests: updatedQuests };
      });
    },
    []
  );

  // Story flags management
  const setStoryFlag = useCallback((flag: keyof StoryFlags, value: boolean) => {
    setState(prev => ({
      ...prev,
      storyFlags: {
        ...prev.storyFlags,
        [flag]: value,
      },
    }));
  }, []);

  // Location management
  const setLocation = useCallback((location: AreaId) => {
    setState(prev => ({
      ...prev,
      currentLocation: location,
    }));
  }, []);

  // Area management
  const setPlayerPosition = useCallback((x: number, y: number) => {
    setState(prev => ({
      ...prev,
      playerPosition: { x, y },
    }));
  }, []);

  const movePlayer = useCallback((deltaX: number, deltaY: number) => {
    setState(prev => ({
      ...prev,
      playerPosition: {
        x: prev.playerPosition.x + deltaX,
        y: prev.playerPosition.y + deltaY,
      },
    }));
  }, []);

  const incrementStepCounter = useCallback(() => {
    setState(prev => {
      const areaState = prev.areaStates[prev.currentLocation];
      if (!areaState) return prev;

      return {
        ...prev,
        areaStates: {
          ...prev.areaStates,
          [prev.currentLocation]: {
            ...areaState,
            stepCounter: areaState.stepCounter + 1,
          },
        },
      };
    });
  }, []);

  const openTreasureChest = useCallback((chestId: ChestId, contents: { gold?: number; items?: any[]; equipment?: Equipment[] }) => {
    setState(prev => {
      const areaState = prev.areaStates[prev.currentLocation];
      if (!areaState) return prev;

      const newOpenedChests = new Set(areaState.openedChests);
      newOpenedChests.add(chestId);

      // Add gold to player
      const newGold = prev.playerData.gold + (contents.gold || 0);

      // Add equipment to inventory
      const newInventory = [...prev.playerData.inventory];
      if (contents.equipment) {
        newInventory.push(...contents.equipment);
      }

      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          gold: newGold,
          inventory: newInventory,
        },
        areaStates: {
          ...prev.areaStates,
          [prev.currentLocation]: {
            ...areaState,
            openedChests: newOpenedChests,
          },
        },
      };
    });
  }, []);

  const defeatBoss = useCallback((bossId: BossId) => {
    setState(prev => {
      const areaState = prev.areaStates[prev.currentLocation];
      if (!areaState) return prev;

      const newDefeatedBosses = new Set(areaState.defeatedBosses);
      newDefeatedBosses.add(bossId);

      return {
        ...prev,
        areaStates: {
          ...prev.areaStates,
          [prev.currentLocation]: {
            ...areaState,
            defeatedBosses: newDefeatedBosses,
          },
        },
      };
    });
  }, []);

  const changeArea = useCallback((areaId: AreaId, spawnPosition: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      currentLocation: areaId,
      playerPosition: spawnPosition,
    }));
  }, []);

  // Shop actions
  const buyItem = useCallback((itemId: string, quantity: number, cost: number) => {
    setState(prev => {
      const totalCost = cost * quantity;
      if (prev.playerData.gold < totalCost) {
        return { ...prev, error: 'Not enough gold!' };
      }

      const currentQuantity = prev.playerData.items[itemId] || 0;

      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          gold: prev.playerData.gold - totalCost,
          items: {
            ...prev.playerData.items,
            [itemId]: currentQuantity + quantity,
          },
        },
        error: null,
      };
    });
  }, []);

  const sellItem = useCallback((itemId: string, quantity: number, sellPrice: number) => {
    setState(prev => {
      const currentQuantity = prev.playerData.items[itemId] || 0;
      if (currentQuantity < quantity) {
        return { ...prev, error: 'Not enough items to sell!' };
      }

      const totalEarned = sellPrice * quantity;
      const newQuantity = currentQuantity - quantity;
      const newItems = { ...prev.playerData.items };

      if (newQuantity === 0) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = newQuantity;
      }

      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          gold: prev.playerData.gold + totalEarned,
          items: newItems,
        },
        error: null,
      };
    });
  }, []);

  const buyEquipment = useCallback((equipment: Equipment) => {
    setState(prev => {
      if (prev.playerData.gold < equipment.cost) {
        return { ...prev, error: 'Not enough gold!' };
      }

      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          gold: prev.playerData.gold - equipment.cost,
          inventory: [...prev.playerData.inventory, equipment],
        },
        error: null,
      };
    });
  }, []);

  const sellEquipment = useCallback((equipmentId: string, sellPrice: number) => {
    setState(prev => {
      const equipmentIndex = prev.playerData.inventory.findIndex(e => e.id === equipmentId);
      if (equipmentIndex === -1) {
        return { ...prev, error: 'Equipment not found in inventory!' };
      }

      const newInventory = [...prev.playerData.inventory];
      newInventory.splice(equipmentIndex, 1);

      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          gold: prev.playerData.gold + sellPrice,
          inventory: newInventory,
        },
        error: null,
      };
    });
  }, []);

  const useItem = useCallback((itemId: string, _targetUnitId: string) => {
    setState(prev => {
      const quantity = prev.playerData.items[itemId] || 0;
      if (quantity === 0) {
        return { ...prev, error: 'No items to use!' };
      }

      // Decrease item count
      const newQuantity = quantity - 1;
      const newItems = { ...prev.playerData.items };

      if (newQuantity === 0) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = newQuantity;
      }

      // Apply item effect to target unit (handled by caller in the future)
      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          items: newItems,
        },
        error: null,
      };
    });
  }, []);

  const actions = {
    navigate,
    goBack,
    equipItem,
    unequipItem,
    setActiveParty,
    recruitUnit,
    addGold,
    startBattle,
    executeTurn,
    endBattle,
    equipDjinn,
    unequipDjinn,
    // Quest actions
    startQuest,
    completeQuest,
    updateQuestObjective,
    // Story flags
    setStoryFlag,
    // Location
    setLocation,
    // Area management
    setPlayerPosition,
    movePlayer,
    incrementStepCounter,
    openTreasureChest,
    defeatBoss,
    changeArea,
    // Shop
    buyItem,
    sellItem,
    buyEquipment,
    sellEquipment,
    useItem,
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  );
};
