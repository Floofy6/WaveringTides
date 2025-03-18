import { Item as ItemInterface } from '../../shared/types';
import { CraftingRecipe as CraftingRecipeClass } from './CraftingRecipe';
export declare class Item {
    private id;
    private name;
    private quantity;
    private type;
    private sellPrice?;
    private buyPrice?;
    private stats?;
    private slot?;
    private craftingRecipe?;
    constructor(id: string, name: string, type: 'resource' | 'equipment', quantity?: number, sellPrice?: number, buyPrice?: number, stats?: {
        attackBonus?: number;
        strengthBonus?: number;
        defenseBonus?: number;
    }, slot?: 'weapon' | 'armor', craftingRecipe?: CraftingRecipeClass);
    toInterface(): ItemInterface;
    getId(): string;
    getName(): string;
    getType(): 'resource' | 'equipment';
    getQuantity(): number;
    getSellPrice(): number | undefined;
    getBuyPrice(): number | undefined;
    getStats(): {
        attackBonus?: number;
        strengthBonus?: number;
        defenseBonus?: number;
    } | undefined;
    getSlot(): 'weapon' | 'armor' | undefined;
    getCraftingRecipe(): CraftingRecipeClass | undefined;
    setQuantity(quantity: number): void;
    setSellPrice(sellPrice: number): void;
    setBuyPrice(buyPrice: number): void;
    setStats(stats: {
        attackBonus?: number;
        strengthBonus?: number;
        defenseBonus?: number;
    }): void;
    setSlot(slot: 'weapon' | 'armor'): void;
    setCraftingRecipe(craftingRecipe: CraftingRecipeClass): void;
    /**
     * Increases the quantity of this item
     * @param amount Amount to increase by
     */
    increaseQuantity(amount?: number): void;
    /**
     * Decreases the quantity of this item
     * @param amount Amount to decrease by
     * @returns Whether the operation was successful
     */
    decreaseQuantity(amount?: number): boolean;
    /**
     * Check if this item is equippable
     */
    isEquippable(): boolean;
    /**
     * Check if this item can be sold
     */
    isSellable(): boolean;
    /**
     * Check if this item can be bought
     */
    isBuyable(): boolean;
    /**
     * Check if this item can be crafted
     */
    isCraftable(): boolean;
    /**
     * Calculate sell value for a given quantity
     */
    getSellValue(quantity?: number): number;
    /**
     * Calculate buy cost for a given quantity
     */
    getBuyCost(quantity?: number): number;
    /**
     * Clone this item with a new quantity
     */
    clone(newQuantity?: number): Item;
}
