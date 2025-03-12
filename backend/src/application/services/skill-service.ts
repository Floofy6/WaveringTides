import { Player } from '../../domain/aggregates/player/Player';
import { Skill } from '../../shared/types';
import { ItemRepository } from '../../domain/repositories/ItemRepository';
import { SKILL_IDS, ITEM_IDS, ITEMS } from '../../shared/constants';

export class SkillService {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  calculateXpGain(skill: Skill, elapsedTime: number): number {
    return skill.xpPerAction * (Math.max(1, skill.level) / 10 + 1) * (elapsedTime / 1000);
  }

  applyXp(skill: Skill, xp: number) {
    skill.xp += xp;
    // Level up is handled in Player.addXpToSkill
  }

  applySkillAction(skill: Skill, player: Player, elapsedTime: number) {
    const xpGained = this.calculateXpGain(skill, elapsedTime);
    this.applyXp(skill, xpGained);

    switch (skill.id) {
      case SKILL_IDS.WOODCUTTING:
        this.applyWoodcutting(player, elapsedTime);
        break;
      case SKILL_IDS.FISHING:
        this.applyFishing(player, elapsedTime);
        break;
      case SKILL_IDS.MINING:
        this.applyMining(player, elapsedTime);
        break;
      // Other non-combat skills would be handled here
    }
  }

  applyWoodcutting(player: Player, elapsedTime: number) {
    const logs = { ...ITEMS[ITEM_IDS.LOGS] };
    const quantity = Math.floor(elapsedTime / 3000) * (1 + Math.floor(player.skills[SKILL_IDS.WOODCUTTING].level / 10));
    if (quantity > 0) {
      logs.quantity = quantity;
      player.addItem(logs);
    }
  }

  applyFishing(player: Player, elapsedTime: number) {
    const fish = { ...ITEMS[ITEM_IDS.RAW_FISH] };
    const quantity = Math.floor(elapsedTime / 4000) * (1 + Math.floor(player.skills[SKILL_IDS.FISHING].level / 10));
    if (quantity > 0) {
      fish.quantity = quantity;
      player.addItem(fish);
    }
  }

  applyMining(player: Player, elapsedTime: number) {
    const ore = { ...ITEMS[ITEM_IDS.ORE] };
    const quantity = Math.floor(elapsedTime / 5000) * (1 + Math.floor(player.skills[SKILL_IDS.MINING].level / 10));
    if (quantity > 0) {
      ore.quantity = quantity;
      player.addItem(ore);
    }
  }
}