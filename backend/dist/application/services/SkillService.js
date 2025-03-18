"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillService = void 0;
const constants_1 = require("../../shared/constants");
class SkillService {
    constructor() { }
    // Helper method to create properly typed items
    createTypedItem(templateId, quantity) {
        const template = constants_1.ITEMS[templateId];
        return {
            id: template.id,
            name: template.name,
            quantity: quantity,
            type: template.type,
            sellPrice: template.sellPrice,
            buyPrice: template.buyPrice,
            stats: template.stats,
            slot: template.slot
        };
    }
    // Helper to check if a skill has mastery features
    hasMasteryFeatures(skill) {
        return 'mastery' in skill &&
            'addMasteryXp' in skill &&
            'getMasteryBonus' in skill &&
            'hasMasteryChance' in skill;
    }
    calculateXpGain(skill, elapsedTime) {
        return skill.xpPerAction * (Math.max(1, skill.level) / 10 + 1) * (elapsedTime / 1000);
    }
    applyXp(skill, xp) {
        skill.xp += xp;
    }
    applySkillAction(skill, player, elapsedTime) {
        const xpGained = this.calculateXpGain(skill, elapsedTime);
        this.applyXp(skill, xpGained);
        // Handle mastery if the skill has these features
        if (this.hasMasteryFeatures(skill)) {
            const masteryXpGained = xpGained * 0.1;
            skill.addMasteryXp(masteryXpGained);
        }
        switch (skill.id) {
            case constants_1.SKILL_IDS.WOODCUTTING:
                this.applyWoodcutting(player, elapsedTime, skill);
                break;
            case constants_1.SKILL_IDS.FISHING:
                this.applyFishing(player, elapsedTime, skill);
                break;
            case constants_1.SKILL_IDS.MINING:
                this.applyMining(player, elapsedTime, skill);
                break;
        }
    }
    applyWoodcutting(player, elapsedTime, skill) {
        // Default multipliers
        let resourceMultiplier = 1.0;
        let speedMultiplier = 1.0;
        // Apply mastery bonuses if available
        if (this.hasMasteryFeatures(skill)) {
            resourceMultiplier = skill.getMasteryBonus('resourceMultiplier');
            speedMultiplier = skill.getMasteryBonus('speedMultiplier');
        }
        const baseTime = 3000 / speedMultiplier;
        const baseQuantity = Math.floor(elapsedTime / baseTime) * (1 + Math.floor(player.skills[constants_1.SKILL_IDS.WOODCUTTING].level / 10));
        let quantity = Math.floor(baseQuantity * resourceMultiplier);
        // Check for double resource chance
        if (this.hasMasteryFeatures(skill) && skill.hasMasteryChance('doubleResource')) {
            quantity = Math.floor(quantity * 2);
            console.log('Double logs from mastery bonus!');
        }
        if (quantity > 0) {
            const logs = this.createTypedItem(constants_1.ITEM_IDS.LOGS, quantity);
            player.addItem(logs);
        }
    }
    applyFishing(player, elapsedTime, skill) {
        // Default multipliers
        let resourceMultiplier = 1.0;
        let speedMultiplier = 1.0;
        // Apply mastery bonuses if available
        if (this.hasMasteryFeatures(skill)) {
            resourceMultiplier = skill.getMasteryBonus('resourceMultiplier');
            speedMultiplier = skill.getMasteryBonus('speedMultiplier');
        }
        const baseTime = 4000 / speedMultiplier;
        const baseQuantity = Math.floor(elapsedTime / baseTime) * (1 + Math.floor(player.skills[constants_1.SKILL_IDS.FISHING].level / 10));
        let quantity = Math.floor(baseQuantity * resourceMultiplier);
        if (this.hasMasteryFeatures(skill) && skill.hasMasteryChance('specialResource')) {
            console.log('Special fish chance triggered!');
        }
        if (quantity > 0) {
            const fish = this.createTypedItem(constants_1.ITEM_IDS.RAW_FISH, quantity);
            player.addItem(fish);
        }
    }
    applyMining(player, elapsedTime, skill) {
        // Default multipliers
        let resourceMultiplier = 1.0;
        let speedMultiplier = 1.0;
        // Apply mastery bonuses if available
        if (this.hasMasteryFeatures(skill)) {
            resourceMultiplier = skill.getMasteryBonus('resourceMultiplier');
            speedMultiplier = skill.getMasteryBonus('speedMultiplier');
        }
        const baseTime = 5000 / speedMultiplier;
        const baseQuantity = Math.floor(elapsedTime / baseTime) * (1 + Math.floor(player.skills[constants_1.SKILL_IDS.MINING].level / 10));
        let quantity = Math.floor(baseQuantity * resourceMultiplier);
        if (this.hasMasteryFeatures(skill) && skill.hasMasteryChance('specialResource')) {
            console.log('Gem chance triggered!');
        }
        if (quantity > 0) {
            const ore = this.createTypedItem(constants_1.ITEM_IDS.ORE, quantity);
            player.addItem(ore);
        }
    }
}
exports.SkillService = SkillService;
//# sourceMappingURL=SkillService.js.map