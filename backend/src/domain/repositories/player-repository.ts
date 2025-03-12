import { Player } from '../aggregates/player/Player';

export interface PlayerRepository {
  getById(playerId: string): Promise<Player | undefined>;
  save(player: Player): Promise<void>;
}