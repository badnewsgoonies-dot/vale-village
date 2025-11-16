/**
 * DjinnSection Component
 * Djinn slots + granted abilities panel
 */

import type { Unit } from '@/core/models/Unit';
import type { Team } from '@/core/models/Team';
import { useStore } from '../state/store';
import { equipDjinn, unequipDjinn } from '@/core/services/DjinnService';
import { getDjinnAbilityMetadataForUnit } from '@/core/algorithms/djinnAbilities';
import { DJINN } from '@/data/definitions/djinn';

interface DjinnSectionProps {
  unit: Unit;
  team: Team;
  selectedSlot: number | null;
  onSelectSlot: (slot: number | null) => void;
}

export function DjinnSection({
  unit,
  team,
  selectedSlot,
  onSelectSlot,
}: DjinnSectionProps) {
  const { setTeam } = useStore((s) => ({ setTeam: s.setTeam }));

  const handleEquipDjinn = (djinnId: string, slotIndex: number) => {
    const result = equipDjinn(team, djinnId, slotIndex);
    if (result.ok) {
      setTeam(result.value);
      onSelectSlot(null);
    } else {
      console.error('Failed to equip Djinn:', result.error);
    }
  };

  const handleUnequipDjinn = (slotIndex: number) => {
    const djinnId = team.equippedDjinn[slotIndex];
    if (!djinnId) return;

    const result = unequipDjinn(team, djinnId);
    if (result.ok) {
      setTeam(result.value);
      onSelectSlot(null);
    } else {
      console.error('Failed to unequip Djinn:', result.error);
    }
  };

  // Get granted abilities for this unit
  const abilityMetadata = getDjinnAbilityMetadataForUnit(unit, team);

  // Get available Djinn (collected but not equipped)
  const availableDjinn = team.collectedDjinn.filter(
    (djinnId) => !team.equippedDjinn.includes(djinnId)
  );

  return (
    <div className="section-card djinn-section">
      <div className="djinn-slots-panel">
        <div className="section-title">DJINN CONFIGURATION</div>
        <div className="djinn-slots-grid">
          {[0, 1, 2].map((slotIndex) => {
            const djinnId = team.equippedDjinn[slotIndex];
        const hasDjinn = Boolean(djinnId);
        const djinn = hasDjinn ? DJINN[djinnId as keyof typeof DJINN] : null;
            const isSelected = selectedSlot === slotIndex;

            return (
              <div
                key={slotIndex}
                className={`djinn-slot ${djinn ? '' : 'empty'} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectSlot(isSelected ? null : slotIndex)}
              >
                {djinn ? (
                  <>
                    <div className="djinn-sprite">{djinn.element[0]}</div>
                    <div className="djinn-name">{djinn.name}</div>
                    <div className="djinn-element">{djinn.element}</div>
                    <div className="djinn-state">
              {hasDjinn && djinnId ? team.djinnTrackers[djinnId]?.state : 'Set'}
                    </div>
                    {isSelected && (
                      <button
                        className="change-btn"
                        style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.7rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnequipDjinn(slotIndex);
                        }}
                      >
                        Unequip
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="empty-slot-text">(Empty)</div>
                    {isSelected && availableDjinn.length > 0 && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#4a9eff' }}>
                        Click Djinn below to equip
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        {selectedSlot !== null && availableDjinn.length > 0 && (
          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {availableDjinn.slice(0, 4).map((djinnId) => {
              const djinn = DJINN[djinnId];
              if (!djinn) return null;
              return (
                <button
                  key={djinnId}
                  className="compendium-tab"
                  onClick={() => handleEquipDjinn(djinnId, selectedSlot)}
                >
                  {djinn.name} ({djinn.element})
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="djinn-abilities-panel">
        <div className="abilities-title">GRANTED ABILITIES ({unit.name})</div>
        <div className="abilities-content">
          {abilityMetadata.length === 0 ? (
            <div className="ability-item" style={{ color: '#666', textAlign: 'center' }}>
              No abilities granted by Djinn
            </div>
          ) : (
            abilityMetadata.slice(0, 6).map((meta, index) => {
              const ability = unit.abilities.find((a) => a.id === meta.abilityId);
              const djinn = DJINN[meta.djinnId];
              const compatibilityColor =
                meta.compatibility === 'same'
                  ? '#4a9eff'
                  : meta.compatibility === 'counter'
                    ? '#ff4a4a'
                    : '#ffaa4a';

              return (
                <div key={index} className="ability-item">
                  <div className="ability-name">{ability?.name || meta.abilityId}</div>
                  <div className="ability-source" style={{ color: compatibilityColor }}>
                    From {djinn?.name} ({meta.compatibility})
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}


