import { t } from "@rbxts/t";

export const isValidPetHatchCount = t.array(t.interface({ id: t.number, existingAmount: t.number }));
type ValidPetHatchCount = t.static<typeof isValidPetHatchCount>;

export let petHatchCount: ValidPetHatchCount = [];

export let newHatchedPets: Array<number> = [];

/**
 * Increases the global pet counter of how many of a certain `petId` exist in the game.
 *
 * @param petId The pet ID to record the hatch for.
 */
export function increasePetCount(petId: number): void {
	let count = petHatchCount.find((pet) => pet.id === petId);
	if (count === undefined) {
		count = {
			id: petId,
			existingAmount: 0,
		};
		petHatchCount.push(count);
	}

	// record count locally
	count.existingAmount += 1;

	// append to changes to perform to datastore
	newHatchedPets.push(petId);
}

/**
 * @returns The server cache for hatched pets.
 */
export function getHatchCount(): Array<number> {
	return newHatchedPets;
}

/**
 * Updates the local server cache of pet hatch counts.
 *
 * @param newCount The new pet hatch count.
 */
export function updateHatchCount(newCount: ValidPetHatchCount): void {
	petHatchCount = newCount;
}

/**
 * Sets the server's cache of newly hatched pet IDs.
 *
 * @param newPets The newly hatched pets.
 */
export function setNewHatchedPets(newPets: Array<number>): void {
	newHatchedPets = newPets;
}
