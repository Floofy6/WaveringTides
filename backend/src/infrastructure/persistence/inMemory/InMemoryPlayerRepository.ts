import { PlayerRepository } from '../../../domain/repositories/PlayerRepository';
import { Player as EntityPlayer } from '../../../domain/entities/Player';
import { Player as AggregatePlayer } from '../../../domain/aggregates/player/Player';
import { PlayerAdapter } from '../../../application/adapters/PlayerAdapter';

export class InMemoryPlayerRepository implements PlayerRepository {
  private players: { [id: string]: AggregatePlayer } = {};

  async getById(playerId: string): Promise<EntityPlayer | undefined> {
    const player = this.players[playerId];
    if (!player) {
      return undefined;
    }
    
    // Convert from aggregate to entity
    return PlayerAdapter.toEntity(player);
  }

  async save(player: EntityPlayer): Promise<void> {
    // Convert from entity to aggregate
    const aggregatePlayer = PlayerAdapter.toAggregate(player);
    this.players[player.getId()] = aggregatePlayer;
  }
}