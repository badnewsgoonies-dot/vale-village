import React, { useState, useCallback } from 'react';
import { GameContext } from './GameContext';
import type { GameState, Screen, StoryFlags, AreaState } from './types';
import type { PlayerData } from '@/types/PlayerData';
import { Unit } from '@/types/Unit';
import { UNIT_DEFINITIONS } from '@/data/unitDefinitions';
import type { Equipment, EquipmentLoadout } from '@/types/Equipment';
import { EQUIPMENT } from '@/data/equipment';
import { ALL_DJINN } from '@/data/djinn';
import type { Djinn } from '@/types/Djinn';
import { ENEMIES, type Enemy } from '@/data/enemies';
import { createBattleState, processBattleVictory } from '@/types/Battle';
import type { UnitDefinition } from '@/types/Unit';
import { createTeam } from '@/types/Team';
import type { AreaId, ChestId, BossId } from '@/types/Area';
import { ALL_AREAS } from '@/data/areas';

// Convert Enemy to Unit for battles
function enemyToUnit(enemy: Enemy): Unit {
  const unitDef: UnitDefinition = {
    id: enemy.id,
    name: enemy.name,
    role: 'Pure DPS', // Enemies use generic role instead of unsafe type cast
    description: `A ${enemy.name} enemy`,
    element: enemy.element,
    baseStats: enemy.stats,
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 }, // No growth for enemies (pp unused)
    abilities: enemy.abilities,
    manaContribution: 0, // Enemies don't contribute to player mana pool
  };
  return new Unit(unitDef, enemy.level);
}

function createInitialPlayerData(mode: 'fresh' | 'debug' = 'fresh'): PlayerData {
  const isaac = new Unit(UNIT_DEFINITIONS.isaac);

  if (mode === 'fresh') {
    // Fresh start: Only Isaac, no items, minimal gold
    return {
      unitsCollected: [isaac], // Only Isaac
      activePartyIds: [isaac.id],
      recruitmentFlags: {},
      gold: 0, // No starting gold
      inventory: [], // No equipment
      items: {}, // No consumable items
      djinnCollected: [], // No Djinn
      equippedDjinnIds: [],
      storyFlags: {},
    };
  }

  // Debug mode: ALL units, equipment, and Djinn unlocked for testing
  const garet = new Unit(UNIT_DEFINITIONS.garet);
  const ivan = new Unit(UNIT_DEFINITIONS.ivan);
  const mia = new Unit(UNIT_DEFINITIONS.mia);
  const felix = new Unit(UNIT_DEFINITIONS.felix);
  const jenna = new Unit(UNIT_DEFINITIONS.jenna);
  const sheba = new Unit(UNIT_DEFINITIONS.sheba);
  const piers = new Unit(UNIT_DEFINITIONS.piers);
  const kraden = new Unit(UNIT_DEFINITIONS.kraden);
  const kyle = new Unit(UNIT_DEFINITIONS.kyle);

  const allUnits = [isaac, garet, ivan, mia, felix, jenna, sheba, piers, kraden, kyle];
  const allDjinn = Object.values(ALL_DJINN);
  const allEquipment = Object.values(EQUIPMENT);

  return {
    unitsCollected: allUnits, // All 10 units unlocked
    activePartyIds: [isaac.id, garet.id, ivan.id, mia.id], // First 4 active
    recruitmentFlags: {},
    gold: 10000, // More gold for testing
    inventory: allEquipment, // All equipment available
    items: {}, // Start with no consumable items
    djinnCollected: allDjinn, // All Djinn unlocked
    equippedDjinnIds: [],
    storyFlags: {},
  };
}

