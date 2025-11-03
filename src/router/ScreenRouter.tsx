import React from 'react';
import { useGame } from '@/context';
import { EquipmentScreen } from '@/components/equipment/EquipmentScreen';
import { UnitCollectionScreen } from '@/components/units/UnitCollectionScreen';
import { RewardsScreen } from '@/components/rewards/RewardsScreen';
import { BattleScreen } from '@/components/battle';
import { OverworldScreen } from '@/components/overworld';
import { ScreenTransition } from './ScreenTransition';

export const ScreenRouter: React.FC = () => {
  const { state, actions } = useGame();
  const screen = state.currentScreen;

  const renderScreen = () => {
    switch (screen.type) {
    case 'TITLE':
      return (
        <div className="title-screen">
          <h1>Vale Chronicles</h1>
          <button onClick={() => actions.navigate({ type: 'OVERWORLD' })}>
            Start Game
          </button>
          <button
            onClick={() => actions.navigate({ type: 'UNIT_COLLECTION' })}
            style={{ marginTop: '10px' }}
          >
            Unit Collection
          </button>
          <button
            onClick={() => {
              // Start a test battle with 3 enemies
              actions.startBattle(['goblin', 'wild_wolf', 'slime']);
              actions.navigate({ type: 'BATTLE' });
            }}
            style={{ marginTop: '10px' }}
          >
            Test Battle
          </button>
        </div>
      );

    case 'UNIT_COLLECTION': {
      // Get actual Unit instances
      const units = state.playerData.unitsCollected;
      const activeParty = units.filter(u => state.playerData.activePartyIds.includes(u.id));

      return (
        <UnitCollectionScreen
          units={units}
          activeParty={activeParty}
          onSetActiveParty={(unitIds: string[]) => {
            actions.setActiveParty(unitIds);
          }}
          onViewEquipment={(unit) => actions.navigate({ type: 'EQUIPMENT', unitId: unit.id })}
          onReturn={() => actions.navigate({ type: 'OVERWORLD' })}
        />
      );
    }

    case 'EQUIPMENT': {
      // Get actual Unit instances
      const units = state.playerData.unitsCollected;

      // Get selected unit from screen state
      const unitId = (screen as any).unitId || state.playerData.activePartyIds[0];
      const selectedUnit = units.find(u => u.id === unitId) || units[0];

      // Get inventory as Equipment instances
      const inventory = state.playerData.inventory;

      return (
        <EquipmentScreen
          units={units}
          selectedUnit={selectedUnit}
          inventory={inventory}
          onEquipItem={(unitId, slot, equipment) => {
            actions.equipItem(unitId, slot, equipment);
          }}
          onUnequipItem={(unitId, slot) => {
            actions.unequipItem(unitId, slot);
          }}
          onReturn={() => actions.goBack()}
        />
      );
    }

    case 'REWARDS':
      // TODO: Get rewards from battle result
      return (
        <RewardsScreen
          xp={100}
          gold={50}
          items={[]}
          levelUps={[]}
          onContinue={() => actions.navigate({ type: 'UNIT_COLLECTION' })}
        />
      );

    case 'BATTLE':
      return <BattleScreen />;

    case 'OVERWORLD': {
      const playerParty = state.playerData.unitsCollected.filter(
        unit => state.playerData.activePartyIds.includes(unit.id)
      );

      return (
        <OverworldScreen
          playerParty={playerParty}
          onNavigate={actions.navigate}
        />
      );
    }

    case 'DJINN_MENU':
      // TODO: Djinn menu (not yet implemented)
      return <div className="placeholder-screen">Djinn Menu - Coming Soon</div>;

    default:
      return <div className="error-screen">Unknown screen: {JSON.stringify(screen)}</div>;
    }
  };

  return (
    <ScreenTransition screenKey={screen.type}>
      {renderScreen()}
    </ScreenTransition>
  );
};
