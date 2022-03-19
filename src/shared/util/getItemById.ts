/**
 * Scans an items folder for a given item which has an "id" attribute matching the specified id.
 *
 * @param folder The folder to scan for items.
 * @param id The id of the item to look for. This should match the "id" attribute of the instance.
 * @returns The item found.
 */
export function getItemById(folder: Instance, id: number): Instance | undefined {
	return folder.GetChildren().find((item) => item.GetAttribute("id") === id);
}
