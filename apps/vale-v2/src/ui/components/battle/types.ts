/**
 * View Model and Props types for Battle UI components
 *
 * These types decouple UI from core models and define the contract
 * between BattleScreen container and presentational components.
 */

// ============================================================================
// View Models
// ============================================================================

export interface TurnOrderUnitVM {
  id: string;
  name: string;
  side: 'player' | 'enemy';
  isCurrent: boolean;
}

export interface StatusEffectVM {
  id: string;
  icon: string;        // emoji or icon identifier
  title: string;       // tooltip text
}

export interface UnitVM {
  id: string;
  name: string;
  element: 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';
  hp?: number;         // undefined for enemies (HP not shown)
  maxHp?: number;
  statuses: StatusEffectVM[];
  isSelected: boolean;
  isKo: boolean;
  isEnemy: boolean;
}

export type TargetingType =
  | 'single-enemy'
  | 'all-enemies'
  | 'single-ally'
  | 'all-allies'
  | 'self';

export type AbilitySource = 'level' | 'equip' | 'djinn';

export interface AbilityVM {
  id: string;
  name: string;
  manaCost: number;
  targeting: TargetingType;
  source: AbilitySource;
  sourceLabel: string;    // "Lv12", "Equip: Earth Mail", "Djinn: Flint"
  description: string;    // "→ Single Enemy", "→ All Allies"
  isLocked: boolean;
  lockedReason?: string;  // "🔒 Locked – Bane in Standby (3 turns)"
}

export interface DjinnVM {
  id: string;
  name: string;
  element: 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';
  state: 'set' | 'standby' | 'recovery';
  turnsRemaining?: number;
  summonDescription: string;
  isSelectable: boolean;
}

export interface ActionSlotVM {
  unitId: string;
  unitName: string;
  summary: string;       // "Stone Fist → Goblin A", "[Empty]", "[KO'd]"
  manaCost: number;
  isCurrent: boolean;
  isEmpty: boolean;
  isKo: boolean;
}

export interface ManaVM {
  current: number;
  max: number;
  overBudget: boolean;
}

export type BattlePhase = 'planning' | 'executing';

export type BattleStatus = 'ongoing' | 'victory' | 'defeat';

export interface BattleRewardsVM {
  xp: number;
  gold: number;
}

export interface BattleLogEntry {
  id: string;
  text: string;
  timestamp: number;
}

// ============================================================================
// Component Props
// ============================================================================

export interface TurnOrderStripProps {
  units: TurnOrderUnitVM[];
}

export interface UnitCardProps {
  unit: UnitVM;
  onClick?: () => void;
}

export interface SidePanelPlayerProps {
  units: UnitVM[];
  onSelectUnit: (unitId: string) => void;
}

export interface SidePanelEnemyProps {
  units: UnitVM[];
  onSelectUnit: (unitId: string) => void;
}

export interface BattlefieldProps {
  playerUnits: UnitVM[];
  enemyUnits: UnitVM[];
  targetingMode: boolean;
  onSelectTarget?: (unitId: string) => void;
}

export type CommandType = 'attack' | 'psynergy' | 'djinn' | 'abilities';

export interface CommandPanelProps {
  currentUnit: UnitVM | null;
  selectedCommand: CommandType | null;
  coreAbilities: AbilityVM[];
  djinnAbilities: AbilityVM[];
  onCommandSelect: (command: CommandType) => void;
  onSelectAbility: (abilityId: string) => void;
}

export interface AbilityPanelProps {
  coreAbilities: AbilityVM[];
  djinnAbilities: AbilityVM[];
  onSelectAbility: (abilityId: string) => void;
}

export interface QueuePanelProps {
  roundNumber: number;
  queueSlots: ActionSlotVM[];
  mana: ManaVM;
  canExecute: boolean;
  targetingMode: boolean;
  onSelectSlot: (unitId: string) => void;
  onClearSlot: (unitId: string) => void;
  onPrevUnit: () => void;
  onNextUnit: () => void;
  onExecuteRound: () => void;
}

export interface DjinnPanelProps {
  djinns: DjinnVM[];
  onSelectDjinn: (djinnId: string) => void;
}

export interface BattleLogProps {
  entries: BattleLogEntry[];
}

export interface BattleOverlayProps {
  status: BattleStatus;
  rewards?: BattleRewardsVM;
  onContinue?: () => void;
  onReturnToVillage?: () => void;
  onRetry?: () => void;
  onReturnToTitle?: () => void;
}

export interface LayoutBattleProps {
  children: React.ReactNode;
  phase: BattlePhase;
}
