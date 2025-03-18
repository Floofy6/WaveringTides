"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
// Instead of implementing the interface directly, we'll use composition
class Item {
    constructor(id, name, type, quantity = 1, sellPrice, buyPrice, stats, slot, craftingRecipe) {
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
    toInterface() {
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
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    getQuantity() {
        return this.quantity;
    }
    getSellPrice() {
        return this.sellPrice;
    }
    getBuyPrice() {
        return this.buyPrice;
    }
    getStats() {
        return this.stats;
    }
    getSlot() {
        return this.slot;
    }
    getCraftingRecipe() {
        return this.craftingRecipe;
    }
    setQuantity(quantity) {
        this.quantity = quantity;
    }
    setSellPrice(sellPrice) {
        this.sellPrice = sellPrice;
    }
    setBuyPrice(buyPrice) {
        this.buyPrice = buyPrice;
    }
    setStats(stats) {
        this.stats = stats;
    }
    setSlot(slot) {
        this.slot = slot;
    }
    setCraftingRecipe(craftingRecipe) {
        this.craftingRecipe = craftingRecipe;
    }
    /**
     * Increases the quantity of this item
     * @param amount Amount to increase by
     */
    increaseQuantity(amount = 1) {
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
    decreaseQuantity(amount = 1) {
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
    isEquippable() {
        return this.type === 'equipment' && !!this.slot;
    }
    /**
     * Check if this item can be sold
     */
    isSellable() {
        return !!this.sellPrice && this.sellPrice > 0;
    }
    /**
     * Check if this item can be bought
     */
    isBuyable() {
        return !!this.buyPrice && this.buyPrice > 0;
    }
    /**
     * Check if this item can be crafted
     */
    isCraftable() {
        return !!this.craftingRecipe;
    }
    /**
     * Calculate sell value for a given quantity
     */
    getSellValue(quantity = 1) {
        if (!this.sellPrice)
            return 0;
        return this.sellPrice * Math.min(quantity, this.quantity);
    }
    /**
     * Calculate buy cost for a given quantity
     */
    getBuyCost(quantity = 1) {
        if (!this.buyPrice)
            return 0;
        return this.buyPrice * quantity;
    }
    /**
     * Clone this item with a new quantity
     */
    clone(newQuantity) {
        return new Item(this.id, this.name, this.type, newQuantity !== null && newQuantity !== void 0 ? newQuantity : this.quantity, this.sellPrice, this.buyPrice, this.stats ? { ...this.stats } : undefined, this.slot, this.craftingRecipe ? { ...this.craftingRecipe } : undefined);
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map