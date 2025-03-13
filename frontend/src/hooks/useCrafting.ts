import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { useInventory } from './useInventory';
import { CraftingRecipe } from '../types';

/**
 * useCrafting hook - Manages crafting-related state and operations
 */
export const useCrafting = () => {
  const { gameState, updateGameState } = useGameContext();
  const { checkItemQuantity } = useInventory();
  
  // Mock recipes for now - in a real app, these would come from the game state
  const recipes: CraftingRecipe[] = [
    {
      id: 'recipe_wooden_sword',
      name: 'Wooden Sword',
      ingredients: { 'item_wood': 5 },
      output: {
        id: 'item_wooden_sword',
        name: 'Wooden Sword',
        quantity: 1
      },
      skillId: 'skill_crafting',
      requiredLevel: 1
    },
    {
      id: 'recipe_leather_armor',
      name: 'Leather Armor',
      ingredients: { 'item_leather': 8 },
      output: {
        id: 'item_leather_armor',
        name: 'Leather Armor',
        quantity: 1
      },
      skillId: 'skill_crafting',
      requiredLevel: 2
    }
  ];
  
  /**
   * Check if a recipe can be crafted with the given quantity
   */
  const canCraft = useCallback((recipeId: string, quantity: number = 1) => {
    if (!gameState) return false;
    
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return false;
    
    // Check if player has enough of each ingredient
    return Object.entries(recipe.ingredients).every(([itemId, requiredAmount]) => {
      return checkItemQuantity(itemId, requiredAmount * quantity);
    });
  }, [gameState, recipes, checkItemQuantity]);
  
  /**
   * Craft an item using the specified recipe
   */
  const craftItem = useCallback((recipeId: string, quantity: number = 1) => {
    if (!gameState) return;
    
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe || !canCraft(recipeId, quantity)) return;
    
    // Get current inventory
    const inventory = { ...gameState.player.inventory };
    const updatedInventory = { ...inventory };
    
    // Remove ingredients
    Object.entries(recipe.ingredients).forEach(([itemId, amount]) => {
      if (updatedInventory[itemId]) {
        const currentQuantity = updatedInventory[itemId].quantity;
        
        if (currentQuantity <= amount * quantity) {
          // Remove the item completely
          delete updatedInventory[itemId];
        } else {
          // Reduce the quantity
          updatedInventory[itemId] = {
            ...updatedInventory[itemId],
            quantity: currentQuantity - (amount * quantity)
          };
        }
      }
    });
    
    // Add crafted item to inventory
    const outputItemId = recipe.output.id;
    const outputAmount = recipe.output.quantity * quantity;
    
    if (updatedInventory[outputItemId]) {
      // Increase quantity of existing item
      updatedInventory[outputItemId] = {
        ...updatedInventory[outputItemId],
        quantity: updatedInventory[outputItemId].quantity + outputAmount
      };
    } else {
      // Add new item
      // In a real app, you would get the full item details from a lookup
      updatedInventory[outputItemId] = {
        id: outputItemId,
        name: recipe.output.name,
        quantity: outputAmount,
        type: 'equipment', // Assuming crafted items are equipment
        sellPrice: 10 // Mock value
      };
    }
    
    // Update game state
    updateGameState((prevState) => {
      if (!prevState) return null;
      return {
        ...prevState,
        player: {
          ...prevState.player,
          inventory: updatedInventory
        }
      };
    });
  }, [gameState, recipes, canCraft, updateGameState]);
  
  return {
    recipes,
    canCraft,
    craftItem
  };
}; 