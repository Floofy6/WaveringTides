import { Skill as SkillInterface } from '../../../shared/types';
export declare class Skill implements SkillInterface {
    id: string;
    name: string;
    level: number;
    xp: number;
    xpPerAction: number;
    isActive: boolean;
    constructor(id: string, name: string, xpPerAction: number);
    addXp(xp: number): void;
    levelUp(): void;
    getXpRequiredForNextLevel(): number;
    activate(): void;
    deactivate(): void;
}
