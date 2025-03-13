import { Item as ItemInterface } from '../../shared/types';
import { CraftingRecipe as CraftingRecipeClass } from './CraftingRecipe';

// Instead of implementing the interface directly, we'll use composition
export class Item {
  private id: string;
  private name: string;
  private quantity: number;
  private type: 'resource' | 'equipment';
  private sellPrice?: number;
  private buyPrice?: number;
  private stats?: {
    attackBonus?: number;
    strengthBonus?: number;
    defenseBonus?: number;
  };
  private slot?: 'weapon' | 'armor';
  private craftingRecipe?: CraftingRecipeClass;

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
    craftingRecipe?: CraftingRecipeClass
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

  // Convert to an object that implements ItemInterface
  public toInterface(): ItemInterface {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      type: this.type,
      sellPrice: this.sellPrice,
      buyPrice: this.buyPrice,
      stats: this.stats,
      slot: this.slot,
      craftingRecipe: this.craftingRecipe
    };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getType(): 'resource' | 'equipment' {
    return this.type;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getSellPrice(): number | undefined {
    return this.sellPrice;
  }

  public getBuyPrice(): number | undefined {
    return this.buyPrice;
  }

  public getStats(): { attackBonus?: number; strengthBonus?: number; defenseBonus?: number; } | undefined {
    return this.stats;
  }

  public getSlot(): 'weapon' | 'armor' | undefined {
    return this.slot;
  }

  public getCraftingRecipe(): CraftingRecipeClass | undefined {
    return this.craftingRecipe;
  }

  public setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  public setSellPrice(sellPrice: number): void {
    this.sellPrice = sellPrice;
  }

  public setBuyPrice(buyPrice: number): void {
    this.buyPrice = buyPrice;
  }

  public setStats(stats: { attackBonus?: number; strengthBonus?: number; defenseBonus?: number; }): void {
    this.stats = stats;
  }

  public setSlot(slot: 'weapon' | 'armor'): void {
    this.slot = slot;
  }

  public setCraftingRecipe(craftingRecipe: CraftingRecipeClass): void {
    this.craftingRecipe = craftingRecipe;
  }

  /**
   * Increases the quantity of this item
   * @param amount Amount to increase by
   */
  public increaseQuantity(amount: number = 1): void {
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
  public decreaseQuantity(amount: number = 1): boolean {
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
  public isEquippable(): boolean {
    return this.type === 'equipment' && !!this.slot;
  }

  /**
   * Check if this item can be sold
   */
  public isSellable(): boolean {
    return !!this.sellPrice && this.sellPrice > 0;
  }

  /**
   * Check if this item can be bought
   */
  public isBuyable(): boolean {
    return !!this.buyPrice && this.buyPrice > 0;
  }

  /**
   * Check if this item can be crafted
   */
  public isCraftable(): boolean {
    return !!this.craftingRecipe;
  }

  /**
   * Calculate sell value for a given quantity
   */
  public getSellValue(quantity: number = 1): number {
    if (!this.sellPrice) return 0;
    return this.sellPrice * Math.min(quantity, this.quantity);
  }

  /**
   * Calculate buy cost for a given quantity
   */
  public getBuyCost(quantity: number = 1): number {
    if (!this.buyPrice) return 0;
    return this.buyPrice * quantity;
  }

  /**
   * Clone this item with a new quantity
   */
  public clone(newQuantity?: number): Item {
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