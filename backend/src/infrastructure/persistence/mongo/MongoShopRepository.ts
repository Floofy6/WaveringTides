import { ItemRepository } from '../../../domain/repositories/ItemRepository';
import { Item } from '../../../domain/entities/Item';
import { ItemModel } from './schemas/ItemSchema';

export class MongoShopRepository implements ItemRepository {
  async getById(itemId: string): Promise<Item | undefined> {
    try {
      const itemDocument = await ItemModel.findOne({ 
        id: itemId,
        buyPrice: { $exists: true, $ne: null }
      });
      
      if (!itemDocument) return undefined;
      
      return this.mapToDomain(itemDocument);
    } catch (error) {
      console.error('Error fetching shop item:', error);
      return undefined;
    }
  }

  async getAll(): Promise<Item[]> {
    try {
      // Only fetch items with a buyPrice (shop items)
      const itemDocuments = await ItemModel.find({
        buyPrice: { $exists: true, $ne: null }
      });
      
      return itemDocuments.map(doc => this.mapToDomain(doc));
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  async save(item: Item): Promise<void> {
    try {
      // Only save items with a buyPrice to the shop
      if (!item.getBuyPrice()) {
        return; // Not a shop item
      }
      
      const itemData = this.mapToPersistence(item);
      
      await ItemModel.findOneAndUpdate(
        { id: item.getId() },
        itemData,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error saving shop item:', error);
      throw new Error(`Failed to save shop item: ${error}`);
    }
  }
  
  private mapToDomain(itemDocument: any): Item {
    // Create a new Item entity from the document data
    const craftingRecipe = itemDocument.craftingRecipe 
      ? {
          itemId: itemDocument.craftingRecipe.itemId,
          requirements: itemDocument.craftingRecipe.requirements,
          skillId: itemDocument.craftingRecipe.skillId,
          level: itemDocument.craftingRecipe.level
        }
      : undefined;
    
    const item = new Item(
      itemDocument.id,
      itemDocument.name,
      itemDocument.type as 'resource' | 'equipment',
      itemDocument.quantity,
      itemDocument.sellPrice,
      itemDocument.buyPrice,
      itemDocument.stats,
      itemDocument.slot as 'weapon' | 'armor' | undefined
    );
    
    // Set crafting recipe if it exists
    if (craftingRecipe) {
      item.setCraftingRecipe(craftingRecipe);
    }
    
    return item;
  }
  
  private mapToPersistence(item: Item): any {
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