import { Item } from '../../shared/types';

export interface ItemRepository {
  getById(itemId: string): Promise<Item | undefined>;
  getAll(): Promise<Item[]>;
}