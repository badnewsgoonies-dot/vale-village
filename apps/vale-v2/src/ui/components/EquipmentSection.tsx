/**
 * EquipmentSection Component
 * Equipment slots + compendium for selected unit
 */

import { useState, useEffect } from 'react';
import type { Unit } from '@/core/models/Unit';
import type { Team } from '@/core/models/Team';
import type { EquipmentSlot, Equipment } from '@/core/models/Equipment';
import { useStore } from '../state/store';
import { updateUnit } from '@/core/models/Unit';
import { calculateEquipmentBonuses } from '@/core/models/Equipment';
import { calculateLevelBonuses } from '@/core/algorithms/stats';

interface EquipmentSectionProps {
  unit: Unit;
  team: Team;
  selectedSlot: EquipmentSlot | null;
  onSelectSlot: (slot: EquipmentSlot | null) => void;
}

const EQUIPMENT_SLOTS: EquipmentSlot[] = ['weapon', 'armor', 'helm', 'boots', 'accessory'];

export function EquipmentSection({
  unit,
  team,
  selectedSlot,
  onSelectSlot,
}: EquipmentSectionProps) {
  const { equipment: inventory } = useStore((s) => ({ equipment: s.equipment }));
  const { updateTeamUnits } = useStore((s) => ({ updateTeamUnits: s.updateTeamUnits }));

  const [activeTab, setActiveTab] = useState<EquipmentSlot>('weapon');

  // Sync activeTab with selectedSlot
  useEffect(() => {
    if (selectedSlot) {
      setActiveTab(selectedSlot);
    }
  }, [selectedSlot]);

  // Get available equipment for current slot
  const availableEquipment = inventory.filter(
    (item) => item.slot === activeTab && (item.allowedUnits.length === 0 || item.allowedUnits.includes(unit.id))
  );

  const handleEquip = (equipment: Equipment) => {
    const newEquipment = { ...unit.equipment, [activeTab]: equipment };
    const updatedUnit = updateUnit(unit, { equipment: newEquipment });
    
    // Update unit in team
    const updatedUnits = team.units.map((u) => (u.id === unit.id ? updatedUnit : u));
    updateTeamUnits(updatedUnits);
    onSelectSlot(null);
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    const newEquipment = { ...unit.equipment, [slot]: null };
    const updatedUnit = updateUnit(unit, { equipment: newEquipment });
    
    const updatedUnits = team.units.map((u) => (u.id === unit.id ? updatedUnit : u));
    updateTeamUnits(updatedUnits);
  };

  const equipmentBonuses = calculateEquipmentBonuses(unit.equipment);
  const levelBonuses = calculateLevelBonuses(unit);
  
  // Calculate preview stats (base + level + equipment)
  const previewStats = {
    atk: unit.baseStats.atk + (levelBonuses.atk || 0) + (equipmentBonuses.atk || 0),
    def: unit.baseStats.def + (levelBonuses.def || 0) + (equipmentBonuses.def || 0),
    mag: unit.baseStats.mag + (levelBonuses.mag || 0) + (equipmentBonuses.mag || 0),
    spd: unit.baseStats.spd + (levelBonuses.spd || 0) + (equipmentBonuses.spd || 0),
  };

  return (
    <div className="section-card equipment-section">
      <div className="equipment-slots-panel">
        <div className="section-title">EQUIPMENT ({unit.name})</div>
        <div className="equipment-grid">
          {EQUIPMENT_SLOTS.map((slot) => {
            const eq = unit.equipment[slot];
            const isSelected = selectedSlot === slot;
            return (
              <div
                key={slot}
                className={`equipment-slot ${slot} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectSlot(isSelected ? null : slot)}
              >
                <div className="equipment-label">{slot.toUpperCase()}</div>
                {eq ? (
                  <>
                    <div className="equipment-value">{eq.name}</div>
                    {eq.statBonus.atk && (
                      <div className="equipment-bonus">+{eq.statBonus.atk} ATK</div>
                    )}
                    {eq.statBonus.def && (
                      <div className="equipment-bonus">+{eq.statBonus.def} DEF</div>
                    )}
                    {eq.statBonus.spd && (
                      <div className="equipment-bonus">+{eq.statBonus.spd} SPD</div>
                    )}
                    {isSelected && (
                      <button
                        className="equipment-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnequip(slot);
                          onSelectSlot(null);
                        }}
                        style={{
                          marginTop: '0.5rem',
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.5rem',
                          background: '#ff4444',
                          border: 'none',
                          borderRadius: '3px',
                          color: '#fff',
                          cursor: 'pointer',
                          width: '100%',
                        }}
                      >
                        Unequip
                      </button>
                    )}
                  </>
                ) : (
                  <div className="equipment-value" style={{ color: '#666' }}>
                    [None]
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Stat Preview */}
        <div className="stat-preview">
          STAT PREVIEW: ATK:{previewStats.atk}
          {equipmentBonuses.atk ? `(+${equipmentBonuses.atk}eq)` : ''} DEF:{previewStats.def}
          {equipmentBonuses.def ? `(+${equipmentBonuses.def}eq)` : ''} MAG:{previewStats.mag}
          {equipmentBonuses.mag ? `(+${equipmentBonuses.mag}eq)` : ''} SPD:{previewStats.spd}
          {equipmentBonuses.spd ? `(+${equipmentBonuses.spd}eq)` : ''}
        </div>
      </div>

      <div className="equipment-compendium">
        {selectedSlot && (
          <div
            style={{
              fontSize: '0.7rem',
              color: '#4a9eff',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '0.25rem',
              background: '#1e2a3a',
              borderRadius: '3px',
            }}
          >
            Equipping to: {selectedSlot.toUpperCase()}
          </div>
        )}
        <div className="compendium-tabs">
          {EQUIPMENT_SLOTS.map((slot) => (
            <button
              key={slot}
              className={`compendium-tab ${activeTab === slot ? 'active' : ''}`}
              onClick={() => setActiveTab(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
        <div className="compendium-content">
          {availableEquipment.length === 0 ? (
            <div className="item-name" style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>
              No {activeTab} available
            </div>
          ) : (
            availableEquipment.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="compendium-item"
                onClick={() => handleEquip(item)}
              >
                <div className="item-name">{item.name}</div>
                <div className="item-stats">
                  {item.statBonus.atk && `+${item.statBonus.atk} ATK `}
                  {item.statBonus.def && `+${item.statBonus.def} DEF `}
                  {item.statBonus.spd && `+${item.statBonus.spd} SPD `}
                  {item.unlocksAbility && `Unlocks: ${item.unlocksAbility}`}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

