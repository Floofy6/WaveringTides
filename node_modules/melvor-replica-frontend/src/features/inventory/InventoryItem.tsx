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
 * Optimized for narrow sidebar with compact layout
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
    <div className={`bg-item-bg border border-panel-border rounded-lg p-2 ${
      item.type === 'equipment' ? 'border-l-4 border-l-primary' : ''
    }`}>
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium text-text text-sm">{item.name}</h4>
        <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xxs font-medium">
          ×{item.quantity}
        </span>
      </div>
      
      {item.type === 'equipment' && item.stats && (
        <div className="space-y-0.5 mb-2 text-xxs text-gray-600">
          {item.slot && <p className="font-medium">Type: {item.slot}</p>}
          {item.stats.attackBonus && <p>ATK: <span className="text-success">+{item.stats.attackBonus}</span></p>}
          {item.stats.strengthBonus && <p>STR: <span className="text-success">+{item.stats.strengthBonus}</span></p>}
          {item.stats.defenseBonus && <p>DEF: <span className="text-success">+{item.stats.defenseBonus}</span></p>}
        </div>
      )}
      
      <div className="mt-2 space-y-1">
        {canEquip && (
          <button 
            className="w-full px-2 py-1 bg-primary text-white text-xs font-medium rounded hover:bg-primary-dark transition-colors"
            onClick={onEquip}
          >
            Equip
          </button>
        )}
        
        {canSell && (
          <div className="space-y-0.5">
            <p className="text-xxs text-gray-600">
              Sell: <span className="text-warning font-medium">{sellValue} gold</span> 
              {selectedQuantity > 1 && <span className="text-gray-500"> ({item.sellPrice} ea)</span>}
            </p>
            <button 
              className="w-full px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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