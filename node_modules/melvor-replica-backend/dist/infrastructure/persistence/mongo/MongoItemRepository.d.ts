import { ItemRepository } from '../../../domain/repositories/ItemRepository';
import { Item } from '../../../domain/entities/Item';
export declare class MongoItemRepository implements ItemRepository {
    constructor();
    private initializeItems;
    getById(itemId: string): Promise<Item | undefined>;
    getAll(): Promise<Item[]>;
    save(item: Item): Promise<void>;
    private mapToDomain;
    private mapToPersistence;
}
