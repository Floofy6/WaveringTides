import { useGameContext } from '../context/GameContext';
import { GameState, Item } from '../types';
import { useCallback } from 'react';

/**
 * Hook for managing inventory-related state and operations
 */
export const useInventory = () => {
  const { gameState, updateGameState } = useGameContext();
  
  /**
   * Sell an item from the inventory
   */
  const sellItem = (itemId: string, quantity: number) => {
    const item = gameState.player.inventory[itemId];
    if (!item || !item.sellPrice) return;
    
    updateGameState((prevState: GameState) => {
      const newInventory = { ...prevState.player.inventory };
      // Use the non-null assertion since we already checked for the sellPrice above
      const newGold = prevState.player.gold + (item.sellPrice! * quantity);
      
      if (item.quantity <= quantity) {
        delete newInventory[itemId];
      } else {
        newInventory[itemId] = {
          ...item,
          quantity: item.quantity - quantity
        };
      }
      
      return {
        ...prevState,
        player: {
          ...prevState.player,
          gold: newGold,
          inventory: newInventory
        }
      };
    });
  };

  /**
   * Equip an item from the inventory
   */
  const equipItem = (itemId: string) => {
    const item = gameState.player.inventory[itemId];
    if (!item || item.type !== 'equipment' || !item.slot) return;
    
    updateGameState((prevState: GameState) => {
      const newInventory = { ...prevState.player.inventory };
      const newEquipment = { ...prevState.player.equipment };
      
      // Type guard to ensure slot is 'weapon' or 'armor'
      if (item.slot === 'weapon' || item.slot === 'armor') {
        // Unequip current item if any
        const currentEquipped = newEquipment[item.slot];
        if (currentEquipped) {
          if (newInventory[currentEquipped.id]) {
            newInventory[currentEquipped.id].quantity += 1;
          } else {
            newInventory[currentEquipped.id] = {
              ...currentEquipped,
              quantity: 1
            };
          }
        }
      
        // Equip new item
        newEquipment[item.slot] = { ...item, quantity: 1 };
      }
      
      // Remove from inventory
      if (item.quantity <= 1) {
        delete newInventory[itemId];
      } else {
        newInventory[itemId] = {
          ...item,
          quantity: item.quantity - 1
        };
      }
      
      return {
        ...prevState,
        player: {
          ...prevState.player,
          inventory: newInventory,
          equipment: newEquipment
        }
      };
    });
  };
  
  /**
   * Unequip an item from equipment slots
   */
  const unequipItem = (slot: 'weapon' | 'armor') => {
    const equippedItem = gameState.player.equipment[slot];
    if (!equippedItem) return;
    
    updateGameState((prevState: GameState) => {
      const newInventory = { ...prevState.player.inventory };
      const newEquipment = { ...prevState.player.equipment };
      
      // Add to inventory
      if (newInventory[equippedItem.id]) {
        newInventory[equippedItem.id].quantity += 1;
      } else {
        newInventory[equippedItem.id] = {
          ...equippedItem,
          quantity: 1
        };
      }
      
      // Remove from equipment
      newEquipment[slot] = undefined;
      
      return {
        ...prevState,
        player: {
          ...prevState.player,
          inventory: newInventory,
          equipment: newEquipment
        }
      };
    });
  };
  
  /**
   * Add an item to the inventory
   */
  const addItem = (item: Item) => {
    updateGameState((prevState: GameState) => {
      const newInventory = { ...prevState.player.inventory };
      
      if (newInventory[item.id]) {
        newInventory[item.id] = {
          ...newInventory[item.id],
          quantity: newInventory[item.id].quantity + item.quantity
        };
      } else {
        newInventory[item.id] = { ...item };
      }
      
      return {
        ...prevState,
        player: {
          ...prevState.player,
          inventory: newInventory
        }
      };
    });
  };
  
  /**
   * Check if the player has a certain quantity of an item
   */
  const checkItemQuantity = useCallback((itemId: string, quantity: number = 1) => {
    const item = gameState.player.inventory[itemId];
    return item && item.quantity >= quantity;
  }, [gameState]);
  
  /**
   * Get the quantity of a specific item in the inventory
   */
  const getItemQuantity = useCallback((itemId: string) => {
    const item = gameState.player.inventory[itemId];
    return item ? item.quantity : 0;
  }, [gameState]);
  
  return {
    inventory: gameState.player.inventory,
    equipment: gameState.player.equipment,
    sellItem,
    equipItem,
    unequipItem,
    addItem,
    checkItemQuantity,
    getItemQuantity
  };
}; 