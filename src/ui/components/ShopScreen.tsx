/**
 * ShopScreen Component
 * Unlock equipment
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
import './ShopScreen.css';
import type { Equipment } from '../../data/schemas/EquipmentSchema';
import type { Unit } from '../../core/models/Unit';
import { isAvailableInCampaign } from '../utils/contentAvailability';

interface ShopScreenProps {
  shopId: string;
  onClose: () => void;
}

export function ShopScreen({ shopId, onClose }: ShopScreenProps) {
  const { gold, addGold, addEquipment, team, updateTeamUnits } = useStore((s) => ({
    gold: s.gold,
    addGold: s.addGold,
    addEquipment: s.addEquipment,
    team: s.team,
    updateTeamUnits: s.updateTeamUnits,
  }));

  const storyFlags = useStore((s) => s.story.flags);

  const [error, setError] = useState<string | null>(null);

  const shop = SHOPS[shopId];
  if (!shop) {
    return (
      <div className="shop-screen-overlay" onClick={onClose}>
        <div className="shop-screen-container" onClick={(e) => e.stopPropagation()}>
          <div className="shop-error">Shop not found: {shopId}</div>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  // Filter available items based on unlock condition
  const isUnlocked = !shop.unlockCondition || shop.unlockCondition(storyFlags as Record<string, boolean>);
  const availableItems = isUnlocked
    ? (shop.availableItems
        .map((id) => EQUIPMENT[id])
        .filter((item): item is Equipment => Boolean(item))
        .filter(isAvailableInCampaign))
    : [];

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

  const starterKitEntries = team
    ? team.units
        .map((unit) => ({
          unit,
          kit: getStarterKit(unit), // CHANGED: Takes unit object (needs element)
        }))
        .filter(({ kit, unit }) => Boolean(kit) && !unit.storeUnlocked)
        .map(({ unit, kit }) => ({ unit, kit: kit! }))
    : [];

  const unlockedUnits = team ? team.units.filter((unit) => unit.storeUnlocked) : [];

  const handleStarterKitPurchase = (unitId: string) => {
    if (!team) return;
    const unit = team.units.find(u => u.id === unitId);
    if (!unit) return;
    
    setError(null);
    const result = purchaseStarterKit(unit, gold); // CHANGED: Takes unit object
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

  return (
    <div className="shop-screen-overlay" onClick={onClose}>
      <div className="shop-screen-container" onClick={(e) => e.stopPropagation()}>
        <div className="shop-header">
          <h1>{shop.name}</h1>
          <button className="close-btn" onClick={onClose} aria-label="Close shop">
            ×
          </button>
        </div>

        <div className="shop-note" style={{ fontSize: '0.85rem', color: '#a8b3c0', padding: '0 1rem', marginBottom: '0.5rem' }}>
          Unlock shared, element-locked equipment for your roster here. Each item lives in the shared inventory and
          the Pre-Battle screen determines who wields it during the next encounter.
        </div>

        <div className="shop-gold">
          <span className="gold-label">Gold:</span>
          <span className="gold-value">{gold}g</span>
        </div>

        {error && (
          <div className="shop-error" role="alert">
            {error}
          </div>
        )}

        <div className="shop-content">
          <section className="starter-kits-section">
            <h2>Starter Kits</h2>
            {starterKitEntries.length === 0 ? (
              <div className="shop-empty">All Starter Kits unlocked.</div>
            ) : (
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
            )}
          </section>

          {unlockedUnits.map((unit) => {
            const availableEquipment = Object.values(EQUIPMENT).filter(
              (item) => isAvailableInCampaign(item) && item.allowedElements.includes(unit.element)
            );
            return (
              <section key={unit.id} className="unit-store-section">
                <h2>{unit.name}&apos;s Equipment</h2>
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

          <section className="shop-general-section">
            {!isUnlocked ? (
              <div className="shop-locked">
                This shop is not yet available.
              </div>
            ) : availableItems.length === 0 ? (
              <div className="shop-empty">No items available.</div>
            ) : (
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
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
