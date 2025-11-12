/**
 * ShopScreen Component
 * Unlock equipment
 */

import { useState } from 'react';
import { useStore } from '../state/store';
import { SHOPS } from '../../data/definitions/shops';
import { EQUIPMENT } from '../../data/definitions/equipment';
import { buyItem, canAffordItem } from '../../core/services/ShopService';
import { EquipmentIcon } from './EquipmentIcon';
import './ShopScreen.css';
import type { Equipment } from '../../core/models/Equipment';

interface ShopScreenProps {
  shopId: string;
  onClose: () => void;
}

export function ShopScreen({ shopId, onClose }: ShopScreenProps) {
  const { gold, addGold, addEquipment } = useStore((s) => ({
    gold: s.gold,
    addGold: s.addGold,
    addEquipment: s.addEquipment,
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
    ? shop.availableItems
        .map((id) => EQUIPMENT[id])
        .filter((item): item is Equipment => Boolean(item))
    : [];

  const handleUnlock = (itemId: string) => {
    setError(null);
    const result = buyItem(gold, itemId);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    addGold(-EQUIPMENT[itemId]!.cost);
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
        </div>
      </div>
    </div>
  );
}
