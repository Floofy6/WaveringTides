import { Enemy } from '../../../domain/aggregates/enemy/Enemy';
import { EnemyRepository } from '../../../domain/repositories/EnemyRepository';
export declare class MongoEnemyRepository implements EnemyRepository {
    constructor();
    private initializeEnemies;
    getById(enemyId: string): Promise<Enemy | undefined>;
    getAll(): Promise<Enemy[]>;
}
