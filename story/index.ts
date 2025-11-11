/**
 * Story Content Index
 *
 * Central registry for all story scenes (intro, chapters, battle contexts).
 * Consumers (dialogue UI, storySlice helpers, etc.) use this to trigger scenes based on game events.
 */

import type { DialogueTree } from '@/types/Dialogue';
import { introScene } from './intro';
import { chapter1Intro } from './chapters/chapter1';
import { chapter2Intro } from './chapters/chapter2';
import { chapter3Intro } from './chapters/chapter3';
import { firstBattleIntro } from './battle-intros/first-battle';
import { trainingMatchIntro } from './battle-intros/training-match';
import { tournamentIntro } from './battle-intros/tournament';
import { sanctumChallengeIntro } from './battle-intros/sanctum-challenge';
import { rivalDuelIntro } from './battle-intros/rival-duel';
import { mercuryGuardianIntro } from './battle-intros/guardian-mercury';
import { venusGuardianIntro } from './battle-intros/guardian-venus';
import { marsGuardianIntro } from './battle-intros/guardian-mars';
import { jupiterGuardianIntro } from './battle-intros/guardian-jupiter';

/**
 * Story scene registry
 * Maps scene IDs to their dialogue trees
 */
export const storyScenes: Record<string, DialogueTree> = {
  // Game intro
  'intro': introScene,

  // Chapter introductions
  'chapter-1': chapter1Intro,
  'chapter-2': chapter2Intro,
  'chapter-3': chapter3Intro,

  // Battle context scenes
  'first-battle': firstBattleIntro,
  'training-match': trainingMatchIntro,
  'tournament': tournamentIntro,
  'sanctum-challenge': sanctumChallengeIntro,
  'rival-duel': rivalDuelIntro,

  // Guardian challenge scenes
  'guardian-mercury': mercuryGuardianIntro,
  'guardian-venus': venusGuardianIntro,
  'guardian-mars': marsGuardianIntro,
  'guardian-jupiter': jupiterGuardianIntro,
};

/**
 * Get a story scene by ID
 */
export function getStoryScene(sceneId: string): DialogueTree | null {
  return storyScenes[sceneId] || null;
}

/**
 * Story scene metadata for the StoryManager
 */
export interface StorySceneMetadata {
  id: string;
  type: 'intro' | 'chapter' | 'battle-context';
  title: string;
  description: string;
  triggerCondition?: (flags: any) => boolean;
}

export const sceneMetadata: StorySceneMetadata[] = [
  {
    id: 'intro',
    type: 'intro',
    title: 'Game Introduction',
    description: 'Opening scene that establishes Vale Village',
  },
  {
    id: 'chapter-1',
    type: 'chapter',
    title: 'Chapter 1: The Adepts of Vale',
    description: 'Introduction to training in Vale Village',
  },
  {
    id: 'chapter-2',
    type: 'chapter',
    title: 'Chapter 2: Tournament of Elements',
    description: 'Competitive tournament begins',
  },
  {
    id: 'chapter-3',
    type: 'chapter',
    title: 'Chapter 3: The Ancient Challenge',
    description: 'Face the guardians of Sol Sanctum',
  },
  {
    id: 'first-battle',
    type: 'battle-context',
    title: 'First Battle Tutorial',
    description: 'Tutorial for the first combat',
  },
  {
    id: 'training-match',
    type: 'battle-context',
    title: 'Training Match',
    description: 'Context for friendly sparring',
  },
  {
    id: 'tournament',
    type: 'battle-context',
    title: 'Tournament Battle',
    description: 'Context for tournament matches',
  },
  {
    id: 'sanctum-challenge',
    type: 'battle-context',
    title: 'Sol Sanctum Challenge',
    description: 'Context for guardian battles',
  },
  {
    id: 'rival-duel',
    type: 'battle-context',
    title: 'Rival Duel',
    description: 'Personal rivalry battles',
  },
  {
    id: 'guardian-mercury',
    type: 'battle-context',
    title: 'Mercury Guardian Trial',
    description: 'Test of wisdom and control',
  },
  {
    id: 'guardian-venus',
    type: 'battle-context',
    title: 'Venus Guardian Trial',
    description: 'Test of strength and resolve',
  },
  {
    id: 'guardian-mars',
    type: 'battle-context',
    title: 'Mars Guardian Trial',
    description: 'Test of passion and discipline',
  },
  {
    id: 'guardian-jupiter',
    type: 'battle-context',
    title: 'Jupiter Guardian Trial',
    description: 'Test of speed and precision',
  },
];
