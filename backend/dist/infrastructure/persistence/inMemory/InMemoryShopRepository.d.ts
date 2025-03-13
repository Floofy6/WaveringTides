import { ItemRepository } from '../../../domain/repositories/ItemRepository';
import { Item } from '../../../domain/entities/Item';
export declare class InMemoryShopRepository implements ItemRepository {
    private shopItems;
    constructor();
    getById(itemId: string): Promise<Item | undefined>;
    getAll(): Promise<Item[]>;
    save(item: Item): Promise<void>;
}
