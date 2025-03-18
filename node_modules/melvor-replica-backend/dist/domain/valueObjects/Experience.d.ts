/**
 * Experience value object represents skill experience points in the game.
 * This provides type safety and domain meaning to what would otherwise be a primitive number.
 */
export type Experience = number;
export declare class ExperienceVO {
    private readonly value;
    constructor(experience: Experience);
    getValue(): Experience;
    /**
     * Add experience points and return a new ExperienceVO
     */
    add(experienceToAdd: Experience): ExperienceVO;
    /**
     * Check if this amount of experience is enough to reach a specific level
     * @param level The level to check against
     */
    isEnoughForLevel(level: number): boolean;
    /**
     * Calculate what level this amount of experience corresponds to
     */
    getLevel(): number;
    /**
     * Calculate the experience required to reach a specific level
     * @param level The target level
     */
    private calculateRequiredXpForLevel;
    /**
     * Calculate experience progress towards the next level (0-100%)
     */
    getProgressToNextLevel(): number;
}
