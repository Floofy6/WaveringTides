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

export interface Mastery {
  level: number;
  xp: number;
  unlocks: { [level: string]: string };
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  totalXp?: number;
  xpPerAction: number;
  isActive: boolean;
  actionProgress?: number;
  lastActiveTime?: number;
  mastery?: Mastery;
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
  attackSpeed: number;
  lootTable: LootTableEntry[];
}

export interface LootTableEntry {
  itemId: string;
  quantity: number;
  chance: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  ingredients: { [itemId: string]: number };
  output: {
    id: string;
    name: string;
    quantity: number;
  };
  skillId: string;
  requiredLevel: number;
  xpReward?: number;
}

export interface GameState {
  player: Player;
}