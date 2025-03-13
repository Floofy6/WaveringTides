import React from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Item } from '../../types';
import EquipmentSlot from './EquipmentSlot';
import CombatStats from './CombatStats';

/**
 * EquipmentPanel component - Displays and manages the player's equipment
 */
const EquipmentPanel: React.FC = () => {
  const { equipment, unequipItem } = useInventory();
  
  const handleUnequip = (slot: 'weapon' | 'armor') => {
    unequipItem(slot);
  };
  
  return (
    <div className="equipment-panel">
      <h2>Equipment</h2>
      
      <div className="equipment-slots">
        <EquipmentSlot 
          type="weapon"
          item={equipment.weapon}
          onUnequip={() => handleUnequip('weapon')}
        />
        
        <EquipmentSlot 
          type="armor"
          item={equipment.armor}
          onUnequip={() => handleUnequip('armor')}
        />
      </div>
      
      <CombatStats equipment={equipment} />
    </div>
  );
};

export default EquipmentPanel; 