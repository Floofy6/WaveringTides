import { Item } from '../entities/Item';

export interface ItemRepository {
  getById(itemId: string): Promise<Item | undefined>;
  getAll(): Promise<Item[]>;
  save(item: Item): Promise<void>;
}