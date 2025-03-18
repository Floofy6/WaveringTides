import { Player as EntityPlayer } from '../../domain/entities/Player';
import { Player as AggregatePlayer } from '../../domain/aggregates/player/Player';
/**
 * Adapter class to convert between different Player implementations
 * This helps resolve the type conflicts between domain entities and aggregates
 */
export declare class PlayerAdapter {
    /**
     * Convert an Entity Player to an Aggregate Player
     */
    static toAggregate(entityPlayer: EntityPlayer): AggregatePlayer;
    /**
     * Convert an Aggregate Player to an Entity Player
     */
    static toEntity(aggregatePlayer: AggregatePlayer): EntityPlayer;
}
