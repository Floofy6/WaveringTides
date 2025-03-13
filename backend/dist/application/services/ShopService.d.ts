import { Player } from '../../domain/aggregates/player/Player';
import { ItemRepository } from '../../domain/repositories/ItemRepository';
export declare class ShopService {
    private readonly itemRepository;
    constructor(itemRepository: ItemRepository);
    private createShopItemData;
    buyItem(player: Player, itemId: string, quantity: number): Promise<void>;
    sellItem(player: Player, itemId: string, quantity: number): Promise<void>;
}
