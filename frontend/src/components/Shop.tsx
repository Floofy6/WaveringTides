import React, { useState, useEffect } from 'react';
import { Item } from '../types';
import api from '../services/api';

interface ShopProps {
  playerGold: number;
  onBuyItem: (itemId: string, quantity: number) => void;
  isLoading?: boolean;
  error?: string | null;
}

const Shop: React.FC<ShopProps> = ({ playerGold, onBuyItem, isLoading = false, error = null }) => {
  const [shopItems, setShopItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        setLoading(true);
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
        setLocalError(null);
      } catch (error) {
        console.error('Error fetching shop items:', error);
        setLocalError('Failed to load shop items');
      } finally {
        setLoading(false);
      }
    };

    fetchShopItems();
  }, []);

  // Reset local error when prop error changes
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleBuyItem = (itemId: string) => {
    if (canAffordItem(itemId)) {
      onBuyItem(itemId, quantity);
      // We don't reset quantity here to make it easier for users to buy multiple batches
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };

  const canAffordItem = (itemId: string): boolean => {
    const item = shopItems.find(item => item.id === itemId);
    return item && item.buyPrice !== undefined ? playerGold >= item.buyPrice * quantity : false;
  };

  const renderErrorMessage = () => {
    if (!localError) return null;
    
    return (
      <div className="error-message">
        {localError}
        <button onClick={() => setLocalError(null)} className="close-error">×</button>
      </div>
    );
  };

  return (
    <div className="shop-container">
      <h2>Shop</h2>
      <p>Your gold: {playerGold}</p>
      
      <div className="quantity-control">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          disabled={isLoading}
        />
      </div>
      
      {renderErrorMessage()}
      
      {loading ? (
        <p>Loading items...</p>
      ) : isLoading ? (
        <p>Processing your purchase...</p>
      ) : (
        <div className="shop-items">
          {shopItems.map(item => (
            <div key={item.id} className="shop-item">
              <h3>{item.name}</h3>
              <p>Price: {item.buyPrice ?? 'N/A'} gold each</p>
              <p>Total: {item.buyPrice !== undefined ? item.buyPrice * quantity : 'N/A'} gold</p>
              
              {item.stats && (
                <div className="item-stats">
                  {item.stats.attackBonus && <p>Attack: +{item.stats.attackBonus}</p>}
                  {item.stats.strengthBonus && <p>Strength: +{item.stats.strengthBonus}</p>}
                  {item.stats.defenseBonus && <p>Defense: +{item.stats.defenseBonus}</p>}
                </div>
              )}
              
              <button
                onClick={() => handleBuyItem(item.id)}
                disabled={!canAffordItem(item.id) || isLoading}
                className="buy-button"
              >
                Buy {quantity}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;

// Add CSS styles for better layout
// .shop-container { padding: 20px; }
// .shop-items { display: flex; flex-wrap: wrap; gap: 20px; }
// .shop-item { border: 1px solid #ccc; padding: 10px; border-radius: 5px; width: 200px; }
// .shop-item h3 { margin: 0 0 10px; }
// .shop-item p { margin: 5px 0; }
// .shop-item button { margin-top: 10px; }
// .quantity-control { margin-bottom: 16px; }
// .error-message { background-color: #ffecec; border: 1px solid #f5aca6; padding: 10px; margin-bottom: 15px; position: relative; }
// .close-error { background: none; border: none; position: absolute; right: 5px; top: 5px; cursor: pointer; }
// .item-stats { margin: 10px 0; padding: 5px; background: #f7f7f7; border-radius: 4px; }