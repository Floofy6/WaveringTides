import React from 'react';
import { Item } from '../../types';

interface InventoryItemProps {
  item: Item;
  selectedQuantity: number;
  onSell: () => void;
  onEquip: () => void;
}

/**
 * InventoryItem component - Displays a single item in the inventory
 * with actions like sell and equip based on item type
 */
const InventoryItem: React.FC<InventoryItemProps> = ({ 
  item, 
  selectedQuantity,
  onSell,
  onEquip
}) => {
  const canSell = 
    item.sellPrice !== undefined && 
    item.sellPrice > 0 && 
    selectedQuantity <= item.quantity;
  
  const canEquip = 
    item.type === 'equipment' && 
    item.slot !== undefined;
    
  // Calculate total sell value
  const sellValue = canSell ? (item.sellPrice! * selectedQuantity) : 0;

  return (
    <div className={`inventory-item ${item.type}`}>
      <div className="item-header">
        <h4 className="item-name">{item.name}</h4>
        <span className="item-quantity">×{item.quantity}</span>
      </div>
      
      {item.type === 'equipment' && item.stats && (
        <div className="item-stats">
          {item.slot && <p className="item-slot">Type: {item.slot}</p>}
          {item.stats.attackBonus && <p>Attack: +{item.stats.attackBonus}</p>}
          {item.stats.strengthBonus && <p>Strength: +{item.stats.strengthBonus}</p>}
          {item.stats.defenseBonus && <p>Defense: +{item.stats.defenseBonus}</p>}
        </div>
      )}
      
      <div className="item-actions">
        {canEquip && (
          <button 
            className="equip-btn"
            onClick={onEquip}
          >
            Equip
          </button>
        )}
        
        {canSell && (
          <div className="sell-controls">
            <p className="sell-price">
              Sell price: {sellValue} gold {selectedQuantity > 1 && `(${item.sellPrice} each)`}
            </p>
            <button 
              className="sell-btn"
              onClick={onSell}
              disabled={!canSell}
            >
              Sell {selectedQuantity}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryItem; 