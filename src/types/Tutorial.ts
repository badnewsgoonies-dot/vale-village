import type { Unit } from './Unit';
import type { Ability } from './Ability';
import type { Djinn } from './Djinn';

/**
 * Tutorial IDs for all available tutorials
 */
export type TutorialId =
  | 'basic-combat'
  | 'psynergy-system'
  | 'djinn-mechanics'
  | 'summon-system'
  | 'advanced-tactics';

/**
 * Tutorial completion status
 */
export type TutorialStatus = 'locked' | 'available' | 'in-progress' | 'completed';

/**
 * Tutorial objective types - what the player must do
 */
export type ObjectiveType =
  | 'use-attack'
  | 'use-defend'
  | 'use-item'
  | 'use-psynergy'
  | 'use-specific-ability'
  | 'activate-djinn'
  | 'use-summon'
  | 'defeat-enemy'
  | 'survive-turns'
  | 'apply-buff'
  | 'apply-debuff'
  | 'trigger-critical'
  | 'dodge-attack';

/**
 * A single objective within a tutorial
 */
export interface TutorialObjective {
  id: string;
  type: ObjectiveType;
  description: string;
  completed: boolean;

  // Optional specific requirements
  abilityId?: string;      // For 'use-specific-ability'
  djinnId?: string;        // For 'activate-djinn'
  count?: number;          // For objectives that need multiple actions
  currentCount?: number;   // Current progress
}

/**
 * Narrator dialogue step
 */
export interface NarratorDialogue {
  speaker: string;         // "Narrator", "Isaac", etc.
  text: string;
  emotion?: 'neutral' | 'excited' | 'warning' | 'success';
  pauseBattle?: boolean;   // Should battle pause during this dialogue?
}

/**
 * Tutorial step - a phase within the tutorial
 */
export interface TutorialStep {
  id: string;
  title: string;
  dialogue: NarratorDialogue[];
  objectives: TutorialObjective[];
  hints: string[];         // Hints shown if player is stuck

  // Conditions for this step
  triggerOnStart?: boolean;
  triggerOnObjectiveComplete?: string; // Trigger when specific objective completes
}

/**
 * Complete tutorial definition
 */
export interface Tutorial {
  id: TutorialId;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;   // "5 minutes", "10 minutes", etc.

  // Tutorial setup
  playerTeamSetup: {
    units: Unit[];
    forcedEquipment?: Map<string, string[]>; // unitId -> equipmentIds
    forcedDjinn?: Djinn[];
  };

  enemySetup: {
    units: Unit[];
  };

  // Tutorial flow
  steps: TutorialStep[];

  // Unlocks
  unlocksOnComplete?: TutorialId[];
  unlocksFeatures?: string[]; // Feature gallery unlocks

  // Rewards
  rewards: {
    badge: string;
    title: string;
  };
}

/**
 * Tutorial progress tracking
 */
export interface TutorialProgress {
  tutorialId: TutorialId;
  status: TutorialStatus;
  currentStepIndex: number;
  stepsCompleted: string[]; // Step IDs
  objectivesCompleted: string[]; // Objective IDs
  attemptsCount: number;
  bestTime?: number; // In seconds
  completedAt?: Date;
}

/**
 * Tutorial state for the active tutorial
 */
export interface TutorialState {
  activeTutorial: Tutorial | null;
  currentStepIndex: number;
  showHint: boolean;
  hintIndex: number;
  isPaused: boolean;
  startTime: number;

  // Battle state overrides
  restrictedActions?: string[]; // Actions not allowed in this tutorial
  highlightedActions?: string[]; // Actions to highlight for the player
}

/**
 * Achievement/Badge for completing tutorials
 */
export interface TutorialBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  tutorialId: TutorialId;
}

/**
 * Showcase mode settings
 */
export interface ShowcaseSettings {
  unlocked: boolean;
  availableCharacters: string[]; // Unit IDs
  availableDjinn: string[]; // Djinn IDs
  availableEquipment: string[]; // Equipment IDs
  infinitePP: boolean;
  godMode: boolean;
}

/**
 * Feature gallery state
 */
export interface FeatureGalleryState {
  unlockedSections: string[]; // 'characters', 'djinn', 'abilities', 'summons', 'equipment'
  viewedCharacters: Set<string>;
  viewedDjinn: Set<string>;
  viewedAbilities: Set<string>;
  viewedSummons: Set<string>;
  viewedEquipment: Set<string>;
}

/**
 * Master tutorial system state
 */
export interface TutorialSystemState {
  // Tutorial progress
  tutorialProgress: Map<TutorialId, TutorialProgress>;
  completedTutorialIds: Set<TutorialId>;

  // Current session
  currentTutorial: TutorialState | null;

  // Showcase mode
  showcaseSettings: ShowcaseSettings;

  // Feature gallery
  featureGallery: FeatureGalleryState;

  // Achievements
  badges: TutorialBadge[];

  // Settings
  canSkipTutorials: boolean;
  showTooltips: boolean;
  helpMode: 'disabled' | 'tooltips-only' | 'full-guidance';
}

/**
 * Check if a tutorial is unlocked
 */
export function isTutorialUnlocked(
  tutorialId: TutorialId,
  completedTutorials: Set<TutorialId>
): boolean {
  // Basic combat is always available
  if (tutorialId === 'basic-combat') {
    return true;
  }

  // Psynergy requires basic combat
  if (tutorialId === 'psynergy-system') {
    return completedTutorials.has('basic-combat');
  }

  // Djinn requires psynergy
  if (tutorialId === 'djinn-mechanics') {
    return completedTutorials.has('psynergy-system');
  }

  // Summons require djinn
  if (tutorialId === 'summon-system') {
    return completedTutorials.has('djinn-mechanics');
  }

  // Advanced tactics require all basics
  if (tutorialId === 'advanced-tactics') {
    return completedTutorials.has('basic-combat') &&
           completedTutorials.has('psynergy-system') &&
           completedTutorials.has('djinn-mechanics');
  }

  return false;
}

/**
 * Calculate tutorial completion percentage
 */
export function calculateCompletionPercentage(
  completedTutorials: Set<TutorialId>
): number {
  const totalTutorials = 5; // We have 5 tutorials
  return (completedTutorials.size / totalTutorials) * 100;
}
