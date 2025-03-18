import { Player } from '../../domain/aggregates/player/Player';
import { ItemRepository } from '../../domain/repositories/ItemRepository';
export declare class CraftingService {
    private readonly itemRepository;
    constructor(itemRepository: ItemRepository);
    private createItem;
    canCraft(player: Player, itemId: string): Promise<boolean>;
    craft(player: Player, itemId: string): Promise<void>;
}
