import React, { useState, useEffect } from 'react';
import { Item } from '../types';

interface ShopProps {
  shopItems: Item[];
  playerGold: number;
  onBuyItem: (itemId: string, quantity: number) => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Shop component - Displays available items for purchase
 * Optimized for narrow sidebar with minimal width
 */
const Shop: React.FC<ShopProps> = ({ 
  shopItems, 
  playerGold, 
  onBuyItem, 
  isLoading = false, 
  error = null 
}) => {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [localError, setLocalError] = useState<string | null>(null);

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
      <div className="bg-danger/10 border border-danger rounded p-2 mb-2 relative text-xs">
        {localError}
        <button 
          onClick={() => setLocalError(null)} 
          className="absolute top-1 right-2 text-danger hover:text-danger-dark"
          aria-label="Close error message"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">Gold: <span className="text-warning">{playerGold.toLocaleString()}</span></p>
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <label htmlFor="quantity" className="text-xs text-gray-600">Qty:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          disabled={isLoading}
          className="w-14 p-1 border border-panel-border rounded text-center text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
      </div>
      
      {renderErrorMessage()}
      
      {isLoading ? (
        <div className="flex items-center justify-center p-2 text-gray-500 text-xs">
          <div className="animate-spin mr-2 h-3 w-3 border-2 border-primary border-t-transparent rounded-full"></div>
          Processing...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {shopItems.map(item => (
            <div 
              key={item.id} 
              className="bg-item-bg border border-panel-border rounded-lg p-2 hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-text text-sm mb-1">{item.name}</h3>
              <div className="space-y-0.5 text-xxs">
                <p className="text-gray-600">Price: <span className="text-warning font-medium">{item.buyPrice?.toLocaleString() ?? 'N/A'}</span></p>
                <p className="text-gray-600">Total: <span className="text-warning font-medium">{item.buyPrice !== undefined ? (item.buyPrice * quantity).toLocaleString() : 'N/A'}</span></p>
              </div>
              
              {item.stats && (
                <div className="mt-1 p-1 bg-panel rounded space-y-0.5 text-xxs">
                  {item.stats.attackBonus && <p className="text-gray-700">ATK: <span className="text-success">+{item.stats.attackBonus}</span></p>}
                  {item.stats.strengthBonus && <p className="text-gray-700">STR: <span className="text-success">+{item.stats.strengthBonus}</span></p>}
                  {item.stats.defenseBonus && <p className="text-gray-700">DEF: <span className="text-success">+{item.stats.defenseBonus}</span></p>}
                </div>
              )}
              
              <div className="mt-1 flex justify-end">
                <button
                  onClick={() => handleBuyItem(item.id)}
                  disabled={!canAffordItem(item.id) || isLoading}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    canAffordItem(item.id) && !isLoading
                      ? 'bg-primary text-white hover:bg-primary-dark' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Buy {quantity}
                </button>
              </div>
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