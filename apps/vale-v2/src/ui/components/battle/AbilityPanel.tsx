/**
 * Ability Panel Component
 *
 * Displays available abilities for the current unit.
 * Shows core abilities (level/equipment) and Djinn-granted abilities.
 */

import React from 'react';
import type { AbilityPanelProps } from './types';

export function AbilityPanel({
  coreAbilities,
  djinnAbilities,
  onSelectAbility,
}: AbilityPanelProps): JSX.Element {
  return (
    <div className="ability-panel">
      {/* Core Abilities Section */}
      {coreAbilities.length > 0 && (
        <>
          <div className="ability-section-title">Core (Level / Equipment)</div>
          <div className="ability-list">
            {coreAbilities.map((ability) => (
              <div
                key={ability.id}
                className="ability-item"
                onClick={() => onSelectAbility(ability.id)}
              >
                <div className="ability-item__top">
                  <span className="ability-name">{ability.name}</span>
                  <span className="ability-meta">
                    {ability.manaCost} mana · [{ability.sourceLabel}]
                  </span>
                </div>
                <div className="ability-detail">{ability.description}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Djinn-Granted Abilities Section */}
      {djinnAbilities.length > 0 && (
        <>
          <div className="ability-section-title">Djinn-Granted (Current State)</div>
          <div className="ability-list">
            {djinnAbilities.map((ability) => {
              const classes = [
                'ability-item',
                ability.isLocked ? 'ability-item--locked' : '',
              ].filter(Boolean).join(' ');

              return (
                <div
                  key={ability.id}
                  className={classes}
                  onClick={() => !ability.isLocked && onSelectAbility(ability.id)}
                >
                  <div className="ability-item__top">
                    <span className="ability-name">{ability.name}</span>
                    <span className="ability-meta">
                      {ability.manaCost} mana · [{ability.sourceLabel}]
                    </span>
                  </div>
                  <div className="ability-detail">{ability.description}</div>
                  {ability.isLocked && ability.lockedReason && (
                    <div className="ability-lock-label">{ability.lockedReason}</div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
