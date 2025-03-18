export interface Player {
  id: string;
  gold: number;
  lastUpdate: number;
  skills: { [skillId: string]: Skill };
  inventory: { [itemId: string]: Item };
  equipment: {
    weapon?: Item;
    armor?: Item;
  };
  combat: {
    currentEnemy?: Enemy;
    isFighting: boolean;
  };
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpPerAction: number;
  isActive: boolean;
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  type: 'resource' | 'equipment';
  sellPrice?: number;
  buyPrice?: number;
  stats?: {
    attackBonus?: number;
    strengthBonus?: number;
    defenseBonus?: number;
  };
  slot?: 'weapon' | 'armor';
  craftingRecipe?: CraftingRecipe;
}

export interface Enemy {
  id: string;
  name: string;
  attack: number;
  defense: number;
  health: number;
  maxHealth: number;
  lootTable: LootTableEntry[];
}

export interface LootTableEntry {
  itemId: string;
  quantity: number;
  chance: number;
}

export interface CraftingRecipe {
  itemId: string;
  requirements: { [itemId: string]: number };
  skillId: string;
  level: number;
}

export type GoldAmount = number;
export type Level = number;
export type Experience = number;

export interface GameState {
  player: Player;
}