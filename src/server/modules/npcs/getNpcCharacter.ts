import { Players } from "@rbxts/services";
import { WorldName } from "shared/configs/worlds";
import { UniversalWorldData, ZoneNames } from "shared/configs/zones";
import { isNpcCharacter, NpcCharacter } from "shared/remotes/damageNPC";

/**
 * Retrieves the character of an NPC.
 *
 * @param worldName The name of the world the NPC is from.
 * @param zoneName The name of the zone the NPC belongs to.
 * @param npcName The name of the NPC.
 * @returns The NPC character.
 */
export function getNpcCharacter(worldName: WorldName, zoneName: ZoneNames, npcName: string): NpcCharacter {
	const npcData = UniversalWorldData[worldName][zoneName].npcs.find((npc) => npc.name === npcName);
	assert(npcData, `Failed to get npc data and generate appearance for ${npcName}`);

	const character = Players.CreateHumanoidModelFromUserId(npcData.userId);
	assert(character, `Could not load character appearance of ${npcName}`);
	assert(isNpcCharacter(character), `Npc "${npcName}" is not an Npc character`);

	character.Name = npcName;

	return character;
}
