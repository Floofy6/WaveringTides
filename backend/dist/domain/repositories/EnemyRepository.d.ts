import { Enemy } from '../aggregates/enemy/Enemy';
export interface EnemyRepository {
    getById(enemyId: string): Promise<Enemy | undefined>;
    getAll(): Promise<Enemy[]>;
}
