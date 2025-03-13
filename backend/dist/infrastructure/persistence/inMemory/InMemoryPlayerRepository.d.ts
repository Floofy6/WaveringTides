import { PlayerRepository } from '../../../domain/repositories/PlayerRepository';
import { Player as EntityPlayer } from '../../../domain/entities/Player';
export declare class InMemoryPlayerRepository implements PlayerRepository {
    private players;
    getById(playerId: string): Promise<EntityPlayer | undefined>;
    save(player: EntityPlayer): Promise<void>;
}
