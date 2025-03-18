"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
class ShopService {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    // Helper method to create a properly typed item for player inventory
    createShopItemData(item, quantity) {
        return {
            id: item.getId(),
            name: item.getName(),
            quantity: quantity,
            type: item.getType(),
            sellPrice: item.getSellPrice(),
            buyPrice: item.getBuyPrice(),
            stats: item.getStats(),
            slot: item.getSlot(),
            craftingRecipe: item.getCraftingRecipe()
        };
    }
    async buyItem(player, itemId, quantity) {
        const shopItem = await this.itemRepository.getById(itemId);
        if (!shopItem) {
            throw new Error(`Item with ID ${itemId} not found in shop`);
        }
        const buyPrice = shopItem.getBuyPrice();
        if (!buyPrice) {
            throw new Error("Item is not buyable");
        }
        const totalPrice = buyPrice * quantity;
        if (player.gold < totalPrice) {
            throw new Error("Insufficient gold");
        }
        player.removeGold(totalPrice);
        const itemData = this.createShopItemData(shopItem, quantity);
        player.addItem(itemData);
    }
    async sellItem(player, itemId, quantity) {
        if (!player.hasItem(itemId, quantity)) {
            throw new Error("Not enough of item to sell");
        }
        const item = await this.itemRepository.getById(itemId);
        if (!item) {
            throw new Error("Item not found");
        }
        const sellPrice = item.getSellPrice();
        if (!sellPrice) {
            throw new Error("Item not sellable");
        }
        player.removeItem(itemId, quantity);
        player.addGold(sellPrice * quantity);
    }
}
exports.ShopService = ShopService;
//# sourceMappingURL=ShopService.js.map