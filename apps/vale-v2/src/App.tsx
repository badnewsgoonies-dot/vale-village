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
import { useStore } from './ui/state/store';
import { createTestBattle } from './ui/utils/testBattle';
import { VS1_ENCOUNTER_ID, VS1_SCENE_POST } from './story/vs1Constants';
import { DIALOGUES } from './data/definitions/dialogues';

function App() {
  // PR-QUEUE-BATTLE: Use queueBattleSlice instead of battleSlice
  const setBattle = useStore((s) => s.setBattle);
  const battle = useStore((s) => s.battle);
  const story = useStore((s) => s.story);
  const showCredits = useStore((s) => s.showCredits);
  const setShowCredits = useStore((s) => s.setShowCredits);
  const showRewards = useStore((s) => s.showRewards);
  const lastBattleRewards = useStore((s) => s.lastBattleRewards);
  const claimRewards = useStore((s) => s.claimRewards);
  const setShowRewards = useStore((s) => s.setShowRewards);
  const selectEquipmentChoice = useStore((s) => s.selectEquipmentChoice);
  const team = useStore((s) => s.team);
  const setTeam = useStore((s) => s.setTeam);
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const currentShopId = useStore((s) => s.currentShopId);
  const startDialogueTree = useStore((s) => s.startDialogueTree);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showDjinnCollection, setShowDjinnCollection] = useState(false);
  const [showPartyManagement, setShowPartyManagement] = useState(false);

  // Initialize team on app startup (needed for battle triggers)
  useEffect(() => {
    // Only initialize if team doesn't exist
    if (!team) {
      const { battleState } = createTestBattle();
      setTeam(battleState.playerTeam);
    }
  }, [team, setTeam]);

  // Ensure app starts in overworld mode
  useEffect(() => {
    setMode('overworld');
  }, [setMode]);

  const canAccessCredits = story.chapter >= 4;

  const returnToOverworld = useStore((s) => s.returnToOverworld);

  // Start VS1 demo flow
  const startVS1Game = () => {
    const preScene = DIALOGUES[VS1_SCENE_PRE];
    if (preScene) {
      startDialogueTree(preScene);
      setMode('dialogue');
    }
  };

  // Handle continue from rewards screen
  const handleRewardsContinue = () => {
    // Check if this was the VS1 encounter
    const wasVS1Battle = battle?.encounterId === VS1_ENCOUNTER_ID || battle?.meta?.encounterId === VS1_ENCOUNTER_ID;

    claimRewards(); // Add gold/equipment to inventory, clear rewards
    setShowRewards(false); // Ensure rewards screen is hidden
    setBattle(null, 0);

    // VS1 specific: show post-scene after rewards
    if (wasVS1Battle) {
      const postScene = DIALOGUES[VS1_SCENE_POST];
      if (postScene) {
        startDialogueTree(postScene);
        setMode('dialogue');
        return;
      }
    }

    // Fallback: return to overworld
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
      {showRewards && lastBattleRewards && team ? (
        <RewardsScreen
          rewards={lastBattleRewards}
          team={team}
          onContinue={handleRewardsContinue}
          onSelectEquipment={selectEquipmentChoice}
        />
      ) : (
        <>
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
