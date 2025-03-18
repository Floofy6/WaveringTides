import { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { GameState, Item } from '../types';
import api from '../services/api';

export const useShop = () => {
  const { gameState, updateGameState, refreshGameState } = useGameContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const buyItem = async (item: Item, quantity: number) => {
    if (!item.buyPrice) {
      setError('This item cannot be purchased');
      return;
    }
    
    const totalCost = item.buyPrice * quantity;
    if (gameState.player.gold < totalCost) {
      setError('Not enough gold to purchase this item');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // First optimistically update the UI
      updateGameState((prevState: GameState) => {
        const newInventory = { ...prevState.player.inventory };
        
        // Add item to inventory
        if (newInventory[item.id]) {
          newInventory[item.id] = {
            ...newInventory[item.id],
            quantity: newInventory[item.id].quantity + quantity
          };
        } else {
          newInventory[item.id] = {
            ...item,
            quantity
          };
        }
        
        // Deduct gold
        const newGold = prevState.player.gold - totalCost;
        
        return {
          ...prevState,
          player: {
            ...prevState.player,
            gold: newGold,
            inventory: newInventory
          }
        };
      });
      
      // Then try to update the server
      try {
        await api.buyItem(item.id, quantity);
      } catch (apiError) {
        console.error('API error when buying item:', apiError);
        // Continue with the client-side purchase even if API fails
      }
      
    } catch (err) {
      console.error('Error buying item:', err);
      setError('Failed to purchase item');
      
      // Rollback optimistic update
      await refreshGameState();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a list of items available in the shop
  // In a real app, this would come from the API
  const shopItems: Item[] = [
    {
      id: 'bronze_sword',
      name: 'Bronze Sword',
      type: 'equipment',
      slot: 'weapon',
      quantity: 1,
      buyPrice: 50,
      sellPrice: 25,
      stats: {
        attackBonus: 4,
        strengthBonus: 2,
        defenseBonus: 0
      }
    },
    {
      id: 'leather_armor',
      name: 'Leather Armor',
      type: 'equipment',
      slot: 'armor',
      quantity: 1,
      buyPrice: 60,
      sellPrice: 30,
      stats: {
        attackBonus: 0,
        strengthBonus: 0,
        defenseBonus: 5
      }
    },
    {
      id: 'health_potion',
      name: 'Health Potion',
      type: 'resource',
      quantity: 1,
      buyPrice: 25,
      sellPrice: 10
    }
  ];
  
  return {
    shopItems,
    isLoading,
    error,
    buyItem,
    gold: gameState.player.gold
  };
}; 