import { useEffect, useState } from 'react';
import { QueueBattleView } from './ui/components/QueueBattleView';
import { CreditsScreen } from './ui/components/CreditsScreen';
import { ChapterIndicator } from './ui/components/ChapterIndicator';
import { RewardsScreen } from './ui/components/RewardsScreen';
import { OverworldMap } from './ui/components/OverworldMap';
import { DialogueBox } from './ui/components/DialogueBox';
import { SaveMenu } from './ui/components/SaveMenu';
import { ShopScreen } from './ui/components/ShopScreen';
import { DjinnCollectionScreen } from './ui/components/DjinnCollectionScreen';
import { PartyManagementScreen } from './ui/components/PartyManagementScreen';
import { PreBattleTeamSelectScreen } from './ui/components/PreBattleTeamSelectScreen';
import { useStore } from './ui/state/store';
import { VS1_ENCOUNTER_ID, VS1_SCENE_POST, VS1_SCENE_PRE } from './story/vs1Constants';
import { DIALOGUES } from './data/definitions/dialogues';
import { UNIT_DEFINITIONS } from './data/definitions/units';
import { DJINN } from './data/definitions/djinn';
import { createUnit } from './core/models/Unit';
import { createTeam } from './core/models/Team';
import { collectDjinn, equipDjinn } from './core/services/DjinnService';
import { calculateEffectiveStats } from './core/algorithms/stats';
import { getXpProgress } from './core/algorithms/xp';

function App() {
  // Expose store and test helpers for debugging and E2E tests
  // Always expose (TODO: restrict in production builds if needed)
  (window as any).__VALE_STORE__ = useStore;
  (window as any).__VALE_TEST_HELPERS__ = {
    calculateEffectiveStats,
    getXpProgress,
    DJINN,
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

  // Initialize team on app startup (needed for battle triggers)
  useEffect(() => {
    // Only initialize if team doesn't exist
    if (!team) {
      // Create Isaac (Adept) at level 1
      const adeptDef = UNIT_DEFINITIONS['adept'];
      if (!adeptDef) {
        console.error('Adept unit definition not found');
        return;
      }
      const isaac = createUnit(adeptDef, 1, 0);
      
      // Create initial team with just Isaac
      const initialTeam = createTeam([isaac]);
      
      // Collect Flint Djinn (Venus T1)
      const flintCollectResult = collectDjinn(initialTeam, 'flint');
      if (!flintCollectResult.ok) {
        // Fallback if Djinn collection fails
        console.error('Failed to collect Flint Djinn:', flintCollectResult.error);
        setTeam(initialTeam);
        setRoster([isaac]);
        return;
      }
      
      // Equip Flint to first slot (slot 0)
      const flintEquipResult = equipDjinn(flintCollectResult.value, 'flint', 0);
      if (!flintEquipResult.ok) {
        // Fallback if equipping fails (shouldn't happen, but handle gracefully)
        console.error('Failed to equip Flint Djinn:', flintEquipResult.error);
        setTeam(flintCollectResult.value); // Still use team with collected Djinn
        setRoster([isaac]);
        return;
      }
      
      // Success: Set team with Isaac + equipped Flint Djinn
      setTeam(flintEquipResult.value);
      setRoster([isaac]); // Roster starts with just Isaac
    }
  }, [team, setTeam, setRoster]);

  // Mode is initialized to 'overworld' in gameFlowSlice, so no need to set it here
  // Removing this effect prevents it from overwriting mode changes (e.g., dialogue)

  const canAccessCredits = story.chapter >= 4;

  const returnToOverworld = useStore((s) => s.returnToOverworld);

  // Start VS1 demo flow
  const startVS1Game = () => {
    const preScene = DIALOGUES[VS1_SCENE_PRE];
    if (preScene) {
      startDialogueTree(preScene);
    }
  };

  // Handle continue from rewards screen
  const handleRewardsContinue = () => {
    // Check if this was the VS1 encounter
    const wasVS1Battle = battle?.encounterId === VS1_ENCOUNTER_ID || battle?.meta?.encounterId === VS1_ENCOUNTER_ID;

    claimRewards(); // This now sets mode to 'overworld'
    setBattle(null, 0);

    // VS1 specific: show post-scene after rewards
    if (wasVS1Battle) {
      const postScene = DIALOGUES[VS1_SCENE_POST];
      if (postScene) {
        startDialogueTree(postScene); // This sets mode to 'dialogue'
        return;
      }
    }

    // Fallback: return to overworld (shouldn't be needed as claimRewards sets mode)
    returnToOverworld();
  };

  return (
    <div>
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
              onConfirm={(team) => {
                confirmBattleTeam(team);
              }}
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
          {mode === 'shop' && currentShopId && (
            <ShopScreen shopId={currentShopId} onClose={() => setMode('overworld')} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
