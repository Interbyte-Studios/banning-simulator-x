import { Workspace } from "@rbxts/services";

const npcFolder = new Instance("Folder");
npcFolder.Name = "npcs";
npcFolder.Parent = Workspace;

/**
 * Retrieves the folder to parent the NPCs to.
 *
 * @returns The folder to parent the NPCs to.
 */
export function getNpcFolder(): Folder {
	return npcFolder;
}
