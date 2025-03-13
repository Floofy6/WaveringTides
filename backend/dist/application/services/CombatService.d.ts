import { Player } from '../../domain/aggregates/player/Player';
import { Enemy } from '../../shared/types';
export declare class CombatService {
    constructor();
    private createTypedItem;
    calculateDamage(attackerStrength: number, attackerAttack: number, defenderDefence: number): number;
    handleCombatRound(player: Player, enemy: Enemy, elapsedTime: number): void;
    handleEnemyDefeat(player: Player, enemy: Enemy): void;
    handlePlayerDefeat(player: Player): void;
}
