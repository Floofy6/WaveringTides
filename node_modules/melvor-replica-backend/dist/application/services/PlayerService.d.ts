import { Player as AggregatePlayer } from '../../domain/aggregates/player/Player';
import { PlayerRepository } from '../../domain/repositories/PlayerRepository';
import { ShopService } from './ShopService';
import { CraftingService } from './CraftingService';
import { EnemyRepository } from '../../domain/repositories/EnemyRepository';
export declare class PlayerService {
    private playerRepository;
    private shopService;
    private craftingService;
    private enemyRepository?;
    constructor(playerRepository: PlayerRepository, shopService: ShopService, craftingService: CraftingService, enemyRepository?: EnemyRepository);
    loadGame(playerId: string): Promise<AggregatePlayer | undefined>;
    saveGame(player: AggregatePlayer): Promise<void>;
    startSkill(playerId: string, skillId: string): Promise<void>;
    stopSkill(playerId: string, skillId: string): Promise<void>;
    craftItem(playerId: string, itemId: string): Promise<void>;
    buyItem(playerId: string, itemId: string, quantity: number): Promise<void>;
    sellItem(playerId: string, itemId: string, quantity: number): Promise<void>;
    startCombat(playerId: string, enemyId: string): Promise<void>;
    stopCombat(playerId: string): Promise<void>;
    equipItem(playerId: string, itemId: string): Promise<void>;
    unequipItem(playerId: string, slot: 'weapon' | 'armor'): Promise<void>;
}
