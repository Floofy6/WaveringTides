"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPlayerRepository = void 0;
const PlayerAdapter_1 = require("../../../application/adapters/PlayerAdapter");
class InMemoryPlayerRepository {
    constructor() {
        this.players = {};
    }
    async getById(playerId) {
        const player = this.players[playerId];
        if (!player) {
            return undefined;
        }
        // Convert from aggregate to entity
        return PlayerAdapter_1.PlayerAdapter.toEntity(player);
    }
    async save(player) {
        // Convert from entity to aggregate
        const aggregatePlayer = PlayerAdapter_1.PlayerAdapter.toAggregate(player);
        this.players[player.getId()] = aggregatePlayer;
    }
}
exports.InMemoryPlayerRepository = InMemoryPlayerRepository;
//# sourceMappingURL=InMemoryPlayerRepository.js.map