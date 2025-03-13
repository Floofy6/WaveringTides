import { Player } from '../../domain/aggregates/player/Player';
import { Skill as SkillInterface } from '../../shared/types';
export declare class SkillService {
    constructor();
    private createTypedItem;
    private hasMasteryFeatures;
    calculateXpGain(skill: SkillInterface, elapsedTime: number): number;
    applyXp(skill: SkillInterface, xp: number): void;
    applySkillAction(skill: SkillInterface, player: Player, elapsedTime: number): void;
    applyWoodcutting(player: Player, elapsedTime: number, skill: SkillInterface): void;
    applyFishing(player: Player, elapsedTime: number, skill: SkillInterface): void;
    applyMining(player: Player, elapsedTime: number, skill: SkillInterface): void;
}
