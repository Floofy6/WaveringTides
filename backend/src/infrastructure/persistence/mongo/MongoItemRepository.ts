import { ItemRepository } from '../../../domain/repositories/ItemRepository';
import { Item } from '../../../domain/entities/Item';
import { ItemModel } from './schemas/ItemSchema';
import { ITEMS } from '../../../shared/constants';

export class MongoItemRepository implements ItemRepository {
  constructor() {
    // Initialize with predefined items if collection is empty
    this.initializeItems();
  }

  private async initializeItems(): Promise<void> {
    try {
      const count = await ItemModel.countDocuments();
      if (count === 0) {
        // Collection is empty, add default items
        const itemsToInsert = Object.entries(ITEMS).map(([_, itemData]) => ({
          id: itemData.id,
          name: itemData.name,
          type: itemData.type,
          quantity: itemData.quantity,
          sellPrice: itemData.sellPrice,
          buyPrice: itemData.buyPrice,
          stats: itemData.stats,
          slot: itemData.slot
        }));
        
        await ItemModel.insertMany(itemsToInsert);
        console.log('Initialized items in MongoDB');
      }
    } catch (error) {
      console.error('Error initializing items in MongoDB:', error);
    }
  }

  async getById(itemId: string): Promise<Item | undefined> {
    try {
      const itemDocument = await ItemModel.findOne({ id: itemId });
      if (!itemDocument) return undefined;
      
      return this.mapToDomain(itemDocument);
    } catch (error) {
      console.error('Error fetching item:', error);
      return undefined;
    }
  }

  async getAll(): Promise<Item[]> {
    try {
      const itemDocuments = await ItemModel.find();
      return itemDocuments.map(doc => this.mapToDomain(doc));
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  }

  async save(item: Item): Promise<void> {
    try {
      const itemData = this.mapToPersistence(item);
      
      await ItemModel.findOneAndUpdate(
        { id: item.getId() },
        itemData,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error saving item:', error);
      throw new Error(`Failed to save item: ${error}`);
    }
  }
  
  private mapToDomain(itemDocument: any): Item {
    // Create a new Item entity from the document data
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