import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type {
  TutorialId,
  Tutorial,
  TutorialSystemState,
  TutorialProgress,
  TutorialStatus,
  TutorialObjective,
  ShowcaseSettings,
  FeatureGalleryState,
  TutorialBadge,
} from '@/types/Tutorial';
import { isTutorialUnlocked } from '@/types/Tutorial';

/**
 * Tutorial Context Actions
 */
interface TutorialContextValue {
  // State
  state: TutorialSystemState;

  // Tutorial management
  startTutorial: (tutorialId: TutorialId, tutorial: Tutorial) => void;
  completeTutorial: (tutorialId: TutorialId) => void;
  quitTutorial: () => void;
  skipTutorial: (tutorialId: TutorialId) => void;

  // Step management
  advanceStep: () => void;
  completeObjective: (objectiveId: string) => void;
  showHint: () => void;
  togglePause: () => void;

  // Progress tracking
  getTutorialStatus: (tutorialId: TutorialId) => TutorialStatus;
  getTutorialProgress: (tutorialId: TutorialId) => TutorialProgress | undefined;
  getCompletionPercentage: () => number;

  // Showcase mode
  unlockShowcase: () => void;
  updateShowcaseSettings: (settings: Partial<ShowcaseSettings>) => void;

  // Feature gallery
  unlockFeature: (feature: string) => void;
  markAsViewed: (type: 'characters' | 'djinn' | 'abilities' | 'summons' | 'equipment', id: string) => void;

  // Badges
  awardBadge: (badge: TutorialBadge) => void;

  // Settings
  toggleTooltips: () => void;
  setHelpMode: (mode: 'disabled' | 'tooltips-only' | 'full-guidance') => void;
  enableSkipMode: () => void;
}

const TutorialContext = createContext<TutorialContextValue | undefined>(undefined);

/**
 * Initial tutorial system state
 */
function createInitialState(): TutorialSystemState {
  return {
    tutorialProgress: new Map(),
    completedTutorialIds: new Set(),
    currentTutorial: null,
    showcaseSettings: {
      unlocked: false,
      availableCharacters: [],
      availableDjinn: [],
      availableEquipment: [],
      infinitePP: false,
      godMode: false,
    },
    featureGallery: {
      unlockedSections: [],
      viewedCharacters: new Set(),
      viewedDjinn: new Set(),
      viewedAbilities: new Set(),
      viewedSummons: new Set(),
      viewedEquipment: new Set(),
    },
    badges: [],
    canSkipTutorials: false,
    showTooltips: true,
    helpMode: 'full-guidance',
  };
}

/**
 * Tutorial Provider Component
 */
