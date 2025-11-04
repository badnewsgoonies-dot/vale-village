import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Panel } from '@/components/shared/Panel';
import { Button } from '@/components/shared/Button';
import type { Equipment } from '@/types/Equipment';
import {
  getEquipmentById,
  getShopItems,
  VALE_VILLAGE_EQUIPMENT_SHOP,
  type ShopInventory,
} from '@/data/shops';
import './ShopScreen.css';

type ShopMode = 'buy' | 'sell';

export const ShopScreen: React.FC = () => {
  const { state, actions } = useGame();
  const [mode, setMode] = useState<ShopMode>('buy');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Get the shop based on screen type
  const screen = state.currentScreen;
  if (screen.type !== 'SHOP') return null;

  const shopType = screen.shopType;
  const shop: ShopInventory =
    shopType === 'item' ? VALE_VILLAGE_ITEM_SHOP : VALE_VILLAGE_EQUIPMENT_SHOP;

  const shopItems = getShopItems(shop);

  const handleBuy = () => {
    if (!selectedItem) return;

    if (shopType === 'item') {
      const item = getItemById(selectedItem);
      if (!item) return;

      actions.buyItem(item.id, quantity, item.cost);
      setQuantity(1);
    } else {
      const equipment = getEquipmentById(selectedItem);
      if (!equipment) return;

      actions.buyEquipment(equipment);
      setSelectedItem(null);
    }
  };

  const handleSell = () => {
    if (!selectedItem) return;

    if (shopType === 'item') {
      const item = getItemById(selectedItem);
      if (!item) return;

      actions.sellItem(item.id, quantity, item.sellPrice);
      setQuantity(1);
    } else {
      const equipment = getEquipmentById(selectedItem);
      if (!equipment) return;

      const sellPrice = Math.floor(equipment.cost * shop.buybackRate);
      actions.sellEquipment(selectedItem, sellPrice);
      setSelectedItem(null);
    }
  };

  const renderBuyMode = () => {
    return (
      <div className="shop-content">
        <h3>Shop Inventory</h3>
        <div className="shop-items-list">
          {shopItems.map((item) => {
            const isItem = 'healAmount' in item || 'ppAmount' in item;
            const isSelected = selectedItem === item.id;

            return (
              <div
                key={item.id}
                className={`shop-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedItem(item.id)}
              >
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">{item.cost} G</span>
                </div>
                {isItem && (
                  <div className="item-description">{(item as Item).description}</div>
                )}
                {!isItem && (
                  <div className="equipment-stats">
                    {Object.entries((item as Equipment).statBonus).map(([stat, value]) => (
                      <span key={stat} className="stat-bonus">
                        {stat.toUpperCase()}: +{value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedItem && (
          <div className="transaction-panel">
            {shopType === 'item' && (
              <div className="quantity-control">
                <label>Quantity:</label>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="99"
                />
                <button onClick={() => setQuantity(Math.min(99, quantity + 1))}>+</button>
              </div>
            )}
            <div className="transaction-total">
              {shopType === 'item' ? (
                <>
                  Total: {(getItemById(selectedItem)?.cost || 0) * quantity} G
                </>
              ) : (
                <>Total: {getEquipmentById(selectedItem)?.cost || 0} G</>
              )}
            </div>
            <Button onClick={handleBuy}>Buy</Button>
          </div>
        )}
      </div>
    );
  };

  const renderSellMode = () => {
    const playerItems = Object.entries(state.playerData.items).map(([itemId, qty]) => ({
      item: getItemById(itemId),
      quantity: qty,
    }));

    const playerEquipment = state.playerData.inventory;

    if (shopType === 'item' && playerItems.length === 0) {
      return (
        <div className="shop-content">
          <p className="no-items">You have no items to sell.</p>
        </div>
      );
    }

    if (shopType === 'equipment' && playerEquipment.length === 0) {
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
          {shopType === 'item' &&
            playerItems
              .filter((pi) => pi.item)
              .map(({ item, quantity: qty }) => {
                if (!item) return null;
                const isSelected = selectedItem === item.id;
                return (
                  <div
                    key={item.id}
                    className={`shop-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedItem(item.id)}
                  >
                    <div className="item-info">
                      <span className="item-name">
                        {item.name} (x{qty})
                      </span>
                      <span className="item-price">{item.sellPrice} G</span>
                    </div>
                  </div>
                );
              })}

          {shopType === 'equipment' &&
            playerEquipment.map((equipment) => {
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
                </div>
              );
            })}
        </div>

        {selectedItem && (
          <div className="transaction-panel">
            {shopType === 'item' && (
              <div className="quantity-control">
                <label>Quantity:</label>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={state.playerData.items[selectedItem] || 1}
                />
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(state.playerData.items[selectedItem] || 1, quantity + 1)
                    )
                  }
                >
                  +
                </button>
              </div>
            )}
            <div className="transaction-total">
              {shopType === 'item' ? (
                <>
                  Total: {(getItemById(selectedItem)?.sellPrice || 0) * quantity} G
                </>
              ) : (
                <>
                  Total:{' '}
                  {Math.floor(
                    (getEquipmentById(selectedItem)?.cost || 0) * shop.buybackRate
                  )}{' '}
                  G
                </>
              )}
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
            setQuantity(1);
          }}
          className={mode === 'buy' ? 'active' : ''}
        >
          Buy
        </Button>
        <Button
          onClick={() => {
            setMode('sell');
            setSelectedItem(null);
            setQuantity(1);
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
