import { ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";

export const isValidPetHatchCount = t.array(t.interface({ id: t.number, existingAmount: t.number }));

let newHatchedPets: Array<number> = [];

/**
 * Updates the local server cache of pet hatch counts for a specific pet.
 *
 * @param petId The pet ID to set the counter for.
 * @param count The amount of this pet that exists globally.
 */
export function setPetCount(petId: number, count: number): void {
	ReplicatedStorage.PetExistStores.SetAttribute(tostring(petId), count);
}

/**
 * Increases the global pet counter of how many of a certain `petId` exist in the game.
 *
 * @param petId The pet ID to record the hatch for.
 */
export function increasePetCount(petId: number): void {
	// record count locally
	setPetCount(petId, tonumber(ReplicatedStorage.PetExistStores.GetAttribute(tostring(petId))) ?? 0 + 1);

	// append to changes to perform to datastore
	newHatchedPets.push(petId);
}

/**
 * @returns The server cache for hatched pets.
 */
export function getNewHatchedPets(): Array<number> {
	return newHatchedPets;
}

/**
 * Sets the server's cache of newly hatched pet IDs.
 *
 * @param newPets The newly hatched pets.
 */
export function setNewHatchedPets(newPets: Array<number>): void {
	newHatchedPets = newPets;
}
