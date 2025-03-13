"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoldAmountVO = void 0;
class GoldAmountVO {
    constructor(amount) {
        if (amount < 0) {
            throw new Error('Gold amount cannot be negative');
        }
        if (amount > GoldAmountVO.MAX_GOLD) {
            throw new Error(`Gold amount cannot exceed ${GoldAmountVO.MAX_GOLD}`);
        }
        this.value = Math.floor(amount); // Ensure gold is always a whole number
    }
    getValue() {
        return this.value;
    }
    /**
     * Add gold and return a new GoldAmountVO
     */
    add(amount) {
        return new GoldAmountVO(Math.min(this.value + amount, GoldAmountVO.MAX_GOLD));
    }
    /**
     * Subtract gold and return a new GoldAmountVO
     * Returns zero if the result would be negative
     */
    subtract(amount) {
        return new GoldAmountVO(Math.max(0, this.value - amount));
    }
    /**
     * Checks if this gold amount is sufficient for a purchase
     */
    isEnoughFor(cost) {
        return this.value >= cost;
    }
    /**
     * Format the gold amount with thousands separators for display
     */
    formatted() {
        return this.value.toLocaleString();
    }
}
exports.GoldAmountVO = GoldAmountVO;
// Constants
GoldAmountVO.MAX_GOLD = 2147483647; // Max 32-bit integer
//# sourceMappingURL=GoldAmount.js.map