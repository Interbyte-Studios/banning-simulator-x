/**
 * Gets a random CFrame between `min` and `max` with the `random` object specified.
 *
 * @param min The minimum vector position.
 * @param max The maximum vector position.
 * @param random The random object to create random locations with.
 * @returns The random CFrame generated.
 */
export function getRandomCFrame(min: Vector3, max: Vector3, random: Random): CFrame {
	return new CFrame(random.NextInteger(min.X, max.X), min.Y, random.NextInteger(min.Z, max.Z));
}
