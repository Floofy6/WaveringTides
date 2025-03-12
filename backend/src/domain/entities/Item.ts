import { Item as ItemInterface, CraftingRecipe } from '../../shared/types';

export class Item implements ItemInterface {
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

  constructor(
    id: string,
    name: string,
    type: 'resource' | 'equipment',
    quantity: number = 1,
    sellPrice?: number,
    buyPrice?: number,
    stats?: {
      attackBonus?: number;
      strengthBonus?: number;
      defenseBonus?: number;
    },
    slot?: 'weapon' | 'armor',
    craftingRecipe?: CraftingRecipe
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.quantity = quantity;
    this.sellPrice = sellPrice;
    this.buyPrice = buyPrice;
    this.stats = stats;
    this.slot = slot;
    this.craftingRecipe = craftingRecipe;
  }

  /**
   * Increases the quantity of this item
   * @param amount Amount to increase by
   */
  increaseQuantity(amount: number): void {
    if (amount < 0) {
      throw new Error('Amount must be positive');
    }
    this.quantity += amount;
  }

  /**
   * Decreases the quantity of this item
   * @param amount Amount to decrease by
   * @returns Whether the operation was successful
   */
  decreaseQuantity(amount: number): boolean {
    if (amount < 0) {
      throw new Error('Amount must be positive');
    }
    if (this.quantity < amount) {
      return false;
    }
    this.quantity -= amount;
    return true;
  }

  /**
   * Check if this item is equippable
   */
  isEquippable(): boolean {
    return this.type === 'equipment' && !!this.slot;
  }

  /**
   * Check if this item can be sold
   */
  isSellable(): boolean {
    return !!this.sellPrice && this.sellPrice > 0;
  }

  /**
   * Check if this item can be bought
   */
  isBuyable(): boolean {
    return !!this.buyPrice && this.buyPrice > 0;
  }

  /**
   * Check if this item can be crafted
   */
  isCraftable(): boolean {
    return !!this.craftingRecipe;
  }

  /**
   * Calculate sell value for a given quantity
   */
  getSellValue(quantity: number = 1): number {
    if (!this.sellPrice) return 0;
    return this.sellPrice * Math.min(quantity, this.quantity);
  }

  /**
   * Calculate buy cost for a given quantity
   */
  getBuyCost(quantity: number = 1): number {
    if (!this.buyPrice) return 0;
    return this.buyPrice * quantity;
  }

  /**
   * Clone this item with a new quantity
   */
  clone(newQuantity?: number): Item {
    return new Item(
      this.id,
      this.name,
      this.type,
      newQuantity ?? this.quantity,
      this.sellPrice,
      this.buyPrice,
      this.stats ? { ...this.stats } : undefined,
      this.slot,
      this.craftingRecipe ? { ...this.craftingRecipe } : undefined
    );
  }
}