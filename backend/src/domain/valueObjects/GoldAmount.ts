/**
 * GoldAmount value object represents an amount of gold currency in the game.
 * This provides type safety and domain meaning to what would otherwise be a primitive number.
 */
export type GoldAmount = number;

export class GoldAmountVO {
  private readonly value: GoldAmount;
  
  // Constants
  static readonly MAX_GOLD = 2147483647; // Max 32-bit integer

  constructor(amount: GoldAmount) {
    if (amount < 0) {
      throw new Error('Gold amount cannot be negative');
    }
    if (amount > GoldAmountVO.MAX_GOLD) {
      throw new Error(`Gold amount cannot exceed ${GoldAmountVO.MAX_GOLD}`);
    }
    this.value = Math.floor(amount); // Ensure gold is always a whole number
  }

  getValue(): GoldAmount {
    return this.value;
  }

  /**
   * Add gold and return a new GoldAmountVO
   */
  add(amount: GoldAmount): GoldAmountVO {
    return new GoldAmountVO(Math.min(this.value + amount, GoldAmountVO.MAX_GOLD));
  }

  /**
   * Subtract gold and return a new GoldAmountVO
   * Returns zero if the result would be negative
   */
  subtract(amount: GoldAmount): GoldAmountVO {
    return new GoldAmountVO(Math.max(0, this.value - amount));
  }

  /**
   * Checks if this gold amount is sufficient for a purchase
   */
  isEnoughFor(cost: GoldAmount): boolean {
    return this.value >= cost;
  }

  /**
   * Format the gold amount with thousands separators for display
   */
  formatted(): string {
    return this.value.toLocaleString();
  }
}