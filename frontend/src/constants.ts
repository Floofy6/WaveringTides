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
    lootTable: [
      { itemId: ITEM_IDS.BRONZE_SWORD, quantity: 1, chance: 0.1 },
      { itemId: ITEM_IDS.LEATHER_ARMOR, quantity: 1, chance: 0.1 },
    ],
  },
};