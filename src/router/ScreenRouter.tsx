import React from 'react';
import { useGame } from '@/context';
import type { Unit } from '@/types/Unit';
import { TitleScreen } from '@/components/title';
import { EquipmentScreen } from '@/components/equipment/EquipmentScreen';
import { UnitCollectionScreen } from '@/components/units/UnitCollectionScreen';
import { PartyManagementScreen } from '@/components/party/PartyManagementScreen';
import { RewardsScreen } from '@/components/rewards/RewardsScreen';
import { BattleScreen } from '@/components/battle';
import { ValeVillageOverworld } from '@/components/overworld/ValeVillageOverworld';
import { ShopScreen } from '@/components/shop/ShopScreen';
import { IntroScreen } from '@/components/intro/IntroScreen';
import { DjinnScreen } from '@/components/djinn/DjinnScreen';
import { AbilitiesScreen } from '@/components/abilities/AbilitiesScreen';
import { SummonsScreen } from '@/components/summons/SummonsScreen';
import { MainMenu } from '@/components/menu/MainMenu';
import { GameDemo } from '@/components/demo/GameDemo';
import { DialogueScreen } from '@/components/dialogue/DialogueScreen';
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

    case 'PARTY_MANAGEMENT':
      return <PartyManagementScreen />;

    case 'EQUIPMENT':
      return <EquipmentScreen />;

    case 'ABILITIES':
      return <AbilitiesScreen />;

    case 'SUMMONS':
      return <SummonsScreen />;

    case 'REWARDS':
      // Get rewards from last battle
      const battleRewards = state.lastBattleRewards;
      const partyUnits = state.playerData.unitsCollected;
      return (
        <RewardsScreen
          xp={battleRewards?.rewards.totalXp || 0}
          gold={battleRewards?.rewards.totalGold || 0}
          items={battleRewards?.rewards.equipmentDrops || []}
          levelUps={battleRewards?.levelUps.map(lu => {
            // Find the unit from party
            const unit = partyUnits.find((u: Unit) => u.id === lu.unitId);
            return unit ? {
              unit,
              oldLevel: lu.oldLevel,
              newLevel: lu.newLevel,
            } : null;
          }).filter(Boolean) as Array<{ unit: Unit; oldLevel: number; newLevel: number; }> || []}
          onContinue={() => actions.navigate({ type: 'OVERWORLD' })}
        />
      );

    case 'BATTLE':
      return <BattleScreen />;

    case 'OVERWORLD':
      return <ValeVillageOverworld />;

    case 'DJINN_MENU':
      return <DjinnScreen />;

    case 'MAIN_MENU':
      return (
        <MainMenu
          onNavigateToDjinn={() => actions.navigate({ type: 'DJINN_MENU' })}
          onNavigateToEquipment={() => {
            const firstUnitId = state.playerData.activePartyIds[0];
            actions.navigate({ type: 'EQUIPMENT', unitId: firstUnitId });
          }}
          onNavigateToParty={() => actions.navigate({ type: 'PARTY_MANAGEMENT' })}
          onNavigateToAbilities={() => actions.navigate({ type: 'ABILITIES' })}
          onNavigateToSummons={() => actions.navigate({ type: 'SUMMONS' })}
          onResume={() => actions.navigate({ type: 'OVERWORLD' })}
        />
      );

    case 'SHOP':
      return <ShopScreen />;

    case 'DIALOGUE':
      return <DialogueScreen />;

    case 'DEMO':
      return <GameDemo />;

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
