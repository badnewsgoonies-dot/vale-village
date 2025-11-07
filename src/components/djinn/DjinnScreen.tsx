import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { ALL_DJINN } from '@/data/djinn';
import { calculateDjinnStatBonuses, getDjinnGrantedAbilities } from '@/utils/djinnCalculations';
import { DjinnIcon } from '@/sprites/components/DjinnIcon';
import type { Djinn } from '@/types/Djinn';
import type { Unit } from '@/types/Unit';
import './DjinnScreen.css';

export const DjinnScreen: React.FC = () => {
  const { state, actions } = useGame();
  const [selectedDjinn, setSelectedDjinn] = useState<Djinn | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get active party units for portraits
  const activeParty = state.playerData.unitsCollected.filter((unit: Unit) =>
    state.playerData.activePartyIds.includes(unit.id)
  );

  // Bench units (collected but not in active party)
  const benchUnits = state.playerData.unitsCollected.filter((unit: Unit) =>
    !state.playerData.activePartyIds.includes(unit.id)
  );

  const [showAllUnits, setShowAllUnits] = useState(false);

  // Get all collected Djinn (for now, show all 12 as available)
  const collectedDjinn = state.playerData.djinnCollected.length > 0
    ? state.playerData.djinnCollected
    : Object.values(ALL_DJINN);

  // Get equipped Djinn
  const equippedDjinn = collectedDjinn.filter((d: Djinn) => 
    state.playerData.equippedDjinnIds.includes(d.id)
  );

  // Group Djinn by element
  const djinnByElement = {
    Venus: collectedDjinn.filter((d: Djinn) => d.element === 'Venus'),
    Mars: collectedDjinn.filter((d: Djinn) => d.element === 'Mars'),
    Mercury: collectedDjinn.filter((d: Djinn) => d.element === 'Mercury'),
    Jupiter: collectedDjinn.filter((d: Djinn) => d.element === 'Jupiter'),
  };

  const handleReturn = () => {
    actions.navigate({ type: 'OVERWORLD' });
  };

  const handleEquip = (djinn: Djinn) => {
    // Check if already equipped
    if (state.playerData.equippedDjinnIds.includes(djinn.id)) {
      // Unequip
      actions.unequipDjinn(djinn.id);
      setErrorMessage(null);
      return;
    }

    // Check max slots
    if (state.playerData.equippedDjinnIds.length >= 3) {
      setErrorMessage('Maximum 3 Djinn equipped!');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Equip
    actions.equipDjinn(djinn.id);
    setErrorMessage(null);
  };

  const isEquipped = (djinn: Djinn): boolean => {
    return state.playerData.equippedDjinnIds.includes(djinn.id);
  };

  return (
    <div className="djinn-screen">
      <div className="djinn-container">
        {/* Header with Return */}
        <header className="djinn-header">
          <h1>DJINN MENU</h1>
          <button className="return-button" onClick={handleReturn}>
            ⊡: Return
          </button>
        </header>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Party Portraits with Stat Changes */}
        <section className="party-stats-panel" aria-label="Party stat effects">
          {/* Active party */}
          {activeParty.map((unit: Unit) => {
            const bonuses = calculateDjinnStatBonuses(unit, equippedDjinn);
            const grantedAbilities = getDjinnGrantedAbilities(unit, equippedDjinn);
            return (
              <div key={unit.id} className="unit-stat-card">
                <img
                  className="unit-portrait"
                  src={`/sprites/overworld/protagonists/${unit.name}.gif`}
                  alt={unit.name}
                  onError={(e) => {
                    e.currentTarget.src = '/sprites/overworld/protagonists/Isaac.gif';
                  }}
                />
                <div className="unit-name">{unit.name} (Active)</div>
                <div className="stat-changes">
                  <span className={bonuses.atk >= 0 ? 'stat-positive' : 'stat-negative'}>
                    {bonuses.atk >= 0 ? '+' : ''}{bonuses.atk} ATK
                  </span>
                  <span className={bonuses.def >= 0 ? 'stat-positive' : 'stat-negative'}>
                    {bonuses.def >= 0 ? '+' : ''}{bonuses.def} DEF
                  </span>
                </div>
                {grantedAbilities.length > 0 && (
                  <div className="granted-abilities">
                    {grantedAbilities.length} new abilities
                  </div>
                )}
              </div>
            );
          })}

          {/* Bench units (preview without swapping) */}
          {benchUnits.length > 0 && (
            <>
              {benchUnits.map((unit: Unit) => {
                const bonuses = calculateDjinnStatBonuses(unit, equippedDjinn);
                const grantedAbilities = getDjinnGrantedAbilities(unit, equippedDjinn);
                return (
                  <div key={unit.id} className="unit-stat-card">
                    <img
                      className="unit-portrait"
                      src={`/sprites/overworld/protagonists/${unit.name}.gif`}
                      alt={unit.name}
                      onError={(e) => {
                        e.currentTarget.src = '/sprites/overworld/protagonists/Isaac.gif';
                      }}
                    />
                    <div className="unit-name">{unit.name} (Bench)</div>
                    <div className="stat-changes">
                      <span className={bonuses.atk >= 0 ? 'stat-positive' : 'stat-negative'}>
                        {bonuses.atk >= 0 ? '+' : ''}{bonuses.atk} ATK
                      </span>
                      <span className={bonuses.def >= 0 ? 'stat-positive' : 'stat-negative'}>
                        {bonuses.def >= 0 ? '+' : ''}{bonuses.def} DEF
                      </span>
                    </div>
                    {grantedAbilities.length > 0 && (
                      <div className="granted-abilities">
                        {grantedAbilities.length} new abilities
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* Optional: full roster preview */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button onClick={() => setShowAllUnits(s => !s)} className="return-button">
              {showAllUnits ? 'Hide full roster' : 'Show full roster'}
            </button>
          </div>

          {showAllUnits && state.playerData.unitsCollected.map((unit: Unit) => {
            const bonuses = calculateDjinnStatBonuses(unit, equippedDjinn);
            const grantedAbilities = getDjinnGrantedAbilities(unit, equippedDjinn);
            return (
              <div key={`roster-${unit.id}`} className="unit-stat-card">
                <img
                  className="unit-portrait"
                  src={`/sprites/overworld/protagonists/${unit.name}.gif`}
                  alt={unit.name}
                  onError={(e) => {
                    e.currentTarget.src = '/sprites/overworld/protagonists/Isaac.gif';
                  }}
                />
                <div className="unit-name">{unit.name}</div>
                <div className="stat-changes">
                  <span className={bonuses.atk >= 0 ? 'stat-positive' : 'stat-negative'}>
                    {bonuses.atk >= 0 ? '+' : ''}{bonuses.atk} ATK
                  </span>
                  <span className={bonuses.def >= 0 ? 'stat-positive' : 'stat-negative'}>
                    {bonuses.def >= 0 ? '+' : ''}{bonuses.def} DEF
                  </span>
                </div>
                {grantedAbilities.length > 0 && (
                  <div className="granted-abilities">
                    {grantedAbilities.length} new abilities
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Equipment Slots */}
        <section className="equipment-slots" aria-label="Equipped Djinn">
          <div className="slots-header">EQUIPPED ({equippedDjinn.length} / 3)</div>
          <div className="slots-container">
            {[0, 1, 2].map((slotIndex) => {
              const djinn = equippedDjinn[slotIndex];
              return (
                <div 
                  key={slotIndex} 
                  className={`equipment-slot ${djinn ? `element-${djinn.element.toLowerCase()}` : 'empty'}`}
                  onClick={() => djinn && handleEquip(djinn)}
                  role="button"
                  tabIndex={0}
                  aria-label={djinn ? `${djinn.name} - Click to unequip` : 'Empty slot'}
                >
                  {djinn ? (
                    <>
                      <DjinnIcon
                        djinn={djinn}
                        size="medium"
                        className="slot-sprite"
                      />
                      <div className="slot-name">{djinn.name}</div>
                    </>
                  ) : (
                    <div className="slot-empty">—</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Djinn Collection */}
        <section className="djinn-collection" aria-label="Djinn collection">
          {/* Venus Djinn */}
          <DjinnElementGroup
            element="Venus"
            djinn={djinnByElement.Venus}
            selectedDjinn={selectedDjinn}
            onSelect={setSelectedDjinn}
            onEquip={handleEquip}
            isEquipped={isEquipped}
          />

          {/* Mars Djinn */}
          <DjinnElementGroup
            element="Mars"
            djinn={djinnByElement.Mars}
            selectedDjinn={selectedDjinn}
            onSelect={setSelectedDjinn}
            onEquip={handleEquip}
            isEquipped={isEquipped}
          />

          {/* Mercury Djinn */}
          <DjinnElementGroup
            element="Mercury"
            djinn={djinnByElement.Mercury}
            selectedDjinn={selectedDjinn}
            onSelect={setSelectedDjinn}
            onEquip={handleEquip}
            isEquipped={isEquipped}
          />

          {/* Jupiter Djinn */}
          <DjinnElementGroup
            element="Jupiter"
            djinn={djinnByElement.Jupiter}
            selectedDjinn={selectedDjinn}
            onSelect={setSelectedDjinn}
            onEquip={handleEquip}
            isEquipped={isEquipped}
          />
        </section>
      </div>
    </div>
  );
};

interface DjinnElementGroupProps {
  element: string;
  djinn: Djinn[];
  selectedDjinn: Djinn | null;
  onSelect: (djinn: Djinn) => void;
  onEquip: (djinn: Djinn) => void;
  isEquipped: (djinn: Djinn) => boolean;
}

const DjinnElementGroup: React.FC<DjinnElementGroupProps> = ({
  element,
  djinn,
  selectedDjinn,
  onSelect,
  onEquip,
  isEquipped,
}) => {
  const elementClass = element.toLowerCase();

  return (
    <div className={`djinn-element-group element-${elementClass}`}>
      <div className="element-header">{element}</div>
      <div className="djinn-list">
        {djinn.map((d) => {
          const equipped = isEquipped(d);
          const selected = selectedDjinn?.id === d.id;
          return (
            <div
              key={d.id}
              className={`djinn-card ${equipped ? 'equipped' : ''} ${selected ? 'selected' : ''}`}
              onClick={() => onSelect(d)}
              role="button"
              tabIndex={0}
              aria-label={`${d.name} - ${equipped ? 'Equipped' : 'Not equipped'}`}
            >
              <DjinnIcon
                djinn={d}
                size="small"
                className="djinn-sprite"
              />
              <div className="djinn-info">
                <div className="djinn-name">{d.name}</div>
                {equipped && <div className="equipped-badge">EQUIPPED</div>}
              </div>
              <button
                className={`equip-button ${equipped ? 'unequip' : 'equip'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEquip(d);
                }}
                aria-label={equipped ? `Unequip ${d.name}` : `Equip ${d.name}`}
              >
                {equipped ? 'UNEQUIP' : 'EQUIP'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
