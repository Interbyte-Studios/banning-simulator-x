import { ReplicatedStorage } from "@rbxts/services";
import { isNpcCharacter, NpcCharacter } from "shared/remotes/damageNPC";

/**
 * Retrieves the character of an NPC.
 *
 * @param npcName The name of the NPC.
 * @returns The NPC character.
 */
export function getNpcCharacter(npcName: string): NpcCharacter {
	const character = ReplicatedStorage.assetObjects.npcs.FindFirstChild(npcName);
	assert(character, `Failed to get npc instance "${npcName}"`);
	assert(isNpcCharacter(character), `Npc "${npcName}" is not an Npc character`);

	return character;
}
