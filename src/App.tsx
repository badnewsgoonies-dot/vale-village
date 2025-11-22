import { useEffect, useState, useCallback } from 'react';
import { QueueBattleView } from './ui/components/QueueBattleView';
import { CreditsScreen } from './ui/components/CreditsScreen';
import { ChapterIndicator } from './ui/components/ChapterIndicator';
import { RewardsScreen } from './ui/components/RewardsScreen';
import { OverworldMap } from './ui/components/OverworldMap';
import { DialogueBox } from './ui/components/DialogueBox';
import { SaveMenu } from './ui/components/SaveMenu';
import { ShopEquipScreen } from './ui/components/ShopEquipScreen';
import { DjinnCollectionScreen } from './ui/components/DjinnCollectionScreen';
import { PartyManagementScreen } from './ui/components/PartyManagementScreen';
import { PreBattleTeamSelectScreen } from './ui/components/PreBattleTeamSelectScreen';
import { DevModeOverlay } from './ui/components/DevModeOverlay';
import { TitleScreen } from './ui/components/TitleScreen';
import { MainMenu } from './ui/components/MainMenu';
import { IntroScreen } from './ui/components/IntroScreen';
import { CompendiumScreen } from './ui/components/CompendiumScreen';
import { useStore, store } from './ui/state/store';
import { useDevMode } from './ui/hooks/useDevMode';
import { VS1_ENCOUNTER_ID, VS1_SCENE_POST, VS1_SCENE_PRE } from './story/vs1Constants';
import { DIALOGUES } from './data/definitions/dialogues';
import { getRecruitmentDialogue, hasRecruitmentDialogue } from './data/definitions/recruitmentData';
import { ENCOUNTER_TO_POST_BATTLE_DIALOGUE } from './data/definitions/postBattleDialogues';
import { createBaseIsaacTeam, createVs1IsaacTeam } from './utils/teamSetup';
import { DJINN } from './data/definitions/djinn';
import { EQUIPMENT } from './data/definitions/equipment';
import { calculateEffectiveStats } from './core/algorithms/stats';
import { getXpProgress } from './core/algorithms/xp';
import { getDjinnGrantedAbilitiesForUnit, calculateDjinnBonusesForUnit } from './core/algorithms/djinnAbilities';
import { collectDjinn, equipDjinn } from './core/services/DjinnService';
import { queueDjinn, queueAction, executeRound, queueBattleServiceInternals } from './core/services/QueueBattleService';
import { makePRNG } from './core/random/prng';
import { updateBattleState } from './core/models/BattleState';

