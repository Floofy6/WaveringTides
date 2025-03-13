export interface Mastery {
    level: number;
    xp: number;
    unlocks: {
        [level: string]: string;
    };
}
export declare class Skill {
    private id;
    private name;
    private level;
    private xp;
    private xpPerAction;
    private isActive;
    private mastery?;
    constructor(id: string, name: string, xpPerAction: number);
    getId(): string;
    getName(): string;
    getLevel(): number;
    getXp(): number;
    getXpPerAction(): number;
    getIsActive(): boolean;
    getMastery(): Mastery | undefined;
    setLevel(level: number): void;
    setXp(xp: number): void;
    setXpPerAction(xpPerAction: number): void;
    setIsActive(isActive: boolean): void;
    setMastery(mastery: Mastery): void;
    addXp(xp: number): void;
    private levelUp;
    getXpRequiredForNextLevel(): number;
    activate(): void;
    deactivate(): void;
    addMasteryXp(xp: number): void;
    private updateMasteryLevel;
    private getMasteryXpForNextLevel;
}
