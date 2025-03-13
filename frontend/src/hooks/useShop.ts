import { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { GameState, Item } from '../types';
import api from '../services/api';

export const useShop = () => {
  const { gameState, updateGameState, refreshGameState } = useGameContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const buyItem = async (item: Item, quantity: number) => {
    if (!gameState) return;
    
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
      updateGameState((prevState: GameState | null) => {
        if (!prevState) return prevState;
        
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
      await api.buyItem(item.id, quantity);
      
      // Refresh state from server to ensure consistency
      await refreshGameState();
      
    } catch (err) {
      setError('Failed to buy item. Please try again.');
      console.error('Buy item error:', err);
      
      // Refresh state from server to ensure consistency after error
      await refreshGameState();
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    gold: gameState?.player.gold || 0,
    buyItem,
    isLoading,
    error
  };
}; 