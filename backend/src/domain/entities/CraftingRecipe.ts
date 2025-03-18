export interface CraftingRecipe {
  itemId: string;
  requirements: { [itemId: string]: number };
  skillId: string;
  level: number;
} 