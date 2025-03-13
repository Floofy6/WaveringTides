import React from 'react';
import { useShop } from '../../hooks/useShop';
import Shop from '../../components/Shop';

const ShopPanel: React.FC = () => {
  const { gold, buyItem, isLoading, error } = useShop();
  
  const handleBuyItem = (itemId: string, quantity: number) => {
    // Find the item in the shop items before buying
    buyItem({ id: itemId } as any, quantity);
  };
  
  return (
    <div className="shop-panel panel">
      <h2>Shop</h2>
      <Shop 
        playerGold={gold} 
        onBuyItem={handleBuyItem} 
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default ShopPanel; 