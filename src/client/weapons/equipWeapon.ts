/**
 * Puts a weapon model into the hand of a character.
 *
 * @param character The character model to weld the weapon onto.
 * @param weaponModel The model to weld to the character.
 */
export function equipWeapon(character: Model, weaponModel: Model): void {
	// parent to character
	weaponModel.Parent = character;
}
