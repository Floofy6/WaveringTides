import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { useCrafting } from '../../hooks/useCrafting';
import { CraftingRecipe } from '../../types';
import QuantitySelector from '../../components/QuantitySelector';

/**
 * CraftingPanel component - Displays available crafting recipes and allows crafting items
 */
const CraftingPanel: React.FC = () => {
  const { recipes, canCraft, craftItem } = useCrafting();
  const { getItemQuantity } = useInventory();
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null);
  const [craftQuantity, setCraftQuantity] = useState(1);
  
  const handleSelectRecipe = (recipe: CraftingRecipe) => {
    setSelectedRecipe(recipe);
    setCraftQuantity(1);
  };
  
  const handleCraft = () => {
    if (selectedRecipe && canCraft(selectedRecipe.id, craftQuantity)) {
      craftItem(selectedRecipe.id, craftQuantity);
    }
  };
  
  return (
    <div className="crafting-panel">
      <h2>Crafting</h2>
      
      <div className="crafting-container">
        <div className="recipe-list">
          <h3>Available Recipes</h3>
          {recipes.map((recipe: CraftingRecipe) => (
            <div 
              key={recipe.id}
              className={`recipe-item ${selectedRecipe?.id === recipe.id ? 'selected' : ''}`}
              onClick={() => handleSelectRecipe(recipe)}
            >
              <div className="recipe-name">{recipe.name}</div>
              <div className="recipe-craftable">
                {canCraft(recipe.id, 1) ? 'Available' : 'Missing Materials'}
              </div>
            </div>
          ))}
        </div>
        
        {selectedRecipe && (
          <div className="recipe-details">
            <h3>{selectedRecipe.name}</h3>
            
            <div className="recipe-ingredients">
              <h4>Required Materials:</h4>
              <ul>
                {Object.entries(selectedRecipe.ingredients).map(([itemId, quantity]) => (
                  <li key={itemId} className={getItemQuantity(itemId) >= quantity * craftQuantity ? 'available' : 'missing'}>
                    {itemId}: {quantity * craftQuantity} 
                    ({getItemQuantity(itemId)}/{quantity * craftQuantity})
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="recipe-output">
              <h4>Creates:</h4>
              <div>{selectedRecipe.output.name} x {selectedRecipe.output.quantity * craftQuantity}</div>
            </div>
            
            <div className="crafting-controls">
              <QuantitySelector
                value={craftQuantity}
                onChange={setCraftQuantity}
                min={1}
                max={100}
                step={1}
                label="Quantity"
              />
              
              <button 
                className="craft-button"
                disabled={!canCraft(selectedRecipe.id, craftQuantity)}
                onClick={handleCraft}
              >
                Craft
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CraftingPanel; 