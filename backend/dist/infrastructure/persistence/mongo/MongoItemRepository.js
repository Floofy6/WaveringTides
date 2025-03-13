"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoItemRepository = void 0;
const Item_1 = require("../../../domain/entities/Item");
const ItemSchema_1 = require("./schemas/ItemSchema");
const constants_1 = require("../../../shared/constants");
class MongoItemRepository {
    constructor() {
        // Initialize with predefined items if collection is empty
        this.initializeItems();
    }
    async initializeItems() {
        try {
            const count = await ItemSchema_1.ItemModel.countDocuments();
            if (count === 0) {
                // Collection is empty, add default items
                const itemsToInsert = Object.entries(constants_1.ITEMS).map(([_, itemData]) => ({
                    id: itemData.id,
                    name: itemData.name,
                    type: itemData.type,
                    quantity: itemData.quantity,
                    sellPrice: itemData.sellPrice,
                    buyPrice: itemData.buyPrice,
                    stats: itemData.stats,
                    slot: itemData.slot
                }));
                await ItemSchema_1.ItemModel.insertMany(itemsToInsert);
                console.log('Initialized items in MongoDB');
            }
        }
        catch (error) {
            console.error('Error initializing items in MongoDB:', error);
        }
    }
    async getById(itemId) {
        try {
            const itemDocument = await ItemSchema_1.ItemModel.findOne({ id: itemId });
            if (!itemDocument)
                return undefined;
            return this.mapToDomain(itemDocument);
        }
        catch (error) {
            console.error('Error fetching item:', error);
            return undefined;
        }
    }
    async getAll() {
        try {
            const itemDocuments = await ItemSchema_1.ItemModel.find();
            return itemDocuments.map(doc => this.mapToDomain(doc));
        }
        catch (error) {
            console.error('Error fetching items:', error);
            return [];
        }
    }
    async save(item) {
        try {
            const itemData = this.mapToPersistence(item);
            await ItemSchema_1.ItemModel.findOneAndUpdate({ id: item.getId() }, itemData, { upsert: true, new: true });
        }
        catch (error) {
            console.error('Error saving item:', error);
            throw new Error(`Failed to save item: ${error}`);
        }
    }
    mapToDomain(itemDocument) {
        // Create a new Item entity from the document data
        const item = new Item_1.Item(itemDocument.id, itemDocument.name, itemDocument.type, itemDocument.quantity, itemDocument.sellPrice, itemDocument.buyPrice, itemDocument.stats, itemDocument.slot);
        // Handle crafting recipe separately
        if (itemDocument.craftingRecipe) {
            item.setCraftingRecipe({
                itemId: itemDocument.craftingRecipe.itemId,
                requirements: itemDocument.craftingRecipe.requirements,
                skillId: itemDocument.craftingRecipe.skillId,
                level: itemDocument.craftingRecipe.level
            });
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
exports.MongoItemRepository = MongoItemRepository;
//# sourceMappingURL=MongoItemRepository.js.map