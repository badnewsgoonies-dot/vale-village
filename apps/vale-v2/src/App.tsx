import { useEffect } from 'react';
import { BattleView } from './ui/components/BattleView';
import { useStore } from './ui/state/store';
import { createTestBattle } from './ui/utils/testBattle';

function App() {
  const setBattle = useStore((s) => s.setBattle);
  const battle = useStore((s) => s.battle);

  useEffect(() => {
    // Initialize test battle on mount
    if (!battle) {
      const { battleState, seed } = createTestBattle();
      setBattle(battleState, seed);
    }
  }, [battle, setBattle]);

  return (
    <div>
      <h1>Vale Chronicles V2</h1>
      <BattleView />
    </div>
  );
}

export default App;

