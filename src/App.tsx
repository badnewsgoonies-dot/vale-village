import { useState } from 'react';
import './App.css';
import './tokens.css';
import { BattleTransition } from './components/battle/BattleTransition';
import { UnitCollectionScreen } from './components/units/UnitCollectionScreen';
import { EquipmentScreen } from './components/equipment/EquipmentScreen';
import { RewardsScreen } from './components/rewards/RewardsScreen';
import { Button } from './components/shared';

type Screen = 'menu' | 'battle-transition' | 'unit-collection' | 'equipment' | 'rewards';

type EquipmentSlot = 'weapon' | 'armor' | 'helm' | 'boots';

interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  icon: string;
  stats: {
    atk?: number;
    def?: number;
    spd?: number;
  };
}

interface EquippedItems {
  weapon?: EquipmentItem;
  armor?: EquipmentItem;
  helm?: EquipmentItem;
  boots?: EquipmentItem;
}

interface UnitEquipment {
  [unitId: string]: EquippedItems;
}

// Mock data for demo
const mockUnits = [
  {
    id: '1', name: 'Isaac', level: 8, element: 'venus' as const,
    class: 'Earth Adept', isActive: true,
    stats: { hp: 245, pp: 85, atk: 62, def: 48, mag: 38, spd: 35 },
    role: 'Balanced Warrior - Tank/DPS hybrid with earth Psynergy'
  },
  {
    id: '2', name: 'Garet', level: 7, element: 'mars' as const,
    class: 'Flame Guard', isActive: true,
    stats: { hp: 268, pp: 72, atk: 71, def: 52, mag: 31, spd: 29 },
    role: 'Tank - High HP and defense with fire attacks'
  },
  {
    id: '3', name: 'Ivan', level: 7, element: 'jupiter' as const,
    class: 'Wind Seer', isActive: true,
    stats: { hp: 198, pp: 112, atk: 48, def: 38, mag: 61, spd: 52 },
    role: 'Mage - High magic damage and speed with wind Psynergy'
  },
  {
    id: '4', name: 'Mia', level: 6, element: 'mercury' as const,
    class: 'Tide Adept', isActive: true,
    stats: { hp: 215, pp: 98, atk: 42, def: 45, mag: 58, spd: 44 },
    role: 'Healer - Support specialist with water healing magic'
  },
  {
    id: '5', name: 'Felix', level: 6, element: 'venus' as const,
    class: 'Squire', isActive: false,
    stats: { hp: 232, pp: 78, atk: 58, def: 46, mag: 35, spd: 33 },
    role: 'Warrior - Balanced earth adept similar to Isaac'
  },
  {
    id: '6', name: 'Jenna', level: 5, element: 'mars' as const,
    class: 'Flame User', isActive: false,
    stats: { hp: 205, pp: 88, atk: 51, def: 39, mag: 48, spd: 41 },
    role: 'Offensive Mage - Fire magic specialist'
  },
  {
    id: '7', name: 'Sheba', level: 5, element: 'jupiter' as const,
    class: 'Wind Caller', isActive: false,
    stats: { hp: 188, pp: 105, atk: 39, def: 35, mag: 65, spd: 57 },
    role: 'Glass Cannon - Highest magic but low defense'
  },
  {
    id: '8', name: 'Piers', level: 7, element: 'mercury' as const,
    class: 'Water Seer', isActive: false,
    stats: { hp: 241, pp: 91, atk: 54, def: 51, mag: 52, spd: 38 },
    role: 'Versatile - Balanced water adept with healing'
  },
  {
    id: '9', name: 'Kraden', level: 8, element: 'neutral' as const,
    class: 'Scholar', isActive: false,
    stats: { hp: 198, pp: 125, atk: 35, def: 42, mag: 68, spd: 31 },
    role: 'Support - Multi-element Psynergy access'
  },
  {
    id: '10', name: 'Kyle', level: 9, element: 'mars' as const,
    class: 'Swordsman', isActive: false,
    stats: { hp: 301, pp: 68, atk: 78, def: 61, mag: 28, spd: 35 },
    role: 'Pure Tank - Highest HP and physical stats'
  },
];

