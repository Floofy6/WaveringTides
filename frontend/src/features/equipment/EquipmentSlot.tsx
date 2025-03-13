import React from 'react';
import { Item } from '../../types';

interface EquipmentSlotProps {
  type: 'weapon' | 'armor';
  item: Item | undefined;
  onUnequip: () => void;
}

/**
 * EquipmentSlot component - Displays a single equipment slot with its item
 */
const EquipmentSlot: React.FC<EquipmentSlotProps> = ({ type, item, onUnequip }) => {
  const slotTitle = type.charAt(0).toUpperCase() + type.slice(1);
  
  return (
    <div className={`equipment-slot ${type}-slot`}>
      <h3>{slotTitle}</h3>
      
      {item ? (
        <div className="equipped-item">
          <h4>{item.name}</h4>
          {item.stats && (
            <div className="item-stats">
              {item.stats.attackBonus !== undefined && 
                <p>Attack: +{item.stats.attackBonus}</p>}
              {item.stats.strengthBonus !== undefined && 
                <p>Strength: +{item.stats.strengthBonus}</p>}
              {item.stats.defenseBonus !== undefined && 
                <p>Defense: +{item.stats.defenseBonus}</p>}
            </div>
          )}
          <button 
            className="unequip-button" 
            onClick={onUnequip}
          >
            Unequip
          </button>
        </div>
      ) : (
        <div className="empty-slot">No {type} equipped</div>
      )}
    </div>
  );
};

export default EquipmentSlot; 