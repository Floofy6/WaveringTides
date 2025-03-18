import React, { useState, useEffect } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { useCrafting } from '../../hooks/useCrafting';
import { CraftingRecipe } from '../../types';
import QuantitySelector from '../../components/QuantitySelector';
import { SKILL_IDS } from '../../constants';
import { useGameContext } from '../../context/GameContext';

/**
 * CraftingPanel component - Displays available crafting recipes and allows crafting items
 */
const CraftingPanel: React.FC = () => {
  const { recipes, canCraft, craftItem, getRecipesForSkill, getAvailableRecipes } = useCrafting();
  const { getItemQuantity } = useInventory();
  const { gameState } = useGameContext();
  
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null);
  const [craftQuantity, setCraftQuantity] = useState(1);
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [availableRecipes, setAvailableRecipes] = useState<CraftingRecipe[]>([]);
  const [craftingSuccess, setCraftingSuccess] = useState(false);
  const [craftingMessage, setCraftingMessage] = useState('');
  
  // Filtered recipes based on selected skill
  useEffect(() => {
    if (selectedSkill === 'all') {
      setAvailableRecipes(recipes);
    } else if (selectedSkill === 'available') {
      setAvailableRecipes(getAvailableRecipes());
    } else {
      setAvailableRecipes(getRecipesForSkill(selectedSkill));
    }
  }, [selectedSkill, recipes, getAvailableRecipes, getRecipesForSkill]);
  
  // Reset crafting success message after 3 seconds
  useEffect(() => {
    if (craftingSuccess || craftingMessage) {
      const timer = setTimeout(() => {
        setCraftingSuccess(false);
        setCraftingMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [craftingSuccess, craftingMessage]);
  
  const handleSelectRecipe = (recipe: CraftingRecipe) => {
    setSelectedRecipe(recipe);
    setCraftQuantity(1);
  };
  
  const handleCraft = () => {
    if (selectedRecipe && canCraft(selectedRecipe.id, craftQuantity)) {
      const success = craftItem(selectedRecipe.id, craftQuantity);
      
      if (success) {
        setCraftingSuccess(true);
        setCraftingMessage(`Successfully crafted ${craftQuantity} ${selectedRecipe.name}!`);
      } else {
        setCraftingMessage('Failed to craft the item.');
      }
    }
  };
  
  const getSkillLevel = (skillId: string) => {
    return gameState.player.skills[skillId]?.level || 0;
  };
  
  // Format item name for display
  const formatItemName = (id: string) => {
    return id.replace('item_', '').replace(/_/g, ' ');
  };
  
  return (
    <div className="bg-panel border border-panel-border rounded-lg p-5 shadow">
      <h2 className="text-xl font-semibold mb-4 text-text">Crafting</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-text">Filter by Skill</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedSkill === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedSkill('all')}
              >
                All Recipes
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedSkill === 'available' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedSkill('available')}
              >
                Available Recipes
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedSkill === SKILL_IDS.CRAFTING 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedSkill(SKILL_IDS.CRAFTING)}
              >
                Crafting
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedSkill === SKILL_IDS.SMITHING 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedSkill(SKILL_IDS.SMITHING)}
              >
                Smithing
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedSkill === SKILL_IDS.COOKING 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedSkill(SKILL_IDS.COOKING)}
              >
                Cooking
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 text-text">Recipes</h3>
            <div className="max-h-[400px] overflow-y-auto pr-2 flex flex-col gap-2">
              {availableRecipes.length === 0 ? (
                <div className="p-4 text-center italic text-gray-500 bg-item-bg rounded">
                  No recipes found for this filter.
                </div>
              ) : (
                availableRecipes.map((recipe: CraftingRecipe) => {
                  const playerLevel = getSkillLevel(recipe.skillId);
                  const hasLevel = playerLevel >= recipe.requiredLevel;
                  const canMake = canCraft(recipe.id, 1);
                  
                  return (
                    <div 
                      key={recipe.id}
                      className={`p-3 rounded cursor-pointer transition-all duration-200 border ${
                        !hasLevel 
                          ? 'bg-gray-100 border-gray-300 opacity-70' 
                          : 'bg-item-bg hover:shadow-md hover:-translate-y-0.5'
                      } ${
                        selectedRecipe?.id === recipe.id 
                          ? 'border-primary shadow' 
                          : 'border-panel-border'
                      }`}
                      onClick={() => handleSelectRecipe(recipe)}
                    >
                      <div className="font-medium text-text mb-1">{recipe.name}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {recipe.skillId.charAt(0).toUpperCase() + recipe.skillId.slice(1)} (Lvl {recipe.requiredLevel})
                        </span>
                        <span className={`font-medium ${
                          !hasLevel 
                            ? 'text-gray-500' 
                            : canMake 
                              ? 'text-success' 
                              : 'text-danger'
                        }`}>
                          {hasLevel ? (canMake ? 'Available' : 'Missing Materials') : 'Insufficient Level'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedRecipe ? (
            <div className="bg-item-bg p-4 rounded-lg border border-panel-border">
              <h3 className="text-lg font-semibold mb-3 text-text">{selectedRecipe.name}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-sm">
                  <div className="text-gray-600 mb-1">Required Skill:</div>
                  <div className="font-medium">
                    {selectedRecipe.skillId.charAt(0).toUpperCase() + selectedRecipe.skillId.slice(1)} (Level {selectedRecipe.requiredLevel})
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-600 mb-1">XP Reward:</div>
                  <div className="font-medium text-primary">
                    {(selectedRecipe.xpReward || 0) * craftQuantity} XP
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2 text-text">Required Materials:</h4>
                <ul className="bg-panel rounded p-3 space-y-2">
                  {Object.entries(selectedRecipe.ingredients).map(([itemId, quantity]) => {
                    const hasEnough = getItemQuantity(itemId) >= quantity * craftQuantity;
                    
                    return (
                      <li 
                        key={itemId} 
                        className={`flex justify-between text-sm ${hasEnough ? 'text-text' : 'text-danger'}`}
                      >
                        <span>{formatItemName(itemId)}: {quantity * craftQuantity}</span>
                        <span className={`${hasEnough ? 'text-success' : 'text-danger'}`}>
                          {getItemQuantity(itemId)}/{quantity * craftQuantity}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div className="mb-5">
                <h4 className="text-sm font-semibold mb-2 text-text">Creates:</h4>
                <div className="bg-panel rounded p-3 text-sm font-medium">
                  {selectedRecipe.output.name} x {selectedRecipe.output.quantity * craftQuantity}
                </div>
              </div>
              
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <QuantitySelector
                    value={craftQuantity}
                    onChange={setCraftQuantity}
                    min={1}
                    max={100}
                    step={1}
                    label="Quantity"
                  />
                </div>
                
                <button 
                  className={`px-5 py-2 rounded font-medium transition-colors ${
                    canCraft(selectedRecipe.id, craftQuantity)
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!canCraft(selectedRecipe.id, craftQuantity)}
                  onClick={handleCraft}
                >
                  Craft
                </button>
              </div>
              
              {craftingMessage && (
                <div className={`mt-4 p-3 rounded text-sm ${
                  craftingSuccess 
                    ? 'bg-success/10 text-success border border-success' 
                    : 'bg-danger/10 text-danger border border-danger'
                }`}>
                  {craftingMessage}
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[400px] bg-item-bg rounded-lg border border-panel-border italic text-gray-500">
              Select a recipe to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CraftingPanel; 