import { useEffect } from 'react';
import { BattleView } from './ui/components/BattleView';
import { CreditsScreen } from './ui/components/CreditsScreen';
import { ChapterIndicator } from './ui/components/ChapterIndicator';
import { RewardsScreen } from './ui/components/RewardsScreen';
import { useStore } from './ui/state/store';
import { createTestBattle } from './ui/utils/testBattle';

function App() {
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

  useEffect(() => {
    // Always recreate test battle on mount to get latest code changes
    const { battleState, seed } = createTestBattle();
    setBattle(battleState, seed);
    // Also set team state for rewards screen
    setTeam(battleState.playerTeam);
  }, [setBattle, setTeam]);

  const canAccessCredits = story.chapter >= 4;

  // Handle continue from rewards screen
  const handleRewardsContinue = () => {
    claimRewards(); // Add gold/equipment to inventory, clear rewards
    setShowRewards(false); // Ensure rewards screen is hidden
    const { battleState, seed } = createTestBattle();
    setBattle(battleState, seed); // Restart test battle
    setTeam(battleState.playerTeam); // Update team state
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
        <BattleView />
      )}
    </div>
  );
}

export default App;

