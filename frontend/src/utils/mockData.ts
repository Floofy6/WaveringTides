import { Item, Skill, Mastery, Enemy } from '../types';
import { ITEMS, ITEM_IDS, SKILL_IDS, ENEMIES } from '../constants';

/**
 * Creates properly typed mock Item objects from constants
 */
export const createMockItems = (): { [id: string]: Item } => {
  const itemsWithProperType: { [id: string]: Item } = {};
  
  // Process each item from the constants
  Object.entries(ITEMS).forEach(([key, itemData]) => {
    // Create base item without optional properties
    const baseItemData: any = {
      id: itemData.id,
      name: itemData.name,
      quantity: itemData.quantity || 1,
      type: itemData.type === 'resource' ? 'resource' : 'equipment',
    };
    
    // Add optional properties only if they exist
    if (itemData.sellPrice !== undefined) {
      baseItemData.sellPrice = itemData.sellPrice;
    }
    
    if (itemData.buyPrice !== undefined) {
      baseItemData.buyPrice = itemData.buyPrice;
    }
    
    // Handle slot carefully
    if (itemData.slot === 'weapon' || itemData.slot === 'armor') {
      baseItemData.slot = itemData.slot;
    }
    
    // Add stats if they exist
    if (itemData.stats) {
      baseItemData.stats = {
        ...itemData.stats
      };
    }
    
    // Add crafting recipe if it exists - using type assertion to avoid TypeScript error
    if ((itemData as any).craftingRecipe) {
      baseItemData.craftingRecipe = (itemData as any).craftingRecipe;
    }
    
    // Cast to Item type
    itemsWithProperType[key] = baseItemData as Item;
  });
  
  return itemsWithProperType;
};

/**
 * Creates mock skill data with proper types
 */
export const createMockSkills = (): { [id: string]: Skill } => {
  return {
    [SKILL_IDS.WOODCUTTING]: {
      id: SKILL_IDS.WOODCUTTING,
      name: 'Woodcutting',
      level: 1,
      xp: 0,
      xpPerAction: 5,
      isActive: false,
      mastery: createMastery([
        { level: 5, description: 'Faster woodcutting speed' },
        { level: 10, description: 'Double logs chance (10%)' }
      ])
    },
    [SKILL_IDS.FISHING]: {
      id: SKILL_IDS.FISHING,
      name: 'Fishing',
      level: 1,
      xp: 0,
      xpPerAction: 7,
      isActive: false,
      mastery: createMastery([
        { level: 5, description: 'Better fish quality' },
        { level: 10, description: 'Double fish chance (10%)' }
      ])
    },
    [SKILL_IDS.MINING]: {
      id: SKILL_IDS.MINING,
      name: 'Mining',
      level: 1,
      xp: 0,
      xpPerAction: 6,
      isActive: false,
      mastery: createMastery([])
    }
  };
};

/**
 * Helper to create mastery objects
 */
interface MasteryUnlock {
  level: number;
  description: string;
}

const createMastery = (unlocks: MasteryUnlock[]): Mastery => {
  const unlocksMap: { [level: string]: string } = {};
  
  unlocks.forEach(unlock => {
    unlocksMap[unlock.level.toString()] = unlock.description;
  });
  
  return {
    level: 1,
    xp: 0,
    unlocks: unlocksMap
  };
};

/**
 * Create properly typed enemy objects
 */
export const createMockEnemies = (): { [id: string]: Enemy } => {
  const enemies: { [id: string]: Enemy } = {};
  
  Object.entries(ENEMIES).forEach(([key, enemyData]) => {
    enemies[key] = {
      id: enemyData.id,
      name: enemyData.name,
      attack: enemyData.attack,
      defense: enemyData.defense,
      health: enemyData.health,
      maxHealth: enemyData.maxHealth,
      attackSpeed: enemyData.attackSpeed || 2000,
      lootTable: enemyData.lootTable
    };
  });
  
  return enemies;
}; 