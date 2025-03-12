import React from 'react';
import { Item } from '../types';

interface InventoryProps {
  inventory: { [id: string]: Item };
  onSellItem: (itemId: string, quantity: number) => void;
  onEquipItem: (itemId: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, onSellItem, onEquipItem }) => {
  const handleSellItem = (itemId: string) => {
    const quantity = 1; // For simplicity, sell one at a time
    onSellItem(itemId, quantity);
  };

  const handleEquipItem = (itemId: string) => {
    onEquipItem(itemId);
  };

  return (
    <div className="inventory">
      <h2>Inventory</h2>
      {Object.keys(inventory).length === 0 ? (
        <p className="empty-message">Your inventory is empty.</p>
      ) : (
        <div className="inventory-grid">
          {Object.values(inventory).map((item) => (
            <div key={item.id} className="inventory-item">
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
              </div>
              
              <div className="item-actions">
                {item.sellPrice && (
                  <button 
                    className="item-btn sell-btn"
                    onClick={() => handleSellItem(item.id)}
                    title={`Sell for ${item.sellPrice} gold`}
                  >
                    Sell
                  </button>
                )}
                
                {item.type === 'equipment' && (
                  <button 
                    className="item-btn equip-btn"
                    onClick={() => handleEquipItem(item.id)}
                  >
                    Equip
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;