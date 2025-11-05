import React from 'react';
import { useGame } from '@/context/GameContext';
import { ALL_DJINN } from '@/data/djinn';
import type { Djinn } from '@/types/Djinn';
import type { Unit } from '@/types/Unit';
import './DjinnScreen.css';

export const DjinnScreen: React.FC = () => {
  const { state, actions } = useGame();

  // Get active party units for portraits
  const activeParty = state.playerData.unitsCollected.filter((unit: Unit) =>
    state.playerData.activePartyIds.includes(unit.id)
  );

  // Get all collected Djinn (for now, show all 12 as available)
  const collectedDjinn = state.playerData.djinnCollected.length > 0
    ? state.playerData.djinnCollected
    : Object.values(ALL_DJINN);

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

  // Mock psynergy data (would come from actual game data)
  const getPsynergyForDjinn = (djinn: Djinn): string[] => {
    const psynergyMap: Record<string, string[]> = {
      'flint': ['Granite', 'Quartz', 'Vine', 'Sap', 'Ground'],
      'fizz': ['Sleet', 'Mist', 'Spritz', 'Hail', 'Tonic', 'Dew'],
      'forge': ['Fever', 'Corona', 'Scorch', 'Ember', 'Flash', 'Torch'],
      'breeze': ['Breeze', 'Zephyr', 'Smog', 'Squall', 'Luff'],
    };
    return psynergyMap[djinn.id] || [];
  };

  return (
    <div className="djinn-screen">
      <div className="djinn-container">
        {/* Character portraits (top-left) */}
        <section className="char-panel" aria-label="Party members">
          {activeParty.map((unit: Unit) => (
            <div key={unit.id} className="char-portrait">
              <img
                src={`/sprites/overworld/protagonists/${unit.name}.gif`}
                alt={unit.name}
                onError={(e) => {
                  e.currentTarget.src = '/sprites/overworld/protagonists/Isaac.gif';
                }}
              />
            </div>
          ))}
        </section>

        {/* Return button (top-right) */}
        <div className="return-panel" aria-label="Controls">
          <button className="return-button" onClick={handleReturn}>
            ⊡: Return
          </button>
        </div>

        {/* Main Djinn panel */}
        <section className="djinn-panel" aria-label="Djinn roster">
          {/* Venus Djinn */}
          {djinnByElement.Venus[0] && (
            <DjinnColumn
              djinn={djinnByElement.Venus[0]}
              psynergies={getPsynergyForDjinn(djinnByElement.Venus[0])}
            />
          )}

          {/* Mercury Djinn */}
          {djinnByElement.Mercury[0] && (
            <DjinnColumn
              djinn={djinnByElement.Mercury[0]}
              psynergies={getPsynergyForDjinn(djinnByElement.Mercury[0])}
            />
          )}

          {/* Mars Djinn */}
          {djinnByElement.Mars[0] && (
            <DjinnColumn
              djinn={djinnByElement.Mars[0]}
              psynergies={getPsynergyForDjinn(djinnByElement.Mars[0])}
            />
          )}

          {/* Jupiter Djinn */}
          {djinnByElement.Jupiter[0] && (
            <DjinnColumn
              djinn={djinnByElement.Jupiter[0]}
              psynergies={getPsynergyForDjinn(djinnByElement.Jupiter[0])}
            />
          )}
        </section>

        {/* Footer */}
        <div className="footer" aria-label="Current view">
          Current Djinn
        </div>
      </div>
    </div>
  );
};

interface DjinnColumnProps {
  djinn: Djinn;
  psynergies: string[];
}

const DjinnColumn: React.FC<DjinnColumnProps> = ({ djinn, psynergies }) => {
  const elementClass = djinn.element.toLowerCase();
  const djinnSpritePath = `/sprites/battle/djinn/${djinn.element}_Djinn_Front.gif`;

  return (
    <div className="djinn-col">
      <div className="djinn-sprite">
        <img
          src={djinnSpritePath}
          alt={`${djinn.name} - ${djinn.element} Djinn`}
          onError={(e) => {
            e.currentTarget.src = '/sprites/battle/djinn/Venus_Djinn_Front.gif';
          }}
        />
      </div>
      <div className="djinn-name">{djinn.name}</div>
      <ul className="psynergy-list" role="list">
        {psynergies.map((psynergy, index) => (
          <li key={index} className="psynergy-item">
            <span
              className={`psynergy-icon ${elementClass}`}
              aria-label={djinn.element}
            />
            <span>{psynergy}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
