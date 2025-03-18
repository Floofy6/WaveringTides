import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Item } from '../../types';
import InventoryItem from './InventoryItem';
import QuantitySelector from '../../components/QuantitySelector';

/**
 * InventoryPanel component - Displays and manages the player's inventory
 * Optimized for narrow sidebar with minimal width
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
    <div className="bg-panel border border-panel-border rounded-lg p-3 shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold text-text">Inventory</h2>
        <InventoryFilter 
          currentFilter={filter}
          onFilterChange={setFilter}
        />
      </div>
      
      <div className="mb-2">
        <QuantitySelector
          value={selectedQuantity}
          onChange={setSelectedQuantity}
          max={99}
          label="Sell Qty:"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-2">
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
    <div className="flex items-center">
      <span className="text-xs text-gray-600 mr-1">Show: </span>
      <div className="flex space-x-1">
        <button 
          className={`px-1.5 py-0.5 text-xxs rounded transition-colors ${
            currentFilter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button 
          className={`px-1.5 py-0.5 text-xxs rounded transition-colors ${
            currentFilter === 'resources' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onFilterChange('resources')}
        >
          Res
        </button>
        <button 
          className={`px-1.5 py-0.5 text-xxs rounded transition-colors ${
            currentFilter === 'equipment' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onFilterChange('equipment')}
        >
          Equip
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
  
  return <p className="col-span-full py-4 text-center italic text-gray-500 text-xs">{messages[filter]}</p>;
};

export default InventoryPanel; 