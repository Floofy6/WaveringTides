import { Enemy } from '../../../domain/aggregates/enemy/Enemy';
import { EnemyRepository } from '../../../domain/repositories/EnemyRepository';
import { EnemyModel } from './schemas';
import { ENEMIES } from '../../../shared/constants';

export class MongoEnemyRepository implements EnemyRepository {
  constructor() {
    // Initialize with predefined enemies if collection is empty
    this.initializeEnemies();
  }

  private async initializeEnemies(): Promise<void> {
    const count = await EnemyModel.countDocuments();
    if (count === 0) {
      // Collection is empty, add default enemies
      const enemies = Object.values(ENEMIES);
      for (const enemyData of enemies) {
        const enemy = new Enemy(
          enemyData.id,
          enemyData.name,
          enemyData.attack,
          enemyData.defense,
          enemyData.health,
          enemyData.lootTable
        );
        
        await EnemyModel.create({
          id: enemy.id,
          name: enemy.name,
          attack: enemy.attack,
          defense: enemy.defense,
          health: enemy.health,
          maxHealth: enemy.maxHealth,
          lootTable: enemy.lootTable
        });
      }
      console.log('Initialized enemies in MongoDB');
    }
  }

  async getById(enemyId: string): Promise<Enemy | undefined> {
    try {
      const enemyDocument = await EnemyModel.findOne({ id: enemyId });
      
      if (!enemyDocument) {
        return undefined;
      }
      
      return new Enemy(
        enemyDocument.id,
        enemyDocument.name,
        enemyDocument.attack,
        enemyDocument.defense,
        enemyDocument.health,
        enemyDocument.lootTable
      );
    } catch (error) {
      console.error('Error fetching enemy from MongoDB:', error);
      return undefined;
    }
  }

  async getAll(): Promise<Enemy[]> {
    try {
      const enemyDocuments = await EnemyModel.find();
      
      return enemyDocuments.map(doc => 
        new Enemy(
          doc.id,
          doc.name,
          doc.attack,
          doc.defense,
          doc.health,
          doc.lootTable
        )
      );
    } catch (error) {
      console.error('Error fetching all enemies from MongoDB:', error);
      return [];
    }
  }
}