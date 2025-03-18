/**
 * GoldAmount value object represents an amount of gold currency in the game.
 * This provides type safety and domain meaning to what would otherwise be a primitive number.
 */
export type GoldAmount = number;
export declare class GoldAmountVO {
    private readonly value;
    static readonly MAX_GOLD = 2147483647;
    constructor(amount: GoldAmount);
    getValue(): GoldAmount;
    /**
     * Add gold and return a new GoldAmountVO
     */
    add(amount: GoldAmount): GoldAmountVO;
    /**
     * Subtract gold and return a new GoldAmountVO
     * Returns zero if the result would be negative
     */
    subtract(amount: GoldAmount): GoldAmountVO;
    /**
     * Checks if this gold amount is sufficient for a purchase
     */
    isEnoughFor(cost: GoldAmount): boolean;
    /**
     * Format the gold amount with thousands separators for display
     */
    formatted(): string;
}
