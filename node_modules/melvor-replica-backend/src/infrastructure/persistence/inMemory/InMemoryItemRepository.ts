import { ItemRepository } from '../../../domain/repositories/ItemRepository';
import { Item } from '../../../domain/entities/Item';
import { ITEMS } from '../../../shared/constants';

export class InMemoryItemRepository implements ItemRepository {
  private items: { [id: string]: Item };

  constructor() {
    // Convert constant items to Item entities
    this.items = {};
    
    // Initialize with predefined items
    Object.entries(ITEMS).forEach(([id, itemData]) => {
      this.items[id] = new Item(
        itemData.id,
        itemData.name,
        itemData.type as 'resource' | 'equipment',
        itemData.quantity,
        itemData.sellPrice,
        itemData.buyPrice,
        itemData.stats,
        itemData.slot as 'weapon' | 'armor' | undefined
      );
    });
  }

  async getById(itemId: string): Promise<Item | undefined> {
    return this.items[itemId];
  }

  async getAll(): Promise<Item[]> {
    return Object.values(this.items);
  }
  
  async save(item: Item): Promise<void> {
    this.items[item.getId()] = item;
  }
}