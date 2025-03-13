import { EnemyRepository } from '../../../domain/repositories/EnemyRepository';
import { Enemy } from '../../../domain/aggregates/enemy/Enemy';
export declare class InMemoryEnemyRepository implements EnemyRepository {
    private enemies;
    constructor();
    getById(enemyId: string): Promise<Enemy | undefined>;
    getAll(): Promise<Enemy[]>;
}
