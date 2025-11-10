import { useEffect } from 'react';
import { BattleView } from './ui/components/BattleView';
import { CreditsScreen } from './ui/components/CreditsScreen';
import { ChapterIndicator } from './ui/components/ChapterIndicator';
import { useStore } from './ui/state/store';
import { createTestBattle } from './ui/utils/testBattle';

function App() {
  const setBattle = useStore((s) => s.setBattle);
  const battle = useStore((s) => s.battle);
  const story = useStore((s) => s.story);
  const showCredits = useStore((s) => s.showCredits);
  const setShowCredits = useStore((s) => s.setShowCredits);

  useEffect(() => {
    // Initialize test battle on mount
    if (!battle) {
      const { battleState, seed } = createTestBattle();
      setBattle(battleState, seed);
    }
  }, [battle, setBattle]);

  const canAccessCredits = story.chapter >= 4;

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
      <BattleView />
    </div>
  );
}

export default App;