export function TutorialProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TutorialSystemState>(createInitialState);

  /**
   * Start a tutorial
   */
  const startTutorial = useCallback((tutorialId: TutorialId, tutorial: Tutorial) => {
    setState(prev => {
      // Initialize progress if not exists
      if (!prev.tutorialProgress.has(tutorialId)) {
        const newProgress: TutorialProgress = {
          tutorialId,
          status: 'in-progress',
          currentStepIndex: 0,
          stepsCompleted: [],
          objectivesCompleted: [],
          attemptsCount: 1,
        };
        prev.tutorialProgress.set(tutorialId, newProgress);
      } else {
        const progress = prev.tutorialProgress.get(tutorialId)!;
        progress.status = 'in-progress';
        progress.attemptsCount++;
      }

      return {
        ...prev,
        currentTutorial: {
          activeTutorial: tutorial,
          currentStepIndex: 0,
          showHint: false,
          hintIndex: 0,
          isPaused: false,
          startTime: Date.now(),
          restrictedActions: [],
          highlightedActions: [],
        },
      };
    });
  }, []);

  /**
   * Complete a tutorial
   */
  const completeTutorial = useCallback((tutorialId: TutorialId) => {
    setState(prev => {
      const progress = prev.tutorialProgress.get(tutorialId);
      if (progress) {
        const elapsedTime = prev.currentTutorial
          ? Math.floor((Date.now() - prev.currentTutorial.startTime) / 1000)
          : 0;

        progress.status = 'completed';
        progress.completedAt = new Date();
        if (!progress.bestTime || elapsedTime < progress.bestTime) {
          progress.bestTime = elapsedTime;
        }
      }

      const newCompleted = new Set(prev.completedTutorialIds);
      newCompleted.add(tutorialId);

      return {
        ...prev,
        completedTutorialIds: newCompleted,
        currentTutorial: null,
      };
    });
  }, []);

  /**
   * Quit current tutorial
   */
  const quitTutorial = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentTutorial: null,
    }));
  }, []);

  /**
   * Skip a tutorial (marks as completed without doing it)
   */
  const skipTutorial = useCallback((tutorialId: TutorialId) => {
    if (!state.canSkipTutorials) {
      console.warn('Skipping tutorials is disabled');
      return;
    }

    setState(prev => {
      const progress: TutorialProgress = {
        tutorialId,
        status: 'completed',
        currentStepIndex: 0,
        stepsCompleted: [],
        objectivesCompleted: [],
        attemptsCount: 0,
        completedAt: new Date(),
      };
      prev.tutorialProgress.set(tutorialId, progress);

      const newCompleted = new Set(prev.completedTutorialIds);
      newCompleted.add(tutorialId);

      return {
        ...prev,
        completedTutorialIds: newCompleted,
      };
    });
  }, [state.canSkipTutorials]);

  /**
   * Advance to next step
   */
  const advanceStep = useCallback(() => {
    setState(prev => {
      if (!prev.currentTutorial || !prev.currentTutorial.activeTutorial) {
        return prev;
      }

      const nextIndex = prev.currentTutorial.currentStepIndex + 1;
      const totalSteps = prev.currentTutorial.activeTutorial.steps.length;

      if (nextIndex >= totalSteps) {
        // Tutorial completed!
        return prev;
      }

      return {
        ...prev,
        currentTutorial: {
          ...prev.currentTutorial,
          currentStepIndex: nextIndex,
          showHint: false,
          hintIndex: 0,
        },
      };
    });
  }, []);

  /**
   * Complete an objective
   */
  const completeObjective = useCallback((objectiveId: string) => {
    setState(prev => {
      if (!prev.currentTutorial) return prev;

      const progress = prev.tutorialProgress.get(prev.currentTutorial.activeTutorial!.id);
      if (progress && !progress.objectivesCompleted.includes(objectiveId)) {
        progress.objectivesCompleted.push(objectiveId);
      }

      return { ...prev };
    });
  }, []);

  /**
   * Show hint for current step
   */
  const showHint = useCallback(() => {
    setState(prev => {
      if (!prev.currentTutorial) return prev;

      const currentStep = prev.currentTutorial.activeTutorial?.steps[prev.currentTutorial.currentStepIndex];
      const maxHints = currentStep?.hints.length || 0;

      return {
        ...prev,
        currentTutorial: {
          ...prev.currentTutorial,
          showHint: true,
          hintIndex: Math.min(prev.currentTutorial.hintIndex + 1, maxHints - 1),
        },
      };
    });
  }, []);

  /**
   * Toggle pause state
   */
  const togglePause = useCallback(() => {
    setState(prev => {
      if (!prev.currentTutorial) return prev;

      return {
        ...prev,
        currentTutorial: {
          ...prev.currentTutorial,
          isPaused: !prev.currentTutorial.isPaused,
        },
      };
    });
  }, []);

  /**
   * Get tutorial status
   */
  const getTutorialStatus = useCallback((tutorialId: TutorialId): TutorialStatus => {
    if (state.completedTutorialIds.has(tutorialId)) {
      return 'completed';
    }

    if (state.currentTutorial?.activeTutorial?.id === tutorialId) {
      return 'in-progress';
    }

    if (isTutorialUnlocked(tutorialId, state.completedTutorialIds)) {
      return 'available';
    }

    return 'locked';
  }, [state.completedTutorialIds, state.currentTutorial]);

  /**
   * Get tutorial progress
   */
  const getTutorialProgress = useCallback((tutorialId: TutorialId) => {
    return state.tutorialProgress.get(tutorialId);
  }, [state.tutorialProgress]);

  /**
   * Get overall completion percentage
   */
  const getCompletionPercentage = useCallback(() => {
    const totalTutorials = 5;
    return (state.completedTutorialIds.size / totalTutorials) * 100;
  }, [state.completedTutorialIds]);

  /**
   * Unlock showcase mode
   */
  const unlockShowcase = useCallback(() => {
    setState(prev => ({
      ...prev,
      showcaseSettings: {
        ...prev.showcaseSettings,
        unlocked: true,
      },
    }));
  }, []);

  /**
   * Update showcase settings
   */
  const updateShowcaseSettings = useCallback((settings: Partial<ShowcaseSettings>) => {
    setState(prev => ({
      ...prev,
      showcaseSettings: {
        ...prev.showcaseSettings,
        ...settings,
      },
    }));
  }, []);

  /**
   * Unlock feature gallery section
   */
  const unlockFeature = useCallback((feature: string) => {
    setState(prev => {
      if (!prev.featureGallery.unlockedSections.includes(feature)) {
        return {
          ...prev,
          featureGallery: {
            ...prev.featureGallery,
            unlockedSections: [...prev.featureGallery.unlockedSections, feature],
          },
        };
      }
      return prev;
    });
  }, []);

  /**
   * Mark item as viewed in gallery
   */
  const markAsViewed = useCallback((
    type: 'characters' | 'djinn' | 'abilities' | 'summons' | 'equipment',
    id: string
  ) => {
    setState(prev => {
      const setName = `viewed${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof FeatureGalleryState;
      const viewedSet = new Set(prev.featureGallery[setName] as Set<string>);
      viewedSet.add(id);

      return {
        ...prev,
        featureGallery: {
          ...prev.featureGallery,
          [setName]: viewedSet,
        },
      };
    });
  }, []);

  /**
   * Award a badge
   */
  const awardBadge = useCallback((badge: TutorialBadge) => {
    setState(prev => {
      if (prev.badges.some(b => b.id === badge.id)) {
        return prev; // Already awarded
      }

      return {
        ...prev,
        badges: [...prev.badges, { ...badge, unlockedAt: new Date() }],
      };
    });
  }, []);

  /**
   * Toggle tooltips
   */
  const toggleTooltips = useCallback(() => {
    setState(prev => ({
      ...prev,
      showTooltips: !prev.showTooltips,
    }));
  }, []);

  /**
   * Set help mode
   */
  const setHelpMode = useCallback((mode: 'disabled' | 'tooltips-only' | 'full-guidance') => {
    setState(prev => ({
      ...prev,
      helpMode: mode,
    }));
  }, []);

  /**
   * Enable skip mode (for experienced players)
   */
  const enableSkipMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      canSkipTutorials: true,
    }));
  }, []);

  const value: TutorialContextValue = {
    state,
    startTutorial,
    completeTutorial,
    quitTutorial,
    skipTutorial,
    advanceStep,
    completeObjective,
    showHint,
    togglePause,
    getTutorialStatus,
    getTutorialProgress,
    getCompletionPercentage,
    unlockShowcase,
    updateShowcaseSettings,
    unlockFeature,
    markAsViewed,
    awardBadge,
    toggleTooltips,
    setHelpMode,
    enableSkipMode,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

/**
 * Hook to use tutorial context
 */
export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
}
