"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryShopRepository = void 0;
const Item_1 = require("../../../domain/entities/Item");
const constants_1 = require("../../../shared/constants");
class InMemoryShopRepository {
    constructor() {
        this.shopItems = {};
        // Only add items with buyPrice to the shop
        Object.entries(constants_1.ITEMS).forEach(([id, itemData]) => {
            if (itemData.buyPrice) {
                this.shopItems[id] = new Item_1.Item(itemData.id, itemData.name, itemData.type, itemData.quantity, itemData.sellPrice, itemData.buyPrice, itemData.stats, itemData.slot);
            }
        });
    }
    async getById(itemId) {
        return this.shopItems[itemId];
    }
    async getAll() {
        return Object.values(this.shopItems);
    }
    async save(item) {
        // Only save items with buyPrice to the shop
        if (item.getBuyPrice()) {
            this.shopItems[item.getId()] = item;
        }
    }
}
exports.InMemoryShopRepository = InMemoryShopRepository;
//# sourceMappingURL=InMemoryShopRepository.js.map