import { Npc, UniversalWorldData } from "shared/configs/zones";

/**
 * @param name The name of the enemy.
 * @returns The metadata of the enemy.
 */
export function getNPCByName(name: string): Npc | undefined {
	for (const [, worldData] of pairs(UniversalWorldData)) {
		for (const [, zoneData] of pairs(worldData)) {
			for (const npcData of zoneData.npcs) {
				if (npcData.name === name) {
					return npcData;
				}
			}
		}
	}

	return undefined;
}
