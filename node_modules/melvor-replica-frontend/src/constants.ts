export const ITEM_IDS = {
  LOGS: 'logs',
  RAW_FISH: 'raw_fish',
  ORE: 'ore',
  BRONZE_BAR: 'bronze_bar',
  BRONZE_SWORD: 'bronze_sword',
  COOKED_FISH: 'cooked_fish',
  LEATHER_ARMOR: 'leather_armor',
};

export const SKILL_IDS = {
  WOODCUTTING: 'woodcutting',
  FISHING: 'fishing',
  MINING: 'mining',
  FIREMAKING: 'firemaking',
  COOKING: 'cooking',
  SMITHING: 'smithing',
  CRAFTING: 'crafting',
  ATTACK: 'attack',
  STRENGTH: 'strength',
  DEFENCE: 'defence',
  HITPOINTS: 'hitpoints',
};

export const ENEMY_IDS = {
  GOBLIN: 'goblin',
  RAT: 'rat',
  BANDIT: 'bandit',
};

// These are simplified versions used on the frontend for display and demo purposes
export const ENEMIES = {
  [ENEMY_IDS.GOBLIN]: {
    id: ENEMY_IDS.GOBLIN,
    name: 'Goblin',
    attack: 3,
    defense: 2,
    health: 10,
    maxHealth: 10,
    attackSpeed: 2200, // Slightly slower than player base speed
    lootTable: [
      { itemId: ITEM_IDS.LOGS, quantity: 1, chance: 0.5 },
      { itemId: ITEM_IDS.BRONZE_BAR, quantity: 1, chance: 0.2 },
    ],
  },
  [ENEMY_IDS.RAT]: {
    id: ENEMY_IDS.RAT,
    name: 'Giant Rat',
    attack: 2,
    defense: 1,
    health: 5,
    maxHealth: 5,
    attackSpeed: 1800, // Faster attack but less damage
    lootTable: [
      { itemId: ITEM_IDS.RAW_FISH, quantity: 1, chance: 0.3 },
    ],
  },
  [ENEMY_IDS.BANDIT]: {
    id: ENEMY_IDS.BANDIT,
    name: 'Bandit',
    attack: 5,
    defense: 4,
    health: 15,
    maxHealth: 15,
    attackSpeed: 2500, // Slower but more powerful
    lootTable: [
      { itemId: ITEM_IDS.BRONZE_SWORD, quantity: 1, chance: 0.1 },
      { itemId: ITEM_IDS.LEATHER_ARMOR, quantity: 1, chance: 0.1 },
    ],
  },
};

export const ITEMS = {
  [ITEM_IDS.LOGS]: {
    id: ITEM_IDS.LOGS,
    name: 'Logs',
    type: 'resource',
    sellPrice: 2,
    quantity: 1
  },
  [ITEM_IDS.RAW_FISH]: {
    id: ITEM_IDS.RAW_FISH,
    name: 'Raw Fish',
    type: 'resource',
    sellPrice: 3,
    quantity: 1
  },
  [ITEM_IDS.ORE]: {
    id: ITEM_IDS.ORE,
    name: 'Ore',
    type: 'resource',
    sellPrice: 4,
    quantity: 1
  },
  [ITEM_IDS.BRONZE_BAR]: {
    id: ITEM_IDS.BRONZE_BAR,
    name: 'Bronze Bar',
    type: 'resource',
    sellPrice: 10,
    buyPrice: 15,
    quantity: 1
  },
  [ITEM_IDS.BRONZE_SWORD]: {
    id: ITEM_IDS.BRONZE_SWORD,
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
  [ITEM_IDS.COOKED_FISH]: {
    id: ITEM_IDS.COOKED_FISH,
    name: 'Cooked Fish',
    type: 'resource',
    sellPrice: 5,
    buyPrice: 8,
    quantity: 1
  },
  [ITEM_IDS.LEATHER_ARMOR]: {
    id: ITEM_IDS.LEATHER_ARMOR,
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