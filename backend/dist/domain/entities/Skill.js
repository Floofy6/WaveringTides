"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
class Skill {
    constructor(id, name, xpPerAction) {
        this.id = id;
        this.name = name;
        this.level = 1;
        this.xp = 0;
        this.xpPerAction = xpPerAction;
        this.isActive = false;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getLevel() {
        return this.level;
    }
    getXp() {
        return this.xp;
    }
    getXpPerAction() {
        return this.xpPerAction;
    }
    getIsActive() {
        return this.isActive;
    }
    getMastery() {
        return this.mastery;
    }
    setLevel(level) {
        this.level = level;
    }
    setXp(xp) {
        this.xp = xp;
        this.levelUp();
    }
    setXpPerAction(xpPerAction) {
        this.xpPerAction = xpPerAction;
    }
    setIsActive(isActive) {
        this.isActive = isActive;
    }
    setMastery(mastery) {
        this.mastery = mastery;
    }
    addXp(xp) {
        this.xp += xp;
        this.levelUp();
        // Also add mastery XP if mastery exists
        if (this.mastery) {
            this.addMasteryXp(xp * 0.1); // 10% of skill XP goes to mastery
        }
    }
    levelUp() {
        let nextLevelXp = this.getXpRequiredForNextLevel();
        while (this.xp >= nextLevelXp) {
            this.level++;
            nextLevelXp = this.getXpRequiredForNextLevel();
        }
    }
    getXpRequiredForNextLevel() {
        return Math.floor(100 * (Math.pow(this.level, 1.5)));
    }
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
    // Mastery-related methods
    addMasteryXp(xp) {
        if (!this.mastery) {
            this.mastery = {
                level: 1,
                xp: 0,
                unlocks: {}
            };
        }
        this.mastery.xp += xp;
        this.updateMasteryLevel();
    }
    updateMasteryLevel() {
        if (!this.mastery)
            return;
        let nextLevelXp = this.getMasteryXpForNextLevel();
        while (this.mastery.xp >= nextLevelXp) {
            this.mastery.level++;
            nextLevelXp = this.getMasteryXpForNextLevel();
        }
    }
    getMasteryXpForNextLevel() {
        if (!this.mastery)
            return 0;
        return Math.floor(150 * (Math.pow(this.mastery.level, 1.8)));
    }
}
exports.Skill = Skill;
//# sourceMappingURL=Skill.js.map