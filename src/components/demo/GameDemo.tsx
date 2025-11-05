import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import './GameDemo.css';

export const GameDemo: React.FC = () => {
  const { state, actions } = useGame();
  const [message, setMessage] = useState('');

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const demoActions = [
    {
      category: 'Navigation',
      actions: [
        {
          name: 'Go to Title Screen',
          action: () => {
            actions.navigate({ type: 'TITLE' });
            showMessage('Navigated to Title Screen');
          },
        },
        {
          name: 'Go to Overworld',
          action: () => {
            actions.navigate({ type: 'OVERWORLD' });
            showMessage('Navigated to Vale Village');
          },
        },
        {
          name: 'Open Main Menu',
          action: () => {
            actions.navigate({ type: 'MAIN_MENU' });
            showMessage('Opened Main Menu');
          },
        },
        {
          name: 'Go to Equipment Screen',
          action: () => {
            const firstUnit = state.playerData.unitsCollected[0];
            if (firstUnit) {
              actions.navigate({ type: 'EQUIPMENT', unitId: firstUnit.id });
              showMessage('Opened Equipment Screen');
            }
          },
        },
        {
          name: 'Go to Party Management',
          action: () => {
            actions.navigate({ type: 'UNIT_COLLECTION' });
            showMessage('Opened Party Management');
          },
        },
        {
          name: 'Go to Djinn Screen',
          action: () => {
            actions.navigate({ type: 'DJINN_MENU' });
            showMessage('Opened Djinn Screen');
          },
        },
        {
          name: 'Go to Shop',
          action: () => {
            actions.navigate({ type: 'SHOP', shopType: 'equipment' });
            showMessage('Opened Equipment Shop');
          },
        },
      ],
    },
    {
      category: 'Battle System',
      actions: [
        {
          name: 'Start Easy Battle (1 Slime)',
          action: () => {
            actions.startBattle(['slime']);
            actions.navigate({ type: 'BATTLE' });
            showMessage('Battle Started: 1 Slime');
          },
        },
        {
          name: 'Start Medium Battle (Goblin + Wolf)',
          action: () => {
            actions.startBattle(['goblin', 'wild-wolf']);
            actions.navigate({ type: 'BATTLE' });
            showMessage('Battle Started: Goblin + Wolf');
          },
        },
        {
          name: 'Start Hard Battle (3 Goblins)',
          action: () => {
            actions.startBattle(['goblin', 'goblin', 'goblin']);
            actions.navigate({ type: 'BATTLE' });
            showMessage('Battle Started: 3 Goblins');
          },
        },
        {
          name: 'Test Battle (Slime + Goblin + Wolf)',
          action: () => {
            actions.startBattle(['slime', 'goblin', 'wild-wolf']);
            actions.navigate({ type: 'BATTLE' });
            showMessage('Battle Started: Mixed Enemies');
          },
        },
      ],
    },
    {
      category: 'Player Resources',
      actions: [
        {
          name: 'Show Current Gold',
          action: () => {
            showMessage(`Current Gold: ${state.playerData.gold}`);
          },
        },
        {
          name: 'Go to Shop (Spend Gold)',
          action: () => {
            actions.navigate({ type: 'SHOP', shopType: 'equipment' });
            showMessage('Opened Equipment Shop');
          },
        },
        {
          name: 'Show Inventory Count',
          action: () => {
            const count = state.playerData.inventory.length;
            showMessage(`Inventory: ${count} items`);
          },
        },
      ],
    },
    {
      category: 'Party Management',
      actions: [
        {
          name: 'Show Party Levels',
          action: () => {
            const party = state.playerData.unitsCollected.filter(u =>
              state.playerData.activePartyIds.includes(u.id)
            );
            const levels = party.map(u => `${u.name} Lv${u.level}`).join(', ');
            showMessage(levels || 'No active party');
          },
        },
        {
          name: 'Show Current Party',
          action: () => {
            const party = state.playerData.unitsCollected.filter(u =>
              state.playerData.activePartyIds.includes(u.id)
            );
            const names = party.map(u => u.name).join(', ');
            showMessage(`Active Party: ${names || 'None'}`);
          },
        },
        {
          name: 'Show All Units',
          action: () => {
            const names = state.playerData.unitsCollected.map(u => u.name).join(', ');
            showMessage(`All Units: ${names || 'None'}`);
          },
        },
      ],
    },
    {
      category: 'Equipment System',
      actions: [
        {
          name: 'Show Inventory',
          action: () => {
            const count = state.playerData.inventory.length;
            showMessage(`Inventory: ${count} items`);
          },
        },
        {
          name: 'Show Equipped Items',
          action: () => {
            const firstUnit = state.playerData.unitsCollected[0];
            if (firstUnit) {
              const equipped = Object.values(firstUnit.equipment).filter(e => e).length;
              showMessage(`${firstUnit.name} has ${equipped}/4 slots equipped`);
            }
          },
        },
      ],
    },
    {
      category: 'Djinn System',
      actions: [
        {
          name: 'Show Collected Djinn',
          action: () => {
            const count = state.playerData.djinnCollected.length;
            showMessage(`Collected Djinn: ${count}/12`);
          },
        },
        {
          name: 'Go to Djinn Screen',
          action: () => {
            actions.navigate({ type: 'DJINN_MENU' });
            showMessage('Opened Djinn Screen');
          },
        },
      ],
    },
    {
      category: 'Screen Transitions',
      actions: [
        {
          name: 'Demo: Overworld → Battle → Rewards',
          action: async () => {
            showMessage('Starting demo sequence...');
            setTimeout(() => {
              actions.navigate({ type: 'OVERWORLD' });
              showMessage('1/3: Overworld');
            }, 500);
            setTimeout(() => {
              actions.startBattle(['slime']);
              actions.navigate({ type: 'BATTLE' });
              showMessage('2/3: Battle');
            }, 2500);
            setTimeout(() => {
              actions.navigate({ type: 'REWARDS' });
              showMessage('3/3: Rewards');
            }, 5000);
          },
        },
        {
          name: 'Demo: Menu Navigation Flow',
          action: async () => {
            showMessage('Starting menu demo...');
            setTimeout(() => {
              actions.navigate({ type: 'MAIN_MENU' });
              showMessage('Main Menu');
            }, 500);
            setTimeout(() => {
              actions.navigate({ type: 'DJINN_MENU' });
              showMessage('Djinn Screen');
            }, 2000);
            setTimeout(() => {
              const firstUnit = state.playerData.unitsCollected[0];
              if (firstUnit) {
                actions.navigate({ type: 'EQUIPMENT', unitId: firstUnit.id });
              }
              showMessage('Equipment Screen');
            }, 3500);
            setTimeout(() => {
              actions.navigate({ type: 'UNIT_COLLECTION' });
              showMessage('Party Management');
            }, 5000);
          },
        },
      ],
    },
    {
      category: 'Debug Info',
      actions: [
        {
          name: 'Show Current Screen',
          action: () => {
            showMessage(`Current Screen: ${state.currentScreen.type}`);
          },
        },
        {
          name: 'Show Player Stats',
          action: () => {
            const firstUnit = state.playerData.unitsCollected[0];
            if (firstUnit) {
              showMessage(`${firstUnit.name} - Lv${firstUnit.level} | HP:${firstUnit.currentHp} | PP:${firstUnit.currentPp}`);
            } else {
              showMessage('No units in party');
            }
          },
        },
        {
          name: 'Show Gold & Resources',
          action: () => {
            showMessage(`Gold: ${state.playerData.gold} | Inventory: ${state.playerData.inventory.length}`);
          },
        },
      ],
    },
  ];

  return (
    <div className="game-demo-container">
      <div className="demo-header">
        <h1>🎮 VALE CHRONICLES - GAME DEMO</h1>
        <p>Test all game features and screens</p>
      </div>

      {message && (
        <div className="demo-message">
          {message}
        </div>
      )}

      <div className="demo-grid">
        {demoActions.map((category, i) => (
          <div key={i} className="demo-category">
            <h2>{category.category}</h2>
            <div className="demo-buttons">
              {category.actions.map((action, j) => (
                <button
                  key={j}
                  className="demo-button"
                  onClick={action.action}
                >
                  {action.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="demo-footer">
        <div className="demo-stats">
          <div><strong>Current Screen:</strong> {state.currentScreen.type}</div>
          <div><strong>Gold:</strong> {state.playerData.gold}</div>
          <div><strong>Units:</strong> {state.playerData.unitsCollected.length}</div>
          <div><strong>Active Party:</strong> {state.playerData.activePartyIds.length}/4</div>
          <div><strong>Djinn:</strong> {state.playerData.djinnCollected.length}/12</div>
          <div><strong>Inventory:</strong> {state.playerData.inventory.length} items</div>
        </div>
      </div>
    </div>
  );
};
