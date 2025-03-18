import { Player } from '../entities/Player';
export interface PlayerRepository {
    getById(playerId: string): Promise<Player | undefined>;
    save(player: Player): Promise<void>;
}
