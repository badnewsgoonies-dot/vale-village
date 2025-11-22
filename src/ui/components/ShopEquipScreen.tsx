/**
 * ShopEquipScreen Component
 * Combined shop and equipment management screen
 */

import { useState } from 'react';
import { useStore } from '../state/store';
import { SHOPS } from '../../data/definitions/shops';
import { EQUIPMENT } from '../../data/definitions/equipment';
import {
  buyItem,
  canAffordItem,
  purchaseStarterKit,
  purchaseUnitEquipment,
} from '../../core/services/ShopService';
import { getStarterKit } from '../../data/definitions/starterKits';
import { EquipmentIcon } from './EquipmentIcon';
import { updateUnit } from '../../core/models/Unit';
import { calculateEquipmentBonuses } from '../../core/models/Equipment';
import { calculateLevelBonuses } from '../../core/algorithms/stats';
import './ShopEquipScreen.css';
import type { Equipment } from '../../data/schemas/EquipmentSchema';
import type { Unit } from '../../core/models/Unit';
import type { EquipmentSlot } from '../../core/models/Equipment';

type Tab = 'shop' | 'equip';

interface ShopEquipScreenProps {
  shopId?: string;
  onClose: () => void;
}

const EQUIPMENT_SLOTS: EquipmentSlot[] = ['weapon', 'armor', 'helm', 'boots', 'accessory'];

