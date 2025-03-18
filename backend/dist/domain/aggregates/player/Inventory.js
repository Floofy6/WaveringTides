"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
class Inventory {
    constructor() {
        this.items = {};
        this.items = {};
    }
    addItem(item) {
        const itemId = item.id;
        if (this.items[itemId]) {
            this.items[itemId].quantity += item.quantity;
        }
        else {
            this.items[itemId] = { ...item };
        }
    }
    removeItem(itemId, quantity) {
        if (this.items[itemId] && this.items[itemId].quantity >= quantity) {
            this.items[itemId].quantity -= quantity;
            if (this.items[itemId].quantity === 0) {
                delete this.items[itemId];
            }
        }
        else {
            throw new Error(`Cannot remove ${quantity} of item ${itemId}`);
        }
    }
    hasItem(itemId, quantity = 1) {
        return !!this.items[itemId] && this.items[itemId].quantity >= quantity;
    }
    getItemQuantity(itemId) {
        var _a;
        return ((_a = this.items[itemId]) === null || _a === void 0 ? void 0 : _a.quantity) || 0;
    }
    getItems() {
        return { ...this.items };
    }
}
exports.Inventory = Inventory;
//# sourceMappingURL=Inventory.js.map