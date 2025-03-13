import React from 'react';
import { Item } from '../types';

interface EquipmentProps {
  weapon?: Item;
  armor?: Item;
  onUnequipItem: (slot: 'weapon' | 'armor') => void;
}

const Equipment: React.FC<EquipmentProps> = ({ weapon, armor, onUnequipItem }) => {
  return (
    <div className="equipment">
      <h2>Equipment</h2>
      
      <div className="equipment-slots">
        <div className="equipment-slot">
          <h3>Weapon</h3>
          {weapon ? (
            <div className="equipped-item">
              <div className="item-info">
                <span className="item-name">{weapon.name}</span>
                {weapon.stats && (
                  <div className="item-stats">
                    {weapon.stats.attackBonus !== undefined && (
                      <span className="item-stat">ATK: +{weapon.stats.attackBonus}</span>
                    )}
                    {weapon.stats.strengthBonus !== undefined && (
                      <span className="item-stat">STR: +{weapon.stats.strengthBonus}</span>
                    )}
                  </div>
                )}
              </div>
              <button 
                className="item-btn unequip-btn"
                onClick={() => onUnequipItem('weapon')}
              >
                Unequip
              </button>
            </div>
          ) : (
            <div className="empty-slot">
              <span>No weapon equipped</span>
            </div>
          )}
        </div>
        
        <div className="equipment-slot">
          <h3>Armor</h3>
          {armor ? (
            <div className="equipped-item">
              <div className="item-info">
                <span className="item-name">{armor.name}</span>
                {armor.stats && (
                  <div className="item-stats">
                    {armor.stats.defenseBonus !== undefined && (
                      <span className="item-stat">DEF: +{armor.stats.defenseBonus}</span>
                    )}
                  </div>
                )}
              </div>
              <button 
                className="item-btn unequip-btn"
                onClick={() => onUnequipItem('armor')}
              >
                Unequip
              </button>
            </div>
          ) : (
            <div className="empty-slot">
              <span>No armor equipped</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Equipment;