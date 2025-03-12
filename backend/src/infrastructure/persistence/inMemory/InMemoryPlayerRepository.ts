import { PlayerRepository } from '../../../domain/repositories/PlayerRepository';
import { Player } from '../../../domain/aggregates/player/Player';

export class InMemoryPlayerRepository implements PlayerRepository {
  private players: { [id: string]: Player } = {};

  async getById(playerId: string): Promise<Player | undefined> {
    return this.players[playerId];
  }

  async save(player: Player): Promise<void> {
    this.players[player.id] = player;
  }
}