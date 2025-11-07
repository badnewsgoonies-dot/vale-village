import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { ALL_DJINN } from '@/data/djinn';
import { calculateDjinnStatBonuses, getDjinnGrantedAbilities } from '@/utils/djinnCalculations';
import { DjinnIcon } from '@/sprites/components/DjinnIcon';
import { Button } from '../shared';
import type { Djinn } from '@/types/Djinn';
import type { Unit } from '@/types/Unit';
import './PreBattleDjinnSelection.css';

interface PreBattleDjinnSelectionProps {
  selectedPartyIds: string[];
  onConfirm: (selectedDjinnIds: string[]) => void;
  onBack: () => void;
}

export const PreBattleDjinnSelection: React.FC<PreBattleDjinnSelectionProps> = ({
  selectedPartyIds,
  onConfirm,
  onBack,
}) => {
  const { state } = useGame();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDjinn, setSelectedDjinn] = useState<Djinn | null>(null);

  // Initialize with current equipped Djinn
  const [tempEquippedDjinnIds, setTempEquippedDjinnIds] = useState<string[]>(
    state.playerData.equippedDjinnIds
  );

  // Get all collected Djinn
  const collectedDjinn = state.playerData.djinnCollected.length > 0
    ? state.playerData.djinnCollected
    : Object.values(ALL_DJINN);

  // Get equipped Djinn
  const equippedDjinn = collectedDjinn.filter((d: Djinn) =>
    tempEquippedDjinnIds.includes(d.id)
  );

  // Group Djinn by element
  const djinnByElement = {
    Venus: collectedDjinn.filter((d: Djinn) => d.element === 'Venus'),
    Mars: collectedDjinn.filter((d: Djinn) => d.element === 'Mars'),
    Mercury: collectedDjinn.filter((d: Djinn) => d.element === 'Mercury'),
    Jupiter: collectedDjinn.filter((d: Djinn) => d.element === 'Jupiter'),
  };

  // Get selected party units
  const selectedParty = state.playerData.unitsCollected.filter((unit: Unit) =>
    selectedPartyIds.includes(unit.id)
  );

  const handleEquip = (djinn: Djinn) => {
    // Check if already equipped
    if (tempEquippedDjinnIds.includes(djinn.id)) {
      // Unequip
      setTempEquippedDjinnIds(tempEquippedDjinnIds.filter(id => id !== djinn.id));
      setErrorMessage(null);
      return;
    }

    // Check max slots
    if (tempEquippedDjinnIds.length >= 3) {
      setErrorMessage('Maximum 3 Djinn can be equipped!');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Equip
    setTempEquippedDjinnIds([...tempEquippedDjinnIds, djinn.id]);
    setErrorMessage(null);
  };

  const isEquipped = (djinn: Djinn): boolean => {
    return tempEquippedDjinnIds.includes(djinn.id);
  };

  const handleConfirm = () => {
    onConfirm(tempEquippedDjinnIds);
  };

  return (
    <div className="pre-battle-djinn-selection">
      <div className="pre-battle-djinn-container">
        {/* Header */}
        <header className="pre-battle-djinn-header">
          <div className="header-content">
            <h1>SELECT YOUR DJINN</h1>
            <p className="subtitle">Choose up to 3 Djinn to boost your party</p>
          </div>
          <div className="header-actions">
            <Button onClick={onBack} ariaLabel="Go back to team selection">
              BACK
            </Button>
            <Button onClick={handleConfirm} ariaLabel="Confirm Djinn selection" variant="primary">
              START BATTLE
            </Button>
          </div>
        </header>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Party Preview with Stat Changes */}
        <section className="party-preview-panel" aria-label="Party stat effects">
          <h3>Party Stats with Selected Djinn</h3>
          <div className="party-preview-grid">
            {selectedParty.map((unit: Unit) => {
              const bonuses = calculateDjinnStatBonuses(unit, equippedDjinn);
              const grantedAbilities = getDjinnGrantedAbilities(unit, equippedDjinn);
              return (
                <div key={unit.id} className="unit-preview-card">
                  <img
                    className="unit-portrait"
                    src={`/sprites/overworld/protagonists/${unit.name}.gif`}
                    alt={unit.name}
                    onError={(e) => {
                      e.currentTarget.src = '/sprites/overworld/protagonists/Isaac.gif';
                    }}
                  />
                  <div className="unit-info">
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
                        +{grantedAbilities.length} abilities
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Equipment Slots */}
        <section className="djinn-equipment-slots" aria-label="Equipped Djinn">
          <div className="slots-header">EQUIPPED DJINN ({equippedDjinn.length} / 3)</div>
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
                      <div className="slot-element">{djinn.element}</div>
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
        <section className="djinn-collection" aria-label="Available Djinn">
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

        {/* Djinn Details Panel */}
        {selectedDjinn && (
          <aside className="djinn-details-panel">
            <div className="details-header">
              <h3>{selectedDjinn.name}</h3>
              <span className={`element-badge element-${selectedDjinn.element.toLowerCase()}`}>
                {selectedDjinn.element}
              </span>
            </div>
            <div className="details-description">
              <p>{selectedDjinn.lore}</p>
            </div>
            <div className="details-effect">
              <h4>Unleash Effect</h4>
              <p>{selectedDjinn.unleashEffect.type.toUpperCase()}: {selectedDjinn.unleashEffect.basePower} power</p>
              <p>Targets: {selectedDjinn.unleashEffect.targets}</p>
            </div>
          </aside>
        )}
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
                {equipped ? 'REMOVE' : 'EQUIP'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
