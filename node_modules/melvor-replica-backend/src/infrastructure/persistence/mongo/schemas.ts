import mongoose from 'mongoose';
import { PlayerModel } from './schemas/PlayerSchema';

// Schema for LootTableEntry
const LootTableEntrySchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  quantity: { type: Number, required: true },
  chance: { type: Number, required: true }
});

// Schema for Enemy
const EnemySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  attack: { type: Number, required: true },
  defense: { type: Number, required: true },
  health: { type: Number, required: true },
  maxHealth: { type: Number, required: true },
  lootTable: [LootTableEntrySchema]
});

// Create the Enemy model
export const EnemyModel = mongoose.model('Enemy', EnemySchema);
// Re-export the PlayerModel
export { PlayerModel };