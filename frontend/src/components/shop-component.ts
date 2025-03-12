import React, { useState, useEffect } from 'react';
import { Item } from '../types';
import api from '../services/api';

interface ShopProps {
  playerGold: number;
  onBuyItem: (itemId: string, quantity: number) => void;
}

const Shop: React.FC<ShopProps> = ({ playerGold, onBuyItem }) => {
  const [shopItems, setShopItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        // In a real implementation, we would fetch this from the backend
        // For now, we'll use some hardcoded items that match our constants
        setShopItems([
          {
            id: 'bronze_sword',
            name: 'Bronze Sword',
            type: 'equipment',
            slot: 'weapon',
            quantity: 1,
            buyPrice: 50,
            sellPrice: 25,
            stats: {
              attackBonus: 4,
              strengthBonus: 2,
            },
          },
          {
            id: 'leather_armor',
            name: 'Leather Armor',
            type: 'equipment',
            slot: 'armor',
            quantity: 1,
            buyPrice: 60,
            sellPrice: 30,
            stats: {
              defenseBonus: 5,
            },
          },
        ]);
      } catch (error) {
        console.error('Error fetching shop items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopItems();
  }, []);

  const handleBuyItem = (itemId: string) => {
    if (canAffordItem(itemId)) {
      onBuyItem(itemId, 1);
    }
  };

  const canAffordItem = (itemId: string): boolean => {
    const item = shopItems.find((item) => item.id === itemId);
    return item ? playerGold >= (item.buyPrice || 0) : false;
  };

  if (loading) {
    return <div className="shop">Loading shop...</div>;
  }

  return (
    <div className="shop">
      <h2>Shop</h2>
      <div className="shop-gold">
        <span>Your Gold: {playerGold}</span>
      </div>
      
      <div className="shop-items">
        {shopItems.map((item) => (
          <div key={item.id} className="shop-item">
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-price">Price: {item.buyPrice} gold</span>
              
              {item.type === 'equipment' && item.stats && (
                <div className="item-stats">
                  {item.stats.attackBonus !== undefined && (
                    <span className="item-stat">ATK: +{item.stats.attackBonus}</span>
                  )}
                  {item.stats.strengthBonus !== undefined && (
                    <span className="item-stat">STR: +{item.stats.strengthBonus}</span>
                  )}
                  {item.stats.defenseBonus !== undefined && (
                    <span className="item-stat">DEF: +{item.stats.defenseBonus}</span>
                  )}
                </div>
              )}
            </div>
            
            <button 
              className={`item-btn buy-btn ${!canAffordItem(item.id) ? 'disabled' : ''}`}
              onClick={() => handleBuyItem(item.id)}
              disabled={!canAffordItem(item.id)}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;