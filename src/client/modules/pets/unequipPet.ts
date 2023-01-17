import { Workspace } from "@rbxts/services";

/**
 *
 * @param petGuid The unique id of the pet.
 */
export function removePet(petGuid: string): void {
	const petModel = Workspace["client objects"].pets.FindFirstChild(petGuid);
	if (petModel === undefined) {
		return;
	}
	petModel.Destroy();
}
