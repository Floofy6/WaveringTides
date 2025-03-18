"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENEMIES = exports.ITEMS = exports.ENEMY_IDS = exports.SKILL_IDS = exports.ITEM_IDS = void 0;
exports.ITEM_IDS = {
    LOGS: 'logs',
    RAW_FISH: 'raw_fish',
    ORE: 'ore',
    BRONZE_BAR: 'bronze_bar',
    BRONZE_SWORD: 'bronze_sword',
    COOKED_FISH: 'cooked_fish',
    LEATHER_ARMOR: 'leather_armor',
};
exports.SKILL_IDS = {
    WOODCUTTING: 'woodcutting',
    FISHING: 'fishing',
    MINING: 'mining',
    FIREMAKING: 'firemaking',
    COOKING: 'cooking',
    SMITHING: 'smithing',
    ATTACK: 'attack',
    STRENGTH: 'strength',
    DEFENCE: 'defence',
    HITPOINTS: 'hitpoints',
};
exports.ENEMY_IDS = {
    GOBLIN: 'goblin',
    RAT: 'rat',
    BANDIT: 'bandit',
};
exports.ITEMS = {
    [exports.ITEM_IDS.LOGS]: {
        id: exports.ITEM_IDS.LOGS,
        name: 'Logs',
        type: 'resource',
        sellPrice: 2,
        quantity: 1
    },
    [exports.ITEM_IDS.RAW_FISH]: {
        id: exports.ITEM_IDS.RAW_FISH,
        name: 'Raw Fish',
        type: 'resource',
        sellPrice: 3,
        quantity: 1
    },
    [exports.ITEM_IDS.ORE]: {
        id: exports.ITEM_IDS.ORE,
        name: 'Ore',
        type: 'resource',
        sellPrice: 4,
        quantity: 1
    },
    [exports.ITEM_IDS.BRONZE_BAR]: {
        id: exports.ITEM_IDS.BRONZE_BAR,
        name: 'Bronze Bar',
        type: 'resource',
        sellPrice: 10,
        buyPrice: 15,
        quantity: 1
    },
    [exports.ITEM_IDS.BRONZE_SWORD]: {
        id: exports.ITEM_IDS.BRONZE_SWORD,
        name: 'Bronze Sword',
        type: 'equipment',
        slot: 'weapon',
        sellPrice: 20,
        buyPrice: 50,
        stats: {
            attackBonus: 5,
            strengthBonus: 3
        },
        quantity: 1
    },
    [exports.ITEM_IDS.COOKED_FISH]: {
        id: exports.ITEM_IDS.COOKED_FISH,
        name: 'Cooked Fish',
        type: 'resource',
        sellPrice: 5,
        buyPrice: 8,
        quantity: 1
    },
    [exports.ITEM_IDS.LEATHER_ARMOR]: {
        id: exports.ITEM_IDS.LEATHER_ARMOR,
        name: 'Leather Armor',
        type: 'equipment',
        slot: 'armor',
        sellPrice: 15,
        buyPrice: 40,
        stats: {
            defenseBonus: 5
        },
        quantity: 1
    }
};
exports.ENEMIES = {
    [exports.ENEMY_IDS.GOBLIN]: {
        id: exports.ENEMY_IDS.GOBLIN,
        name: 'Goblin',
        attack: 3,
        defense: 2,
        health: 10,
        maxHealth: 10,
        lootTable: [
            { itemId: exports.ITEM_IDS.LOGS, quantity: 1, chance: 0.5 },
            { itemId: exports.ITEM_IDS.BRONZE_BAR, quantity: 1, chance: 0.2 },
        ],
    },
    [exports.ENEMY_IDS.RAT]: {
        id: exports.ENEMY_IDS.RAT,
        name: 'Giant Rat',
        attack: 2,
        defense: 1,
        health: 5,
        maxHealth: 5,
        lootTable: [
            { itemId: exports.ITEM_IDS.RAW_FISH, quantity: 1, chance: 0.3 },
        ],
    },
    [exports.ENEMY_IDS.BANDIT]: {
        id: exports.ENEMY_IDS.BANDIT,
        name: 'Bandit',
        attack: 5,
        defense: 4,
        health: 15,
        maxHealth: 15,
        lootTable: [
            { itemId: exports.ITEM_IDS.BRONZE_SWORD, quantity: 1, chance: 0.1 },
            { itemId: exports.ITEM_IDS.LEATHER_ARMOR, quantity: 1, chance: 0.1 },
        ],
    },
};
//# sourceMappingURL=constants.js.map