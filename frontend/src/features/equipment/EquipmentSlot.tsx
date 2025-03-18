import React from 'react';
import { Item } from '../../types';

interface EquipmentSlotProps {
  type: 'weapon' | 'armor';
  item: Item | undefined;
  onUnequip: () => void;
}

/**
 * EquipmentSlot component - Displays a single equipment slot with its item
 * Optimized for narrow sidebar with minimal width
 */
const EquipmentSlot: React.FC<EquipmentSlotProps> = ({ type, item, onUnequip }) => {
  const slotTitle = type.charAt(0).toUpperCase() + type.slice(1);
  
  return (
    <div className="bg-item-bg border border-panel-border rounded-lg p-2">
      <h3 className="text-sm font-medium mb-1 text-text">{slotTitle}</h3>
      
      {item ? (
        <div className="flex flex-col">
          <h4 className="font-medium text-text text-xs mb-1">{item.name}</h4>
          {item.stats && (
            <div className="space-y-0.5 mb-1.5 text-xxs">
              {item.stats.attackBonus !== undefined && 
                <p className="text-gray-700">ATK: <span className="text-success">+{item.stats.attackBonus}</span></p>}
              {item.stats.strengthBonus !== undefined && 
                <p className="text-gray-700">STR: <span className="text-success">+{item.stats.strengthBonus}</span></p>}
              {item.stats.defenseBonus !== undefined && 
                <p className="text-gray-700">DEF: <span className="text-success">+{item.stats.defenseBonus}</span></p>}
            </div>
          )}
          <button 
            className="mt-1 px-2 py-1 bg-danger text-white rounded text-xs font-medium hover:bg-danger/90 transition-colors" 
            onClick={onUnequip}
          >
            Unequip
          </button>
        </div>
      ) : (
        <div className="py-3 text-center italic text-gray-500 text-xs">No {type}</div>
      )}
    </div>
  );
};

export default EquipmentSlot; 