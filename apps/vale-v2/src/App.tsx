import { useEffect } from 'react';
import { QueueBattleView } from './ui/components/QueueBattleView';
import { CreditsScreen } from './ui/components/CreditsScreen';
import { ChapterIndicator } from './ui/components/ChapterIndicator';
import { RewardsScreen } from './ui/components/RewardsScreen';
import { OverworldMap } from './ui/components/OverworldMap';
import { DialogueBox } from './ui/components/DialogueBox';
import { useStore } from './ui/state/store';
import { createTestBattle } from './ui/utils/testBattle';

function App() {
  // PR-QUEUE-BATTLE: Use queueBattleSlice instead of battleSlice
  const setBattle = useStore((s) => s.setBattle);
  const story = useStore((s) => s.story);
  const showCredits = useStore((s) => s.showCredits);
  const setShowCredits = useStore((s) => s.setShowCredits);
  const showRewards = useStore((s) => s.showRewards);
  const lastBattleRewards = useStore((s) => s.lastBattleRewards);
  const claimRewards = useStore((s) => s.claimRewards);
  const setShowRewards = useStore((s) => s.setShowRewards);
  const team = useStore((s) => s.team);
  const setTeam = useStore((s) => s.setTeam);
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);

  // Commented out test battle - now using overworld as entry point
  // To test battles, trigger a battle from the overworld or use dev tools
  // useEffect(() => {
  //   const { battleState, seed } = createTestBattle();
  //   setBattle(battleState, seed);
  //   setTeam(battleState.playerTeam);
  // }, [setBattle, setTeam]);

  // Ensure app starts in overworld mode
  useEffect(() => {
    setMode('overworld');
  }, [setMode]);

  const canAccessCredits = story.chapter >= 4;

  // Handle continue from rewards screen
  const handleRewardsContinue = () => {
    claimRewards(); // Add gold/equipment to inventory, clear rewards
    setShowRewards(false); // Ensure rewards screen is hidden
    const { battleState, seed } = createTestBattle();
    setBattle(battleState, seed); // Restart test battle
    setTeam(battleState.playerTeam); // Update team state
    setMode('battle');
  };

  return (
    <div>
      <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h1 style={{ margin: 0 }}>Vale Chronicles V2</h1>
          <ChapterIndicator chapter={story.chapter} />
        </div>
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
      </div>
      {showCredits && (
        <CreditsScreen onExit={() => setShowCredits(false)} />
      )}
      {showRewards && lastBattleRewards && team ? (
        <RewardsScreen
          rewards={lastBattleRewards}
          team={team}
          onContinue={handleRewardsContinue}
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
        </>
      )}
    </div>
  );
}

export default App;

