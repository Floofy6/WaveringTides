"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEnemyRepository = void 0;
const Enemy_1 = require("../../../domain/aggregates/enemy/Enemy");
const constants_1 = require("../../../shared/constants");
class InMemoryEnemyRepository {
    constructor() {
        this.enemies = {};
        // Initialize with predefined enemies
        Object.values(constants_1.ENEMIES).forEach(enemyData => {
            const enemy = new Enemy_1.Enemy(enemyData.id, enemyData.name, enemyData.attack, enemyData.defense, enemyData.health, enemyData.lootTable);
            this.enemies[enemy.id] = enemy;
        });
    }
    async getById(enemyId) {
        return this.enemies[enemyId];
    }
    async getAll() {
        return Object.values(this.enemies);
    }
}
exports.InMemoryEnemyRepository = InMemoryEnemyRepository;
//# sourceMappingURL=InMemoryEnemyRepository.js.map