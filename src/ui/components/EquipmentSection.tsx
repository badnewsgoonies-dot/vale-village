/**
 * EquipmentSection Component
 * Equipment slots + compendium for selected unit
 */

import { useState, useEffect } from 'react';
import type { Unit } from '@/core/models/Unit';
import type { EquipmentSlot, Equipment, EquipmentLoadout } from '@/core/models/Equipment';
import { calculateEquipmentBonuses } from '@/core/models/Equipment';
import { calculateLevelBonuses } from '@/core/algorithms/stats';
import { EquipmentIcon } from './EquipmentIcon';

interface EquipmentSectionProps {
  unit: Unit;
  selectedSlot: EquipmentSlot | null;
  onSelectSlot: (slot: EquipmentSlot | null) => void;
  equipmentLoadout: EquipmentLoadout;
  inventory: Equipment[];
  onEquip: (slot: EquipmentSlot, item: Equipment) => void;
  onUnequip: (slot: EquipmentSlot) => void;
}

const EQUIPMENT_SLOTS: EquipmentSlot[] = ['weapon', 'armor', 'helm', 'boots', 'accessory'];

export function EquipmentSection({
  unit,
  selectedSlot,
  onSelectSlot,
  equipmentLoadout,
  inventory,
  onEquip,
  onUnequip,
}: EquipmentSectionProps) {
  const [activeTab, setActiveTab] = useState<EquipmentSlot>('weapon');

  // Sync activeTab with selectedSlot
  useEffect(() => {
    if (selectedSlot) {
      setActiveTab(selectedSlot);
    }
  }, [selectedSlot]);

  // Get available equipment for current slot
  const availableEquipment = inventory.filter(
    (item) => item.slot === activeTab && (item.allowedElements.length === 0 || item.allowedElements.includes(unit.element))
  );

  const handleEquip = (equipment: Equipment) => {
    onEquip(activeTab, equipment);
    onSelectSlot(null);
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    onUnequip(slot);
    onSelectSlot(null);
  };

  const equipmentBonuses = calculateEquipmentBonuses(equipmentLoadout);
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
            const eq = equipmentLoadout[slot];
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
                    <div className="equipment-slot-row">
                      <EquipmentIcon equipment={eq} size="medium" className="equipment-slot-icon" />
                      <div className="equipment-value">{eq.name}</div>
                    </div>
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
                  availableEquipment.map((item) => (
                    <div
                      key={item.id}
                      className="compendium-item"
                      onClick={() => handleEquip(item)}
                    >
                      <div className="compendium-item-header">
                        <EquipmentIcon equipment={item} size="small" className="item-icon" />
                        <div className="item-name">{item.name}</div>
                      </div>
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

