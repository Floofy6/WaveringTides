import mongoose from 'mongoose';

// Schema for Skill
const SkillSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, required: true, default: 1 },
  xp: { type: Number, required: true, default: 0 },
  xpPerAction: { type: Number, required: true },
  isActive: { type: Boolean, required: true, default: false }
});

// Schema for Item stats
const ItemStatsSchema = new mongoose.Schema({
  attackBonus: { type: Number },
  strengthBonus: { type: Number },
  defenseBonus: { type: Number }
});

// Schema for Item
const ItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, required: true, enum: ['resource', 'equipment'] },
  sellPrice: { type: Number },
  buyPrice: { type: Number },
  stats: { type: ItemStatsSchema },
  slot: { type: String, enum: ['weapon', 'armor'] },
  craftingRecipe: {
    type: {
      itemId: { type: String, required: true },
      requirements: { type: Map, of: Number },
      skillId: { type: String, required: true },
      level: { type: Number, required: true }
    }
  }
});

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

// Schema for Combat
const CombatSchema = new mongoose.Schema({
  isFighting: { type: Boolean, required: true, default: false },
  currentEnemy: { type: EnemySchema }
});

// Schema for Equipment
const EquipmentSchema = new mongoose.Schema({
  weapon: { type: ItemSchema },
  armor: { type: ItemSchema }
});

// Schema for Player
const PlayerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  gold: { type: Number, required: true, default: 0 },
  lastUpdate: { type: Number, required: true },
  skills: { type: Map, of: SkillSchema },
  inventory: { type: Map, of: ItemSchema },
  equipment: { type: EquipmentSchema, required: true },
  combat: { type: CombatSchema, required: true }
});

// Create the models
export const PlayerModel = mongoose.model('Player', PlayerSchema);
export const EnemyModel = mongoose.model('Enemy', EnemySchema);