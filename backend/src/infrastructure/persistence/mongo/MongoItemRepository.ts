import { ItemRepository } from '../../../domain/repositories/ItemRepository';
import { Item } from '../../../shared/types';
import { ITEMS } from '../../../shared/constants';
import mongoose from 'mongoose';

// Create a schema for items
const ItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['resource', 'equipment'] },
  sellPrice: { type: Number },
  buyPrice: { type: Number },
  stats: {
    attackBonus: { type: Number },
    strengthBonus: { type: Number },
    defenseBonus: { type: Number }
  },
  slot: { type: String, enum: ['weapon', 'armor'] },
  craftingRecipe: {
    itemId: { type: String },
    requirements: { type: Map, of: Number },
    skillId: { type: String },
    level: { type: Number }
  }
});

// Create the Item model
const ItemModel = mongoose.model('Item', ItemSchema);

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
        const items = Object.values(ITEMS);
        await ItemModel.insertMany(items);
        console.log('Initialized items in MongoDB');
      }
    } catch (error) {
      console.error('Error initializing items in MongoDB:', error);
    }
  }

  async getById(itemId: string): Promise<Item | undefined> {
    try {
      const itemDocument = await ItemModel.findOne({ id: itemId });
      
      if (!itemDocument) {
        return undefined;
      }
      
      return {
        id: itemDocument.id,
        name: itemDocument.name,
        quantity: 1, // Default quantity
        type: itemDocument.type as 'resource' | 'equipment',
        sellPrice: itemDocument.sellPrice,
        buyPrice: itemDocument.buyPrice,
        stats: itemDocument.stats,
        slot: itemDocument.slot as 'weapon' | 'armor' | undefined,
        craftingRecipe: itemDocument.craftingRecipe
      };
    } catch (error) {
      console.error('Error fetching item from MongoDB:', error);
      return undefined;
    }
  }

  async getAll(): Promise<Item[]> {
    try {
      const itemDocuments = await ItemModel.find();
      
      return itemDocuments.map(doc => ({
        id: doc.id,
        name: doc.name,
        quantity: 1, // Default quantity
        type: doc.type as 'resource' | 'equipment',
        sellPrice: doc.sellPrice,
        buyPrice: doc.buyPrice,
        stats: doc.stats,
        slot: doc.slot as 'weapon' | 'armor' | undefined,
        craftingRecipe: doc.craftingRecipe
      }));
    } catch (error) {
      console.error('Error fetching all items from MongoDB:', error);
      return [];
    }
  }
}