function App() {
  // Enable dev mode keyboard shortcut (Ctrl+D)
  useDevMode();
  // Expose store and test helpers for debugging and E2E tests
  // Always expose (TODO: restrict in production builds if needed)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__VALE_STORE__ = useStore;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__VALE_TEST_HELPERS__ = {
    calculateEffectiveStats,
    getXpProgress,
    DJINN,
  };
  // Expose equipment definitions for E2E tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__VALE_EQUIPMENT__ = EQUIPMENT;
  // Expose Djinn ability + service helpers for E2E tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__VALE_DJINN_HELPERS__ = {
    getDjinnGrantedAbilitiesForUnit,
    calculateDjinnBonusesForUnit,
    collectDjinn,
    equipDjinn,
  };
  // Expose battle service functions for E2E tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__VALE_BATTLE_HELPERS__ = {
    queueDjinn,
    queueAction,
    executeRound,
    transitionToPlanningPhase: queueBattleServiceInternals.transitionToPlanningPhase,
  };
  // Expose stats functions for E2E tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__VALE_STATS_HELPERS__ = {
    calculateEffectiveStats,
    calculateDjinnBonusesForUnit,
  };
  // Expose PRNG factory for E2E tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__VALE_PRNG__ = makePRNG;
  // Expose battle state functions for E2E tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__VALE_BATTLE_STATE_HELPERS__ = {
    updateBattleState,
  };

  // PR-QUEUE-BATTLE: Use queueBattleSlice instead of battleSlice
  const setBattle = useStore((s) => s.setBattle);
  const battle = useStore((s) => s.battle);
  const story = useStore((s) => s.story);
  const showCredits = useStore((s) => s.showCredits);
  const setShowCredits = useStore((s) => s.setShowCredits);
  const lastBattleRewards = useStore((s) => s.lastBattleRewards);
  const claimRewards = useStore((s) => s.claimRewards);
  const selectEquipmentChoice = useStore((s) => s.selectEquipmentChoice);
  const team = useStore((s) => s.team);
  const setTeam = useStore((s) => s.setTeam);
  const setRoster = useStore((s) => s.setRoster);
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const currentShopId = useStore((s) => s.currentShopId);
  const startDialogueTree = useStore((s) => s.startDialogueTree);
  const pendingBattleEncounterId = useStore((s) => s.pendingBattleEncounterId);
  const confirmBattleTeam = useStore((s) => s.confirmBattleTeam);
  const setPendingBattle = useStore((s) => s.setPendingBattle);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showDjinnCollection, setShowDjinnCollection] = useState(false);
  const [showPartyManagement, setShowPartyManagement] = useState(false);
  const [showShopEquip, setShowShopEquip] = useState(false);

  // Initialize team on app startup (needed for battle triggers)
  useEffect(() => {
    if (!team) {
      const { isaac, team: baseTeam } = createBaseIsaacTeam();
      setTeam(baseTeam);
      setRoster([isaac]);
    }
  }, [team, setTeam, setRoster]);

  // Mode is initialized to 'overworld' in gameFlowSlice, so no need to set it here
  // Removing this effect prevents it from overwriting mode changes (e.g., dialogue)

  const canAccessCredits = story.chapter >= 4;

  const returnToOverworld = useStore((s) => s.returnToOverworld);

  // Start VS1 demo flow
  const startVS1Game = () => {
    const { isaac, team: vs1Team } = createVs1IsaacTeam();
    setTeam(vs1Team);
    setRoster([isaac]);

    const preScene = DIALOGUES[VS1_SCENE_PRE];
    if (preScene) {
      startDialogueTree(preScene);
    }
  };

  // Handle continue from rewards screen
  const handleRewardsContinue = useCallback(() => {
    // Get encounterId from rewards slice (stored during processVictory)
    // This is more reliable than battle state since battle gets cleared
    const storeState = store.getState();
    const lastBattleEncounterId = storeState.lastBattleEncounterId;
    // Fallback to battle state (for backwards compatibility)
    const battleEncounterId = battle?.encounterId || battle?.meta?.encounterId;
    const encounterId = lastBattleEncounterId || battleEncounterId;
    
    // Check if this was the VS1 encounter
    const wasVS1Battle = encounterId === VS1_ENCOUNTER_ID;

    claimRewards(); // This clears lastBattleRewards but keeps lastBattleEncounterId temporarily
    setBattle(null, 0);
    
    // Clear the stored encounterId after using it
    store.setState({ lastBattleEncounterId: null });

    // VS1 specific: show post-scene after rewards
    if (wasVS1Battle) {
      const postScene = DIALOGUES[VS1_SCENE_POST];
      if (postScene) {
        startDialogueTree(postScene); // This sets mode to 'dialogue'
        return;
      }
    }

    // Check for post-battle dialogue (celebration after liberation)
    // This comes BEFORE recruitment dialogue
    if (encounterId) {
      const postBattleDialogueId = ENCOUNTER_TO_POST_BATTLE_DIALOGUE[encounterId];
      if (postBattleDialogueId) {
        const postBattleDialogue = DIALOGUES[postBattleDialogueId];
        if (postBattleDialogue) {
          startDialogueTree(postBattleDialogue); // This sets mode to 'dialogue'
          return;
        } else {
          console.warn(`Post-battle dialogue not found: ${postBattleDialogueId}`);
        }
      }
    }

    // Check for recruitment dialogue (data-driven, not hard-coded)
    if (encounterId && hasRecruitmentDialogue(encounterId)) {
      const recruitmentDialogue = getRecruitmentDialogue(encounterId);

      if (recruitmentDialogue) {
        startDialogueTree(recruitmentDialogue); // This sets mode to 'dialogue'
        return;
      } else {
        console.warn(`Recruitment dialogue not found for encounter ${encounterId}`);
      }
    }

    // If no dialogue was triggered, return to overworld
    // (claimRewards doesn't set mode anymore, so we need to do it here)
    if (!encounterId || (!wasVS1Battle && !hasRecruitmentDialogue(encounterId))) {
      returnToOverworld();
    }
  }, [battle, claimRewards, setBattle, startDialogueTree, returnToOverworld]);

  // Expose handleRewardsContinue for E2E tests (after it's defined)
  (window as any).handleRewardsContinue = handleRewardsContinue;

  // Hide dev header on startup screens
  const isStartupScreen = mode === 'title-screen' || mode === 'main-menu' || mode === 'intro';

  return (
    <div>
      {!isStartupScreen && (
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h1 style={{ margin: 0 }}>Vale Chronicles V2</h1>
            <ChapterIndicator chapter={story.chapter} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowSaveMenu(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Save Game
            </button>
            <button
              onClick={() => setShowDjinnCollection(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#9C27B0',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Djinn Collection
            </button>
            <button
              onClick={() => setShowPartyManagement(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#FF9800',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Party Management
            </button>
            <button
              onClick={() => setShowShopEquip(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#607D8B',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Shop & Equipment
            </button>
            {canAccessCredits && (
              <button
                onClick={() => setShowCredits(true)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2196F3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                View Credits
              </button>
            )}
            <button
              onClick={startVS1Game}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#E91E63',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              🎮 Play VS1 Demo
            </button>
          </div>
        </div>
      )}
      {showCredits && (
        <CreditsScreen onExit={() => setShowCredits(false)} />
      )}
      {showSaveMenu && (
        <SaveMenu onClose={() => setShowSaveMenu(false)} />
      )}
      {showDjinnCollection && (
        <DjinnCollectionScreen onClose={() => setShowDjinnCollection(false)} />
      )}
      {showPartyManagement && (
        <PartyManagementScreen onClose={() => setShowPartyManagement(false)} />
      )}
      {showShopEquip && (
        <ShopEquipScreen shopId={currentShopId || 'vale-armory'} onClose={() => setShowShopEquip(false)} />
      )}
      
      {/* Startup screens */}
      {mode === 'title-screen' && <TitleScreen />}
      {mode === 'main-menu' && <MainMenu />}
      {mode === 'intro' && <IntroScreen />}
      {mode === 'compendium' && (
        <CompendiumScreen onClose={() => setMode('main-menu')} />
      )}
      
      {/* Game screens */}
      {mode === 'rewards' && lastBattleRewards && team ? (
        <RewardsScreen
          rewards={lastBattleRewards}
          team={team}
          onContinue={handleRewardsContinue}
          onSelectEquipment={selectEquipmentChoice}
        />
      ) : (
        <>
          {mode === 'team-select' && pendingBattleEncounterId && (
            <PreBattleTeamSelectScreen
              encounterId={pendingBattleEncounterId}
              onConfirm={() => confirmBattleTeam()}
              onCancel={() => {
                setPendingBattle(null);
                setMode('overworld');
              }}
            />
          )}
          {mode === 'overworld' && <OverworldMap />}
          {mode === 'battle' && <QueueBattleView />}
          {mode === 'dialogue' && (
            <>
              <OverworldMap />
              <DialogueBox />
            </>
          )}
          {mode === 'shop' && (
            <ShopEquipScreen shopId={currentShopId || undefined} onClose={() => setMode('overworld')} />
          )}
        </>
      )}

      {/* Dev Mode Overlay - Only renders when enabled (Ctrl+D) */}
      <DevModeOverlay />
    </div>
  );
}

export default App;