// Mock equipment inventory
const mockInventory: EquipmentItem[] = [
  { id: 'broad-sword', name: 'Broad Sword', slot: 'weapon', icon: '⚔', stats: { atk: 15, spd: -2 } },
  { id: 'steel-armor', name: 'Steel Armor', slot: 'armor', icon: '🛡', stats: { def: 12, spd: -1 } },
  { id: 'iron-helm', name: 'Iron Helm', slot: 'helm', icon: '⛑', stats: { def: 6 } },
  { id: 'hermes-boots', name: 'Hermes Boots', slot: 'boots', icon: '👢', stats: { spd: 8 } },
  { id: 'battle-axe', name: 'Battle Axe', slot: 'weapon', icon: '🪓', stats: { atk: 18, spd: -3 } },
  { id: 'wooden-staff', name: 'Wooden Staff', slot: 'weapon', icon: '🪵', stats: { atk: 8 } },
  { id: 'chain-mail', name: 'Chain Mail', slot: 'armor', icon: '⛓', stats: { def: 9 } },
  { id: 'leather-cap', name: 'Leather Cap', slot: 'helm', icon: '🧢', stats: { def: 3 } },
  { id: 'longsword', name: 'Longsword', slot: 'weapon', icon: '🗡', stats: { atk: 12 } },
  { id: 'leather-vest', name: 'Leather Vest', slot: 'armor', icon: '🛡', stats: { def: 7 } },
];

