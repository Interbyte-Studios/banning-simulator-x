import { CollectionService } from "@rbxts/services";

let deleteEnabled = false;
let petsToDelete: Array<string> = [];

const imageTag = "SelectedForDeletionImage";

/**
 * @param value The value to change multi-delete to.
 */
export function toggleMultiDeleteState(value: boolean): void {
	deleteEnabled = value;

	if (value === false) {
		for (const deletionImage of CollectionService.GetTagged(imageTag)) {
			if (deletionImage !== undefined && deletionImage.IsA("ImageLabel")) {
				deletionImage.Destroy();
			}
		}
	}
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

	for (const deletionImage of CollectionService.GetTagged(imageTag)) {
		if (deletionImage !== undefined && deletionImage.IsA("ImageLabel")) {
			deletionImage.Destroy();
		}
	}
}

/**
 * @returns A list of pets currently selected for deletion.
 */
export function getPetDeleteCache(): Array<string> {
	return petsToDelete;
}
