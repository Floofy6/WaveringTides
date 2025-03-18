/**
 * Level value object represents a skill level in the game.
 * This provides type safety and domain meaning to what would otherwise be a primitive number.
 */
export type Level = number;

export class LevelVO {
  private readonly value: Level;
  
  // Constants
  static readonly MIN_LEVEL = 1;
  static readonly MAX_LEVEL = 99;

  constructor(level: Level) {
    if (level < LevelVO.MIN_LEVEL || level > LevelVO.MAX_LEVEL) {
      throw new Error(`Level must be between ${LevelVO.MIN_LEVEL} and ${LevelVO.MAX_LEVEL}`);
    }
    this.value = level;
  }

  getValue(): Level {
    return this.value;
  }

  /**
   * Calculates the XP required to reach the next level
   */
  getXpForNextLevel(): number {
    return Math.floor(100 * (this.value ** 1.5));
  }

  /**
   * Creates a new LevelVO with incremented level
   */
  increment(): LevelVO {
    if (this.value >= LevelVO.MAX_LEVEL) {
      return this; // Cannot go above max level
    }
    return new LevelVO(this.value + 1);
  }

  /**
   * Checks if this level can be increased (is not at max)
   */
  canLevelUp(): boolean {
    return this.value < LevelVO.MAX_LEVEL;
  }
}