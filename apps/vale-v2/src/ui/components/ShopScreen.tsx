/**
 * ShopScreen Component
 * Buy and sell equipment
 */

import { useState } from 'react';
import { useStore } from '../state/store';
import { SHOPS } from '../../data/definitions/shops';
import { EQUIPMENT } from '../../data/definitions/equipment';
import { buyItem, sellItem, getSellPrice, canAffordItem } from '../../core/services/ShopService';
import { EquipmentIcon } from './EquipmentIcon';
import './ShopScreen.css';
import type { Equipment } from '../../core/models/Equipment';

interface ShopScreenProps {
  shopId: string;
  onClose: () => void;
}

type Tab = 'buy' | 'sell';

export function ShopScreen({ shopId, onClose }: ShopScreenProps) {
  const { gold, equipment, addGold, addEquipment, removeEquipment } = useStore((s) => ({
    gold: s.gold,
    equipment: s.equipment,
    addGold: s.addGold,
    addEquipment: s.addEquipment,
    removeEquipment: s.removeEquipment,
  }));

  const storyFlags = useStore((s) => s.story.flags);

  const [activeTab, setActiveTab] = useState<Tab>('buy');
  const [error, setError] = useState<string | null>(null);
  const [sellingItemId, setSellingItemId] = useState<string | null>(null);

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

  const handleBuy = (itemId: string) => {
    setError(null);
    const result = buyItem(gold, itemId);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    addGold(-EQUIPMENT[itemId]!.cost);
    addEquipment([result.value.item]);
  };

  const handleSellClick = (itemId: string) => {
    setSellingItemId(itemId);
  };

  const handleConfirmSell = () => {
    if (!sellingItemId) return;

    setError(null);
    const result = sellItem(gold, sellingItemId);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    addGold(result.value.sellPrice);
    removeEquipment(sellingItemId);
    setSellingItemId(null);
  };

  const handleCancelSell = () => {
    setSellingItemId(null);
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

        {/* Tabs */}
        <div className="shop-tabs">
          <button
            className={`tab-btn ${activeTab === 'buy' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('buy');
              setError(null);
            }}
          >
            Buy
          </button>
          <button
            className={`tab-btn ${activeTab === 'sell' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('sell');
              setError(null);
            }}
          >
            Sell
          </button>
        </div>

        {/* Buy Tab */}
        {activeTab === 'buy' && (
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
                        onClick={() => handleBuy(item.id)}
                        disabled={!affordable}
                      >
                        Buy
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Sell Tab */}
        {activeTab === 'sell' && (
          <div className="shop-content">
            {equipment.length === 0 ? (
              <div className="shop-empty">No items to sell.</div>
            ) : (
              <div className="shop-items-grid">
                {equipment.map((item) => {
                  const sellPrice = getSellPrice(item.id);
                  const isConfirming = sellingItemId === item.id;
                  return (
                    <div key={item.id} className="shop-item-card">
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
                        <div className="item-price">Sell: {sellPrice}g</div>
                      </div>
                      {isConfirming ? (
                        <div className="sell-confirm">
                          <button className="confirm-btn" onClick={handleConfirmSell}>
                            Confirm
                          </button>
                          <button className="cancel-btn" onClick={handleCancelSell}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="sell-btn"
                          onClick={() => handleSellClick(item.id)}
                        >
                          Sell
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

