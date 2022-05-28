/**
 * Compares a players position to an objects position and returns the magnitude.
 *
 * @param player The player.
 * @param object The object to compare the player's position to.
 * @returns The magnitude between the player's position and the objects position.
 */
export function getMagnitudeBetweenPlayerAndObject(player: Player, object: BasePart): number | void {
	const character = player.Character;
	if (character === undefined) {
		return warn(`Could not find Character for player ${player.Name}`);
	}

	const humanoid = character.FindFirstChildWhichIsA("Humanoid");
	if (humanoid === undefined) {
		return warn(`Could not find Humanoid for player ${player.Name}`);
	}

	const humanoidRootPart = humanoid.RootPart;
	if (humanoidRootPart === undefined) {
		return warn(`Could not find HumanoidRootPart for player ${player.Name}`);
	}

	return humanoidRootPart.Position.sub(object.Position).Magnitude;
}
