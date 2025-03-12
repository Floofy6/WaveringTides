import { PlayerRepository } from '../../domain/repositories/PlayerRepository';
import { ItemRepository } from '../../domain/repositories/ItemRepository';
import { EnemyRepository } from '../../domain/repositories/EnemyRepository';

import { InMemoryPlayerRepository } from './inMemory/InMemoryPlayerRepository';
import { InMemoryItemRepository } from './inMemory/InMemoryItemRepository';
import { InMemoryEnemyRepository } from './inMemory/InMemoryEnemyRepository';
import { InMemoryShopRepository } from './inMemory/InMemoryShopRepository';

import { MongoPlayerRepository } from './mongo/MongoPlayerRepository';
import { MongoItemRepository } from './mongo/MongoItemRepository';
import { MongoEnemyRepository } from './mongo/MongoEnemyRepository';

// Repository factory to create the appropriate repositories based on environment
export class RepositoryFactory {
  private static useMongoDB = process.env.USE_MONGODB === 'true';

  static createPlayerRepository(): PlayerRepository {
    return this.useMongoDB 
      ? new MongoPlayerRepository() 
      : new InMemoryPlayerRepository();
  }

  static createItemRepository(): ItemRepository {
    return this.useMongoDB 
      ? new MongoItemRepository() 
      : new InMemoryItemRepository();
  }

  static createShopRepository(): ItemRepository {
    // For now, we'll stick with in-memory for the shop
    return new InMemoryShopRepository();
  }

  static createEnemyRepository(): EnemyRepository {
    return this.useMongoDB 
      ? new MongoEnemyRepository() 
      : new InMemoryEnemyRepository();
  }
}