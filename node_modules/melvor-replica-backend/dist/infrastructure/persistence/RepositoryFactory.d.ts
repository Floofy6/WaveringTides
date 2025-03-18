import { PlayerRepository } from '../../domain/repositories/PlayerRepository';
import { ItemRepository } from '../../domain/repositories/ItemRepository';
import { EnemyRepository } from '../../domain/repositories/EnemyRepository';
export declare class RepositoryFactory {
    private static useMongoDB;
    static createPlayerRepository(): PlayerRepository;
    static createItemRepository(): ItemRepository;
    static createShopRepository(): ItemRepository;
    static createEnemyRepository(): EnemyRepository;
}
