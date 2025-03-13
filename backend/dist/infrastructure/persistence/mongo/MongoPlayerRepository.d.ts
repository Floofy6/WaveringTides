import { PlayerRepository } from '../../../domain/repositories/PlayerRepository';
import { Player } from '../../../domain/entities/Player';
export declare class MongoPlayerRepository implements PlayerRepository {
    getById(playerId: string): Promise<Player | undefined>;
    save(player: Player): Promise<void>;
    private mapToAggregate;
    private mapToPersistence;
}
