import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { useInventory } from './useInventory';
import { CraftingRecipe } from '../types';
import { SKILL_IDS } from '../constants';

/**
 * useCrafting hook - Manages crafting-related state and operations
 */
export const useCrafting = () => {
  const { gameState, updateGameState } = useGameContext();
  const { checkItemQuantity } = useInventory();
  
  // Define recipes for various skills
  const recipes: CraftingRecipe[] = [
    // Crafting skill recipes
    {
      id: 'recipe_wooden_sword',
      name: 'Wooden Sword',
      ingredients: { 'item_wood': 5 },
      output: {
        id: 'item_wooden_sword',
        name: 'Wooden Sword',
        quantity: 1
      },
      skillId: SKILL_IDS.CRAFTING,
      requiredLevel: 1,
      xpReward: 20
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
      skillId: SKILL_IDS.CRAFTING,
      requiredLevel: 2,
      xpReward: 35
    },
    
    // Smithing skill recipes
    {
      id: 'recipe_bronze_sword',
      name: 'Bronze Sword',
      ingredients: { 'item_bronze_bar': 3 },
      output: {
        id: 'item_bronze_sword',
        name: 'Bronze Sword',
        quantity: 1
      },
      skillId: SKILL_IDS.SMITHING,
      requiredLevel: 5,
      xpReward: 50
    },
    {
      id: 'recipe_bronze_armor',
      name: 'Bronze Armor',
      ingredients: { 'item_bronze_bar': 5 },
      output: {
        id: 'item_bronze_armor',
        name: 'Bronze Armor',
        quantity: 1
      },
      skillId: SKILL_IDS.SMITHING,
      requiredLevel: 10,
      xpReward: 75
    },
    {
      id: 'recipe_bronze_bar',
      name: 'Bronze Bar',
      ingredients: { 'item_copper_ore': 1, 'item_tin_ore': 1 },
      output: {
        id: 'item_bronze_bar',
        name: 'Bronze Bar',
        quantity: 1
      },
      skillId: SKILL_IDS.SMITHING,
      requiredLevel: 1,
      xpReward: 15
    },
    
    // Cooking skill recipes
    {
      id: 'recipe_cooked_fish',
      name: 'Cooked Fish',
      ingredients: { 'item_raw_fish': 1 },
      output: {
        id: 'item_cooked_fish',
        name: 'Cooked Fish',
        quantity: 1
      },
      skillId: SKILL_IDS.COOKING,
      requiredLevel: 1,
      xpReward: 10
    },
    {
      id: 'recipe_bread',
      name: 'Bread',
      ingredients: { 'item_flour': 1, 'item_water': 1 },
      output: {
        id: 'item_bread',
        name: 'Bread',
        quantity: 1
      },
      skillId: SKILL_IDS.COOKING,
      requiredLevel: 5,
      xpReward: 25
    }
  ];
  
  /**
   * Check if the player has the required skill level for a recipe
   */
  const hasRequiredLevel = useCallback((recipe: CraftingRecipe) => {
    const skill = gameState.player.skills[recipe.skillId];
    return skill && skill.level >= recipe.requiredLevel;
  }, [gameState]);
  
  /**
   * Check if a recipe can be crafted with the given quantity
   */
  const canCraft = useCallback((recipeId: string, quantity: number = 1) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return false;
    
    // Check if player has the required skill level
    if (!hasRequiredLevel(recipe)) return false;
    
    // Check if player has enough of each ingredient
    return Object.entries(recipe.ingredients).every(([itemId, requiredAmount]) => {
      return checkItemQuantity(itemId, requiredAmount * quantity);
    });
  }, [recipes, checkItemQuantity, hasRequiredLevel]);
  
  /**
   * Get recipes for a specific skill
   */
  const getRecipesForSkill = useCallback((skillId: string) => {
    return recipes.filter(recipe => recipe.skillId === skillId);
  }, [recipes]);
  
  /**
   * Get all recipes the player can currently craft based on skill levels
   */
  const getAvailableRecipes = useCallback(() => {
    return recipes.filter(recipe => {
      const skill = gameState.player.skills[recipe.skillId];
      return skill && skill.level >= recipe.requiredLevel;
    });
  }, [recipes, gameState]);
  
  /**
   * Craft an item using the specified recipe
   */
  const craftItem = useCallback((recipeId: string, quantity: number = 1) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe || !canCraft(recipeId, quantity)) return false;
    
    // Update game state
    updateGameState(prevState => {
      // Create a deep copy of the player object
      const player = { ...prevState.player };
      const inventory = { ...player.inventory };
      
      // Remove ingredients
      Object.entries(recipe.ingredients).forEach(([itemId, amount]) => {
        if (inventory[itemId]) {
          const currentQuantity = inventory[itemId].quantity;
          
          if (currentQuantity <= amount * quantity) {
            // Remove the item completely
            delete inventory[itemId];
          } else {
            // Reduce the quantity
            inventory[itemId] = {
              ...inventory[itemId],
              quantity: currentQuantity - (amount * quantity)
            };
          }
        }
      });
      
      // Add crafted item to inventory
      const outputItemId = recipe.output.id;
      const outputAmount = recipe.output.quantity * quantity;
      
      if (inventory[outputItemId]) {
        // Increase quantity of existing item
        inventory[outputItemId] = {
          ...inventory[outputItemId],
          quantity: inventory[outputItemId].quantity + outputAmount
        };
      } else {
        // Add new item
        // Determine item type based on the item ID
        const itemType = outputItemId.includes('sword') || outputItemId.includes('armor') 
          ? 'equipment' 
          : 'resource';
        
        // If it's equipment, add appropriate stats
        const stats = itemType === 'equipment' 
          ? {
              attackBonus: outputItemId.includes('sword') ? 5 + recipe.requiredLevel : 0,
              strengthBonus: outputItemId.includes('sword') ? 3 + Math.floor(recipe.requiredLevel/2) : 0,
              defenseBonus: outputItemId.includes('armor') ? 5 + recipe.requiredLevel : 0
            }
          : undefined;
        
        // Determine equipment slot
        const slot = outputItemId.includes('sword') 
          ? 'weapon' 
          : outputItemId.includes('armor') ? 'armor' : undefined;
        
        inventory[outputItemId] = {
          id: outputItemId,
          name: recipe.output.name,
          quantity: outputAmount,
          type: itemType,
          sellPrice: recipe.requiredLevel * 10, // Base price on required level
          stats,
          slot
        };
      }
      
      // Add XP to the relevant skill
      const skills = { ...player.skills };
      if (skills[recipe.skillId]) {
        const currentSkill = skills[recipe.skillId];
        const totalXpReward = (recipe.xpReward ?? 0) * quantity;
        
        skills[recipe.skillId] = {
          ...currentSkill,
          xp: currentSkill.xp + totalXpReward
        };
        
        // Check if the player leveled up
        while (skills[recipe.skillId].xp >= calculateXpForNextLevel(skills[recipe.skillId].level)) {
          skills[recipe.skillId].level += 1;
        }
      }
      
      return {
        ...prevState,
        player: {
          ...player,
          inventory,
          skills
        }
      };
    });
    
    return true;
  }, [recipes, canCraft, updateGameState]);
  
  /**
   * Calculate XP required for the next level
   */
  const calculateXpForNextLevel = (level: number): number => {
    return Math.floor(100 * (level ** 1.5));
  };
  
  return {
    recipes,
    canCraft,
    craftItem,
    getRecipesForSkill,
    getAvailableRecipes
  };
}; 