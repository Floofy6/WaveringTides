import { Player } from '../../domain/aggregates/player/Player';
import { ItemRepository } from '../../domain/repositories/ItemRepository';

export class CraftingService {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  async canCraft(player: Player, itemId: string): Promise<boolean> {
    const item = await this.itemRepository.getById(itemId);
    if (!item || !item.craftingRecipe) {
      return false;
    }

    const recipe = item.craftingRecipe;

    // Check skill level
    if (player.getSkillLevel(recipe.skillId) < recipe.level) {
      return false;
    }

    // Check resources
    for (const resourceId in recipe.requirements) {
      if (player.getItemQuantity(resourceId) < recipe.requirements[resourceId]) {
        return false;
      }
    }

    return true;
  }

  async craft(player: Player, itemId: string): Promise<void> {
    const canCraft = await this.canCraft(player, itemId);
    if (!canCraft) {
      throw new Error(`Cannot craft item with ID ${itemId}`);
    }

    const item = await this.itemRepository.getById(itemId);
    if (!item || !item.craftingRecipe) {
      throw new Error("Error in crafting");
    }
    
    const recipe = item.craftingRecipe;

    // Remove resources
    for (const resourceId in recipe.requirements) {
      player.removeItem(resourceId, recipe.requirements[resourceId]);
    }

    // Add crafted item
    const craftedItem = { ...item, quantity: 1 };
    player.addItem(craftedItem);

    // Award XP
    player.addXpToSkill(recipe.skillId, recipe.level * 10);
  }
}