// Mock initial equipment setup
const mockInitialEquipment: UnitEquipment = {
  '1': {
    weapon: mockInventory.find(i => i.id === 'longsword'),
    armor: mockInventory.find(i => i.id === 'leather-vest'),
  },
  '2': {
    weapon: mockInventory.find(i => i.id === 'wooden-staff'),
  },
  '3': {},
  '4': {},
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [units, setUnits] = useState(mockUnits);
  const [equipment, setEquipment] = useState<UnitEquipment>(mockInitialEquipment);
  const [inventory] = useState<EquipmentItem[]>(mockInventory);

  const openMockup = (mockupName: string) => {
    window.open(`/mockups/${mockupName}.html`, '_blank');
  };

  const handleToggleActive = (unitId: string) => {
    setUnits(prev => prev.map(unit =>
      unit.id === unitId ? { ...unit, isActive: !unit.isActive } : unit
    ));
  };

  const handleEquipItem = (unitId: string, slot: EquipmentSlot, itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    setEquipment(prev => ({
      ...prev,
      [unitId]: {
        ...prev[unitId],
        [slot]: item
      }
    }));
  };

  const handleUnequipItem = (unitId: string, slot: EquipmentSlot) => {
    setEquipment(prev => {
      const newEquipment = { ...prev };
      if (newEquipment[unitId]) {
        const updatedUnit = { ...newEquipment[unitId] };
        delete updatedUnit[slot];
        newEquipment[unitId] = updatedUnit;
      }
      return newEquipment;
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'battle-transition':
        return (
          <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #1a2540 0%, #0a1530 100%)',
            gap: '20px'
          }}>
            <BattleTransition onComplete={() => console.log('Transition complete!')} />
            <Button onClick={() => setCurrentScreen('menu')}>
              Back to Menu
            </Button>
          </div>
        );

      case 'unit-collection':
        return (
          <div style={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #1a2540 0%, #0a1530 100%)',
            padding: '20px'
          }}>
            <UnitCollectionScreen
              units={units}
              onToggleActive={handleToggleActive}
              onViewEquipment={() => {
                setCurrentScreen('equipment');
              }}
              onReturn={() => setCurrentScreen('menu')}
            />
          </div>
        );

      case 'equipment':
        return (
          <div style={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #1a2540 0%, #0a1530 100%)',
            padding: '20px'
          }}>
            <EquipmentScreen
              units={units.slice(0, 4).map(u => ({ id: u.id, name: u.name, level: u.level, element: u.element }))}
              equipment={equipment}
              inventory={inventory}
              onEquipItem={handleEquipItem}
              onUnequipItem={handleUnequipItem}
              onReturn={() => setCurrentScreen('menu')}
            />
          </div>
        );

      case 'rewards':
        return (
          <div style={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #0a1530 0%, #1a2540 100%)',
            padding: '20px'
          }}>
            <RewardsScreen
              xp={450}
              gold={250}
              items={[
                { id: 'broad-sword', name: 'Broad Sword', icon: '⚔', quantity: 1 },
                { id: 'herb', name: 'Herb', icon: '🍖', quantity: 3 },
                { id: 'crystal', name: 'Crystal Shard', icon: '💎', quantity: 1 },
              ]}
              levelUpUnits={[
                { id: '1', name: 'Isaac', oldLevel: 7, newLevel: 8, sprite: 'I' },
                { id: '2', name: 'Garet', oldLevel: 6, newLevel: 7, sprite: 'G' },
                { id: '3', name: 'Ivan', oldLevel: 6, newLevel: 7, sprite: 'Iv' },
              ]}
              recruitedUnit={{
                name: 'Mia',
                class: 'Tide Adept',
                sprite: 'M'
              }}
              onContinue={() => setCurrentScreen('menu')}
            />
          </div>
        );

      default:
        return (
          <div className="App">
            <h1>Vale Chronicles - React Components Demo</h1>
            <p>Golden Sun-inspired tactical RPG - Graphics Integration Phase</p>

            <div className="demo-section">
              <h2>🎨 New React Components (Interactive!)</h2>
              <div className="mockup-buttons">
                <button
                  className="react-component"
                  onClick={() => setCurrentScreen('battle-transition')}
                >
                  ⚔️ Battle Transition
                  <span className="badge">✅ Complete</span>
                </button>
                <button
                  className="react-component"
                  onClick={() => setCurrentScreen('unit-collection')}
                >
                  👥 Unit Collection
                  <span className="badge">✅ Complete</span>
                </button>
                <button
                  className="react-component"
                  onClick={() => setCurrentScreen('equipment')}
                >
                  🗡️ Equipment Screen
                  <span className="badge">✅ Complete</span>
                </button>
                <button
                  className="react-component"
                  onClick={() => setCurrentScreen('rewards')}
                >
                  🏆 Rewards Screen
                  <span className="badge">✅ Complete</span>
                </button>
              </div>
            </div>

            <div className="demo-section">
              <h2>📄 Original HTML Mockups (Reference)</h2>
              <div className="mockup-buttons">
                <button onClick={() => openMockup('battle-transition')}>
                  Battle Transition
                </button>
                <button onClick={() => openMockup('equipment-screen')}>
                  Equipment Screen
                </button>
                <button onClick={() => openMockup('rewards-screen')}>
                  Rewards Screen
                </button>
                <button onClick={() => openMockup('unit-collection')}>
                  Unit Collection
                </button>
                <button
                  onClick={() => openMockup('vale-village')}
                  className="missing"
                  title="This mockup file is missing"
                >
                  Vale Village (Missing)
                </button>
              </div>
            </div>

            <div className="progress-section">
              <h3>Progress: 4/4 Screens Converted ✨</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%' }}>100%</div>
              </div>
              <ul className="checklist">
                <li className="done">✅ Battle Transition - 4-stage animation</li>
                <li className="done">✅ Unit Collection - Grid layout with stats</li>
                <li className="done">✅ Equipment Screen - Inventory management</li>
                <li className="done">✅ Rewards Screen - Celebration animations</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return renderScreen();
}

export default App;
