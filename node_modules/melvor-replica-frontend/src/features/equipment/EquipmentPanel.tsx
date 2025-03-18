import React from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Item } from '../../types';
import EquipmentSlot from './EquipmentSlot';
import CombatStats from './CombatStats';

/**
 * EquipmentPanel component - Displays and manages the player's equipment
 * Optimized for narrow sidebar with minimal width
 */
const EquipmentPanel: React.FC = () => {
  const { equipment, unequipItem } = useInventory();
  
  const handleUnequip = (slot: 'weapon' | 'armor') => {
    unequipItem(slot);
  };
  
  return (
    <div className="bg-panel border border-panel-border rounded-lg p-3 shadow">
      <h2 className="text-base font-semibold mb-2 text-text">Equipment</h2>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
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