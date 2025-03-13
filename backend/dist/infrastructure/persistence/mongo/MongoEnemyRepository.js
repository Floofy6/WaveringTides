"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoEnemyRepository = void 0;
const Enemy_1 = require("../../../domain/aggregates/enemy/Enemy");
const schemas_1 = require("./schemas");
const constants_1 = require("../../../shared/constants");
class MongoEnemyRepository {
    constructor() {
        // Initialize with predefined enemies if collection is empty
        this.initializeEnemies();
    }
    async initializeEnemies() {
        const count = await schemas_1.EnemyModel.countDocuments();
        if (count === 0) {
            // Collection is empty, add default enemies
            const enemies = Object.values(constants_1.ENEMIES);
            for (const enemyData of enemies) {
                const enemy = new Enemy_1.Enemy(enemyData.id, enemyData.name, enemyData.attack, enemyData.defense, enemyData.health, enemyData.lootTable);
                await schemas_1.EnemyModel.create({
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
    async getById(enemyId) {
        try {
            const enemyDocument = await schemas_1.EnemyModel.findOne({ id: enemyId });
            if (!enemyDocument) {
                return undefined;
            }
            return new Enemy_1.Enemy(enemyDocument.id, enemyDocument.name, enemyDocument.attack, enemyDocument.defense, enemyDocument.health, enemyDocument.lootTable);
        }
        catch (error) {
            console.error('Error fetching enemy from MongoDB:', error);
            return undefined;
        }
    }
    async getAll() {
        try {
            const enemyDocuments = await schemas_1.EnemyModel.find();
            return enemyDocuments.map(doc => new Enemy_1.Enemy(doc.id, doc.name, doc.attack, doc.defense, doc.health, doc.lootTable));
        }
        catch (error) {
            console.error('Error fetching all enemies from MongoDB:', error);
            return [];
        }
    }
}
exports.MongoEnemyRepository = MongoEnemyRepository;
//# sourceMappingURL=MongoEnemyRepository.js.map