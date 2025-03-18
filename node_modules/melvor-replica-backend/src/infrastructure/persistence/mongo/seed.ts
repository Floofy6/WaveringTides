import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ItemModel } from './schemas/ItemSchema';
import { PlayerModel } from './schemas/PlayerSchema';
import { ITEMS, SKILL_IDS } from '../../../shared/constants';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wavering-tides')
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function seedItems() {
  try {
    // Clear existing items
    await ItemModel.deleteMany({});
    console.log('Cleared existing items');

    // Insert new items
    const items = Object.values(ITEMS).map(item => ({
      id: item.id,
      name: item.name,
      quantity: 1,
      type: item.type,
      sellPrice: item.sellPrice,
      buyPrice: item.buyPrice,
      stats: item.stats,
      slot: item.slot
    }));

    await ItemModel.insertMany(items);
    console.log(`Seeded ${items.length} items`);
  } catch (error) {
    console.error('Error seeding items:', error);
  }
}

async function seedDefaultPlayer() {
  try {
    // Clear existing players
    await PlayerModel.deleteMany({});
    console.log('Cleared existing players');

    // Create default player
    const defaultPlayer = {
      id: 'player1',
      gold: 100,
      lastUpdate: Date.now(),
      skills: {
        [SKILL_IDS.WOODCUTTING]: {
          id: SKILL_IDS.WOODCUTTING,
          name: 'Woodcutting',
          level: 1,
          xp: 0,
          xpPerAction: 5,
          isActive: false,
          mastery: {
            level: 1,
            xp: 0,
            unlocks: {
              5: 'Faster woodcutting speed',
              10: 'Double logs chance (10%)'
            }
          }
        },
        [SKILL_IDS.FISHING]: {
          id: SKILL_IDS.FISHING,
          name: 'Fishing',
          level: 1,
          xp: 0,
          xpPerAction: 7,
          isActive: false,
          mastery: {
            level: 1,
            xp: 0,
            unlocks: {
              5: 'Better fish quality',
              10: 'Double fish chance (10%)'
            }
          }
        },
        [SKILL_IDS.MINING]: {
          id: SKILL_IDS.MINING,
          name: 'Mining',
          level: 1,
          xp: 0,
          xpPerAction: 6,
          isActive: false,
          mastery: {
            level: 1,
            xp: 0,
            unlocks: {}
          }
        }
      },
      inventory: {},
      equipment: {},
      combat: {
        isFighting: false
      }
    };

    await PlayerModel.create(defaultPlayer);
    console.log('Seeded default player');
  } catch (error) {
    console.error('Error seeding default player:', error);
  }
}

async function runSeed() {
  try {
    await seedItems();
    await seedDefaultPlayer();
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
runSeed(); 