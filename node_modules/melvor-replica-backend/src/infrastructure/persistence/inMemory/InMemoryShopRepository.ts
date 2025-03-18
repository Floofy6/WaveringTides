import { ItemRepository } from '../../../domain/repositories/ItemRepository';
import { Item } from '../../../domain/entities/Item';
import { ITEMS } from '../../../shared/constants';

export class InMemoryShopRepository implements ItemRepository {
  private shopItems: { [id: string]: Item } = {};

  constructor() {
    // Only add items with buyPrice to the shop
    Object.entries(ITEMS).forEach(([id, itemData]) => {
      if (itemData.buyPrice) {
        this.shopItems[id] = new Item(
          itemData.id,
          itemData.name,
          itemData.type as 'resource' | 'equipment',
          itemData.quantity,
          itemData.sellPrice,
          itemData.buyPrice,
          itemData.stats,
          itemData.slot as 'weapon' | 'armor' | undefined
        );
      }
    });
  }

  async getById(itemId: string): Promise<Item | undefined> {
    return this.shopItems[itemId];
  }

  async getAll(): Promise<Item[]> {
    return Object.values(this.shopItems);
  }
  
  async save(item: Item): Promise<void> {
    // Only save items with buyPrice to the shop
    if (item.getBuyPrice()) {
      this.shopItems[item.getId()] = item;
    }
  }
}