function createInitialStoryFlags(): StoryFlags {
  return {
    intro_seen: false,
    talked_to_elder_first_time: false,
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
    storyFlags: createInitialStoryFlags(),
    currentLocation: 'battle_row',
    playerPosition: { x: 2, y: 7 }, // Starting position in Battle Row
    areaStates: {
      vale_village: createInitialAreaState(),
      forest_path: createInitialAreaState(),
      ancient_ruins: createInitialAreaState(),
      battle_row: createInitialAreaState(),
      house1_interior: createInitialAreaState(),
      house2_interior: createInitialAreaState(),
      house3_interior: createInitialAreaState(),
      house4_interior: createInitialAreaState(),
      house5_interior: createInitialAreaState(),
      house6_interior: createInitialAreaState(),
      house7_interior: createInitialAreaState(),
      house8_interior: createInitialAreaState(),
      house9_interior: createInitialAreaState(),
      house10_interior: createInitialAreaState(),
      house11_interior: createInitialAreaState(),
      house12_interior: createInitialAreaState(),
      house13_interior: createInitialAreaState(),
      house14_interior: createInitialAreaState(),
      house15_interior: createInitialAreaState(),
      house16_interior: createInitialAreaState(),
      house17_interior: createInitialAreaState(),
      house18_interior: createInitialAreaState(),
      house19_interior: createInitialAreaState(),
      house20_interior: createInitialAreaState(),
      house21_interior: createInitialAreaState(),
      house22_interior: createInitialAreaState(),
      house23_interior: createInitialAreaState(),
      house24_interior: createInitialAreaState(),
      house25_interior: createInitialAreaState(),
      house26_interior: createInitialAreaState(),
      house27_interior: createInitialAreaState(),
      house28_interior: createInitialAreaState(),
      house29_interior: createInitialAreaState(),
      house30_interior: createInitialAreaState(),
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

        // Get the currently equipped item (if any) before equipping new one
        const previouslyEquippedItem = updatedUnit.equipment[slot as keyof EquipmentLoadout];

        // Equip the new item
        updatedUnit.equipItem(slot as keyof EquipmentLoadout, equipment);

        // Remove the equipped item from inventory
        const inventoryIndex = prev.playerData.inventory.findIndex(item => item.id === equipment.id);
        const newInventory = [...prev.playerData.inventory];
        if (inventoryIndex !== -1) {
          newInventory.splice(inventoryIndex, 1);
        }

        // Add previously equipped item back to inventory (if there was one)
        if (previouslyEquippedItem) {
          newInventory.push(previouslyEquippedItem);
        }

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
    // Validate party size (1-4 units)
    if (unitIds.length < 1 || unitIds.length > 4) {
      setState(prev => ({ ...prev, error: 'Active party must have 1-4 units' }));
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

  const giveDjinn = useCallback((djinnId: string) => {
    setState(prev => {
      // Check if Djinn already collected
      const alreadyCollected = prev.playerData.djinnCollected.some(d => d.id === djinnId);
      if (alreadyCollected) {
        console.log(`Djinn ${djinnId} already collected`);
        return prev;
      }

      // Find Djinn definition
      const djinn = ALL_DJINN[djinnId];
      if (!djinn) {
        console.error(`Djinn not found: ${djinnId}`);
        return { ...prev, error: `Djinn ${djinnId} not found` };
      }

      console.log(`Giving Djinn: ${djinn.name}`);

      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          djinnCollected: [...prev.playerData.djinnCollected, djinn],
        },
        error: null,
      };
    });
  }, []);

  // Battle actions
  const startBattle = useCallback((enemyIds: string[], npcId?: string) => {
    console.log('Starting battle with enemies:', enemyIds, 'npcId:', npcId);

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
      // Add npcId to battle state
      battleState.npcId = npcId;

      console.log('Battle initialized:', {
        playerUnits: playerTeam.units.length,
        enemyUnits: enemies.length,
        turnOrder: battleState.turnOrder.map(u => u.name),
        npcId,
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

      // Determine if player won (check actual battle state, not status field)
      const playersAlive = prev.currentBattle.playerTeam.units.some(u => !u.isKO);
      const enemiesAlive = prev.currentBattle.enemies.some(u => !u.isKO);
      const playerWon = playersAlive && !enemiesAlive;

      console.log('[endBattle] Battle status:', { playersAlive, enemiesAlive, playerWon });
      console.log('[endBattle] Enemy IDs:', prev.currentBattle.enemies.map(e => ({ id: e.id, name: e.name, level: e.level })));

      // Calculate rewards if player won
      let rewards = null;
      if (playerWon) {
        console.log('[endBattle] Player won! Processing rewards...');
        rewards = processBattleVictory(prev.currentBattle);
        console.log('[endBattle] Rewards calculated:', rewards);

        // Check for NPC bonus rewards
        let npcBonusGold = 0;
        const npcBonusEquipment: Equipment[] = [];
        let npcDjinn: Djinn | null = null;

        if (prev.currentBattle.npcId) {
          // Find the NPC in current area
          const currentArea = ALL_AREAS[prev.currentLocation];
          const npc = currentArea?.npcs.find(n => n.id === prev.currentBattle?.npcId);

          if (npc?.battleRewards) {
            console.log('NPC battle rewards found:', npc.battleRewards);
            npcBonusGold = npc.battleRewards.gold || 0;
            if (npc.battleRewards.equipment) {
              npcBonusEquipment.push(...npc.battleRewards.equipment);
            }
            if (npc.battleRewards.djinnId) {
              const djinn = ALL_DJINN[npc.battleRewards.djinnId];
              if (djinn) {
                npcDjinn = djinn;
              }
            }
          }
        }

        // Merge NPC rewards with battle rewards
        const totalGold = rewards.goldEarned + npcBonusGold;
        const totalEquipment = [...rewards.rewards.equipmentDrops, ...npcBonusEquipment];

        // Update rewards object to include NPC bonuses
        rewards = {
          ...rewards,
          goldEarned: totalGold,
          rewards: {
            ...rewards.rewards,
            equipmentDrops: totalEquipment,
          },
        };

        // Add equipment drops to inventory, gold, and djinn
        const updatedPlayerData = {
          ...prev.playerData,
          gold: prev.playerData.gold + totalGold,
          inventory: [
            ...prev.playerData.inventory,
            ...totalEquipment
          ],
          djinnCollected: npcDjinn
            ? [...prev.playerData.djinnCollected, npcDjinn]
            : prev.playerData.djinnCollected,
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

  // Djinn management
  const equipDjinn = useCallback((djinnId: string) => {
    setState(prev => {
      // Validation: Check if Djinn is collected
      const djinn = prev.playerData.djinnCollected.find(d => d.id === djinnId);
      if (!djinn) {
        return { ...prev, error: 'Cannot equip Djinn that has not been collected' };
      }

      // Validation: Check if already equipped
      if (prev.playerData.equippedDjinnIds.includes(djinnId)) {
        return { ...prev, error: 'Djinn is already equipped' };
      }

      // Validation: Max 3 Djinn equipped
      if (prev.playerData.equippedDjinnIds.length >= 3) {
        return { ...prev, error: 'Maximum 3 Djinn can be equipped. Unequip one first.' };
      }

      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          equippedDjinnIds: [...prev.playerData.equippedDjinnIds, djinnId],
        },
        error: null,
      };
    });
  }, []);

  const unequipDjinn = useCallback((djinnId: string) => {
    setState(prev => {
      // Validation: Check if Djinn is actually equipped
      if (!prev.playerData.equippedDjinnIds.includes(djinnId)) {
        return { ...prev, error: 'Djinn is not currently equipped' };
      }

      return {
        ...prev,
        playerData: {
          ...prev.playerData,
          equippedDjinnIds: prev.playerData.equippedDjinnIds.filter(id => id !== djinnId),
        },
        error: null,
      };
    });
  }, []);

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

  // Start new game with specified mode
  const startNewGame = useCallback((mode: 'fresh' | 'debug' = 'fresh') => {
    setState({
      playerData: createInitialPlayerData(mode),
      currentBattle: null,
      lastBattleRewards: null,
      currentScreen: { type: 'DIALOGUE', npcId: 'first_djinn' }, // Start with Isaac+Djinn cutscene
      screenHistory: [],
      loading: false,
      error: null,
      storyFlags: createInitialStoryFlags(),
      currentLocation: 'battle_row',
      playerPosition: { x: 2, y: 7 }, // Starting position in Battle Row
      areaStates: {
        vale_village: createInitialAreaState(),
        forest_path: createInitialAreaState(),
        ancient_ruins: createInitialAreaState(),
        battle_row: createInitialAreaState(),
        house1_interior: createInitialAreaState(),
        house2_interior: createInitialAreaState(),
        house3_interior: createInitialAreaState(),
        house4_interior: createInitialAreaState(),
        house5_interior: createInitialAreaState(),
        house6_interior: createInitialAreaState(),
        house7_interior: createInitialAreaState(),
        house8_interior: createInitialAreaState(),
        house9_interior: createInitialAreaState(),
        house10_interior: createInitialAreaState(),
        house11_interior: createInitialAreaState(),
        house12_interior: createInitialAreaState(),
        house13_interior: createInitialAreaState(),
        house14_interior: createInitialAreaState(),
        house15_interior: createInitialAreaState(),
        house16_interior: createInitialAreaState(),
        house17_interior: createInitialAreaState(),
        house18_interior: createInitialAreaState(),
        house19_interior: createInitialAreaState(),
        house20_interior: createInitialAreaState(),
        house21_interior: createInitialAreaState(),
        house22_interior: createInitialAreaState(),
        house23_interior: createInitialAreaState(),
        house24_interior: createInitialAreaState(),
        house25_interior: createInitialAreaState(),
        house26_interior: createInitialAreaState(),
        house27_interior: createInitialAreaState(),
        house28_interior: createInitialAreaState(),
        house29_interior: createInitialAreaState(),
        house30_interior: createInitialAreaState(),
      },
    });
  }, []);

  const actions = {
    navigate,
    goBack,
    startNewGame,
    equipItem,
    unequipItem,
    setActiveParty,
    recruitUnit,
    addGold,
    giveDjinn,
    startBattle,
    executeTurn,
    endBattle,
    equipDjinn,
    unequipDjinn,
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
