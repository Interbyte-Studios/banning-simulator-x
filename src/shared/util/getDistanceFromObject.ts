/**
 * Compares a players position to an objects position and returns the magnitude.
 *
 * @param character The character model of the player.
 * @param object The object to compare the player's position to.
 * @returns The magnitude between the player's position and the objects position.
 */
export function getMagnitudeBetweenPlayerAndObject(character: Model, object: BasePart): number | undefined {
	const humanoid = character.FindFirstChildWhichIsA("Humanoid");
	if (humanoid === undefined) {
		return;
	}

	const humanoidRootPart = humanoid.RootPart;
	if (humanoidRootPart === undefined) {
		return;
	}

	return humanoidRootPart.Position.sub(object.Position).Magnitude;
}
