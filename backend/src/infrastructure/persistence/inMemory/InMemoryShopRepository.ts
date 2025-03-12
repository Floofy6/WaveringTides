import { ItemRepository } from '../../../domain/repositories/ItemRepository';
import { Item } from '../../../shared/types';
import { ITEMS } from '../../../shared/constants';

export class InMemoryShopRepository implements ItemRepository {
  private shopItems: { [id: string]: Item } = {};

  constructor() {
    // Only add items with buyPrice to the shop
    Object.values(ITEMS).forEach(item => {
      if (item.buyPrice) {
        this.shopItems[item.id] = { ...item };
      }
    });
  }

  async getById(itemId: string): Promise<Item | undefined> {
    return this.shopItems[itemId];
  }

  async getAll(): Promise<Item[]> {
    return Object.values(this.shopItems);
  }
}