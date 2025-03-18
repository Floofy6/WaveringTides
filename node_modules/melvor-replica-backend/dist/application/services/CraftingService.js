"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CraftingService = void 0;
const Item_1 = require("../../domain/entities/Item");
class CraftingService {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    // Helper method to create a properly typed item
    createItem(item, quantity) {
        const newItem = new Item_1.Item(item.getId(), item.getName(), item.getType(), quantity, item.getSellPrice(), item.getBuyPrice(), item.getStats(), item.getSlot());
        // Set crafting recipe if it exists
        const craftingRecipe = item.getCraftingRecipe();
        if (craftingRecipe) {
            newItem.setCraftingRecipe(craftingRecipe);
        }
        return newItem;
    }
    async canCraft(player, itemId) {
        const item = await this.itemRepository.getById(itemId);
        if (!item)
            return false;
        const recipe = item.getCraftingRecipe();
        if (!recipe)
            return false;
        // Check skill level
        if (player.getSkillLevel(recipe.skillId) < recipe.level) {
            return false;
        }
        // Check resources
        for (const resourceId in recipe.requirements) {
            if (player.getItemQuantity(resourceId) < recipe.requirements[resourceId]) {
                return false;
            }
        }
        return true;
    }
    async craft(player, itemId) {
        const canCraft = await this.canCraft(player, itemId);
        if (!canCraft) {
            throw new Error(`Cannot craft item with ID ${itemId}`);
        }
        const itemTemplate = await this.itemRepository.getById(itemId);
        if (!itemTemplate) {
            throw new Error("Item template not found");
        }
        const recipe = itemTemplate.getCraftingRecipe();
        if (!recipe) {
            throw new Error("Crafting recipe not found");
        }
        // Remove resources
        for (const resourceId in recipe.requirements) {
            player.removeItem(resourceId, recipe.requirements[resourceId]);
        }
        // Add crafted item - convert domain entity to interface type expected by player
        const craftedItem = this.createItem(itemTemplate, 1);
        // Here we're creating a plain object that matches the ItemType interface
        // which is what the Player aggregate expects
        const craftedItemData = {
            id: craftedItem.getId(),
            name: craftedItem.getName(),
            quantity: craftedItem.getQuantity(),
            type: craftedItem.getType(),
            sellPrice: craftedItem.getSellPrice(),
            buyPrice: craftedItem.getBuyPrice(),
            stats: craftedItem.getStats(),
            slot: craftedItem.getSlot(),
            craftingRecipe: craftedItem.getCraftingRecipe()
        };
        player.addItem(craftedItemData);
        // Award XP
        player.addXpToSkill(recipe.skillId, recipe.level * 10);
    }
}
exports.CraftingService = CraftingService;
//# sourceMappingURL=CraftingService.js.map