import { ItemRepository } from '../../../domain/repositories/ItemRepository';
import { Item } from '../../../shared/types';
import { ITEMS } from '../../../shared/constants';

export class InMemoryItemRepository implements ItemRepository {
  private items: { [id: string]: Item };

  constructor() {
    // Initialize with predefined items
    this.items = { ...ITEMS };
  }

  async getById(itemId: string): Promise<Item | undefined> {
    return this.items[itemId];
  }

  async getAll(): Promise<Item[]> {
    return Object.values(this.items);
  }
}