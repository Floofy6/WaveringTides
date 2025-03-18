"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const ItemSchema_1 = require("./schemas/ItemSchema");
const PlayerSchema_1 = require("./schemas/PlayerSchema");
const constants_1 = require("../../../shared/constants");
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wavering-tides')
    .then(() => console.log('Connected to MongoDB for seeding'))
    .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
async function seedItems() {
    try {
        // Clear existing items
        await ItemSchema_1.ItemModel.deleteMany({});
        console.log('Cleared existing items');
        // Insert new items
        const items = Object.values(constants_1.ITEMS).map(item => ({
            id: item.id,
            name: item.name,
            quantity: 1,
            type: item.type,
            sellPrice: item.sellPrice,
            buyPrice: item.buyPrice,
            stats: item.stats,
            slot: item.slot
        }));
        await ItemSchema_1.ItemModel.insertMany(items);
        console.log(`Seeded ${items.length} items`);
    }
    catch (error) {
        console.error('Error seeding items:', error);
    }
}
async function seedDefaultPlayer() {
    try {
        // Clear existing players
        await PlayerSchema_1.PlayerModel.deleteMany({});
        console.log('Cleared existing players');
        // Create default player
        const defaultPlayer = {
            id: 'player1',
            gold: 100,
            lastUpdate: Date.now(),
            skills: {
                [constants_1.SKILL_IDS.WOODCUTTING]: {
                    id: constants_1.SKILL_IDS.WOODCUTTING,
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
                [constants_1.SKILL_IDS.FISHING]: {
                    id: constants_1.SKILL_IDS.FISHING,
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
                [constants_1.SKILL_IDS.MINING]: {
                    id: constants_1.SKILL_IDS.MINING,
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
        await PlayerSchema_1.PlayerModel.create(defaultPlayer);
        console.log('Seeded default player');
    }
    catch (error) {
        console.error('Error seeding default player:', error);
    }
}
async function runSeed() {
    try {
        await seedItems();
        await seedDefaultPlayer();
        console.log('Seed completed successfully');
    }
    catch (error) {
        console.error('Error during seeding:', error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
}
// Run the seed function
runSeed();
//# sourceMappingURL=seed.js.map