import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Item } from '../../types';
import InventoryItem from './InventoryItem';
import QuantitySelector from '../../components/QuantitySelector';

/**
 * InventoryPanel component - Displays and manages the player's inventory
 */
const InventoryPanel: React.FC = () => {
  const { inventory, sellItem, equipItem } = useInventory();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [filter, setFilter] = useState<'all' | 'resources' | 'equipment'>('all');
  
  const handleSellItem = (itemId: string) => {
    sellItem(itemId, selectedQuantity);
  };
  
  const handleEquipItem = (itemId: string) => {
    equipItem(itemId);
  };
  
  const filteredInventory = Object.entries(inventory).filter(([_, item]) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });
  
  return (
    <div className="inventory-panel">
      <div className="inventory-header">
        <h2>Inventory</h2>
        <InventoryFilter 
          currentFilter={filter}
          onFilterChange={setFilter}
        />
      </div>
      
      <QuantitySelector
        value={selectedQuantity}
        onChange={setSelectedQuantity}
        max={99}
        label="Sell Quantity:"
      />
      
      <div className="inventory-grid">
        {filteredInventory.length === 0 ? (
          <EmptyInventoryMessage filter={filter} />
        ) : (
          filteredInventory.map(([itemId, item]) => (
            <InventoryItem
              key={itemId}
              item={item}
              selectedQuantity={selectedQuantity}
              onSell={() => handleSellItem(itemId)}
              onEquip={() => handleEquipItem(itemId)}
            />
          ))
        )}
      </div>
    </div>
  );
};

/**
 * InventoryFilter component - Provides filtering options for inventory items
 */
interface InventoryFilterProps {
  currentFilter: 'all' | 'resources' | 'equipment';
  onFilterChange: (filter: 'all' | 'resources' | 'equipment') => void;
}

const InventoryFilter: React.FC<InventoryFilterProps> = ({ 
  currentFilter, 
  onFilterChange 
}) => {
  return (
    <div className="inventory-filter">
      <span>Show: </span>
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'resources' ? 'active' : ''}`}
          onClick={() => onFilterChange('resources')}
        >
          Resources
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'equipment' ? 'active' : ''}`}
          onClick={() => onFilterChange('equipment')}
        >
          Equipment
        </button>
      </div>
    </div>
  );
};

/**
 * EmptyInventoryMessage component - Displays appropriate message when inventory is empty
 */
interface EmptyInventoryMessageProps {
  filter: 'all' | 'resources' | 'equipment';
}

const EmptyInventoryMessage: React.FC<EmptyInventoryMessageProps> = ({ filter }) => {
  const messages = {
    all: "Your inventory is empty.",
    resources: "You don't have any resources.",
    equipment: "You don't have any equipment."
  };
  
  return <p className="empty-inventory">{messages[filter]}</p>;
};

export default InventoryPanel; 