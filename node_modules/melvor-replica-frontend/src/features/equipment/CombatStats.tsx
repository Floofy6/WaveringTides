import React from 'react';
import { Item } from '../../types';

interface CombatStatsProps {
  equipment: {
    weapon?: Item;
    armor?: Item;
  };
}

/**
 * CombatStats component - Calculates and displays combat statistics based on equipped items
 * Optimized for narrow sidebar with minimal width
 */
const CombatStats: React.FC<CombatStatsProps> = ({ equipment }) => {
  /**
   * Calculate the total value for a specific stat from all equipped items
   */
  const calculateTotalStat = (statName: 'attackBonus' | 'strengthBonus' | 'defenseBonus'): number => {
    let total = 0;
    
    if (equipment.weapon?.stats?.[statName]) {
      total += equipment.weapon.stats[statName] || 0;
    }
    
    if (equipment.armor?.stats?.[statName]) {
      total += equipment.armor.stats[statName] || 0;
    }
    
    return total;
  };

  return (
    <div className="bg-panel border border-panel-border rounded-lg p-2 mt-1">
      <h3 className="text-sm font-medium mb-1.5 text-text">Combat Stats</h3>
      <div className="grid grid-cols-3 gap-1">
        <div className="bg-item-bg p-2 rounded text-center">
          <div className="text-xxs text-gray-600 mb-0.5">ATK</div>
          <div className="font-semibold text-primary text-xs">{calculateTotalStat('attackBonus')}</div>
        </div>
        <div className="bg-item-bg p-2 rounded text-center">
          <div className="text-xxs text-gray-600 mb-0.5">STR</div>
          <div className="font-semibold text-primary text-xs">{calculateTotalStat('strengthBonus')}</div>
        </div>
        <div className="bg-item-bg p-2 rounded text-center">
          <div className="text-xxs text-gray-600 mb-0.5">DEF</div>
          <div className="font-semibold text-primary text-xs">{calculateTotalStat('defenseBonus')}</div>
        </div>
      </div>
    </div>
  );
};

export default CombatStats; 