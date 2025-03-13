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
    <div className="equipment-stats">
      <h3>Combat Stats</h3>
      <p>Attack: {calculateTotalStat('attackBonus')}</p>
      <p>Strength: {calculateTotalStat('strengthBonus')}</p>
      <p>Defense: {calculateTotalStat('defenseBonus')}</p>
    </div>
  );
};

export default CombatStats; 