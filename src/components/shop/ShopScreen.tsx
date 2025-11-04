import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Panel } from '@/components/shared/Panel';
import { Button } from '@/components/shared/Button';
import {
  getEquipmentById,
  getShopItems,
  VALE_VILLAGE_EQUIPMENT_SHOP,
  type ShopInventory,
} from '@/data/shops';
import './ShopScreen.css';

type ShopMode = 'buy' | 'sell';

/**
 * Shop Screen - Equipment Only
 * 
 * DESIGN NOTE: No consumable items in this game.
 * Healing/buffs are handled by abilities (Ply, Wish, etc.).
 * Shops sell equipment only (Weapons, Armor, Helms, Boots).
 */
export const ShopScreen: React.FC = () => {
  const { state, actions } = useGame();
  const [mode, setMode] = useState<ShopMode>('buy');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Get the shop (equipment only)
  const shop: ShopInventory = VALE_VILLAGE_EQUIPMENT_SHOP;
  const shopItems = getShopItems(shop);

  const handleBuy = () => {
    if (!selectedItem) return;

    const equipment = getEquipmentById(selectedItem);
    if (!equipment) return;

    // Check if player has enough gold
    if (state.playerData.gold < equipment.cost) {
      alert('Not enough gold!');
      return;
    }

    actions.buyEquipment(equipment);
    setSelectedItem(null);
  };

  const handleSell = () => {
    if (!selectedItem) return;

    const equipment = getEquipmentById(selectedItem);
    if (!equipment) return;

    const sellPrice = Math.floor(equipment.cost * shop.buybackRate);
    actions.sellEquipment(selectedItem, sellPrice);
    setSelectedItem(null);
  };

  const renderBuyMode = () => {
    return (
      <div className="shop-content">
        <h3>Shop Inventory</h3>
        <div className="shop-items-list">
          {shopItems.map((equipment) => {
            const isSelected = selectedItem === equipment.id;
            const canAfford = state.playerData.gold >= equipment.cost;

            return (
              <div
                key={equipment.id}
                className={`shop-item ${isSelected ? 'selected' : ''} ${!canAfford ? 'cant-afford' : ''}`}
                onClick={() => setSelectedItem(equipment.id)}
              >
                <div className="item-info">
                  <span className="item-name">{equipment.name}</span>
                  <span className="item-price">{equipment.cost} G</span>
                </div>
                <div className="equipment-stats">
                  <span className="equipment-slot">{equipment.slot}</span>
                  {Object.entries(equipment.statBonus).map(([stat, value]) => (
                    <span key={stat} className="stat-bonus">
                      {stat.toUpperCase()}: +{value}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {selectedItem && (
          <div className="transaction-panel">
            <div className="transaction-total">
              Total: {getEquipmentById(selectedItem)?.cost || 0} G
            </div>
            <Button 
              onClick={handleBuy}
              className={state.playerData.gold < (getEquipmentById(selectedItem)?.cost || 0) ? 'disabled' : ''}
            >
              Buy
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderSellMode = () => {
    const playerEquipment = state.playerData.inventory;

    if (playerEquipment.length === 0) {
      return (
        <div className="shop-content">
          <p className="no-items">You have no equipment to sell.</p>
        </div>
      );
    }

    return (
      <div className="shop-content">
        <h3>Your Inventory</h3>
        <div className="shop-items-list">
          {playerEquipment.map((equipment) => {
            const isSelected = selectedItem === equipment.id;
            const sellPrice = Math.floor(equipment.cost * shop.buybackRate);

            return (
              <div
                key={equipment.id}
                className={`shop-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedItem(equipment.id)}
              >
                <div className="item-info">
                  <span className="item-name">{equipment.name}</span>
                  <span className="item-price">{sellPrice} G</span>
                </div>
                <div className="equipment-stats">
                  <span className="equipment-slot">{equipment.slot}</span>
                  {Object.entries(equipment.statBonus).map(([stat, value]) => (
                    <span key={stat} className="stat-bonus">
                      {stat.toUpperCase()}: +{value}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {selectedItem && (
          <div className="transaction-panel">
            <div className="transaction-total">
              Total:{' '}
              {Math.floor(
                (getEquipmentById(selectedItem)?.cost || 0) * shop.buybackRate
              )}{' '}
              G
            </div>
            <Button onClick={handleSell}>Sell</Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="shop-screen">
      <div className="shop-header">
        <h1>{shop.name}</h1>
        <div className="shop-gold">Gold: {state.playerData.gold} G</div>
      </div>

      <div className="shop-mode-selector">
        <Button
          onClick={() => {
            setMode('buy');
            setSelectedItem(null);
          }}
          className={mode === 'buy' ? 'active' : ''}
        >
          Buy
        </Button>
        <Button
          onClick={() => {
            setMode('sell');
            setSelectedItem(null);
          }}
          className={mode === 'sell' ? 'active' : ''}
        >
          Sell
        </Button>
        <Button onClick={() => actions.goBack()}>Exit</Button>
      </div>

      {state.error && <div className="shop-error">{state.error}</div>}

      <Panel className="shop-panel">
        {mode === 'buy' ? renderBuyMode() : renderSellMode()}
      </Panel>

      <div className="controls-info">
        <p>Click an item to select it, then choose Buy or Sell</p>
      </div>
    </div>
  );
};
