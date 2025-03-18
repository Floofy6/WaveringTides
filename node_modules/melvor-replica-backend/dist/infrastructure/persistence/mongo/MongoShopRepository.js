"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoShopRepository = void 0;
const Item_1 = require("../../../domain/entities/Item");
const ItemSchema_1 = require("./schemas/ItemSchema");
class MongoShopRepository {
    async getById(itemId) {
        try {
            const itemDocument = await ItemSchema_1.ItemModel.findOne({
                id: itemId,
                buyPrice: { $exists: true, $ne: null }
            });
            if (!itemDocument)
                return undefined;
            return this.mapToDomain(itemDocument);
        }
        catch (error) {
            console.error('Error fetching shop item:', error);
            return undefined;
        }
    }
    async getAll() {
        try {
            // Only fetch items with a buyPrice (shop items)
            const itemDocuments = await ItemSchema_1.ItemModel.find({
                buyPrice: { $exists: true, $ne: null }
            });
            return itemDocuments.map(doc => this.mapToDomain(doc));
        }
        catch (error) {
            console.error('Error fetching shop items:', error);
            return [];
        }
    }
    async save(item) {
        try {
            // Only save items with a buyPrice to the shop
            if (!item.getBuyPrice()) {
                return; // Not a shop item
            }
            const itemData = this.mapToPersistence(item);
            await ItemSchema_1.ItemModel.findOneAndUpdate({ id: item.getId() }, itemData, { upsert: true, new: true });
        }
        catch (error) {
            console.error('Error saving shop item:', error);
            throw new Error(`Failed to save shop item: ${error}`);
        }
    }
    mapToDomain(itemDocument) {
        // Create a new Item entity from the document data
        const craftingRecipe = itemDocument.craftingRecipe
            ? {
                itemId: itemDocument.craftingRecipe.itemId,
                requirements: itemDocument.craftingRecipe.requirements,
                skillId: itemDocument.craftingRecipe.skillId,
                level: itemDocument.craftingRecipe.level
            }
            : undefined;
        const item = new Item_1.Item(itemDocument.id, itemDocument.name, itemDocument.type, itemDocument.quantity, itemDocument.sellPrice, itemDocument.buyPrice, itemDocument.stats, itemDocument.slot);
        // Set crafting recipe if it exists
        if (craftingRecipe) {
            item.setCraftingRecipe(craftingRecipe);
        }
        return item;
    }
    mapToPersistence(item) {
        // Convert the Item entity to a format for persistence
        const data = {
            id: item.getId(),
            name: item.getName(),
            quantity: item.getQuantity(),
            type: item.getType(),
            sellPrice: item.getSellPrice(),
            buyPrice: item.getBuyPrice(),
            stats: item.getStats(),
            slot: item.getSlot()
        };
        // Only add craftingRecipe if it exists
        const craftingRecipe = item.getCraftingRecipe();
        if (craftingRecipe) {
            Object.assign(data, {
                craftingRecipe: {
                    itemId: craftingRecipe.itemId,
                    requirements: craftingRecipe.requirements,
                    skillId: craftingRecipe.skillId,
                    level: craftingRecipe.level
                }
            });
        }
        return data;
    }
}
exports.MongoShopRepository = MongoShopRepository;
//# sourceMappingURL=MongoShopRepository.js.map