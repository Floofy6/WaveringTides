"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryFactory = void 0;
const InMemoryPlayerRepository_1 = require("./inMemory/InMemoryPlayerRepository");
const InMemoryItemRepository_1 = require("./inMemory/InMemoryItemRepository");
const InMemoryEnemyRepository_1 = require("./inMemory/InMemoryEnemyRepository");
const InMemoryShopRepository_1 = require("./inMemory/InMemoryShopRepository");
const MongoPlayerRepository_1 = require("./mongo/MongoPlayerRepository");
const MongoItemRepository_1 = require("./mongo/MongoItemRepository");
const MongoEnemyRepository_1 = require("./mongo/MongoEnemyRepository");
// Repository factory to create the appropriate repositories based on environment
class RepositoryFactory {
    static createPlayerRepository() {
        return this.useMongoDB
            ? new MongoPlayerRepository_1.MongoPlayerRepository()
            : new InMemoryPlayerRepository_1.InMemoryPlayerRepository();
    }
    static createItemRepository() {
        return this.useMongoDB
            ? new MongoItemRepository_1.MongoItemRepository()
            : new InMemoryItemRepository_1.InMemoryItemRepository();
    }
    static createShopRepository() {
        // For now, we'll stick with in-memory for the shop
        return new InMemoryShopRepository_1.InMemoryShopRepository();
    }
    static createEnemyRepository() {
        return this.useMongoDB
            ? new MongoEnemyRepository_1.MongoEnemyRepository()
            : new InMemoryEnemyRepository_1.InMemoryEnemyRepository();
    }
}
exports.RepositoryFactory = RepositoryFactory;
RepositoryFactory.useMongoDB = process.env.USE_MONGODB === 'true';
//# sourceMappingURL=RepositoryFactory.js.map