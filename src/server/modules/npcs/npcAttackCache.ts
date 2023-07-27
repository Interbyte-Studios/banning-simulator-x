export type NpcAttackCache = Map<Model, Array<{ player: Player; lastAttack: number }>>;
const npcAttackCache: NpcAttackCache = new Map();

/**
 * @returns The npc attack cache.
 */
export function getNpcAttackCache(): NpcAttackCache {
	return npcAttackCache;
}

/**
 * Checks if a player can attack an npc.
 *
 * @param player The player to check if they can attack.
 * @param npc The npc to check if the player can attack.
 * @param now The current time.
 * @returns Whether or not the player can attack the npc.
 */
export function checkCanAttack(player: Player, npc: Model, now: number): boolean {
	const lastAttack = npcAttackCache.get(npc);
	if (lastAttack !== undefined) {
		const playerLog = lastAttack.find((log) => log.player === player);
		if (playerLog !== undefined) {
			if (now - playerLog.lastAttack < 0.25) {
				return false;
			}
		} else {
			npcAttackCache.set(npc, [...lastAttack, { player, lastAttack: now }]);
			return true;
		}
	} else {
		npcAttackCache.set(npc, [{ player, lastAttack: now }]);
		return true;
	}

	return false;
}

/**
 * Clears the attack log for an npc.
 *
 * @param npc The npc to clear the attack log for.
 */
export function clearAttackLog(npc: Model): void {
	npcAttackCache.delete(npc);
}