export function ShopEquipScreen({ shopId, onClose }: ShopEquipScreenProps) {
  const { gold, addGold, addEquipment, removeEquipment, team, updateTeamUnits, equipment: inventory } = useStore((s) => ({
    gold: s.gold,
    addGold: s.addGold,
    addEquipment: s.addEquipment,
    removeEquipment: s.removeEquipment,
    team: s.team,
    updateTeamUnits: s.updateTeamUnits,
    equipment: s.equipment,
  }));

  const storyFlags = useStore((s) => s.story.flags);
  const [activeTab, setActiveTab] = useState<Tab>('shop');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(
    team?.units[0]?.id ?? null
  );
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedUnit = team?.units.find((u) => u.id === selectedUnitId) ?? null;

  // Shop tab logic
  const shop = shopId ? SHOPS[shopId] : null;
  const isShopUnlocked = !shop || !shop.unlockCondition || shop.unlockCondition(storyFlags as Record<string, boolean>);
  const availableItems = shop && isShopUnlocked
    ? (shop.availableItems
        .map((id) => EQUIPMENT[id])
        .filter(Boolean) as Equipment[])
    : [];

  const starterKitEntries = team
    ? team.units
        .map((unit) => ({
          unit,
          kit: getStarterKit(unit),
        }))
        .filter(({ kit, unit }) => Boolean(kit) && !unit.storeUnlocked)
        .map(({ unit, kit }) => ({ unit, kit: kit! }))
    : [];

  const unlockedUnits = team ? team.units.filter((unit) => unit.storeUnlocked) : [];

  const handleUnlock = (itemId: string) => {
    setError(null);
    const result = buyItem(gold, itemId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    addGold(result.value.newGold - gold);
    addEquipment([result.value.item]);
  };

  const handleStarterKitPurchase = (unitId: string) => {
    if (!team) return;
    const unit = team.units.find((u) => u.id === unitId);
    if (!unit) return;
    
    setError(null);
    const result = purchaseStarterKit(unit, gold);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    addGold(result.value.newGold - gold);
    addEquipment(result.value.equipment);

    const updatedUnits = team.units.map((unit) =>
      unit.id === unitId ? { ...unit, storeUnlocked: true } : unit
    );
    updateTeamUnits(updatedUnits);
  };

  const handleUnitEquipmentPurchase = (unit: Unit, itemId: string) => {
    setError(null);
    const result = purchaseUnitEquipment(unit, gold, itemId);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    addGold(result.value.newGold - gold);
    addEquipment([result.value.item]);
  };


  // Equipment tab logic
  const handleEquip = (equipment: Equipment) => {
    if (!selectedUnit || !selectedSlot) return;
    
    // If there's already an item in this slot, return it to inventory first
    const currentItem = selectedUnit.equipment[selectedSlot];
    if (currentItem) {
      addEquipment([currentItem]);
    }
    
    // Remove the new item from inventory
    removeEquipment(equipment.id);
    
    // Equip the new item
    const newEquipment = { ...selectedUnit.equipment, [selectedSlot]: equipment };
    const updatedUnit = updateUnit(selectedUnit, { equipment: newEquipment });
    
    const updatedUnits = team!.units.map((u) => (u.id === selectedUnit.id ? updatedUnit : u));
    updateTeamUnits(updatedUnits);
    setSelectedSlot(null);
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    if (!selectedUnit) return;
    
    // Get the item being unequipped
    const itemToUnequip = selectedUnit.equipment[slot];
    
    // Update unit equipment (set slot to null)
    const newEquipment = { ...selectedUnit.equipment, [slot]: null };
    const updatedUnit = updateUnit(selectedUnit, { equipment: newEquipment });
    
    // Return item to inventory if it exists
    if (itemToUnequip) {
      addEquipment([itemToUnequip]);
    }
    
    const updatedUnits = team!.units.map((u) => (u.id === selectedUnit.id ? updatedUnit : u));
    updateTeamUnits(updatedUnits);
  };

  const availableEquipmentForSlot = selectedUnit && selectedSlot
    ? inventory.filter(
        (item) => item.slot === selectedSlot && 
        (item.allowedElements.length === 0 || item.allowedElements.includes(selectedUnit.element))
      )
    : [];

  const equipmentBonuses = selectedUnit ? calculateEquipmentBonuses(selectedUnit.equipment) : {};
  const levelBonuses = selectedUnit ? calculateLevelBonuses(selectedUnit) : {};
  
  const previewStats = selectedUnit ? {
    atk: selectedUnit.baseStats.atk + (levelBonuses.atk || 0) + (equipmentBonuses.atk || 0),
    def: selectedUnit.baseStats.def + (levelBonuses.def || 0) + (equipmentBonuses.def || 0),
    mag: selectedUnit.baseStats.mag + (levelBonuses.mag || 0) + (equipmentBonuses.mag || 0),
    spd: selectedUnit.baseStats.spd + (levelBonuses.spd || 0) + (equipmentBonuses.spd || 0),
  } : null;

  return (
    <div className="shop-equip-overlay" onClick={onClose}>
      <div className="shop-equip-container" onClick={(e) => e.stopPropagation()}>
        <div className="shop-equip-header">
          <h1>{shop ? shop.name : 'Shop & Equipment'}</h1>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="shop-equip-gold">
          <span className="gold-label">Gold:</span>
          <span className="gold-value">{gold}g</span>
        </div>

        <div className="shop-equip-note" style={{ fontSize: '0.8rem', color: '#a9b1c8', padding: '0 1rem', marginBottom: '0.5rem' }}>
          Equipment in your inventory is shared across the roster and locked to elements. Use the Pre-Battle screen to finalize
          which pieces each unit actually carries into combat.
        </div>

        {error && (
          <div className="shop-equip-error" role="alert">
            {error}
          </div>
        )}

        <div className="shop-equip-tabs">
          <button
            className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            Shop
          </button>
          <button
            className={`tab-btn ${activeTab === 'equip' ? 'active' : ''}`}
            onClick={() => setActiveTab('equip')}
          >
            Equipment
          </button>
        </div>

        <div className="shop-equip-content">
          {activeTab === 'shop' && (
            <div className="shop-tab-content">
              {!shop ? (
                <div className="shop-empty">No shop available</div>
              ) : !isShopUnlocked ? (
                <div className="shop-locked">This shop is not yet available.</div>
              ) : (
                <>
                  {starterKitEntries.length > 0 && (
                    <section className="starter-kits-section">
                      <h2>Starter Kits</h2>
                      <div className="shop-items-grid">
                        {starterKitEntries.map(({ unit, kit }) => {
                          const affordable = gold >= kit.cost;
                          return (
                            <div
                              key={unit.id}
                              className={`shop-item-card ${!affordable ? 'unaffordable' : ''}`}
                            >
                              <div className="item-details">
                                <div className="item-name">{kit.name}</div>
                                <div className="item-stats">
                                  <span className="stat-badge">{unit.name}</span>
                                  <span className="stat-badge">{kit.cost}g</span>
                                </div>
                              </div>
                              <button
                                className="buy-btn"
                                onClick={() => handleStarterKitPurchase(unit.id)}
                                disabled={!affordable}
                              >
                                Purchase Starter Kit
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {unlockedUnits.map((unit) => {
                    // Filter equipment by element type (not unit-specific)
                    const availableEquipment = Object.values(EQUIPMENT).filter((item) =>
                      item.allowedElements.includes(unit.element)
                    );
                    return (
                      <section key={unit.id} className="unit-store-section">
                        <h2>{unit.name}'s Equipment ({unit.element})</h2>
                        {availableEquipment.length === 0 ? (
                          <div className="shop-empty">No equipment available yet.</div>
                        ) : (
                          <div className="shop-items-grid">
                            {availableEquipment.map((item) => {
                              const affordable = canAffordItem(gold, item.id);
                              return (
                                <div
                                  key={`${unit.id}-${item.id}`}
                                  className={`shop-item-card ${!affordable ? 'unaffordable' : ''}`}
                                >
                                  <div className="item-icon">
                                    <EquipmentIcon equipment={item} />
                                  </div>
                                  <div className="item-details">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-stats">
                                      {Object.entries(item.statBonus).map(([stat, value]) => (
                                        <span key={stat} className="stat-badge">
                                          +{value} {stat.toUpperCase()}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="item-price">{item.cost}g</div>
                                  </div>
                                  <button
                                    className="buy-btn"
                                    onClick={() => handleUnitEquipmentPurchase(unit, item.id)}
                                    disabled={!affordable}
                                  >
                                    Purchase for {unit.name}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    );
                  })}

                  {availableItems.length > 0 && (
                    <section className="shop-general-section">
                      <h2>General Equipment</h2>
                      <div className="shop-items-grid">
                        {availableItems.map((item) => {
                          const affordable = canAffordItem(gold, item.id);
                          return (
                            <div
                              key={item.id}
                              className={`shop-item-card ${!affordable ? 'unaffordable' : ''}`}
                            >
                              <div className="item-icon">
                                <EquipmentIcon equipment={item} />
                              </div>
                              <div className="item-details">
                                <div className="item-name">{item.name}</div>
                                <div className="item-stats">
                                  {Object.entries(item.statBonus).map(([stat, value]) => (
                                    <span key={stat} className="stat-badge">
                                      +{value} {stat.toUpperCase()}
                                    </span>
                                  ))}
                                </div>
                                <div className="item-price">{item.cost}g</div>
                              </div>
                              <button
                                className="buy-btn"
                                onClick={() => handleUnlock(item.id)}
                                disabled={!affordable}
                              >
                                Unlock Equipment
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {starterKitEntries.length === 0 && unlockedUnits.length === 0 && availableItems.length === 0 && (
                    <div className="shop-empty">No items available.</div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'equip' && (
            <div className="equip-tab-content">
              <div className="equipment-tab-note" style={{ fontSize: '0.8rem', color: '#9ea6b7', marginBottom: '0.5rem', textAlign: 'center' }}>
                This view shows each unit's preferred loadout. The Pre-Battle screen is still the final say for actual gear per battle.
              </div>
              {!team || team.units.length === 0 ? (
                <div className="shop-empty">No units available.</div>
              ) : (
                <div className="equip-layout">
                  <div className="unit-selector-panel">
                    <h2>Select Unit</h2>
                    <div className="unit-list">
                      {team.units.map((unit) => (
                        <div
                          key={unit.id}
                          className={`unit-card ${selectedUnitId === unit.id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedUnitId(unit.id);
                            setSelectedSlot(null);
                          }}
                        >
                          <div className="unit-info">
                            <div className="unit-name">{unit.name}</div>
                            <div className="unit-level">Lv. {unit.level}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedUnit && (
                    <div className="equipment-management-panel">
                      <div className="equipment-slots-section">
                        <h2>{selectedUnit.name}'s Equipment</h2>
                        <div className="equipment-grid">
                          {EQUIPMENT_SLOTS.map((slot) => {
                            const eq = selectedUnit.equipment[slot];
                            const isSelected = selectedSlot === slot;
                            return (
                              <div
                                key={slot}
                                className={`equipment-slot ${slot} ${isSelected ? 'selected' : ''}`}
                                onClick={() => setSelectedSlot(isSelected ? null : slot)}
                              >
                                <div className="equipment-label">{slot.toUpperCase()}</div>
                                {eq ? (
                                  <>
                                    <div className="equipment-value">{eq.name}</div>
                                    <div className="equipment-bonuses">
                                      {eq.statBonus.atk && (
                                        <span className="bonus-badge">+{eq.statBonus.atk} ATK</span>
                                      )}
                                      {eq.statBonus.def && (
                                        <span className="bonus-badge">+{eq.statBonus.def} DEF</span>
                                      )}
                                      {eq.statBonus.mag && (
                                        <span className="bonus-badge">+{eq.statBonus.mag} MAG</span>
                                      )}
                                      {eq.statBonus.spd && (
                                        <span className="bonus-badge">+{eq.statBonus.spd} SPD</span>
                                      )}
                                    </div>
                                    {isSelected && (
                                      <button
                                        className="unequip-btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUnequip(slot);
                                          setSelectedSlot(null);
                                        }}
                                      >
                                        Unequip
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <div className="equipment-value empty">[None]</div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {previewStats && (
                          <div className="stat-preview">
                            <div className="stat-preview-title">STAT PREVIEW</div>
                            <div className="stat-preview-values">
                              <span>
                                ATK: {previewStats.atk}
                                {equipmentBonuses.atk ? ` (+${equipmentBonuses.atk})` : ''}
                              </span>
                              <span>
                                DEF: {previewStats.def}
                                {equipmentBonuses.def ? ` (+${equipmentBonuses.def})` : ''}
                              </span>
                              <span>
                                MAG: {previewStats.mag}
                                {equipmentBonuses.mag ? ` (+${equipmentBonuses.mag})` : ''}
                              </span>
                              <span>
                                SPD: {previewStats.spd}
                                {equipmentBonuses.spd ? ` (+${equipmentBonuses.spd})` : ''}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="equipment-inventory-section">
                        {selectedSlot ? (
                          <>
                            <div className="slot-indicator">
                              Equipping to: <strong>{selectedSlot.toUpperCase()}</strong>
                            </div>
                            {availableEquipmentForSlot.length === 0 ? (
                              <div className="inventory-empty">
                                No {selectedSlot} available in inventory
                              </div>
                            ) : (
                              <div className="inventory-grid">
                                {availableEquipmentForSlot.map((item) => (
                                  <div
                                    key={item.id}
                                    className="inventory-item"
                                    onClick={() => handleEquip(item)}
                                  >
                                    <div className="inventory-item-icon">
                                      <EquipmentIcon equipment={item} />
                                    </div>
                                    <div className="inventory-item-name">{item.name}</div>
                                    <div className="inventory-item-stats">
                                      {item.statBonus.atk && `+${item.statBonus.atk} ATK `}
                                      {item.statBonus.def && `+${item.statBonus.def} DEF `}
                                      {item.statBonus.mag && `+${item.statBonus.mag} MAG `}
                                      {item.statBonus.spd && `+${item.statBonus.spd} SPD `}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="slot-prompt">
                            Select an equipment slot to view available items
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
