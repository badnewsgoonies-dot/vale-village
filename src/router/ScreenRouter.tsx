import React from 'react';
import { useGame } from '@/context';
import { EquipmentScreen } from '@/components/equipment/EquipmentScreen';
import { UnitCollectionScreen } from '@/components/units/UnitCollectionScreen';
import { RewardsScreen } from '@/components/rewards/RewardsScreen';
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
          <button onClick={() => actions.navigate({ type: 'UNIT_COLLECTION' })}>
            Start Game
          </button>
        </div>
      );

    case 'UNIT_COLLECTION': {
      // Map Unit instances to the format expected by UnitCollectionScreen
      const units = state.playerData.unitsCollected.map(unit => ({
        id: unit.id,
        name: unit.name,
        level: unit.level,
        element: unit.element.toLowerCase() as 'venus' | 'mars' | 'mercury' | 'jupiter' | 'neutral',
        class: unit.role,
        isActive: state.playerData.activePartyIds.includes(unit.id),
        stats: {
          hp: unit.maxHp,
          pp: unit.maxPp,
          atk: unit.stats.atk,
          def: unit.stats.def,
          mag: unit.stats.mag,
          spd: unit.stats.spd,
        },
        role: getRoleDescription(unit.role),
      }));

      return (
        <UnitCollectionScreen
          units={units}
          onToggleActive={(unitId) => {
            const currentIds = state.playerData.activePartyIds;
            const newIds = currentIds.includes(unitId)
              ? currentIds.filter(id => id !== unitId)
              : [...currentIds, unitId];

            // Ensure we have exactly 4 units (pad with available units if needed)
            if (newIds.length < 4) {
              const availableUnits = state.playerData.unitsCollected
                .filter(u => !newIds.includes(u.id))
                .map(u => u.id);
              while (newIds.length < 4 && availableUnits.length > 0) {
                newIds.push(availableUnits.shift()!);
              }
            } else if (newIds.length > 4) {
              newIds.splice(4);
            }

            actions.setActiveParty(newIds);
          }}
          onViewEquipment={(unitId) => actions.navigate({ type: 'EQUIPMENT', unitId })}
          onReturn={() => actions.navigate({ type: 'TITLE' })}
        />
      );
    }

    case 'EQUIPMENT': {
      // Map units to format expected by EquipmentScreen
      const units = state.playerData.unitsCollected.map(unit => ({
        id: unit.id,
        name: unit.name,
        level: unit.level,
        element: unit.element.toLowerCase() as 'venus' | 'mars' | 'mercury' | 'jupiter' | 'neutral',
      }));

      // Build equipment mapping
      const equipment = state.playerData.unitsCollected.reduce((acc, unit) => {
        acc[unit.id] = {
          weapon: unit.equipment.weapon,
          armor: unit.equipment.armor,
          helm: unit.equipment.helm,
          boots: unit.equipment.boots,
        };
        return acc;
      }, {} as Record<string, any>);

      // Map inventory to format expected by EquipmentScreen
      const inventoryItems = state.playerData.inventory.map(item => ({
        id: item.id,
        name: item.name,
        slot: item.slot,
        icon: 'placeholder', // TODO: Get icon from sprite registry
        stats: {
          atk: item.statBonus.atk,
          def: item.statBonus.def,
          spd: item.statBonus.spd,
        },
      }));

      return (
        <EquipmentScreen
          units={units}
          equipment={equipment}
          inventory={inventoryItems}
          onEquipItem={(unitId, slot, itemId) => {
            const item = state.playerData.inventory.find(i => i.id === itemId);
            if (item) {
              actions.equipItem(unitId, slot, item);
            }
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
          levelUpUnits={[]}
          onContinue={() => actions.navigate({ type: 'UNIT_COLLECTION' })}
        />
      );

    case 'BATTLE':
      // TODO: Battle screen (not yet implemented)
      return <div className="placeholder-screen">Battle Screen - Coming Soon</div>;

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

/**
 * Helper function to get role description from class name
 */
function getRoleDescription(className: string): string {
  const roleMap: Record<string, string> = {
    'Squire': 'Balanced Warrior - Tank/DPS hybrid with earth Psynergy',
    'Guard': 'Tank - High HP and defense with fire attacks',
    'Wind Seer': 'Mage - High magic damage and speed with wind Psynergy',
    'Water Seer': 'Healer - Support specialist with water healing magic',
    'Brute': 'Tank - High HP and defense with earth attacks',
    'Flame User': 'Offensive Mage - Fire magic specialist',
    'Pilgrim': 'Support - Healing and defensive magic',
  };

  return roleMap[className] || 'Versatile adventurer';
}
