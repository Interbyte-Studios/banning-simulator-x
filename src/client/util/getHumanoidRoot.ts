/**
 * Finds and returns the humanoid root part of the player.
 *
 * @param player The player to get the humanoid root part from.
 * @returns The humanoid root part of the player.
 */
export const getHumanoidRootPart = (player: Player): BasePart | undefined => {
	debug.setmemorycategory("getHumanoidRoot");
	const character = player.Character ?? player.CharacterAdded.Wait()[0];
	if (character === undefined) {
		return;
	}
	const humanoid = character.WaitForChild("Humanoid") as Humanoid;
	if (humanoid === undefined) {
		return;
	}
	return humanoid.RootPart;
};
