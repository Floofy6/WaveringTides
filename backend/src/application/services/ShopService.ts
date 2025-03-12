import { Player } from '../../domain/aggregates/player/Player';
import { Item } from '../../shared/types';
import { ItemRepository } from '../../domain/repositories/ItemRepository';

export class ShopService {
  constructor(private readonly itemRepository: ItemRepository) {}

  // Helper method to create a properly typed item
  private createShopItem(template: any, quantity: number): Item {
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

  async buyItem(player: Player, itemId: string, quantity: number): Promise<void> {
    const shopItem = await this.itemRepository.getById(itemId);
    if (!shopItem) {
      throw new Error(`Item with ID ${itemId} not found in shop`);
    }

    if (!shopItem.buyPrice) {
      throw new Error("Item is not buyable");
    }

    const totalPrice = shopItem.buyPrice * quantity;
    if (player.gold < totalPrice) {
      throw new Error("Insufficient gold");
    }

    player.removeGold(totalPrice);
    const item = this.createShopItem(shopItem, quantity);
    player.addItem(item);
  }

  async sellItem(player: Player, itemId: string, quantity: number): Promise<void> {
    if (!player.hasItem(itemId, quantity)) {
      throw new Error("Not enough of item to sell");
    }
    
    const item = await this.itemRepository.getById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    
    if (!item.sellPrice) {
      throw new Error("Item not sellable");
    }
    
    player.removeItem(itemId, quantity);
    player.addGold(item.sellPrice * quantity);
  }
}