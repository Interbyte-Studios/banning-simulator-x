let deleteEnabled = false;
let petsToDelete: Array<string> = [];

/**
 * @param value The value to change multi-delete to.
 */
export function toggleMultiDeleteState(value: boolean): void {
	deleteEnabled = value;
}

/**
 * @returns The value of multi-delete.
 */
export function getMultiDeleteState(): boolean {
	return deleteEnabled;
}

/**
 * @param guid The pet's unique id.
 */
export function addPetToDeleteCache(guid: string): void {
	petsToDelete.push(guid);
}

/**
 * @param guid The pet's unique id.
 */
export function removePetFromDeleteCache(guid: string): void {
	petsToDelete.unorderedRemove(petsToDelete.findIndex((petGuid) => petGuid === guid));
}

/**
 * Clears the pet delete cache.
 */
export function clearPetDeleteCache(): void {
	petsToDelete = [];
}
