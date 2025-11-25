/**
 * Ability Panel Component
 *
 * Displays available abilities for the current unit.
 * Shows core abilities (level/equipment) and Djinn-granted abilities.
 */

import { SimpleSprite } from '../../sprites/SimpleSprite';
import { getAbilityIconSprite, getAbilityEffectSprite } from '../../sprites/mappings';
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
                  <div className="ability-icon">
                    <SimpleSprite
                      id={getAbilityEffectSprite(ability.id) ?? getAbilityIconSprite(ability.id)}
                      width={32}
                      height={32}
                      style={{ borderRadius: '4px' }}
                    />
                  </div>
                  <div className="ability-info">
                    <span className="ability-name">{ability.name}</span>
                    <span className="ability-meta">
                      {ability.manaCost} mana · [{ability.sourceLabel}]
                    </span>
                  </div>
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
                    <div className="ability-icon">
                      <SimpleSprite
                        id={getAbilityEffectSprite(ability.id) ?? getAbilityIconSprite(ability.id)}
                        width={32}
                        height={32}
                        style={{
                          borderRadius: '4px',
                          opacity: ability.isLocked ? 0.5 : 1
                        }}
                      />
                    </div>
                    <div className="ability-info">
                      <span className="ability-name">{ability.name}</span>
                      <span className="ability-meta">
                        {ability.manaCost} mana · [{ability.sourceLabel}]
                      </span>
                    </div>
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
