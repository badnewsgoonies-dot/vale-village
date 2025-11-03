import React from 'react';
import { useGame } from '@/context';
import { TitleScreen } from '@/components/title';
import { EquipmentScreen } from '@/components/equipment/EquipmentScreen';
import { UnitCollectionScreen } from '@/components/units/UnitCollectionScreen';
import { RewardsScreen } from '@/components/rewards/RewardsScreen';
import { BattleScreen } from '@/components/battle';
import { NewOverworldScreen } from '@/components/overworld/NewOverworldScreen';
import { QuestLogScreen } from '@/components/quests/QuestLogScreen';
import { ShopScreen } from '@/components/shop/ShopScreen';
import { IntroScreen } from '@/components/intro/IntroScreen';
import { ScreenTransition } from './ScreenTransition';

export const ScreenRouter: React.FC = () => {
  const { state, actions } = useGame();
  const screen = state.currentScreen;

  const renderScreen = () => {
    switch (screen.type) {
    case 'TITLE':
      return (
        <TitleScreen
          onNavigate={actions.navigate}
          onStartBattle={actions.startBattle}
        />
      );

    case 'INTRO':
      return <IntroScreen />;

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
          onContinue={() => actions.navigate({ type: 'OVERWORLD' })}
        />
      );

    case 'BATTLE':
      return <BattleScreen />;

    case 'OVERWORLD':
      return <NewOverworldScreen />;

    case 'DJINN_MENU':
      // TODO: Djinn menu (not yet implemented)
      return <div className="placeholder-screen">Djinn Menu - Coming Soon</div>;

    case 'QUEST_LOG':
      return <QuestLogScreen />;

    case 'SHOP':
      return <ShopScreen />;

    case 'DIALOGUE':
      // TODO: Dialogue screen (not yet implemented)
      return <div className="placeholder-screen">Dialogue - Coming Soon</div>;

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
