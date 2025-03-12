import { Player } from '../../domain/aggregates/player/Player';
import { Item } from '../../shared/types';
import { ItemRepository } from '../../domain/repositories/ItemRepository';

export class CraftingService {
  constructor(private readonly itemRepository: ItemRepository) {}

  // Helper method to create a properly typed item
  private createTypedItem(template: any, quantity: number): Item {
    return {
      id: template.id,
      name: template.name,
      quantity: quantity,
      type: template.type as 'resource' | 'equipment',
      sellPrice: template.sellPrice,
      buyPrice: template.buyPrice,
      stats: template.stats,
      slot: template.slot as 'weapon' | 'armor' | undefined,
      craftingRecipe: template.craftingRecipe
    };
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

    const itemTemplate = await this.itemRepository.getById(itemId);
    if (!itemTemplate || !itemTemplate.craftingRecipe) {
      throw new Error("Error in crafting");
    }
    
    const recipe = itemTemplate.craftingRecipe;

    // Remove resources
    for (const resourceId in recipe.requirements) {
      player.removeItem(resourceId, recipe.requirements[resourceId]);
    }

    // Add crafted item
    const craftedItem = this.createTypedItem(itemTemplate, 1);
    player.addItem(craftedItem);

    // Award XP
    player.addXpToSkill(recipe.skillId, recipe.level * 10);
  }
}