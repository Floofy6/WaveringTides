/**
 * Level value object represents a skill level in the game.
 * This provides type safety and domain meaning to what would otherwise be a primitive number.
 */
export type Level = number;
export declare class LevelVO {
    private readonly value;
    static readonly MIN_LEVEL = 1;
    static readonly MAX_LEVEL = 99;
    constructor(level: Level);
    getValue(): Level;
    /**
     * Calculates the XP required to reach the next level
     */
    getXpForNextLevel(): number;
    /**
     * Creates a new LevelVO with incremented level
     */
    increment(): LevelVO;
    /**
     * Checks if this level can be increased (is not at max)
     */
    canLevelUp(): boolean;
}
