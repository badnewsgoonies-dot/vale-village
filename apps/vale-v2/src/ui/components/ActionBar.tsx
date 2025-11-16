/**
 * Action bar component
 * Displays available abilities and handles action selection
 */

import { useState } from 'react';
import { useStore } from '../state/store';
import { DJINN } from '../../data/definitions/djinn';
import { DJINN_ABILITIES } from '../../data/definitions/djinnAbilities';
import { getLockedDjinnAbilityMetadataForUnit } from '../../core/algorithms/djinnAbilities';

interface ActionBarProps {
  disabled?: boolean;
}

export function ActionBar({ disabled = false }: ActionBarProps) {
  const battle = useStore((s) => s.battle);
  const perform = useStore((s) => s.perform);
  const endTurn = useStore((s) => s.endTurn);
  const preview = useStore((s) => s.preview);

  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  if (!battle || disabled) {
    return (
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }}>
        <p>Battle ended. Controls disabled.</p>
      </div>
    );
  }

  const allUnits = [...battle.playerTeam.units, ...battle.enemies];
  const currentActorId = battle.turnOrder[battle.currentActorIndex];
  const currentActor = allUnits.find(u => u.id === currentActorId);

  if (!currentActor) return null;

  const isPlayerUnit = battle.playerTeam.units.some(u => u.id === currentActorId);
  if (!isPlayerUnit) {
    // Enemy turn - show AI decision info
    return (
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }}>
        <p>Enemy turn: {currentActor.name}</p>
        <p style={{ fontSize: '0.9em', color: '#666' }}>AI is deciding...</p>
      </div>
    );
  }

  const remainingMana = battle.remainingMana;
  const availableAbilities = currentActor.abilities.filter(
    (ability) =>
      currentActor.unlockedAbilityIds.includes(ability.id) &&
      remainingMana >= ability.manaCost
  );
  const lockedDjinnAbilities = getLockedDjinnAbilityMetadataForUnit(currentActor, battle.playerTeam);

  const formatLockedReason = (meta: { djinnId: string }) => {
    const tracker = battle.playerTeam.djinnTrackers[meta.djinnId];
    const djinnName = DJINN[meta.djinnId]?.name ?? meta.djinnId;
    const state = tracker?.state ?? 'Unknown';
    const timer = battle.djinnRecoveryTimers[meta.djinnId];
    const countdownText = timer !== undefined ? ` (${timer} rounds left)` : '';
    return `${djinnName} is ${state}${countdownText}`;
  };

  const handleAbilitySelect = (abilityId: string) => {
    setSelectedAbility(abilityId);
    setSelectedTargets([]);
  };

  const handleTargetSelect = (targetId: string) => {
    if (!selectedAbility) return;
    
    const ability = currentActor.abilities.find(a => a.id === selectedAbility);
    if (!ability) return;

    // Single target abilities
    if (ability.targets === 'single-enemy' || ability.targets === 'single-ally') {
      setSelectedTargets([targetId]);
    } else {
      // Multi-target abilities
      if (selectedTargets.includes(targetId)) {
        setSelectedTargets(selectedTargets.filter(id => id !== targetId));
      } else {
        setSelectedTargets([...selectedTargets, targetId]);
      }
    }
  };

  const handleExecute = () => {
    if (!selectedAbility || selectedTargets.length === 0 || !currentActorId) return;
    perform(currentActorId, selectedAbility, selectedTargets);
    setSelectedAbility(null);
    setSelectedTargets([]);
  };

  // Preview with error boundary to prevent crashes
  const previewData = (() => {
    if (!selectedAbility || selectedTargets.length === 0 || !currentActorId) return null;
    try {
      return preview(currentActorId, selectedAbility, selectedTargets);
    } catch (error) {
      console.error('Preview failed:', error);
      return null;
    }
  })();

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }}>
      <h3>Actions for {currentActor.name}</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <h4>Abilities:</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {availableAbilities.map((ability) => (
              <button
                key={ability.id}
                onClick={() => handleAbilitySelect(ability.id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedAbility === ability.id ? '#4CAF50' : '#2196F3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {ability.name} (Cost: {ability.manaCost})
              </button>
            ))}
          </div>
        </div>

        {lockedDjinnAbilities.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.25rem 0' }}>Locked Djinn Abilities</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {lockedDjinnAbilities.map((meta) => {
                const ability = DJINN_ABILITIES[meta.abilityId];
                if (!ability) return null;
                return (
                  <button
                    key={`${meta.abilityId}-${meta.djinnId}`}
                    disabled
                    title={`${ability.name} locked because ${formatLockedReason(meta)}`}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#2f2f2f',
                      color: '#aaa',
                      border: '1px dashed #666',
                      borderRadius: '4px',
                      cursor: 'not-allowed',
                    }}
                  >
                    {ability.name} (Cost: {ability.manaCost}) — {formatLockedReason(meta)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {selectedAbility && (
        <div style={{ marginBottom: '1rem' }}>
          <h4>Select Targets:</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {allUnits.map((unit) => {
              const ability = currentActor.abilities.find(a => a.id === selectedAbility);
              if (!ability) return null;

              const isEnemy = battle.enemies.some(e => e.id === unit.id);
              const isValidTarget =
                (ability.targets === 'single-enemy' && isEnemy) ||
                (ability.targets === 'all-enemies' && isEnemy) ||
                (ability.targets === 'single-ally' && !isEnemy) ||
                (ability.targets === 'all-allies' && !isEnemy) ||
                (ability.targets === 'self' && unit.id === currentActorId);

              if (!isValidTarget) return null;

              return (
                <button
                  key={unit.id}
                  onClick={() => handleTargetSelect(unit.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: selectedTargets.includes(unit.id) ? '#4CAF50' : '#fff',
                    border: '2px solid #2196F3',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {unit.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {previewData && (
        <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff', borderRadius: '4px' }}>
          <strong>Preview:</strong> {previewData.min}-{previewData.max} damage (avg: {previewData.avg})
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleExecute}
          disabled={disabled || !selectedAbility || selectedTargets.length === 0}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: selectedAbility && selectedTargets.length > 0 && !disabled ? '#4CAF50' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedAbility && selectedTargets.length > 0 && !disabled ? 'pointer' : 'not-allowed',
          }}
        >
          Execute
        </button>
        <button
          onClick={() => {
            setSelectedAbility(null);
            setSelectedTargets([]);
          }}
          disabled={disabled}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: disabled ? '#ccc' : '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => endTurn()}
          disabled={disabled}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: disabled ? '#ccc' : '#FF9800',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          End Turn
        </button>
      </div>
    </div>
  );
}
