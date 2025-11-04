import { createContext, useContext } from 'react';
import type { GameState, Screen, StoryFlags } from './types';
import type { Equipment } from '@/types/Equipment';
import type { Djinn } from '@/types/Djinn';
import type { AreaId, ChestId, BossId, TreasureChest } from '@/types/Area';

export interface GameActions {
  // Navigation
  navigate: (screen: Screen) => void;
  goBack: () => void;

  // Unit management
  setActiveParty: (unitIds: string[]) => void;

  // Equipment
  equipItem: (unitId: string, slot: string, equipment: Equipment) => void;
  unequipItem: (unitId: string, slot: string) => void;

  // Djinn
  equipDjinn: (unitId: string, djinn: Djinn) => void;
  unequipDjinn: (djinnId: string) => void;

  // Battle
  startBattle: (enemyIds: string[]) => void;
  executeTurn: (abilityId: string, targetId: string) => void;
  endBattle: () => void;

  // Quests
  startQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  updateQuestObjective: (questId: string, objectiveId: string, increment?: number) => void;

  // Story flags
  setStoryFlag: (flag: keyof StoryFlags, value: boolean) => void;

  // Location (now type-safe!)
  setLocation: (location: AreaId) => void;

  // Area management (now type-safe!)
  setPlayerPosition: (x: number, y: number) => void;
  movePlayer: (deltaX: number, deltaY: number) => void;
  incrementStepCounter: () => void;
  openTreasureChest: (chestId: ChestId, contents: TreasureChest['contents']) => void;
  defeatBoss: (bossId: BossId) => void;
  changeArea: (areaId: AreaId, spawnPosition: { x: number; y: number }) => void;

  // Shop
  buyItem: (itemId: string, quantity: number, cost: number) => void;
  sellItem: (itemId: string, quantity: number, sellPrice: number) => void;
  buyEquipment: (equipment: Equipment) => void;
  sellEquipment: (equipmentId: string, sellPrice: number) => void;
  useItem: (itemId: string, targetUnitId: string) => void;
}

export interface GameContextValue {
  state: GameState;
  actions: GameActions;
}

export const GameContext = createContext<GameContextValue | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
