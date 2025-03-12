import { EnemyRepository } from '../../../domain/repositories/EnemyRepository';
import { Enemy } from '../../../domain/aggregates/enemy/Enemy';
import { ENEMIES } from '../../../shared/constants';

export class InMemoryEnemyRepository implements EnemyRepository {
  private enemies: { [id: string]: Enemy } = {};

  constructor() {
    // Initialize with predefined enemies
    Object.values(ENEMIES).forEach(enemyData => {
      const enemy = new Enemy(
        enemyData.id,
        enemyData.name,
        enemyData.attack,
        enemyData.defense,
        enemyData.health,
        enemyData.lootTable
      );
      this.enemies[enemy.id] = enemy;
    });
  }

  async getById(enemyId: string): Promise<Enemy | undefined> {
    return this.enemies[enemyId];
  }

  async getAll(): Promise<Enemy[]> {
    return Object.values(this.enemies);
  }
}