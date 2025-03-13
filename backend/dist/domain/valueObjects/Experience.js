"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceVO = void 0;
class ExperienceVO {
    constructor(experience) {
        if (experience < 0) {
            throw new Error('Experience cannot be negative');
        }
        this.value = experience;
    }
    getValue() {
        return this.value;
    }
    /**
     * Add experience points and return a new ExperienceVO
     */
    add(experienceToAdd) {
        return new ExperienceVO(this.value + experienceToAdd);
    }
    /**
     * Check if this amount of experience is enough to reach a specific level
     * @param level The level to check against
     */
    isEnoughForLevel(level) {
        return this.value >= this.calculateRequiredXpForLevel(level);
    }
    /**
     * Calculate what level this amount of experience corresponds to
     */
    getLevel() {
        let level = 1;
        while (this.isEnoughForLevel(level + 1)) {
            level++;
        }
        return level;
    }
    /**
     * Calculate the experience required to reach a specific level
     * @param level The target level
     */
    calculateRequiredXpForLevel(level) {
        if (level <= 1)
            return 0;
        return Math.floor(100 * ((level - 1) ** 1.5));
    }
    /**
     * Calculate experience progress towards the next level (0-100%)
     */
    getProgressToNextLevel() {
        const currentLevel = this.getLevel();
        const currentLevelXp = this.calculateRequiredXpForLevel(currentLevel);
        const nextLevelXp = this.calculateRequiredXpForLevel(currentLevel + 1);
        const xpDifference = nextLevelXp - currentLevelXp;
        const progressXp = this.value - currentLevelXp;
        return Math.min(100, Math.floor((progressXp / xpDifference) * 100));
    }
}
exports.ExperienceVO = ExperienceVO;
//# sourceMappingURL=Experience.js.map