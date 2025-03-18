import React from 'react';
import { useShop } from '../../hooks/useShop';
import Shop from '../../components/Shop';

/**
 * ShopPanel component - Container for the shop functionality
 * Optimized for narrow sidebar with minimal width
 */
const ShopPanel: React.FC = () => {
  const { shopItems, gold, buyItem, isLoading, error } = useShop();
  
  const handleBuyItem = (itemId: string, quantity: number) => {
    // Find the item in the shop items before buying
    const itemToBuy = shopItems.find(item => item.id === itemId);
    if (itemToBuy) {
      buyItem(itemToBuy, quantity);
    } else {
      console.error(`Item ${itemId} not found in shop items`);
    }
  };
  
  return (
    <div className="bg-panel border border-panel-border rounded-lg p-3 shadow">
      <h2 className="text-base font-semibold mb-2 text-text">Shop</h2>
      <Shop 
        shopItems={shopItems}
        playerGold={gold} 
        onBuyItem={handleBuyItem} 
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default ShopPanel; 