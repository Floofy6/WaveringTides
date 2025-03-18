"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryItemRepository = void 0;
const Item_1 = require("../../../domain/entities/Item");
const constants_1 = require("../../../shared/constants");
class InMemoryItemRepository {
    constructor() {
        // Convert constant items to Item entities
        this.items = {};
        // Initialize with predefined items
        Object.entries(constants_1.ITEMS).forEach(([id, itemData]) => {
            this.items[id] = new Item_1.Item(itemData.id, itemData.name, itemData.type, itemData.quantity, itemData.sellPrice, itemData.buyPrice, itemData.stats, itemData.slot);
        });
    }
    async getById(itemId) {
        return this.items[itemId];
    }
    async getAll() {
        return Object.values(this.items);
    }
    async save(item) {
        this.items[item.getId()] = item;
    }
}
exports.InMemoryItemRepository = InMemoryItemRepository;
//# sourceMappingURL=InMemoryItemRepository.js.map