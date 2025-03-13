import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
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

export const ItemModel = mongoose.model('Item', ItemSchema); 